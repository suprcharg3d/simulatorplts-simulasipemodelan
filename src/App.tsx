/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  PRESET_CITIES,
  PANEL_TECHNOLOGIES,
  SimulatorParams,
  SimulationResult
} from "./types";
import { calculateSolarSimulation, estimateInstallationCost } from "./utils/solarCalculator";
import SolarDiagram from "./components/SolarDiagram";
import SolarDashboard from "./components/SolarDashboard";
import SolarFormulas from "./components/SolarFormulas";
import {
  SlidersHorizontal,
  MapPin,
  Settings,
  RotateCcw,
  Sun,
  Cpu,
  Calculator
} from "lucide-react";

export default function App() {
  // Navigation tab state: "simulation" or "formulas"
  const [activeTab, setActiveTab] = useState<"simulation" | "formulas">("simulation");

  // 1. Initial configuration states based on Indonesian standard levels
  const [selectedCityName, setSelectedCityName] = useState<string>("Surabaya");
  const [panelArea, setPanelArea] = useState<number>(30); // m²
  const [solarRadiation, setSolarRadiation] = useState<number>(4.8); // Peak Sun Hours (Surabaya default)
  const [panelTechId, setPanelTechId] = useState<string>("mono");
  const [customEfficiency, setCustomEfficiency] = useState<number>(20); // % of efficiency for customizable panels
  const [electricityPrice, setElectricityPrice] = useState<number>(1445); // Rp/kWh (PLN standard rate R-1/TR)
  const [feedInTariff, setFeedInTariff] = useState<number>(1084); // Rp/kWh (75% export credit cap)
  const [powerDraw, setPowerDraw] = useState<number>(12); // Average Indonesian household energy draw (kWh/day)

  // capital investment controllers
  const [isManualInvestment, setIsManualInvestment] = useState<boolean>(false);
  const [manualInvestment, setManualInvestment] = useState<number>(85000000); // Default manual budget override

  // Auto estimation helper cost
  const calculatedEstimatedInvestment = useMemo(() => {
    return estimateInstallationCost(panelArea, panelTechId, customEfficiency);
  }, [panelArea, panelTechId, customEfficiency]);

  const activeInvestment = isManualInvestment ? manualInvestment : calculatedEstimatedInvestment;

  // Indonesian Rupiah formatter wrapper
  const rpFormatter = (val: number) => {
    return "Rp " + new Intl.NumberFormat("id-ID").format(val);
  };

  // 2. Preset listener
  const handleCityChange = (cityName: string) => {
    setSelectedCityName(cityName);
    if (cityName !== "custom") {
      const city = PRESET_CITIES.find(c => c.name === cityName);
      if (city) {
        setSolarRadiation(city.radiation);
      }
    }
  };

  // 3. Bundle simulator parameters
  const simulationParams: SimulatorParams = useMemo(() => {
    return {
      panelArea,
      solarRadiation,
      panelTechId,
      customEfficiency,
      electricityPrice,
      feedInTariff,
      initialInvestment: activeInvestment,
      powerDraw,
      performanceRatio: 0.82 // loss coefficients (wiring, temperature, shading overhead)
    };
  }, [
    panelArea,
    solarRadiation,
    panelTechId,
    customEfficiency,
    electricityPrice,
    feedInTariff,
    activeInvestment,
    powerDraw
  ]);

  // Execute simulation solver
  const simulationResult: SimulationResult = useMemo(() => {
    return calculateSolarSimulation(simulationParams);
  }, [simulationParams]);

  // 4. Hourly time slice scheduler (day/night animated schematic flow)
  const [selectedHour, setSelectedHour] = useState<number>(12); // standard peak sun hour is noon
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedHour((prevHour) => (prevHour + 1) % 24);
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const activeHourPoint = simulationResult.hourlyPoints[selectedHour];

  // Restores user to localized defaults
  const handleResetParameters = () => {
    setSelectedCityName("Surabaya");
    setPanelArea(30);
    setSolarRadiation(4.8);
    setPanelTechId("mono");
    setCustomEfficiency(20);
    setElectricityPrice(1445);
    setFeedInTariff(1084);
    setPowerDraw(12);
    setIsManualInvestment(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-12" id="app-viewport">
      
      {/* GLOWING HEADER */}
      <header className="w-full bg-slate-900/60 border-b border-slate-800/60 py-5 px-6 lg:px-12 mb-8 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/5">
              <Sun className="w-6 h-6 animate-spin" style={{ animationDuration: "12s" }} />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold tracking-wider text-amber-400 uppercase">
                Simulator PLTS On-Grid Interaktif
              </h1>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Simulasi aliran listrik DC/AC rumah mandiri secara realtime dan proyeksi periode impas (ROI) jangka panjang.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 self-center">
            {/* View switcher tab button control group */}
            <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab("simulation")}
                className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === "simulation"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                id="tab-simulation"
              >
                <Cpu className="w-3.5 h-3.5" />
                Simulasi Utama
              </button>
              <button
                onClick={() => setActiveTab("formulas")}
                className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === "formulas"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                id="tab-formulas"
              >
                <Calculator className="w-3.5 h-3.5" />
                Teori & Formula
              </button>
            </div>

            <button
              onClick={handleResetParameters}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              title="Atur ulang simulator ke standarisasi Indonesia"
              id="reset-config-button"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Parameter
            </button>
          </div>
        </div>
      </header>

      {/* CORE CONTROL GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {activeTab === "simulation" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LATERBAR CONTROLLER FORM */}
          <section className="lg:col-span-4 bg-slate-900 border border-slate-800/80 p-6 rounded-3xl shadow-md space-y-6 self-start max-h-[85vh] overflow-y-auto sticky top-28 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <SlidersHorizontal className="w-4.5 h-4.5 text-amber-500" />
              <h2 className="text-xs font-display font-medium text-slate-200 tracking-wider uppercase">
                Parameter Simulasi
              </h2>
            </div>

            {/* A: Lokasi Dan Insolasi */}
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1.5 flex items-center gap-1 uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  Kota Presets (Indonesia)
                </label>
                <select
                  value={selectedCityName}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 outline-hidden focus:border-amber-500 transition-colors cursor-pointer"
                  id="city-select"
                >
                  {PRESET_CITIES.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name} ({city.country}) — {city.radiation} Jam/Hari
                    </option>
                  ))}
                  <option value="custom">Kustom Lokasi Sendiri...</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1 font-sans">
                  {selectedCityName !== "custom" 
                    ? PRESET_CITIES.find(c => c.name === selectedCityName)?.description 
                    : "Tentukan sendiri nilai insolation yang diterima permukaan solar panel."}
                </p>
              </div>

              {/* Solar Radiation Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 font-medium">Intensitas Radiasi Harian</span>
                  <span className="font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 py-0.5 px-1.5 rounded">
                    {solarRadiation.toFixed(1)} <span className="text-[9px] text-slate-400">jam/m²/hari</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="8.5"
                  step="0.1"
                  value={solarRadiation}
                  onChange={(e) => {
                    setSelectedCityName("custom");
                    setSolarRadiation(parseFloat(e.target.value));
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  id="solar-radiation-slider"
                />
              </div>
            </div>

            <hr className="border-slate-850" />

            {/* B: Dimensi Panel */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-semibold text-indigo-400 tracking-wider uppercase">
                Spesifikasi Array Hardware
              </h3>

              {/* Panel Area */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 font-medium">Total Luas Area Panel</span>
                  <span className="font-mono font-bold text-indigo-400 bg-indigo-505/10 border border-indigo-500/20 py-0.5 px-1.5 rounded">
                    {panelArea} <span className="text-[9px] text-slate-400">m²</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="1"
                  value={panelArea}
                  onChange={(e) => setPanelArea(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  id="panel-area-slider"
                />
                <span className="text-[9px] text-slate-400 block mt-1 leading-normal">
                  Setara ±<span className="font-semibold text-indigo-400">{Math.ceil(panelArea / 2.0)} modul panel surya</span> (modul standar estimasi ukuran 2m², energi output rating 400W).
                </span>
              </div>

              {/* Silicon Tech Selection dropdown */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1.5 flex items-center gap-1 uppercase tracking-widest">
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  Jenis Semikonduktor Sel
                </label>
                <select
                  value={panelTechId}
                  onChange={(e) => setPanelTechId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 outline-hidden focus:border-indigo-500 transition-colors cursor-pointer"
                  id="panel-tech-select"
                >
                  {PANEL_TECHNOLOGIES.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} ({(tech.efficiency * 100).toFixed(0)}% Efisiensi)
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  {PANEL_TECHNOLOGIES.find(t => t.id === panelTechId)?.description}
                </p>
              </div>

              {/* Custom panel efficiency slider */}
              {panelTechId === "custom" && (
                <div className="bg-indigo-950/40 border border-indigo-900/40 p-3 rounded-xl space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-indigo-300">Efisiensi Sel Kustom</span>
                    <span className="font-mono font-bold text-indigo-400 bg-indigo-900/50 py-0.5 px-1.5 rounded">
                      {customEfficiency}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={customEfficiency}
                    onChange={(e) => setCustomEfficiency(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-550"
                    id="custom-efficiency-slider"
                  />
                </div>
              )}
            </div>

            <hr className="border-slate-850" />

            {/* C: PLN Tarif Listrik */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase">
                Tarif Listrik & Ekspor (PLN)
              </h3>

              {/* Utility Import Rate Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-404 font-medium">Beli Listrik PLN (Impor)</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-0.5 px-1.5 rounded">
                    Rp {electricityPrice.toLocaleString("id-ID")} <span className="text-[9px] text-slate-400">/kWh</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="1300"
                  max="2800"
                  step="10"
                  value={electricityPrice}
                  onChange={(e) => setElectricityPrice(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  id="import-price-slider"
                />
              </div>

              {/* Feed-In Export Credit Tariff Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-404 font-medium">Nilai Ekspor Surplus Listrik</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-0.5 px-1.5 rounded">
                    Rp {feedInTariff.toLocaleString("id-ID")} <span className="text-[9px] text-slate-400">/kWh</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="2500"
                  step="10"
                  value={feedInTariff}
                  onChange={(e) => setFeedInTariff(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  id="export-credit-slider"
                />
              </div>
            </div>

            <hr className="border-slate-850" />

            {/* D: Bebat Konsumsi Harian */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                Konsumsi Energi Harian
              </h3>

              {/* Power draw slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-401 font-medium">Konsumsi Rata-rata Rumah</span>
                  <span className="font-mono font-bold text-slate-300 bg-slate-800 border border-slate-700 py-0.5 px-1.5 rounded">
                    {powerDraw} <span className="text-[9px] text-slate-400">kWh/hari</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="60"
                  step="1"
                  value={powerDraw}
                  onChange={(e) => setPowerDraw(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-500"
                  id="facility-load-slider"
                />
                <span className="text-[9px] text-slate-400 block mt-1 leading-normal">
                  Rata-rata rumah menengah di Indonesia mencatatkan pemakaian 8 - 18 kWh/hari (tergantung pemakaian pendingin ruangan/AC).
                </span>
              </div>
            </div>

            <hr className="border-slate-850" />

            {/* E: Financial Capital Setup */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-semibold text-amber-500 tracking-wider uppercase">
                  Biaya Investasi Pemasangan
                </h3>
                <label className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isManualInvestment}
                    onChange={(e) => setIsManualInvestment(e.target.checked)}
                    className="rounded text-amber-500 accent-amber-500"
                    id="manual-override-checkbox"
                  />
                  Kustom Manual
                </label>
              </div>

              {isManualInvestment ? (
                <div className="space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Budget Awal Kontraktor</span>
                    <span className="font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                      {rpFormatter(manualInvestment)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15000000"
                    max="250000000"
                    step="1000000"
                    value={manualInvestment}
                    onChange={(e) => setManualInvestment(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    id="manual-investment-slider"
                  />
                </div>
              ) : (
                <div className="bg-slate-950/65 border border-slate-850 p-4 rounded-2xl space-y-1">
                  <span className="text-[8px] font-semibold tracking-wider text-slate-500 block uppercase">Estimasi PLTS Otomatis (RAB)</span>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs font-semibold text-slate-350">Biaya Total Kontraktor</span>
                    <span className="text-sm font-mono font-bold text-slate-100">
                      {rpFormatter(calculatedEstimatedInvestment)}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 leading-normal pt-1">
                    Sudah termasuk komponen modul bersertifikat SNI, AC/DC inverter on-grid, perizinan PLN (re-commissioning meter EXIM), dan jasa pemasangan.
                  </p>
                </div>
              )}
            </div>

          </section>

          {/* RIGHT SCREEN: SCHEMATIC VISUALS & METRICS */}
          <section className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Live Animation Flow Schematic Node */}
            <SolarDiagram
              currentHourPoint={activeHourPoint}
              systemCapacitykWp={simulationResult.systemCapacitykWp}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              selectedHour={selectedHour}
              setSelectedHour={setSelectedHour}
            />

            {/* Financial Payback & Timeline Metrics Dashboard */}
            <SolarDashboard
              simulation={simulationResult}
              initialInvestment={activeInvestment}
            />

          </section>

        </div>
        ) : (
          <div className="w-full">
            <SolarFormulas />
          </div>
        )}
      </main>

    </div>
  );
}
