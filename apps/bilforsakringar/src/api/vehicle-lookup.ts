import type { Vehicle } from "../types/insurance";
import { vehicleSchema } from "../types/insurance";

const MOCK_VEHICLES: Record<string, Vehicle> = {
  ABC123: {
    regno: "ABC123",
    vin: "YV1CZ592471234567",
    make: "Volvo",
    model: "V60 D4 Momentum",
    color: "Svart",
    vehicleYear: 2019,
    modelYear: 2019,
    fuelType: "Diesel",
    powerHp: 190,
    powerKw: 140,
    weight: 1735,
    co2: 119,
    mileage: 45000,
    tax: 1702,
    numberOfOwners: 2,
    firstRegistered: "2019-03-15",
    inspectionValidUntil: "2027-05-31",
  },
  XYZ789: {
    regno: "XYZ789",
    vin: "WVWZZZ3CZDE012345",
    make: "Volkswagen",
    model: "Golf 1.5 TSI Style",
    color: "Vit",
    vehicleYear: 2021,
    modelYear: 2021,
    fuelType: "Bensin",
    powerHp: 150,
    powerKw: 110,
    weight: 1355,
    co2: 123,
    mileage: 28000,
    tax: 1416,
    numberOfOwners: 1,
    firstRegistered: "2021-06-20",
    inspectionValidUntil: "2027-08-31",
  },
  DEF456: {
    regno: "DEF456",
    vin: "5YJ3E1EA1LF123456",
    make: "Tesla",
    model: "Model 3 Long Range",
    color: "Röd",
    vehicleYear: 2022,
    modelYear: 2022,
    fuelType: "El",
    powerHp: 351,
    powerKw: 258,
    weight: 1847,
    co2: 0,
    mileage: 15000,
    tax: 360,
    numberOfOwners: 1,
    firstRegistered: "2022-01-10",
    inspectionValidUntil: "2028-03-31",
  },
  GHI321: {
    regno: "GHI321",
    vin: "JTDKN3DU5A0123456",
    make: "Toyota",
    model: "Yaris Hybrid",
    color: "Blå",
    vehicleYear: 2018,
    modelYear: 2018,
    fuelType: "Hybrid",
    powerHp: 100,
    powerKw: 74,
    weight: 1100,
    co2: 75,
    mileage: 62000,
    tax: 360,
    numberOfOwners: 3,
    firstRegistered: "2018-09-05",
    inspectionValidUntil: "2026-11-30",
  },
  JKL654: {
    regno: "JKL654",
    vin: "WBAPH5C55BA123456",
    make: "BMW",
    model: "320d xDrive",
    color: "Grå",
    vehicleYear: 2017,
    modelYear: 2017,
    fuelType: "Diesel",
    powerHp: 190,
    powerKw: 140,
    weight: 1640,
    co2: 129,
    mileage: 89000,
    tax: 2006,
    numberOfOwners: 4,
    firstRegistered: "2017-04-22",
    inspectionValidUntil: "2026-06-30",
  },
};

function generateRandomVehicle(regno: string): Vehicle {
  const makes = [
    { make: "Volvo", models: ["V40", "V60", "V90", "XC40", "XC60", "XC90", "S60", "S90"] },
    { make: "Volkswagen", models: ["Golf", "Passat", "Tiguan", "Polo", "T-Roc", "ID.4"] },
    { make: "Toyota", models: ["Corolla", "RAV4", "Yaris", "C-HR", "Camry", "Prius"] },
    { make: "Skoda", models: ["Octavia", "Superb", "Kodiaq", "Karoq", "Fabia", "Enyaq"] },
    { make: "Audi", models: ["A3", "A4", "A6", "Q3", "Q5", "e-tron"] },
    { make: "Mercedes", models: ["A-Klass", "C-Klass", "E-Klass", "GLA", "GLC", "EQC"] },
    { make: "Kia", models: ["Ceed", "Sportage", "Niro", "EV6", "Sorento"] },
    { make: "Hyundai", models: ["i30", "Tucson", "Kona", "Ioniq 5", "Santa Fe"] },
  ];

  const fuelTypes = ["Bensin", "Diesel", "El", "Hybrid", "Laddhybrid"];
  const colors = ["Svart", "Vit", "Grå", "Blå", "Röd", "Silver", "Grön"];

  const makeData = makes[Math.floor(Math.random() * makes.length)];
  const model = makeData.models[Math.floor(Math.random() * makeData.models.length)];
  const fuelType = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const currentYear = new Date().getFullYear();
  const vehicleYear = currentYear - Math.floor(Math.random() * 12);
  const powerHp = 80 + Math.floor(Math.random() * 250);
  const mileage = Math.floor(Math.random() * 150000);
  const numberOfOwners = 1 + Math.floor(Math.random() * 4);

  return {
    regno: regno.toUpperCase(),
    make: makeData.make,
    model: `${model} ${fuelType === "El" ? "Electric" : ""}`.trim(),
    color,
    vehicleYear,
    modelYear: vehicleYear,
    fuelType,
    powerHp,
    powerKw: Math.round(powerHp * 0.7355),
    weight: 1200 + Math.floor(Math.random() * 800),
    co2: fuelType === "El" ? 0 : 80 + Math.floor(Math.random() * 150),
    mileage,
    tax: 360 + Math.floor(Math.random() * 3000),
    numberOfOwners,
    firstRegistered: `${vehicleYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
    inspectionValidUntil: `${currentYear + 1}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
  };
}

export async function lookupVehicle(regno: string): Promise<Vehicle> {
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

  const normalizedRegno = regno.toUpperCase().replace(/\s/g, "");

  if (MOCK_VEHICLES[normalizedRegno]) {
    return vehicleSchema.parse(MOCK_VEHICLES[normalizedRegno]);
  }

  return vehicleSchema.parse(generateRandomVehicle(normalizedRegno));
}

export async function lookupVehicleReal(regno: string): Promise<Vehicle> {
  const response = await fetch(`https://api.biluppgifter.se/api/v1/vehicle/regno/${regno}`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_BILUPPGIFTER_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "Bilforsakringar.se/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Vehicle lookup failed: ${response.status}`);
  }

  const data = await response.json();
  const vehicleData = data.data;

  return vehicleSchema.parse({
    regno: vehicleData.attributes.regno,
    vin: vehicleData.attributes.vin,
    make: vehicleData.basic?.data?.make,
    model: vehicleData.basic?.data?.model,
    color: vehicleData.basic?.data?.color,
    vehicleYear: vehicleData.basic?.data?.vehicle_year,
    modelYear: vehicleData.basic?.data?.model_year,
    fuelType: vehicleData.technical?.data?.fuel,
    powerHp: vehicleData.technical?.data?.power_hp_1,
    powerKw: vehicleData.technical?.data?.power_kw_1,
    weight: vehicleData.technical?.data?.weight,
    co2: vehicleData.environment?.data?.co2,
    mileage: vehicleData.inspection?.data?.meter,
    tax: vehicleData.status?.data?.tax,
    numberOfOwners: vehicleData.status?.data?.number_of_owners,
    firstRegistered: vehicleData.status?.data?.first_registered,
    inspectionValidUntil: vehicleData.inspection?.data?.inspection_valid_until,
  });
}
