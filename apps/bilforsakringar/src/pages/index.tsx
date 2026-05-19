import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Shield, Clock, Award, TrendingDown } from "lucide-react";
import { Button } from "@affiliate/ui";
import { RegnoInput } from "../components/RegnoInput";
import { VehicleCard } from "../components/VehicleCard";
import { InsuranceQuotes } from "../components/InsuranceQuotes";
import type { Vehicle, CoverageType, InsuranceQuote } from "../types/insurance";
import { estimateInsuranceQuotes } from "../lib/insurance-calculator";

export default function HomePage() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [quotes, setQuotes] = useState<InsuranceQuote[]>([]);
  const [selectedCoverage, setSelectedCoverage] = useState<CoverageType>("halv");

  const handleVehicleFound = useCallback((foundVehicle: Vehicle) => {
    setVehicle(foundVehicle);
    const initialQuotes = estimateInsuranceQuotes(foundVehicle, "halv");
    setQuotes(initialQuotes);
    setSelectedCoverage("halv");
  }, []);

  const handleCoverageChange = useCallback(
    (coverage: CoverageType) => {
      setSelectedCoverage(coverage);
      if (vehicle) {
        const newQuotes = estimateInsuranceQuotes(vehicle, coverage);
        setQuotes(newQuotes);
      }
    },
    [vehicle]
  );

  const handleReset = useCallback(() => {
    setVehicle(null);
    setQuotes([]);
  }, []);

  return (
    <>
      <Helmet>
        <title>Jämför bilförsäkringar 2026 – Hitta billigaste försäkringen | Bilförsäkringar.se</title>
        <meta
          name="description"
          content="Jämför bilförsäkringar från Sveriges största försäkringsbolag. Ange ditt registreringsnummer och få prisförslag direkt. Spara tusenlappar på din bilförsäkring."
        />
      </Helmet>

      {!vehicle ? (
        <div className="min-h-[calc(100vh-200px)] flex flex-col">
          <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4">
            <div className="w-full max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Jämför bilförsäkringar
                  <span className="text-blue-600"> på 30 sekunder</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Ange ditt registreringsnummer så hämtar vi information om din bil och visar
                  prisförslag från Sveriges ledande försäkringsbolag.
                </p>
              </div>

              <RegnoInput onVehicleFound={handleVehicleFound} />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
                <FeatureItem
                  icon={<Clock className="w-6 h-6" />}
                  title="Snabbt"
                  description="Resultat på 30 sek"
                />
                <FeatureItem
                  icon={<Shield className="w-6 h-6" />}
                  title="Säkert"
                  description="Krypterad data"
                />
                <FeatureItem
                  icon={<TrendingDown className="w-6 h-6" />}
                  title="Spara pengar"
                  description="Upp till 40% rabatt"
                />
                <FeatureItem
                  icon={<Award className="w-6 h-6" />}
                  title="Oberoende"
                  description="Alla stora bolag"
                />
              </div>
            </div>
          </section>

          <section className="py-16 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                Så fungerar det
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <StepItem
                  number={1}
                  title="Ange registreringsnummer"
                  description="Vi hämtar automatiskt information om din bil från Transportstyrelsen."
                />
                <StepItem
                  number={2}
                  title="Välj försäkringstyp"
                  description="Trafik, halv eller helförsäkring – vi visar priser för alla alternativ."
                />
                <StepItem
                  number={3}
                  title="Jämför och välj"
                  description="Se priser från alla stora försäkringsbolag och välj det bästa för dig."
                />
              </div>
            </div>
          </section>

          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Försäkringsbolag vi jämför
              </h2>
              <p className="text-gray-600 mb-8">
                Vi samarbetar med Sveriges största och mest pålitliga försäkringsbolag
              </p>
              <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
                {["Folksam", "If", "Trygg-Hansa", "Länsförsäkringar", "Gjensidige", "Dina"].map(
                  (name) => (
                    <div key={name} className="text-xl font-semibold text-gray-600">
                      {name}
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <Button variant="ghost" onClick={handleReset} className="mb-6 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ny sökning
            </Button>

            <div className="space-y-8">
              <VehicleCard vehicle={vehicle} />
              <InsuranceQuotes
                quotes={quotes}
                selectedCoverage={selectedCoverage}
                onCoverageChange={handleCoverageChange}
              />
            </div>

            <div className="mt-12 p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Om prisuppskattningarna</h3>
              <p className="text-sm text-gray-600">
                Priserna som visas är uppskattningar baserade på fordonsdata som märke, modell,
                ålder och motoreffekt. Det slutgiltiga priset från försäkringsbolaget kan variera
                beroende på personliga faktorer som din ålder, bostadsort, körsträcka per år och
                eventuell skadehistorik. Klicka på "Gå till [bolag]" för att få ett exakt pris.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-4">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function StepItem({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
