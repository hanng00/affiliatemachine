import { useState, useCallback } from "react";
import { Search, Car, AlertCircle, Loader2 } from "lucide-react";
import { Button, Card, CardContent } from "@affiliate/ui";
import { regnoSchema } from "../types/insurance";
import type { Vehicle } from "../types/insurance";
import { lookupVehicle } from "../api/vehicle-lookup";

interface RegnoInputProps {
  onVehicleFound: (vehicle: Vehicle) => void;
  isLoading?: boolean;
}

export function RegnoInput({ onVehicleFound, isLoading: externalLoading }: RegnoInputProps) {
  const [regno, setRegno] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loading = externalLoading || isLoading;

  const formatRegno = (value: string): string => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (cleaned.length <= 3) return cleaned;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRegno(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 6) {
      setRegno(formatted);
      setError(null);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const cleanedRegno = regno.replace(/\s/g, "");
      const result = regnoSchema.safeParse(cleanedRegno);

      if (!result.success) {
        setError(result.error.errors[0]?.message || "Ogiltigt registreringsnummer");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const vehicle = await lookupVehicle(result.data);
        onVehicleFound(vehicle);
      } catch {
        setError("Kunde inte hitta fordonet. Kontrollera registreringsnumret och försök igen.");
      } finally {
        setIsLoading(false);
      }
    },
    [regno, onVehicleFound]
  );

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl border-0 bg-white">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <Car className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Ange ditt registreringsnummer</h2>
            <p className="text-gray-600">
              Vi hämtar information om din bil och visar prisförslag från Sveriges försäkringsbolag
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all bg-gray-50">
                <div className="flex items-center justify-center w-20 h-16 bg-blue-600 text-white font-bold text-lg shrink-0">
                  <span className="text-2xl">🇸🇪</span>
                </div>
                <input
                  type="text"
                  value={regno}
                  onChange={handleInputChange}
                  placeholder="ABC 123"
                  className="flex-1 h-16 px-4 text-2xl font-mono font-bold tracking-wider text-center bg-transparent outline-none placeholder:text-gray-400 uppercase"
                  disabled={loading}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <p className="text-xs text-gray-500 text-center">
              Testa med: ABC123, XYZ789, DEF456 (Tesla), GHI321 (Toyota), JKL654 (BMW)
            </p>
          </div>

          <Button
            type="submit"
            size="xl"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg h-14"
            disabled={loading || regno.replace(/\s/g, "").length < 6}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Hämtar fordonsuppgifter...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Jämför försäkringar
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
