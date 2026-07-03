/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  HourlySimPoint,
  PANEL_TECHNOLOGIES,
  SimulatorParams,
  SimulationResult,
  YearlySimulationRow
} from "../types";

/**
 * Standard double-peak household utility load profile (residential demand factor over 24 hours)
 * Peaks in morning (8am) and high peak in evening (6pm-10pm).
 */
const HOURLY_LOAD_CURVE_FACTORS = [
  0.25, 0.22, 0.20, 0.20, 0.22, 0.28, // Midnight - 5 AM
  0.45, 0.68, 0.75, 0.60, 0.45, 0.40, // 6 AM - 11 AM
  0.38, 0.35, 0.35, 0.42, 0.55, 0.72, // 12 PM - 5 PM
  0.92, 1.00, 0.95, 0.85, 0.55, 0.35  // 6 PM - 11 PM
];

/**
 * Executes a full physical and financial simulation based on configured parameters.
 */
export function calculateSolarSimulation(params: SimulatorParams): SimulationResult {
  const {
    panelArea,
    solarRadiation,
    panelTechId,
    customEfficiency,
    electricityPrice,
    feedInTariff,
    initialInvestment,
    powerDraw,
    performanceRatio
  } = params;

  // Determine actual panel efficiency
  const matchingTech = PANEL_TECHNOLOGIES.find(t => t.id === panelTechId);
  const efficiencyDecimal = matchingTech && matchingTech.id !== "custom"
    ? matchingTech.efficiency
    : customEfficiency / 100;

  // Standard STC Capacity = Area (m²) * Efficiency
  // Assumes STC standard peak light intensity of 1000 W/m² (1 kW/m²)
  const systemCapacitykWp = panelArea * efficiencyDecimal;

  // Daily Generation = System Capacity * Solar Radiation (Peak Sun Hours) * PR
  const dailySolarGenKWh = systemCapacitykWp * solarRadiation * performanceRatio;
  const annualSolarGenKWh = dailySolarGenKWh * 365;

  // 1. Build the Hourly Curve Simulation (24 Hour points)
  const hourlyPoints: HourlySimPoint[] = [];
  const totalLoadFactorSum = HOURLY_LOAD_CURVE_FACTORS.reduce((a, b) => a + b, 0);

  // Normalizing the solar shape
  // Solar wave uses sine-squared wave from 6am to 6pm
  const solarFactors = Array(24).fill(0);
  let solarFactorSum = 0;
  for (let h = 0; h < 24; h++) {
    if (h >= 6 && h <= 18) {
      const theta = Math.PI * (h - 6) / 12;
      solarFactors[h] = Math.pow(Math.sin(theta), 2);
      solarFactorSum += solarFactors[h];
    }
  }

  // Generate real-time kW equivalents
  for (let h = 0; h < 24; h++) {
    let ampm = h >= 12 ? "PM" : "AM";
    let hourDisplay = h % 12 === 0 ? "12" : (h % 12).toString();
    const timeLabel = `${hourDisplay}:00 ${ampm}`;

    // Hourly demand based on normalized standard load curve
    // Scale total daily load (kWh) to hourly average (kW)
    const loadKW = powerDraw * (HOURLY_LOAD_CURVE_FACTORS[h] / totalLoadFactorSum);

    // Hourly solar output based on normalized shape
    // Scale overall daily solar generation (kWh) to hourly average (kW)
    const solarKW = solarFactorSum > 0 ? dailySolarGenKWh * (solarFactors[h] / solarFactorSum) : 0;

    // Direct consumed energy (whichever is smaller)
    const selfConsumedKW = Math.min(solarKW, loadKW);

    // Exported surplus
    const exportedKW = Math.max(0, solarKW - loadKW);

    // Grid imported shortfall
    const importedKW = Math.max(0, loadKW - solarKW);

    hourlyPoints.push({
      hour: h,
      timeLabel,
      generation: Number(solarKW.toFixed(3)),
      load: Number(loadKW.toFixed(3)),
      selfConsumed: Number(selfConsumedKW.toFixed(3)),
      exported: Number(exportedKW.toFixed(3)),
      imported: Number(importedKW.toFixed(3))
    });
  }

  // Sum daily totals from hours to verify and preserve precision
  const dailySelfKWh = hourlyPoints.reduce((acc, p) => acc + p.selfConsumed, 0);
  const dailyExportKWh = hourlyPoints.reduce((acc, p) => acc + p.exported, 0);
  const dailyImportKWh = hourlyPoints.reduce((acc, p) => acc + p.imported, 0);

  // Percentages represent current day utilization
  const dailyDirectConsumptionPercent = dailySolarGenKWh > 0
    ? (dailySelfKWh / dailySolarGenKWh) * 100
    : 0;
  const dailySolarExportPercent = dailySolarGenKWh > 0
    ? (dailyExportKWh / dailySolarGenKWh) * 100
    : 0;

  // 2. Build the 25-Year Projection
  // Annualized values
  const baseAnnualProduction = annualSolarGenKWh;
  const annualDemandKWh = powerDraw * 365;

  const yearlyRows: YearlySimulationRow[] = [];
  let cumulativeSavings = 0;

  for (let year = 1; year <= 25; year++) {
    // Standard long-term factors:
    // Panels degrade by 0.5% per year
    const degradationFactor = Math.pow(1 - 0.005, year - 1);
    
    // Utility rates inflate by 2.5% per year
    const currentPrice = electricityPrice * Math.pow(1 + 0.025, year - 1);

    // Solar generation in this year (degraded)
    const yearlyProduction = baseAnnualProduction * degradationFactor;

    // Calculate electrical splits based on proportion of solar generated
    // scale daily splits to the year's degraded solar production
    const yearlySelfKWh = Math.min(yearlyProduction * (dailySelfKWh / Math.max(0.001, dailySolarGenKWh)), annualDemandKWh);
    const yearlyExportKWh = Math.max(0, yearlyProduction - yearlySelfKWh);
    const yearlyImportKWh = Math.max(0, annualDemandKWh - yearlySelfKWh);

    // Financial outcomes
    const billWithoutSolar = annualDemandKWh * currentPrice;

    // Net billing under net metering feed-in rates
    const solarSavingsSelf = yearlySelfKWh * currentPrice;
    const solarExportCredits = yearlyExportKWh * feedInTariff;
    const billWithSolar = yearlyImportKWh * currentPrice - solarExportCredits;

    const annualSavings = solarSavingsSelf + solarExportCredits;
    cumulativeSavings += annualSavings;

    // Handle inverter maintenance costs logic (typically Year 12)
    // About 15% of initial investment to replace or service state elements
    const maintenanceCost = year === 12 ? Math.round(initialInvestment * 0.15) : 0;

    const cumulativeNetBenefit = cumulativeSavings - initialInvestment - (year >= 12 ? Math.round(initialInvestment * 0.15) : 0);

    yearlyRows.push({
      year,
      degradationFactor: Number((degradationFactor * 100).toFixed(1)),
      utilityPrice: Number(currentPrice.toFixed(3)),
      solarProduction: Math.round(yearlyProduction),
      importedElectric: Math.round(yearlyImportKWh),
      exportedElectric: Math.round(yearlyExportKWh),
      costWithoutSolar: Math.round(billWithoutSolar),
      costWithSolar: Math.round(billWithSolar),
      annualSavings: Math.round(annualSavings),
      cumulativeSavings: Math.round(cumulativeSavings),
      cumulativeNetBenefit: Math.round(cumulativeNetBenefit),
      maintenanceCost
    });
  }

  // Calculate Payback Period
  // Find where cumulativeSavings surpasses initial investment
  let paybackPeriodYears = -1;
  for (let i = 0; i < yearlyRows.length; i++) {
    const row = yearlyRows[i];
    // Take Year 12 inverter replacement warning into account
    const totalCostsToThisYear = initialInvestment + (row.year >= 12 ? Math.round(initialInvestment * 0.15) : 0);
    if (row.cumulativeSavings >= totalCostsToThisYear) {
      // Find fractional year
      const prevCumulativeSavings = i > 0 ? yearlyRows[i - 1].cumulativeSavings : 0;
      const savingsThisYear = row.annualSavings;
      const neededSavings = totalCostsToThisYear - prevCumulativeSavings;
      
      const fraction = savingsThisYear > 0 ? neededSavings / savingsThisYear : 0;
      paybackPeriodYears = row.year - 1 + parseFloat(fraction.toFixed(1));
      break;
    }
  }

  // If we never break even in 25 years
  if (paybackPeriodYears === -1) {
    paybackPeriodYears = initialInvestment / (yearlyRows[0].annualSavings || 1);
    if (paybackPeriodYears > 35) paybackPeriodYears = 99; // Represents practically never
  }

  // Limit precision
  paybackPeriodYears = Number(Math.min(paybackPeriodYears, 25).toFixed(1));

  const total25YearSavings = yearlyRows[24].cumulativeSavings;
  const total25YearNetBenefit = yearlyRows[24].cumulativeNetBenefit;

  // 3. Environmental Offset Metrics
  // standard coefficients (US/global average coefficients)
  // Clean electricity saves 0.385 kg of carbon emissions per kWh
  const co2SavedKgPerYear = annualSolarGenKWh * 0.385;
  // Standard mature tree of 10 years absorbs about 22 kg of CO2/year
  const treesPlantedPerYear = co2SavedKgPerYear / 22;
  // 1 kWh solar offsets ~0.45 kg of coal burned to generate steam/electric
  const coalSavedKgPerYear = annualSolarGenKWh * 0.45;

  return {
    systemCapacitykWp: Number(systemCapacitykWp.toFixed(2)),
    dailySolarGenKWh: Number(dailySolarGenKWh.toFixed(2)),
    annualSolarGenKWh: Math.round(annualSolarGenKWh),
    hourlyPoints,
    yearlyRows,
    total25YearSavings,
    total25YearNetBenefit,
    paybackPeriodYears,
    co2SavedKgPerYear: Math.round(co2SavedKgPerYear),
    treesPlantedPerYear: Number(treesPlantedPerYear.toFixed(1)),
    coalSavedKgPerYear: Math.round(coalSavedKgPerYear),
    dailyDirectConsumptionPercent,
    dailySolarExportPercent
  };
}

/**
 * Highly realistic automatic system installation cost estimator
 * Average commercial/residential pricing in Indonesia is around Rp 15.000.000 - Rp 23.000.000 per kW DC depending on panel technology.
 */
export function estimateInstallationCost(area: number, techId: string, customEff: number): number {
  const matchingTech = PANEL_TECHNOLOGIES.find(t => t.id === techId);
  const efficiencyDecimal = matchingTech && matchingTech.id !== "custom"
    ? matchingTech.efficiency
    : customEff / 100;

  const kwp = area * efficiencyDecimal;
  const techFactor = matchingTech ? matchingTech.costMultiplier : 1.0;

  // Base price per kW of capacity in Rp: ~Rp 17.500.000
  const baseCost = kwp * 17500000 * techFactor;

  // Fixed overhead costs in Rp (permitting PLN, engineering, solar inverter racks): ~Rp 10.000.000
  const overhead = 10000000;

  return Math.round(baseCost + overhead);
}
