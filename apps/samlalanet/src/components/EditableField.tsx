import { useEffect, useId, useRef, useState } from "react";

/**
 * Inline click-to-edit number token, layout-stable: the input occupies the
 * exact same box as the resting text, so switching to edit never shifts the
 * row. Technique — an inline-grid with a single cell whose width is set by an
 * invisible sizer span holding the current string; the resting button and the
 * editing input both fill that cell (width:100%, no border/padding), so the
 * footprint is identical and only grows/shrinks with the typed text itself.
 *
 * Resting markup is a plain <button>, so values prerender into the HTML;
 * editing is effect/handler-driven only.
 */
export function EditableNumber({
  value,
  onChange,
  format,
  label,
  min = 0,
  max,
  step = 1,
  inputMode = "numeric",
  autoEdit = false,
}: {
  value: number;
  onChange: (next: number) => void;
  /** Resting display, e.g. (v) => `${formatSek(v)}`. */
  format: (v: number) => string;
  /** a11y label, e.g. "Ändra belopp". */
  label: string;
  min?: number;
  max?: number;
  step?: number;
  inputMode?: "numeric" | "decimal";
  autoEdit?: boolean;
}) {
  const [editing, setEditing] = useState(autoEdit);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function start() {
    setDraft(value ? String(value) : "");
    setEditing(true);
  }
  function commit() {
    const n = Number(draft);
    const clampedLow = Math.max(min, Number.isFinite(n) ? n : 0);
    const clamped = max !== undefined ? Math.min(max, clampedLow) : clampedLow;
    onChange(clamped);
    setEditing(false);
  }
  function cancel() {
    setDraft(String(value));
    setEditing(false);
  }

  // The sizer holds whichever string is currently rendered, so the cell hugs
  // the content in both states (no fixed width, no jump).
  const sizerText = editing ? draft || "0" : format(value);

  return (
    <span
      className={cellClass(editing)}
      onClick={editing ? undefined : start}
    >
      <span className="tabular invisible col-start-1 row-start-1 whitespace-pre px-0.5" aria-hidden="true">
        {sizerText}
      </span>
      {editing ? (
        <input
          ref={inputRef}
          type="number"
          inputMode={inputMode}
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            } else if (e.key === "Escape") {
              e.preventDefault();
              cancel();
            }
          }}
          className="tabular col-start-1 row-start-1 w-full border-0 bg-transparent px-0.5 text-base font-semibold text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
      ) : (
        <button
          type="button"
          aria-label={label}
          tabIndex={0}
          className="tabular col-start-1 row-start-1 w-full px-0.5 text-left font-semibold text-foreground"
        >
          {format(value)}
        </button>
      )}
    </span>
  );
}

/**
 * Inline click-to-edit select token. Same layout-stable cell as EditableNumber:
 * the native <select> overlays the resting label at identical width.
 */
export function EditableSelect<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: readonly { id: T; label: string }[];
  onChange: (next: T) => void;
  label: string;
}) {
  const [editing, setEditing] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const id = useId();
  const current = options.find((o) => o.id === value);
  const labelText = current?.label ?? value;

  useEffect(() => {
    if (editing && selectRef.current) selectRef.current.focus();
  }, [editing]);

  return (
    <span
      className={cellClass(editing)}
      onClick={editing ? undefined : () => setEditing(true)}
    >
      {/* Sizer always holds the current label so the cell width never changes
          when the bordered <select> chrome appears. */}
      <span className="invisible col-start-1 row-start-1 whitespace-pre px-0.5" aria-hidden="true">
        {labelText}
      </span>
      {editing ? (
        <select
          ref={selectRef}
          id={id}
          aria-label={label}
          value={value}
          onChange={(e) => {
            onChange(e.target.value as T);
            setEditing(false);
          }}
          onBlur={() => setEditing(false)}
          className="col-start-1 row-start-1 w-full appearance-none border-0 bg-transparent px-0.5 text-base font-semibold text-foreground outline-none"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <button
          type="button"
          aria-label={label}
          tabIndex={0}
          className="col-start-1 row-start-1 w-full px-0.5 text-left font-semibold text-foreground"
        >
          {labelText}
        </button>
      )}
    </span>
  );
}

/**
 * Shared inline cell: an inline-grid that stacks the sizer + control in one
 * cell. The dotted underline (resting) becomes a solid teal underline + faint
 * wash (editing) so the affordance reads as "tap to edit" → "editing now",
 * without ever changing the element's box size.
 */
function cellClass(editing: boolean): string {
  return [
    "relative inline-grid cursor-text rounded-[3px] align-baseline",
    "underline underline-offset-4 transition-colors",
    editing
      ? "bg-teal/5 decoration-teal decoration-solid"
      : "decoration-dotted decoration-muted-foreground/50 hover:bg-teal/5 hover:decoration-teal",
  ].join(" ");
}
