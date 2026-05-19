import { Car, Calendar, Gauge, Fuel, Users, FileCheck, Banknote } from "lucide-react";
import { Card, CardContent } from "@affiliate/ui";
import type { Vehicle } from "../types/insurance";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "–";
    return new Date(dateStr).toLocaleDateString("sv-SE");
  };

  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return "–";
    return new Intl.NumberFormat("sv-SE").format(num);
  };

  return (
    <Card className="w-full bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0 shadow-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-12 h-8 bg-blue-600 rounded text-white font-bold text-sm">
                  🇸🇪
                </div>
                <span className="text-2xl font-mono font-bold tracking-wider">{vehicle.regno}</span>
              </div>
              <h3 className="text-xl font-semibold">
                {vehicle.make} {vehicle.model}
              </h3>
              {vehicle.color && <p className="text-slate-400 mt-1">{vehicle.color}</p>}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{vehicle.vehicleYear}</div>
              <div className="text-slate-400 text-sm">Årsmodell</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
          <InfoItem
            icon={<Gauge className="w-5 h-5" />}
            label="Mätarställning"
            value={vehicle.mileage ? `${formatNumber(vehicle.mileage)} km` : "–"}
          />
          <InfoItem
            icon={<Car className="w-5 h-5" />}
            label="Motoreffekt"
            value={vehicle.powerHp ? `${vehicle.powerHp} hk` : "–"}
          />
          <InfoItem
            icon={<Fuel className="w-5 h-5" />}
            label="Drivmedel"
            value={vehicle.fuelType || "–"}
          />
          <InfoItem
            icon={<Users className="w-5 h-5" />}
            label="Antal ägare"
            value={vehicle.numberOfOwners?.toString() || "–"}
          />
          <InfoItem
            icon={<Calendar className="w-5 h-5" />}
            label="I trafik sedan"
            value={formatDate(vehicle.firstRegistered)}
          />
          <InfoItem
            icon={<FileCheck className="w-5 h-5" />}
            label="Besiktning giltig"
            value={formatDate(vehicle.inspectionValidUntil)}
          />
          <InfoItem
            icon={<Banknote className="w-5 h-5" />}
            label="Fordonsskatt"
            value={vehicle.tax ? `${formatNumber(vehicle.tax)} kr/år` : "–"}
          />
          {vehicle.co2 !== undefined && (
            <InfoItem
              icon={<span className="text-lg">🌱</span>}
              label="CO₂-utsläpp"
              value={vehicle.co2 === 0 ? "0 g/km" : `${vehicle.co2} g/km`}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-blue-400 mt-0.5">{icon}</div>
      <div>
        <div className="text-slate-400 text-xs">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
