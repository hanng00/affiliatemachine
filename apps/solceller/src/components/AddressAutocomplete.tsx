import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchSuggestions,
  getCoordinates,
  newSessionToken,
  type AddressSuggestion,
} from "@/lib/geocode";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (lat: number, lon: number, display: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  disabled,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // One Places session spans the keystrokes + the final details lookup so
  // Google bills the whole search as a single session. Reset after a pick.
  const sessionRef = useRef(newSessionToken());

  const loadSuggestions = useCallback(async (q: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const results = await fetchSuggestions(q, sessionRef.current, controller.signal);
      setSuggestions(results);
      setOpen(results.length > 0);
      setActiveIdx(-1);
    } catch {
      // Aborted or network error — leave current suggestions untouched.
    }
  }, []);

  function handleInput(val: string) {
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadSuggestions(val), 300);
  }

  async function selectSuggestion(s: AddressSuggestion) {
    const label = s.secondary ? `${s.primary}, ${s.secondary}` : s.primary;
    onChange(label);
    setSuggestions([]);
    setOpen(false);
    const coords = await getCoordinates(s, sessionRef.current);
    // Selection ends the billing session; start a fresh one for the next search.
    sessionRef.current = newSessionToken();
    if (coords) onSelect(coords.lat, coords.lon, label);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="Adress"
        aria-autocomplete="list"
        aria-expanded={open}
        autoComplete="off"
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
      />
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-[45] mt-1 max-h-60 overflow-auto rounded-xl border border-border bg-card shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={() => selectSuggestion(s)}
              onMouseEnter={() => setActiveIdx(i)}
              className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 ${
                i === activeIdx
                  ? "bg-primary/10"
                  : "hover:bg-muted"
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-foreground">{s.primary}</span>
                {s.secondary && (
                  <span className="block truncate text-xs text-muted-foreground">{s.secondary}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
