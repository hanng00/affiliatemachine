import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Car, AlertCircle, Loader2, User, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE_URL } from "../config/api";
import { regnoSchema } from "../types/insurance";

interface QuoteInputProps {
  onQuotesFound?: (result: { id: string }) => void;
  /** Optional headline/subtitle override so the same tool reads in-context on content pages. */
  heading?: string;
  subheading?: string;
}

export function QuoteInput({ onQuotesFound, heading, subheading }: QuoteInputProps) {
  const navigate = useNavigate();
  const [regno, setRegno] = useState("");
  const [personnummer, setPersonnummer] = useState("");
  // Progressive disclosure: lead with the low-friction regno (mobile-first — 68%
  // of traffic). Personnummer is only revealed once a valid regno is entered, so
  // cold SEO visitors aren't met with a personnummer wall as step one.
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatRegno = (value: string): string => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (cleaned.length <= 3) return cleaned;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
  };

  const formatPersonnummer = (value: string): string => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length <= 6) return cleaned;
    if (cleaned.length <= 10) return `${cleaned.slice(0, 6)}-${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handleRegnoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRegno(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 6) {
      setRegno(formatted);
      setError(null);
    }
  };

  const handlePersonnummerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPersonnummer(e.target.value);
    if (formatted.replace(/[^0-9]/g, "").length <= 10) {
      setPersonnummer(formatted);
      setError(null);
    }
  };

  const regnoValid = regnoSchema.safeParse(regno.replace(/\s/g, "")).success;

  const handleContinue = useCallback(() => {
    const regnoResult = regnoSchema.safeParse(regno.replace(/\s/g, ""));
    if (!regnoResult.success) {
      setError(regnoResult.error.errors[0]?.message || "Ogiltigt registreringsnummer");
      return;
    }
    setError(null);
    setStep(2);
  }, [regno]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const cleanedRegno = regno.replace(/\s/g, "");
      const cleanedPnr = personnummer.replace(/[^0-9]/g, "");

      const regnoResult = regnoSchema.safeParse(cleanedRegno);
      if (!regnoResult.success) {
        setError(regnoResult.error.errors[0]?.message || "Ogiltigt registreringsnummer");
        return;
      }

      // Still on step 1: advance to personnummer rather than submit.
      if (step === 1) {
        setStep(2);
        return;
      }

      if (cleanedPnr.length !== 10) {
        setError("Ange ett giltigt personnummer (10 siffror)");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Start the search and get the ID immediately
        const response = await fetch(`${API_BASE_URL}/quote/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            regno: regnoResult.data,
            personnummer: cleanedPnr,
            yearlyKm: 10,
            driverUnder24: false,
            deductible: "medium",
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error?.message || "Kunde inte starta sökning");
        }

        const { id } = await response.json();
        
        // Redirect immediately to the search page
        navigate(`/s/${id}`);
        
        if (onQuotesFound) {
          onQuotesFound({ id });
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Kunde inte hämta försäkringsofferter. Försök igen."
        );
        setIsLoading(false);
      }
    },
    [regno, personnummer, step, navigate, onQuotesFound]
  );

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl border-0 bg-white">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-2">
              <Car className="w-7 h-7 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {heading ?? "Jämför ditt pris"}
            </h2>
            <p className="text-gray-600">
              {subheading ??
                "Börja med registreringsnumret — så hämtar vi priser för just din bil."}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registreringsnummer
              </label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all bg-gray-50">
                <div className="flex items-center justify-center w-16 h-14 bg-blue-600 text-white font-bold text-lg shrink-0">
                  <span className="text-xl">🇸🇪</span>
                </div>
                <input
                  type="text"
                  value={regno}
                  onChange={handleRegnoChange}
                  placeholder="ABC 123"
                  className="flex-1 h-14 px-4 text-xl font-mono font-bold tracking-wider text-center bg-transparent outline-none placeholder:text-gray-400 uppercase"
                  disabled={isLoading}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  aria-label="Registreringsnummer"
                />
              </div>
            </div>

            {step === 2 && (
              <div className="rise">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personnummer
                </label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all bg-gray-50">
                  <div className="flex items-center justify-center w-16 h-14 bg-gray-600 text-white shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <input
                    type="text"
                    value={personnummer}
                    onChange={handlePersonnummerChange}
                    placeholder="ÅÅMMDD-XXXX"
                    className="flex-1 h-14 px-4 text-xl font-mono tracking-wider text-center bg-transparent outline-none placeholder:text-gray-400"
                    disabled={isLoading}
                    autoComplete="off"
                    inputMode="numeric"
                    autoFocus
                    aria-label="Personnummer"
                  />
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                  <Lock className="h-3.5 w-3.5" />
                  Krävs för personliga priser. Skickas krypterat och sparas inte.
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {step === 1 ? (
            <Button
              type="button"
              size="xl"
              onClick={handleContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg h-14"
              disabled={!regnoValid}
            >
              Fortsätt
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="xl"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg h-14"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Startar sökning...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Visa priser
                </>
              )}
            </Button>
          )}

          <p className="text-xs text-gray-500 text-center">
            Gratis och utan förpliktelser · Oberoende prisjämförelse
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
