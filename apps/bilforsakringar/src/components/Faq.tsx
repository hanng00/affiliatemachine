import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "../config/content";

/**
 * Accessible FAQ accordion. Renders all answers in the DOM (SSR/crawlable);
 * visibility is toggled with CSS so prerendered HTML carries the full text.
 */
export function Faq({ items, title }: { items: FaqItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl">
      {title && (
        <h2 className="font-display text-2xl font-bold text-center text-foreground mb-8">
          {title}
        </h2>
      )}
      <div className="divide-y divide-[var(--color-border)] rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)]">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.question}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-semibold text-foreground">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[var(--color-primary)] transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className={isOpen ? "px-5 pb-5" : "sr-only"}>
                <p className="text-[var(--color-text-muted)] leading-relaxed">{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
