/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SolarPresetCity {
  name: string;
  country: string;
  radiation: number; // kWh/m²/day
  description: string;
}

export interface PanelTechnology {
  id: string;
  name: string;
  efficiency: number; // expressed as fraction, e.g., 0.21 representing 21%
  description: string;
  costMultiplier: number; // adjustment factor for cost estimators
}

export interface SimulatorParams {
  panelArea: number; // m²
  solarRadiation: number; // kWh/m²/day
  panelTechId: string;
  customEfficiency: number; // % (active if panelTechId is 'custom')
  electricityPrice: number; // $/kWh
  feedInTariff: number; // $/kWh
  initialInvestment: number; // $
  powerDraw: number; // Average daily household consumption in kWh/day
  performanceRatio: number; // Efficiency coefficient of wiring/shading, default ~0.82
}

export interface HourlySimPoint {
  hour: number;
  timeLabel: string;
  generation: number; // kW
  load: number; // kW
  selfConsumed: number; // kW
  exported: number; // kW
  imported: number; // kW
}

export interface YearlySimulationRow {
  year: number;
  degradationFactor: number;
  utilityPrice: number; // $/kWh
  solarProduction: number; // kWh/year
  importedElectric: number; // kWh/year
  exportedElectric: number; // kWh/year
  costWithoutSolar: number; // $/year
  costWithSolar: number; // $/year
  annualSavings: number; // $/year
  cumulativeSavings: number; // $/year
  cumulativeNetBenefit: number; // $/year (Cumulative Savings - Initial Investment - repairs)
  maintenanceCost: number; // $
}

export interface SimulationResult {
  systemCapacitykWp: number;
  dailySolarGenKWh: number;
  annualSolarGenKWh: number;
  hourlyPoints: HourlySimPoint[];
  yearlyRows: YearlySimulationRow[];
  total25YearSavings: number;
  total25YearNetBenefit: number;
  paybackPeriodYears: number;
  co2SavedKgPerYear: number;
  treesPlantedPerYear: number;
  coalSavedKgPerYear: number;
  dailyDirectConsumptionPercent: number; // % of solar used by the house
  dailySolarExportPercent: number; // % of solar sent to grid
}

// Global presets
export const PRESET_CITIES: SolarPresetCity[] = [
  { name: "Surabaya", country: "Jawa Timur", radiation: 4.8, description: "Radiasi matahari sangat tinggi dan konsisten sepanjang tahun." },
  { name: "Denpasar", country: "Bali", radiation: 5.1, description: "Puncak insolasi tropis terbaik untuk wilayah pariwisata." },
  { name: "Jakarta", country: "DKI Jakarta", radiation: 4.2, description: "Tingkat radiasi perkotaan sedang, terpengaruh polusi/awan musiman." },
  { name: "Makassar", country: "Sulawesi Selatan", radiation: 4.9, description: "Potensi energi surya sangat konsisten dengan tutupan awan rendah." },
  { name: "Medan", country: "Sumatera Utara", radiation: 4.0, description: "Paparan tropis sedang dengan curah hujan tinggi musiman." },
];

export const PANEL_TECHNOLOGIES: PanelTechnology[] = [
  {
    id: "mono",
    name: "Monocrystalline Silicide",
    efficiency: 0.21,
    description: "Premium single-crystal silicon. High efficiency, sleek black appearance, great longevity.",
    costMultiplier: 1.0
  },
  {
    id: "poly",
    name: "Polycrystalline Silicide",
    efficiency: 0.17,
    description: "Multi-crystal silicon. Moderate efficiency, marbled blue pattern, traditional look.",
    costMultiplier: 0.8
  },
  {
    id: "thin",
    name: "Thin-Film (Amorphous/CdTe)",
    efficiency: 0.12,
    description: "Flexible layers of active material. Lower efficiency but excels in high heat or shading.",
    costMultiplier: 0.75
  },
  {
    id: "premium_n",
    name: "Premium N-Type (HJT / TOPCon)",
    efficiency: 0.24,
    description: "Next-gen ultra-premium tech. Extreme conversion rate, near-zero degradation, elite performance.",
    costMultiplier: 1.3
  },
  {
    id: "custom",
    name: "Custom (Manual Efficiency Mode)",
    efficiency: 0.20,
    description: "Enter any hypothetical efficiency coefficient to model arbitrary panels here.",
    costMultiplier: 1.0
  }
];
