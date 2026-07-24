import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamSSE } from "hono/streaming";
import {
  registry,
  quoteRequestSchema,
  type QuoteResult,
} from "@affiliate/insurance-providers";
import { getSite, isAllowedWorkerCorsOrigin } from "@affiliate/sites";
import { fetchIfQuoteViaBrowser } from "./if-browser-quote";

type Bindings = {
  ENVIRONMENT: string;
  SEARCHES: KVNamespace;
  BROWSER?: Fetcher;
};

interface StoredSearch {
  id: string;
  createdAt: string;
  status: "loading" | "complete";
  request: {
    regno: string;
    yearlyKm: number;
    driverUnder24: boolean;
    deductible: string;
  };
  providers: { id: string; name: string }[];
  quotes: unknown[];
  errors: unknown[];
}

const site = getSite("bilforsakringar")!;
const pagesProject = "bilforsakringar";

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: (origin) => {
      const devOrigins = ["http://localhost:5173", "http://localhost:3000"];
      if (devOrigins.includes(origin)) return origin;
      if (isAllowedWorkerCorsOrigin(origin, site.domain, pagesProject)) {
        return origin;
      }
      return "";
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

function generateSearchId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/** Collect quotes from all providers. IF uses Browser Run when available. */
async function collectAllQuotes(
  env: Bindings,
  request: Parameters<typeof registry.streamQuotes>[0]
): Promise<QuoteResult[]> {
  const results: QuoteResult[] = [];
  await streamAllQuotes(env, request, (result) => results.push(result));
  return results;
}

/** Stream quotes from all providers. IF uses Browser Run when available. */
async function streamAllQuotes(
  env: Bindings,
  request: Parameters<typeof registry.streamQuotes>[0],
  onResult: (result: QuoteResult) => void
): Promise<void> {
  const providers = registry.getAll().filter((p) => p.id !== "if");

  await Promise.allSettled([
    ...providers.map(async (provider) => {
      try {
        onResult(await provider.getQuote(request));
      } catch (err) {
        onResult({
          success: false,
          error: {
            provider: provider.id,
            error: err instanceof Error ? err.message : "Unknown error",
          },
        });
      }
    }),
    (async () => {
      if (env.BROWSER) {
        onResult(await fetchIfQuoteViaBrowser(env.BROWSER, request));
        return;
      }

      const ifProvider = registry.get("if");
      if (ifProvider) {
        onResult(await ifProvider.getQuote(request));
      }
    })(),
  ]);
}

app.get("/", (c) => {
  return c.json({
    name: "bilforsakringar-worker",
    version: "0.0.5",
    browserRun: true,
    providers: registry.getAll().map((p) => ({
      id: p.id,
      name: p.name,
    })),
  });
});

app.get("/providers", (c) => {
  const providers = registry.getAll().map((p) => ({
    id: p.id,
    name: p.name,
    logoUrl: p.logoUrl,
    websiteUrl: p.websiteUrl,
  }));
  return c.json({ providers });
});

app.get("/providers/:provider/configurations", async (c) => {
  const providerId = c.req.param("provider");
  const provider = registry.get(providerId);

  if (!provider) {
    return c.json(
      {
        success: false,
        error: {
          code: "PROVIDER_NOT_FOUND",
          message: `Provider "${providerId}" not found`,
        },
      },
      404
    );
  }

  try {
    const configurations = await provider.getConfigurations();
    return c.json({
      success: true,
      provider: providerId,
      configurations,
    });
  } catch (err) {
    return c.json(
      {
        success: false,
        error: {
          code: "FETCH_ERROR",
          message: err instanceof Error ? err.message : "Unknown error",
        },
      },
      500
    );
  }
});

// Get stored search by ID
app.get("/search/:id", async (c) => {
  const searchId = c.req.param("id");
  
  const stored = await c.env.SEARCHES.get(searchId, "json") as StoredSearch | null;
  
  if (!stored) {
    return c.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Search not found or expired",
        },
      },
      404
    );
  }

  return c.json({
    success: true,
    id: stored.id,
    createdAt: stored.createdAt,
    status: stored.status,
    providers: stored.providers,
    quotes: stored.quotes,
    errors: stored.errors,
    request: stored.request,
  });
});

// Start a search - returns ID immediately, processes in background
app.post("/quote/start", async (c) => {
  const body = await c.req.json();

  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          details: parsed.error.flatten(),
        },
      },
      400
    );
  }

  const searchId = generateSearchId();
  const request = {
    regno: parsed.data.regno,
    yearlyKm: parsed.data.yearlyKm,
    driverUnder24: parsed.data.driverUnder24,
    deductible: parsed.data.deductible,
  };

  const providers = registry.getAll().map(p => ({ id: p.id, name: p.name }));

  // Store initial search state
  const initialSearch: StoredSearch = {
    id: searchId,
    createdAt: new Date().toISOString(),
    status: "loading",
    request,
    providers,
    quotes: [],
    errors: [],
  };

  await c.env.SEARCHES.put(searchId, JSON.stringify(initialSearch), {
    expirationTtl: 60 * 60 * 24 * 30,
  });

  // Process quotes in background using waitUntil
  c.executionCtx.waitUntil(
    (async () => {
      const quotes: unknown[] = [];
      const errors: unknown[] = [];

      await streamAllQuotes(c.env, parsed.data, (result: QuoteResult) => {
        if (result.success) {
          quotes.push(result.data);
        } else {
          errors.push(result.error);
        }
      });

      // Update search with final results
      const completedSearch: StoredSearch = {
        id: searchId,
        createdAt: initialSearch.createdAt,
        status: "complete",
        request,
        providers,
        quotes,
        errors,
      };

      await c.env.SEARCHES.put(searchId, JSON.stringify(completedSearch), {
        expirationTtl: 60 * 60 * 24 * 30,
      });
    })()
  );

  // Return immediately with the search ID
  return c.json({
    success: true,
    id: searchId,
    providers,
  });
});

// Streaming quote endpoint using SSE
app.post("/quote/stream", async (c) => {
  const body = await c.req.json();

  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          details: parsed.error.flatten(),
        },
      },
      400
    );
  }

  const searchId = generateSearchId();
  const request = {
    regno: parsed.data.regno,
    yearlyKm: parsed.data.yearlyKm,
    driverUnder24: parsed.data.driverUnder24,
    deductible: parsed.data.deductible,
  };

  const quotes: unknown[] = [];
  const errors: unknown[] = [];
  const providerCount = registry.getAll().length;

  return streamSSE(c, async (stream) => {
    // Send initial event with search ID and provider count
    await stream.writeSSE({
      event: "init",
      data: JSON.stringify({ 
        id: searchId, 
        providerCount,
        providers: registry.getAll().map(p => ({ id: p.id, name: p.name }))
      }),
    });

    // Stream results as they arrive
    await streamAllQuotes(c.env, parsed.data, async (result: QuoteResult) => {
      if (result.success) {
        quotes.push(result.data);
        await stream.writeSSE({
          event: "quote",
          data: JSON.stringify(result.data),
        });
      } else {
        errors.push(result.error);
        await stream.writeSSE({
          event: "error",
          data: JSON.stringify(result.error),
        });
      }
    });

    // Store the complete results
    const storedSearch: StoredSearch = {
      id: searchId,
      createdAt: new Date().toISOString(),
      status: "complete",
      request,
      quotes,
      errors,
    };

    await c.env.SEARCHES.put(searchId, JSON.stringify(storedSearch), {
      expirationTtl: 60 * 60 * 24 * 30,
    });

    // Send completion event
    await stream.writeSSE({
      event: "complete",
      data: JSON.stringify({ 
        id: searchId,
        totalQuotes: quotes.length,
        totalErrors: errors.length,
      }),
    });
  });
});

// Original non-streaming endpoint (kept for backwards compatibility)
app.post("/quote", async (c) => {
  const body = await c.req.json();

  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          details: parsed.error.flatten(),
        },
      },
      400
    );
  }

  const results = await collectAllQuotes(c.env, parsed.data);

  const successful = results.filter(
    (r): r is Extract<QuoteResult, { success: true }> => r.success
  );
  const failed = results.filter(
    (r): r is Extract<QuoteResult, { success: false }> => !r.success
  );

  const quotes = successful.map((r) => r.data);
  const errors = failed.map((r) => r.error);
  const request = {
    regno: parsed.data.regno,
    yearlyKm: parsed.data.yearlyKm,
    driverUnder24: parsed.data.driverUnder24,
    deductible: parsed.data.deductible,
  };

  // Generate search ID and store results
  const searchId = generateSearchId();
  const storedSearch: StoredSearch = {
    id: searchId,
    createdAt: new Date().toISOString(),
    status: "complete",
    request,
    quotes,
    errors,
  };

  // Store for 30 days
  await c.env.SEARCHES.put(searchId, JSON.stringify(storedSearch), {
    expirationTtl: 60 * 60 * 24 * 30,
  });

  return c.json({
    success: true,
    id: searchId,
    quotes,
    errors,
    request,
  });
});

app.post("/quote/:provider", async (c) => {
  const providerId = c.req.param("provider");
  const body = await c.req.json();

  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          details: parsed.error.flatten(),
        },
      },
      400
    );
  }

  if (providerId === "if" && c.env.BROWSER) {
    const result = await fetchIfQuoteViaBrowser(c.env.BROWSER, parsed.data);
    return c.json(result, result.success ? 200 : 400);
  }

  const result = await registry.getQuoteFrom(providerId, parsed.data);

  if (!result.success) {
    return c.json(result, 400);
  }

  return c.json(result);
});

export default app;
