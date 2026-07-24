// Trygg-Hansa uses yearly mileage in thousands (1 = 1000 km, 15 = 15000 km, etc.)
// Their API accepts: 1000, 1500, 2000, 2500, 3000 (in actual km values)
// But looking at the request, it seems they use raw values like 1000 for 1000km/year

export function mapYearlyKm(yearlyKmThousands: number): number {
  // Input is in thousands (e.g., 15 = 15000 km/year)
  // Trygg-Hansa API expects the value in actual km
  // Common options: 1000, 1500, 2000, 2500, 3000 km/year
  const kmPerYear = yearlyKmThousands * 1000;
  
  // Map to closest Trygg-Hansa option
  const options = [1000, 1500, 2000, 2500, 3000];
  
  // Find closest option
  let closest = options[0];
  let minDiff = Math.abs(kmPerYear - closest);
  
  for (const opt of options) {
    const diff = Math.abs(kmPerYear - opt);
    if (diff < minDiff) {
      minDiff = diff;
      closest = opt;
    }
  }
  
  return closest;
}

// Deductible mapping based on the API response
// Traffic deductible options: id 2 = 1000 kr, id 3 = 2000 kr
// Half insurance deductible options: id 1 = 1800 kr, id 2 = 3000 kr
// Vehicle damage deductible options: id 1 = 3500 kr, id 2 = 6000 kr, id 4 = 4500 kr

export interface DeductibleIds {
  traffic: number;
  half: number;
  vehicleDamage: number;
}

export function mapDeductibles(level: "low" | "medium" | "high"): DeductibleIds {
  switch (level) {
    case "low":
      return {
        traffic: 2,      // 1000 kr
        half: 1,         // 1800 kr
        vehicleDamage: 1, // 3500 kr
      };
    case "medium":
      return {
        traffic: 2,      // 1000 kr
        half: 1,         // 1800 kr
        vehicleDamage: 4, // 4500 kr
      };
    case "high":
      return {
        traffic: 3,      // 2000 kr
        half: 2,         // 3000 kr
        vehicleDamage: 2, // 6000 kr
      };
  }
}
