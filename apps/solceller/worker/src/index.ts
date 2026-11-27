import { Hono } from "hono";
import { cors } from "hono/cors";
import { getSite, isAllowedWorkerCorsOrigin } from "@affiliate/sites";

type Bindings = {
  ENVIRONMENT: string;
  LEADS: KVNamespace;
  /** Bearer token for GET /leads. Unset → the endpoint is disabled (404). */
  LEADS_ADMIN_TOKEN?: string;
};

interface StoredLead {
  id: string;
  createdAt: string;
  email: string;
  roofAreaSqm: number;
  kwp: number;
  annualSavings: number;
  netCost: number;
  region: string;
  address?: string;
  source: "villa" | "brf";
  phone?: string;
  /** Install horizon picked in step 1 of the form: "3m" | "12m" | "curious". */
  timeline?: string;
}

const site = getSite("solceller")!;
const pagesProject = "solceller";

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

function generateLeadId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 12; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

app.get("/", (c) => {
  return c.json({
    name: "solceller-worker",
    version: "0.0.1",
  });
});

app.post("/lead", async (c) => {
  const body = await c.req.json();

  const { email, phone, timeline, roofAreaSqm, kwp, annualSavings, netCost, region, address, source } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return c.json(
      { success: false, error: { code: "INVALID_EMAIL", message: "Ogiltig e-postadress" } },
      400
    );
  }

  if (typeof roofAreaSqm !== "number" || roofAreaSqm <= 0) {
    return c.json(
      { success: false, error: { code: "INVALID_DATA", message: "Ogiltig takyta" } },
      400
    );
  }

  const leadId = generateLeadId();
  const lead: StoredLead = {
    id: leadId,
    createdAt: new Date().toISOString(),
    email: email.trim().toLowerCase(),
    roofAreaSqm,
    kwp: kwp ?? 0,
    annualSavings: annualSavings ?? 0,
    netCost: netCost ?? 0,
    region: region ?? "mellan",
    address: address?.trim(),
    source: source === "brf" ? "brf" : "villa",
    phone: typeof phone === "string" && phone.trim() ? phone.trim().slice(0, 32) : undefined,
    timeline: ["3m", "12m", "curious"].includes(timeline) ? timeline : undefined,
  };

  await c.env.LEADS.put(`lead:${leadId}`, JSON.stringify(lead), {
    expirationTtl: 60 * 60 * 24 * 90, // 90 days
  });

  // Also store by email for deduplication/lookup
  const emailKey = `email:${lead.email}`;
  const existingLeads = await c.env.LEADS.get(emailKey, "json") as string[] | null;
  const leadIds = existingLeads ?? [];
  leadIds.push(leadId);
  await c.env.LEADS.put(emailKey, JSON.stringify(leadIds), {
    expirationTtl: 60 * 60 * 24 * 90,
  });

  return c.json({
    success: true,
    id: leadId,
  });
});

// List leads (admin/export). Holds PII (email + address): requires
// `Authorization: Bearer $LEADS_ADMIN_TOKEN`; disabled entirely when unset.
app.get("/leads", async (c) => {
  const expected = c.env.LEADS_ADMIN_TOKEN;
  if (!expected) return c.json({ success: false }, 404);
  if (c.req.header("Authorization") !== `Bearer ${expected}`) {
    return c.json({ success: false }, 401);
  }
  const list = await c.env.LEADS.list({ prefix: "lead:" });
  const leads: StoredLead[] = [];

  for (const key of list.keys) {
    const lead = await c.env.LEADS.get(key.name, "json") as StoredLead | null;
    if (lead) leads.push(lead);
  }

  // Sort by createdAt descending
  leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return c.json({ success: true, leads, count: leads.length });
});

export default app;
