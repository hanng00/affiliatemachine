import { useSyncExternalStore } from "react";
import {
  calculateLoan,
  defaultAssumptions,
  debtTypes,
  type LoanResult,
} from "@affiliate/loan-calculator";

/**
 * A tiny external store so the prerendered SEO sections further down the page
 * (the ränteavdrag explainer + "så funkar samlingslån") can render the user's
 * *live* numbers — the same `result` the hero calculator computes — without
 * lifting all calculator state into the page and re-threading it through every
 * section.
 *
 * Why an external store and not context: the diagrams are siblings of the
 * calculator in the page tree, not descendants, so a provider would have to
 * wrap the whole page and hoist the calculator's state up. This keeps the
 * calculator owning its own state and just *publishing* a read-only snapshot.
 *
 * SSR/prerender: `getServerSnapshot` returns the seeded-example result, so the
 * static HTML shows a real, populated chart (good for SEO + no-JS), identical
 * to what the calculator seeds. The client then syncs the live value on edit.
 */

const seedResult: LoanResult = calculateLoan(
  [
    { amount: 80_000, rate: debtTypes.find((d) => d.id === "privatlan")!.typicalRate },
    { amount: 30_000, rate: debtTypes.find((d) => d.id === "kreditkort")!.typicalRate },
    { amount: 15_000, rate: debtTypes.find((d) => d.id === "smslan")!.typicalRate },
  ],
  defaultAssumptions
);

export interface LiveSnapshot {
  result: LoanResult;
  targetRate: number;
}

let snapshot: LiveSnapshot = {
  result: seedResult,
  targetRate: defaultAssumptions.targetRate,
};

const listeners = new Set<() => void>();

export function publishLoanSnapshot(next: LiveSnapshot): void {
  snapshot = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => snapshot;
const getServerSnapshot = (): LiveSnapshot => ({
  result: seedResult,
  targetRate: defaultAssumptions.targetRate,
});

/** Read the live calculator snapshot. SSR-safe (falls back to the seed). */
export function useLoanSnapshot(): LiveSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
