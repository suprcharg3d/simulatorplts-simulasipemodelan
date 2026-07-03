/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HourlySimPoint } from "../types";
import { Sun, CloudSun, Moon, Zap, ArrowRightLeft, Home, Building2, Eye } from "lucide-react";

interface SolarDiagramProps {
  currentHourPoint: HourlySimPoint; // The hourly simulation point representing active status
  systemCapacitykWp: number; // The size under test
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  selectedHour: number;
  setSelectedHour: (hour: number) => void;
}

export default function SolarDiagram({
  currentHourPoint,
  systemCapacitykWp,
  isPlaying,
  setIsPlaying,
  selectedHour,
  setSelectedHour
}: SolarDiagramProps) {
  const {
    hour,
    timeLabel,
    generation,
    load,
    selfConsumed,
    exported,
    imported
  } = currentHourPoint;

  // Determine environmental states
  const isDaytime = hour >= 6 && hour <= 18;
  const solarPowerKW = generation;
  const loadPowerKW = load;
  const netGridKW = exported - imported; // positive means exporting, negative importing

  // Dynamic colors & intensities
  const solarPercentageOfCapacity = Math.min(100, Math.round((solarPowerKW / (systemCapacitykWp || 1)) * 100));
  
  // Sunshine intensity scale from 0 to 1
  let sunIntensity = 0;
  if (hour >= 6 && hour <= 18) {
    const theta = Math.PI * (hour - 6) / 12;
    sunIntensity = Math.pow(Math.sin(theta), 2);
  }

  // Calculate coordinates of the Sun as it moves across an arc
  // Arc starts at bottom-left (60, 200) at 6 AM, peaks at (280, 80) at 12 PM, sets at (500, 200) at 6 PM
  let sunX = 140;
  let sunY = 110;
  if (isDaytime) {
    const t = (hour - 6) / 12; // 0 to 1
    const angle = Math.PI * (1 - t); // PI to 0
    sunX = 280 - 180 * Math.cos(angle);
    sunY = 240 - 160 * Math.sin(angle);
  }

  return (
    <div className="w-full bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 shadow-md relative overflow-hidden transition-all duration-300">
      {/* Dynamic inline styles for SVG power line flow animations */}
      <style>{`
        @keyframes flow-fast-right {
          from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes flow-fast-left {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 20; }
        }
        @keyframes pulse-sun-glow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.12); }
        }
        .flow-export {
          stroke-dasharray: 6, 8;
          animation: flow-fast-right 0.8s linear infinite;
        }
        .flow-import {
          stroke-dasharray: 6, 8;
          animation: flow-fast-left 0.8s linear infinite;
        }
        .flow-solar-dc {
          stroke-dasharray: 5, 5;
          animation: flow-fast-right 1.2s linear infinite;
        }
        .flow-ac-consumption {
          stroke-dasharray: 5, 7;
          animation: flow-fast-right 1.4s linear infinite;
        }
        .pulse-ambient {
          transform-origin: center;
          animation: pulse-sun-glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Diagram Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-md font-display font-medium text-slate-100 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Aliran Daya Rumah Realtime
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Snapshot distribusi daya pada pukul <span className="font-semibold text-slate-200">{timeLabel}</span> berdasarkan intensitas matahari.
          </p>
        </div>

        {/* 24-Hour Scrubber Controls */}
        <div className="flex items-center gap-3 bg-slate-950/40 rounded-xl p-2 border border-slate-800/60 self-start">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              isPlaying
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/5 animate-pulse"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
            }`}
            id="play-simulation-btn"
          >
            {isPlaying ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                Jeda Animasi
              </>
            ) : (
              "Putar Otomatis"
            )}
          </button>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="23"
              value={hour}
              onChange={(e) => {
                setIsPlaying(false);
                setSelectedHour(parseInt(e.target.value));
              }}
              className="w-24 sm:w-36 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              id="time-scrubber-slider"
            />
            <span className="text-xs font-semibold font-mono text-slate-200 w-16 text-center bg-slate-900 border border-slate-800 py-1 px-1.5 rounded">
              {timeLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Adaptive sky canvas representation */}
      <div 
        className={`w-full rounded-2xl border relative overflow-hidden transition-colors duration-1000 ${
          isDaytime
            ? "border-sky-900/30 bg-gradient-to-b from-sky-955 via-sky-900/20 to-slate-950"
            : "border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300"
        }`}
        style={{ height: "350px" }}
      >
        {/* Star elements for night view */}
        {!isDaytime && (
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute top-10 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
            <div className="absolute top-24 left-1/2 w-1.5 h-1.5 bg-white/70 rounded-full" />
            <div className="absolute top-16 right-1/4 w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDuration: "5s" }} />
            <div className="absolute top-8 right-12 w-0.5 h-0.5 bg-white rounded-full" />
            <div className="absolute top-36 left-12 w-1 h-1 bg-white/50 rounded-full" />
            <div className="absolute top-[280px] left-1/3 w-1 h-1 bg-white rounded-full animate-pulse" />
          </div>
        )}

        {/* Dynamic Landscape Indicator Details */}
        <div className="absolute bottom-4 left-6 pointer-events-none z-10 flex items-center gap-2">
          {isDaytime ? (
            <div className="flex items-center gap-1.5 bg-amber-500/10 backdrop-blur-md py-1 px-2.5 rounded-full text-[10px] font-semibold text-amber-400 border border-amber-500/20">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-455/10 animate-pulse" />
              Radiasi Matahari: {Math.round(sunIntensity * 100)}%
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-xs py-1 px-2.5 rounded-full text-[10px] font-semibold text-sky-400 border border-slate-800">
              <Moon className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
              Nol Produksi PLTS (Malam)
            </div>
          )}

          <div className={`py-1 px-2.5 rounded-full text-[10px] font-semibold border ${
            netGridKW > 0
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : netGridKW < 0
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
              : "bg-slate-800/85 text-slate-400 border-slate-800"
          }`}>
            {netGridKW > 0 ? `Kirim Ekspor PLN: +${netGridKW.toFixed(2)} kW` : netGridKW < 0 ? `Tarik Impor PLN: ${netGridKW.toFixed(2)} kW` : "Arus Listrik Seimbang"}
          </div>
        </div>

        {/* Scalable SVG Schematic Container */}
        <svg 
          viewBox="0 0 1150 480" 
          className="w-full h-full select-none"
          id="solar-schematic-svg"
        >
          {/* DEFINITIONS FOR GRADIENTS & GLOWS */}
          <defs>
            {/* Glowing filter */}
            <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Gradient definition for solar panels */}
            <linearGradient id="pv-panel-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Daytime Sky Gradient overlay */}
            <linearGradient id="sunlight-gradient" x1="0%" y1="0%" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* LIGHT PIPES / PATHS (BACKGROUND LAYERS) */}
          
          {/* 1. Sunlight beam path (only visible during day) */}
          {isDaytime && (
            <path
              d={`M ${sunX} ${sunY} L 280 205`}
              stroke="url(#sunlight-gradient)"
              strokeWidth="48"
              strokeDasharray="4, 4"
              opacity={0.3 + sunIntensity * 0.5}
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Golden Photon dashed flow from Sun to PV Roof */}
          {isDaytime && (
            <path
              d={`M ${sunX} ${sunY} L 280 205`}
              stroke="#fbbf24"
              strokeWidth="3"
              strokeDasharray="8, 12"
              className="flow-solar-dc"
              opacity={0.5 + sunIntensity * 0.5}
              fill="none"
              id="path-sunlist-photons"
            />
          )}

          {/* 2. PV Array to Inverter (DC High Voltage) */}
          <path
            d="M 280 295 L 280 395"
            stroke={isDaytime ? "#f59e0b" : "#334155"}
            strokeWidth="3.5"
            fill="none"
            opacity={isDaytime ? 0.3 : 0.15}
          />
          {isDaytime && solarPowerKW > 0 && (
            <path
              d="M 280 295 L 280 395"
              stroke="#f59e0b"
              strokeWidth="3.5"
              className="flow-solar-dc"
              fill="none"
              style={{ animationDuration: `${2.0 - sunIntensity * 1.5}s` }}
              id="path-dc-to-inverter"
            />
          )}

          {/* 3. Inverter to MCB Box (AC Stream) */}
          <path
            d="M 330 435 L 480 435"
            stroke={solarPowerKW > 0 ? "#3b82f6" : "#334155"}
            strokeWidth="3.5"
            fill="none"
            opacity={solarPowerKW > 0 ? 0.35 : 0.15}
          />
          {solarPowerKW > 0 && (
            <path
              d="M 330 435 L 480 435"
              stroke="#3b82f6"
              strokeWidth="3.5"
              className="flow-ac-consumption"
              fill="none"
              style={{ animationDuration: `${1.8 - sunIntensity * 1.2}s` }}
              id="path-ac-to-mcb"
            />
          )}

          {/* 4. Facility to MCB Box */}
          <path
            d="M 540 275 L 540 395"
            stroke="#3b82f6"
            strokeWidth="3.5"
            fill="none"
            opacity={0.2}
          />
          {/* Animated electricity flow UP into the facility (house draws power) */}
          <path
            d="M 540 395 L 540 275"
            stroke="#10b981"
            strokeWidth="3.5"
            className="flow-ac-consumption"
            fill="none"
            style={{ animationDuration: `${3.0 - (loadPowerKW / 10)}s` }}
            id="path-mcb-to-facility"
          />

          {/* 5. MCB Box to EXIM Meter */}
          <path
            d="M 600 435 L 740 435"
            stroke={netGridKW !== 0 ? (netGridKW > 0 ? "#10b981" : "#f59e0b") : "#334155"}
            strokeWidth="3.5"
            fill="none"
            opacity={netGridKW !== 0 ? 0.4 : 0.15}
          />
          {netGridKW !== 0 && (
            <path
              d={netGridKW > 0 ? "M 600 435 L 740 435" : "M 740 435 L 600 435"}
              stroke={netGridKW > 0 ? "#10b981" : "#f59e0b"}
              strokeWidth="4"
              className={netGridKW > 0 ? "flow-export" : "flow-import"}
              fill="none"
              style={{ animationDuration: `${1.5 - Math.min(1.2, Math.abs(netGridKW) / 4)}s` }}
              id="path-mcb-to-meter"
            />
          )}

          {/* 6. EXIM Meter to Utility Grid */}
          <path
            d="M 820 435 L 1020 435"
            stroke={netGridKW !== 0 ? (netGridKW > 0 ? "#10b981" : "#f59e0b") : "#334155"}
            strokeWidth="3.5"
            fill="none"
            opacity={netGridKW !== 0 ? 0.35 : 0.15}
          />
          {netGridKW !== 0 && (
            <path
              d={netGridKW > 0 ? "M 820 435 L 1020 435" : "M 1020 435 L 820 435"}
              stroke={netGridKW > 0 ? "#10b981" : "#f59e0b"}
              strokeWidth="4"
              className={netGridKW > 0 ? "flow-export" : "flow-import"}
              fill="none"
              style={{ animationDuration: `${1.5 - Math.min(1.2, Math.abs(netGridKW) / 4)}s` }}
              id="path-meter-to-grid"
            />
          )}


          {/* COMPONENT NODES (VISUAL SYMBOLS) */}

          {/* A. THE SUN / MOON NODE (TOP LEFT DYNAMIC POSITION) */}
          {isDaytime ? (
            <g transform={`translate(${sunX - 120}, ${sunY - 120})`} className="cursor-pointer">
              {/* Outer amber pulsing corona range glow */}
              <circle
                cx="120"
                cy="120"
                r="65"
                fill="#fbbf24"
                opacity="0.1"
                className="pulse-ambient"
              />
              <circle
                cx="120"
                cy="120"
                r="45"
                fill="#f59e0b"
                opacity={0.3}
              />
              
              {/* Sun disk core */}
              <circle
                cx="120"
                cy="120"
                r="32"
                fill="#fff"
                stroke="#d97706"
                strokeWidth="4"
              />
              <circle
                cx="120"
                cy="120"
                r="22"
                fill="#f59e0b"
              />

              {/* Solar Rays (8 ray beams rotate slightly) */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angleDegree) => (
                <line
                  key={angleDegree}
                  x1="120"
                  y1="75"
                  x2="120"
                  y2="62"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  transform={`rotate(${angleDegree + hour * 2} 120 120)`}
                />
              ))}
              
              <text
                x="120"
                y="178"
                textAnchor="middle"
                className="text-[10px] font-sans font-bold select-none tracking-widest fill-amber-500"
              >
                MATAHARI
              </text>
            </g>
          ) : (
            // Nocturnal Moon replacement node coordinates
            <g transform="translate(140, 110)">
              {/* Moon faint ambient silver glow */}
              <circle
                cx="0"
                cy="0"
                r="40"
                fill="#94a3b8"
                opacity="0.1"
                className="pulse-ambient"
              />
              {/* Crescent moon shape */}
              <path
                d="M -15 -18 A 20 20 0 1 0 15 15 A 15 15 0 1 1 -15 -18 Z"
                fill="#cbd5e1"
                stroke="#475569"
                strokeWidth="2"
              />
              <text
                x="0"
                y="38"
                textAnchor="middle"
                className="text-[10px] font-sans font-bold tracking-widest fill-slate-500"
              >
                REM BULAN
              </text>
            </g>
          )}


          {/* B. PV ARRAY NODE (ROOFTOP MOUNT) */}
          <g transform="translate(220, 200)">
            {/* Array background base */}
            <rect
              x="0"
              y="55"
              width="120"
              height="35"
              rx="4"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="2"
            />
            
            {/* Angular Blue Solar Core Roof-shape */}
            <path
              d="M 60 5 L 115 52 L 5 52 Z"
              fill="url(#pv-panel-grad)"
              stroke="#1e293b"
              strokeWidth="2.5"
            />

            {/* Grid line reflections on panel to make it look premium */}
            {isDaytime && (
              <>
                <line x1="33" y1="52" x2="60" y2="5" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />
                <line x1="60" y1="52" x2="60" y2="5" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />
                <line x1="87" y1="52" x2="60" y2="5" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />
                <path d="M 19 40 L 101 40" stroke="#3b82f6" strokeWidth="1.2" opacity="0.4" />
                <path d="M 32 28 L 88 28" stroke="#3b82f6" strokeWidth="1.2" opacity="0.4" />
                <path d="M 46 16 L 74 16" stroke="#3b82f6" strokeWidth="1.2" opacity="0.4" />
              </>
            )}

            {/* Label texts */}
            <text
              x="60"
              y="112"
              textAnchor="middle"
              className="text-[10px] font-sans font-bold select-none fill-slate-300 tracking-wider uppercase"
            >
              PANEL ATAP PLTS
            </text>

            <rect
              x="12"
              y="60"
              width="96"
              height="25"
              rx="10"
              fill="#0f172a"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            <text
              x="60"
              y="76"
              textAnchor="middle"
              className="text-[10px] font-mono font-bold fill-blue-400"
            >
              {solarPowerKW > 0 ? `${solarPowerKW.toFixed(2)} kW DC` : "0.00 kW"}
            </text>
          </g>


          {/* C. INVERTER NODE (DC TO AC TRANSLATION) */}
          <g transform="translate(230, 395)">
            <rect
              x="0"
              y="0"
              width="100"
              height="80"
              rx="12"
              fill="#0f172a"
              stroke={solarPowerKW > 0 ? "#f59e0b" : "#334155"}
              strokeWidth="2.5"
            />

            {/* Simulated cooling fans and dynamic indicators */}
            <circle cx="20" cy="20" r="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            <circle cx="20" cy="20" r="1.5" fill="#64748b" />
            
            {/* Dynamic system light indicator */}
            <circle 
              cx="80" 
              cy="20" 
              r="4.5" 
              fill={solarPowerKW > 0 ? "#10b981" : "#ef4444"} 
              className={solarPowerKW > 0 ? "animate-pulse" : ""} 
            />

            {/* Schematic Inverter Symbol logo */}
            <path
              d="M 35 48 L 48 48 L 52 38 L 65 38"
              stroke={solarPowerKW > 0 ? "#3b82f6" : "#475569"}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Wave decorator symbol */}
            <path
              d="M 40 58 Q 45 54 50 58 T 60 58"
              stroke="#3b82f6"
              strokeWidth="1.5"
              fill="none"
              opacity={solarPowerKW > 0 ? 1 : 0.3}
            />

            <text
              x="50"
              y="105"
              textAnchor="middle"
              className="text-[10px] font-sans font-bold select-none fill-slate-300 tracking-wider"
            >
              INVERTER AC/DC
            </text>
          </g>


          {/* D. FACILITY NODE (STATIONARY LOAD CONSUMER - ABOVE MCB) */}
          <g transform="translate(480, 180)">
            {/* Main house structural gray box */}
            <rect
              x="0"
              y="40"
              width="120"
              height="55"
              rx="8"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Roof pitch shape */}
            <path
              d="M 0 40 L 60 5 L 120 40 Z"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="2"
            />
            
            {/* Door graphic */}
            <rect x="50" y="65" width="20" height="30" fill="#1e293b" rx="2" />
            {/* Windows graphic with dynamic solar yellow glow if powered */}
            <rect 
              x="20" 
              y="55" 
              width="18" 
              height="18" 
              fill={solarPowerKW > 0 ? "#fbbf24" : "#1e293b"} 
              rx="3" 
              stroke={solarPowerKW > 0 ? "#d97706" : "#334155"}
              strokeWidth="1"
            />
            <rect 
              x="82" 
              y="55" 
              width="18" 
              height="18" 
              fill={solarPowerKW > 0 ? "#fbbf24" : "#1e293b"}
              rx="3" 
              stroke={solarPowerKW > 0 ? "#d97706" : "#334155"}
              strokeWidth="1"
            />

            <text
              x="60"
              y="115"
              textAnchor="middle"
              className="text-[10px] font-sans font-bold select-none fill-slate-300 tracking-wider"
            >
              RUMAH MANDIRI
            </text>

            <rect
              x="12"
              y="125"
              width="96"
              height="25"
              rx="10"
              fill="#064e3b"
              stroke="#065f46"
              strokeWidth="1.5"
            />
            <text
              x="60"
              y="141"
              textAnchor="middle"
              className="text-[10px] font-mono font-bold fill-emerald-450 text-emerald-400"
            >
              Beban: {loadPowerKW.toFixed(2)} kW
            </text>
          </g>


          {/* E. MCB BOX (CENTRAL HUB CONSOLIDATION) */}
          <g transform="translate(480, 400)">
            {/* Base block container */}
            <rect
              x="0"
              y="0"
              width="120"
              height="70"
              rx="10"
              fill="#111827"
              stroke="#374151"
              strokeWidth="2.5"
            />
            
            {/* White status screen in middle of MCB box */}
            <rect
              x="15"
              y="22"
              width="90"
              height="26"
              rx="4"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1"
            />
            {/* Circuit breaker slots */}
            <rect x="25" y="27" width="8" height="16" fill="#334155" rx="1" />
            <rect x="38" y="27" width="8" height="16" fill="#10b981" rx="1" />
            <rect x="51" y="27" width="8" height="16" fill="#334155" rx="1" />
            <rect x="64" y="27" width="8" height="16" fill="#f59e0b" rx="1" />
            <rect x="77" y="27" width="8" height="16" fill="#334155" rx="1" />
            <rect x="90" y="27" width="8" height="16" fill="#ef4444" rx="1" />

            <text
              x="60"
              y="93"
              textAnchor="middle"
              className="text-[10px] font-sans font-bold select-none fill-slate-300 tracking-wider"
            >
              SEKRING MCB
            </text>
          </g>


          {/* F. EXIM METER (IMPORT EXPORT DIAL GRID INTERFACE) */}
          <g transform="translate(735, 395)">
            {/* Outer circular meter case */}
            <circle
              cx="45"
              cy="40"
              r="40"
              fill="#0f172a"
              stroke={netGridKW > 0 ? "#10b981" : (netGridKW < 0 ? "#f59e0b" : "#475569")}
              strokeWidth="3"
            />
            {/* Glass shine visual arc */}
            <path
              d="M 12 25 A 34 34 0 0 1 78 25"
              stroke="#334155"
              strokeWidth="1.5"
              fill="none"
              opacity="0.8"
            />

            {/* Dynamic liquid-crystal screen */}
            <rect
              x="18"
              y="25"
              width="54"
              height="28"
              rx="4"
              fill="#111827"
              stroke="#334155"
              strokeWidth="1"
            />

            {/* LED flashing import status */}
            <circle 
              cx="58" 
              cy="16" 
              r="3" 
              fill={netGridKW > 0 ? "#10b981" : (netGridKW < 0 ? "#fbbf24" : "#475569")}
              className={netGridKW !== 0 ? "animate-pulse" : ""}
            />

            {/* Net power readout numerical text inside EXIM dial */}
            <text
              x="45"
              y="42"
              textAnchor="middle"
              className={`text-[9px] font-mono font-bold ${
                netGridKW > 0
                  ? "fill-emerald-400 font-extrabold"
                  : netGridKW < 0
                  ? "fill-amber-400 font-extrabold"
                  : "fill-slate-400"
              }`}
            >
              {netGridKW > 0 ? `-${netGridKW.toFixed(2)}` : netGridKW < 0 ? `+${Math.abs(netGridKW).toFixed(2)}` : "0.00"}
            </text>
            <text
              x="45"
              y="49"
              textAnchor="middle"
              className="text-[6px] font-mono font-semibold fill-slate-500"
            >
              kW NET
            </text>

            <text
              x="45"
              y="105"
              textAnchor="middle"
              className="text-[10px] font-sans font-bold select-none fill-slate-300 tracking-wider"
            >
              METERAN EXIM
            </text>
          </g>


          {/* G. UTILITY GRID NODE (TRADITIONAL POWER POLE CODES) */}
          <g transform="translate(1000, 260)">
            {/* The structural power line grid pole */}
            {/* Vertical pole */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="200"
              stroke="#475569"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Cross bar 1 (high voltage) */}
            <line
              x1="12"
              y1="80"
              x2="88"
              y2="80"
              stroke="#475569"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* Cross bar 2 (secondary phase) */}
            <line
              x1="22"
              y1="125"
              x2="78"
              y2="125"
              stroke="#475569"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Ceramic insulators holding the wire junctions */}
            <rect x="20" y="70" width="8" height="10" fill="#334155" rx="1.5" />
            <rect x="72" y="70" width="8" height="10" fill="#334155" rx="1.5" />
            
            <rect x="28" y="115" width="8" height="10" fill="#334155" rx="1.5" />
            <rect x="64" y="115" width="8" height="10" fill="#334155" rx="1.5" />

            {/* Lightning ground status */}
            <circle cx="50" cy="50" r="3" fill="#1e293b" />

            <text
              x="50"
              y="240"
              textAnchor="middle"
              className="text-[10px] font-sans font-bold select-none fill-slate-300 tracking-wider"
            >
              JARINGAN PLN
            </text>
          </g>
        </svg>
      </div>

      {/* Quick Interactive Explanation panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200">Produksi Panel Atap</h4>
            <p className="text-slate-400 text-[11px] mt-0.5 leading-normal">
              Modul panel surya mengumpulkan radiasi matahari untuk menghasilkan listrik DC harian, disalurkan ke AC/DC Inverter penyearah guna menyuplai daya komersial ke rumah.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Home className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200">Prioritas Konsumsi Lokal</h4>
            <p className="text-slate-400 text-[11px] mt-0.5 leading-normal">
              Daya AC primer digunakan langsung untuk menghidupkan seluruh peralatan elektronik rumah tangga. Ini memangkas konsumsi bayar PLN secara instan!
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <ArrowRightLeft className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200">Kredit Ekspor Net-Metering</h4>
            <p className="text-slate-400 text-[11px] mt-0.5 leading-normal">
              Jika panel berkas daya melebihi beban rumah, surplus listrik otomatis dialirkan kembali ke PLN melalui meteran EXIM untuk didepositokan sebagai saldo pengurang tagihan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
