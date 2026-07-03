/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SimulationResult, YearlySimulationRow } from "../types";
import {
  TrendingUp,
  CalendarCheck,
  Zap,
  Info,
  ShieldAlert
} from "lucide-react";

interface SolarDashboardProps {
  simulation: SimulationResult;
  initialInvestment: number;
}

export default function SolarDashboard({ simulation, initialInvestment }: SolarDashboardProps) {
  const {
    systemCapacitykWp,
    dailySolarGenKWh,
    yearlyRows,
    total25YearNetBenefit,
    paybackPeriodYears,
    dailyDirectConsumptionPercent,
    dailySolarExportPercent
  } = simulation;

  // Selected year state for interactive timeline slider
  const [activeYrHoverIndex, setActiveYrHoverIndex] = useState<number>(11); // Default to Year 12 (standard inverter service milestone)

  const currentHoverRow: YearlySimulationRow = yearlyRows[activeYrHoverIndex] || yearlyRows[11];

  // Indonesian Rupiah currency formatting helper
  const formatCurrency = (val: number) => {
    return "Rp " + new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatKWh = (val: number) => {
    return new Intl.NumberFormat("id-ID").format(val) + " kWh";
  };

  // SVG Chart Dimensions & Computations
  const chartW = 850;
  const chartH = 320;
  const paddingX = 90;
  const paddingY = 40;

  // X values range from 1 to 25.
  // Y values range from lowest (usually initial investment as negative) to highest projected saving.
  let cumulativeCostsNoSolarSum = 0;
  const noSolarCosts = yearlyRows.map(r => {
    cumulativeCostsNoSolarSum += r.costWithoutSolar;
    return -cumulativeCostsNoSolarSum;
  });

  const solarBenefits = yearlyRows.map(r => r.cumulativeNetBenefit);

  // Math boundaries for plotting coordinates
  const minYVal = Math.min(-initialInvestment * 1.25, ...noSolarCosts);
  const maxYVal = Math.max(total25YearNetBenefit * 1.1, ...solarBenefits, 20000000);
  const totalYSpan = maxYVal - minYVal;

  const getXCoord = (year: number) => {
    return paddingX + ((year - 1) / 24) * (chartW - paddingX * 2);
  };

  const getYCoord = (val: number) => {
    return chartH - paddingY - ((val - minYVal) / (totalYSpan || 1)) * (chartH - paddingY * 2);
  };

  // Build coordinate strings for SVG lines
  const solarPathPoints = yearlyRows.map(r => {
    return `${getXCoord(r.year)},${getYCoord(r.cumulativeNetBenefit)}`;
  }).join(" ");

  const noSolarPathPoints = yearlyRows.map((r, i) => {
    return `${getXCoord(r.year)},${getYCoord(noSolarCosts[i])}`;
  }).join(" ");

  const yZeroLine = getYCoord(0);

  return (
    <div className="w-full flex flex-col gap-6" id="simulator-dashboard-root">
      
      {/* 1. KEY IMPACT METRIC TILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: System Capacity */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-700/80 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kapasitas Puncak STC</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Zap className="w-4.5 h-4.5 fill-amber-500/10" />
              </div>
            </div>
            <h4 className="text-2xl font-display font-bold text-slate-100 mt-2.5">
              {systemCapacitykWp.toFixed(2)} <span className="text-sm font-semibold text-slate-500">kWp</span>
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 border-t border-slate-800 pt-2.5 font-sans">
            Menghasilkan rata-rata <span className="font-semibold text-amber-400">{dailySolarGenKWh.toFixed(1)} kWh/hari</span> yang siap disalurkan.
          </p>
        </div>

        {/* Metric 2: Payback Period */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-700/80 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Periode Impas (ROI)</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-450">
                <CalendarCheck className="w-4.5 h-4.5 text-blue-400" />
              </div>
            </div>
            <h4 className="text-2xl font-display font-bold text-slate-100 mt-2.5">
              {paybackPeriodYears <= 25 ? (
                <>
                  {paybackPeriodYears} <span className="text-xs font-semibold text-slate-500">Tahun</span>
                </>
              ) : (
                <span className="text-sm text-red-400 font-semibold">Tidak feasible (&gt;25 Thn)</span>
              )}
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 border-t border-slate-800 pt-2.5">
            Estimasi waktu kembali modal awal. Garansi panel surya hingga 25 Tahun.
          </p>
        </div>

        {/* Metric 3: Total Net Savings */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-700/80 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nilai Keuntungan Netto 25Thn</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
            </div>
            <h4 className="text-2xl font-display font-bold text-emerald-400 mt-2.5">
              {formatCurrency(total25YearNetBenefit)}
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 border-t border-slate-800 pt-2.5 font-sans">
            Sudah memperhitungkan pemeliharaan & inflasi tarif listrik berkala.
          </p>
        </div>
      </div>


      {/* 2. CORE INTERACTIVE DEGRADATION & ACCUMULATION FINANCIAL TIMELINE */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-md font-display font-bold text-slate-100 tracking-tight">Proyeksi Finansial Kumulatif 25 Tahun</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Nilai akumulasi kas bersih dengan panel surya dibandingkan akumulasi biaya tagihan PLN konvensional.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs shrink-0 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Dengan Panel Surya
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                Tanpa Panel Surya (Tagihan PLN)
              </span>
            </div>
          </div>

          {/* Interactive SVG Graph Area */}
          <div className="w-full overflow-x-auto select-none mt-6">
            <div className="min-w-[720px] relative">
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto">
                {/* Y-Axis Grid Lines */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((frac, idx) => {
                  const y = paddingY + frac * (chartH - paddingY * 2);
                  const val = maxYVal - frac * totalYSpan;
                  return (
                    <g key={idx} opacity="0.15" className="stroke-slate-600">
                      <line x1={paddingX} y1={y} x2={chartW - paddingX} y2={y} strokeDasharray="3,3" />
                      <text
                        x={paddingX - 12}
                        y={y + 4}
                        className="text-[9px] font-mono fill-slate-400 text-right stroke-none"
                        textAnchor="end"
                      >
                        {formatCurrency(val)}
                      </text>
                    </g>
                  );
                })}

                {/* Horizontal zero axis line (break-even point) */}
                <line
                  x1={paddingX}
                  y1={yZeroLine}
                  x2={chartW - paddingX}
                  y2={yZeroLine}
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeDasharray="2,2"
                />
                <text
                  x={chartW - paddingX + 8}
                  y={yZeroLine + 3}
                  className="text-[8px] font-semibold font-mono fill-slate-500"
                >
                  TASY BATAS IMPAS
                </text>

                {/* Vertical year grid elements */}
                {[1, 5, 10, 15, 20, 25].map((yr) => {
                  const x = getXCoord(yr);
                  return (
                    <g key={yr} opacity="0.12" className="stroke-slate-600">
                      <line x1={x} y1={paddingY} x2={x} y2={chartH - paddingY} />
                      <text
                        x={x}
                        y={chartH - paddingY + 16}
                        className="text-[9px] font-mono fill-slate-400 stroke-none"
                        textAnchor="middle"
                      >
                        Thn {yr}
                      </text>
                    </g>
                  );
                })}

                {/* BASELINE PATH - NO SOLAR */}
                <path
                  d={`M ${paddingX} ${getYCoord(0)} L ${noSolarPathPoints}`}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2.5"
                  strokeDasharray="4,4"
                  opacity="0.8"
                />

                {/* DYNAMIC SHADING / FILL UNDER SOLAR CASH SURPASS CURVE */}
                <path
                  d={`M ${paddingX} ${getYCoord(-initialInvestment)} L ${solarPathPoints} L ${getXCoord(25)} ${yZeroLine} L ${paddingX} ${yZeroLine} Z`}
                  fill="url(#solar-fill-grad)"
                  opacity="0.1"
                  id="solar-fill-shading"
                />
                <defs>
                  <linearGradient id="solar-fill-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* MET DIRECT SAVINGS LINE */}
                <path
                  d={`M ${paddingX} ${getYCoord(-initialInvestment)} L ${solarPathPoints}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  id="path-solar-savings"
                />

                {/* INVERTER REPLACEMENT SYMBOL IN YEAR 12 */}
                <g transform={`translate(${getXCoord(12) - 8}, ${getYCoord(yearlyRows[11].cumulativeNetBenefit) - 8})`} className="cursor-pointer">
                  <circle cx="8" cy="8" r="8" fill="#f43f5e" stroke="#0f172a" strokeWidth="2" />
                  <title>Tahun 12: Estimasi Penggantian Inverter Utama</title>
                </g>

                {/* INTERACTIVE TRACKING INDICATORS ON ACTIVE YEAR CHOSEN */}
                {activeYrHoverIndex !== null && (
                  <g>
                    {/* Vertical marker line */}
                    <line
                      x1={getXCoord(activeYrHoverIndex + 1)}
                      y1={paddingY}
                      x2={getXCoord(activeYrHoverIndex + 1)}
                      y2={chartH - paddingY}
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                      opacity="0.5"
                    />

                    {/* No Solar Cost Node */}
                    <circle
                      cx={getXCoord(activeYrHoverIndex + 1)}
                      cy={getYCoord(noSolarCosts[activeYrHoverIndex])}
                      r="5"
                      fill="#64748b"
                      stroke="#1e293b"
                      strokeWidth="1.5"
                    />

                    {/* With Solar cumulative net payoff node */}
                    <circle
                      cx={getXCoord(activeYrHoverIndex + 1)}
                      cy={getYCoord(yearlyRows[activeYrHoverIndex].cumulativeNetBenefit)}
                      r="5"
                      fill="#10b981"
                      stroke="#0f172a"
                      strokeWidth="1.5"
                    />
                  </g>
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* 3. SIMPLIFIED ACTIVE YEAR SLIDER & REAL-TIME PRECISE STATS COUNTERS */}
        <div className="flex flex-col gap-4 border-t border-slate-800/80 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Slider Scrubber Controller */}
            <div className="md:col-span-5 flex items-center justify-between gap-3 bg-slate-950/60 border border-slate-800/60 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider shrink-0 uppercase">Geser Tahun Analisis:</span>
              <input
                type="range"
                min="0"
                max="24"
                value={activeYrHoverIndex}
                onChange={(e) => setActiveYrHoverIndex(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                id="chart-timeline-slider"
              />
              <span className="text-[10px] font-mono font-black text-slate-200 bg-slate-800 py-1 px-2 rounded shrink-0">
                Tahun {activeYrHoverIndex + 1}
              </span>
            </div>

            {/* Micro Stats Row - Extremely clean representation */}
            <div className="md:col-span-7 grid grid-cols-3 gap-3">
              <div className="bg-slate-950/30 border border-slate-800/40 p-2.5 rounded-xl">
                <span className="text-[9px] font-semibold text-slate-500 block uppercase">Fisura Degradasi</span>
                <span className="text-xs font-mono font-bold text-slate-200 block mt-0.5">
                  {currentHoverRow.degradationFactor}% <span className="text-[9px] text-slate-500 font-normal">Kinerja</span>
                </span>
              </div>

              <div className="bg-slate-950/30 border border-slate-800/40 p-2.5 rounded-xl">
                <span className="text-[9px] font-semibold text-slate-500 block uppercase">Estimasi Tarif Listrik</span>
                <span className="text-xs font-mono font-bold text-slate-200 block mt-0.5">
                  Rp {Math.round(currentHoverRow.utilityPrice)}<span className="text-[9px] text-slate-500 font-normal">/kWh</span>
                </span>
              </div>

              <div className="bg-slate-950/30 border border-slate-800/40 p-2.5 rounded-xl">
                <span className="text-[9px] font-semibold text-slate-505 block uppercase">Saldo Kas Bersih</span>
                <span className={`text-xs font-mono font-bold block mt-0.5 ${currentHoverRow.cumulativeNetBenefit >= 0 ? "text-emerald-400" : "text-amber-500"}`}>
                  {formatCurrency(currentHoverRow.cumulativeNetBenefit)}
                </span>
              </div>
            </div>

          </div>

          {/* Conditional Note for Year 12 string inverter replacement */}
          {currentHoverRow.year === 12 && (
            <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-900/40 p-3 rounded-xl text-rose-300 text-[11px] animate-fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>
                <strong>Tahun 12 Terdeteksi:</strong> Pemeliharaan periodik dilakukan berupa penggantian komersial string inverter on-grid (diestimasikan sebesar 15% dari kapital awal investasi). Hal ini menjaga efisiensi penyearah tetap optimal.
              </span>
            </div>
          )}

          {/* Dynamic summary text */}
          <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-3 flex items-center gap-2.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-slate-400 leading-normal">
              Hingga <strong>Tahun {currentHoverRow.year}</strong>, sistem solar berhasil memproduksi energi kumulatif berkinerja tinggi sebesar <strong>{formatKWh(currentHoverRow.solarProduction)}</strong>. Keuntungan kumulatif yang didapat dari offset langsung tagihan serta kredit ekspor surplus grid bernilai total <strong>{formatCurrency(currentHoverRow.cumulativeSavings)}</strong>.
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
