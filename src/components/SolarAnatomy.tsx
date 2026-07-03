import React, { useState } from "react";
import { Zap, Sun, Award, HelpCircle } from "lucide-react";

interface PartExplanation {
  title: string;
  desc: string;
  color: string;
}

export default function SolarAnatomy() {
  const [activePart, setActivePart] = useState<string>("photovoltaic");

  const explanations: Record<string, PartExplanation> = {
    photovoltaic: {
      title: "Prinsip Kerja Efek Fotovoltaik",
      desc: "Ketika partikel cahaya matahari (foton) menghantam permukaan sel surya, energinya memicu pelepasan elektron dari ikatan atom silikon. Sambungan P-N internal memaksa elektron bebas mengalir melalui sirkuit luar, menciptakan arus listrik DC searah yang dapat menyalakan lampu sebelum mengalir kembali ke lapisan dasar.",
      color: "border-amber-500 text-amber-400 bg-amber-500/10"
    },
    foton: {
      title: "1. Foton / Cahaya Matahari (Photons)",
      desc: "Energi elektromagnetik yang dipancarkan matahari dalam bentuk paket partikel diskrit bernama Foton. Berfungsi sebagai pemicu ketukan energi utama yang memutus rantai elektron agar lepas bergerak bebas.",
      color: "border-yellow-500 text-yellow-400 bg-yellow-500/10"
    },
    grid: {
      title: "2. Jaring Elektroda Atas (Top Metallic Grid)",
      desc: "Elektroda logam penghantar tipis bermotif jala di permukaan atas sel surya. Berfungsi mengumpulkan elektron bebas yang bermigrasi ke permukaan atas tanpa menghalangi penetrasi cahaya matahari masuk ke struktur silikon.",
      color: "border-slate-400 text-slate-300 bg-slate-500/10"
    },
    typen: {
      title: "3. Semikonduktor Tipe-N (N-type Silicon)",
      desc: "Lapisan silikon atas yang ter-doping fosfor sehingga kelebihan elektron bebas. Sangat rentan melepaskan muatan negatif ketika menerima paparan energi foton matahari.",
      color: "border-red-500 text-red-400 bg-red-500/10"
    },
    pnjunction: {
      title: "4. Sambungan P-N (P-N Junction Boundary)",
      desc: "Medan listrik statis internal permanen di antara lapisan Tipe-N dan Tipe-P. Bertindak sebagai gerbang satu arah yang memaksa elektron bebas meluncur ke arah lapisan Tipe-N dan mencegah kembalinya elektron ke lubang asalnya (rekombinasi prematur).",
      color: "border-amber-500 text-amber-400 bg-amber-500/10"
    },
    typep: {
      title: "5. Semikonduktor Tipe-P (P-type Silicon)",
      desc: "Lapisan silikon bawah yang ter-doping boron, menghasilkan kelangkaan elektron yang meninggalkan lubang-lubang kosong bermuatan positif (Holes). Berperan menarik elektron kembali setelah menempuh sirkuit eksternal.",
      color: "border-sky-500 text-sky-400 bg-sky-500/10"
    },
    base: {
      title: "6. Elektroda Bawah (Rear Contact Sheet)",
      desc: "Kontak logam masif pada bagian belakang sel surya yang menutup sirkuit arus eksternal, bertindak sebagai jangkar penerima elektron untuk kembali ke dalam material dasar silikon.",
      color: "border-indigo-500 text-indigo-400 bg-indigo-500/10"
    },
    lamp: {
      title: "7. Arus Listrik & Beban Lampu (Electric Load)",
      desc: "Aliran elektron bebas yang bergerak teratur memicu terbentuknya beda potensial arus listrik searah (DC). Saat dialirkan melewati sirkuit luar yang terhubung dengan lampu, hambatannya memicu nyala pijaran energi.",
      color: "border-emerald-500 text-emerald-400 bg-emerald-500/10"
    },
  };

  const getExplanation = () => explanations[activePart] || explanations.photovoltaic;
  const activeEx = getExplanation();

  return (
    <div className="w-full bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 shadow-md transition-all duration-300" id="solar-anatomy-panel">
      
      {/* Animation CSS definition embedded locally */}
      <style>{`
        @keyframes photon-drop {
          0% { transform: translateY(-40px) translateX(-20px); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(135px) translateX(67px); opacity: 0; }
        }
        @keyframes photon-reflect {
          0% { transform: translateY(110px) translateX(55px); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(30px) translateX(110px); opacity: 0; }
        }
        @keyframes electron-flow-anatomy {
          0% { stroke-dashoffset: 40; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes carrier-shimmy {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes pulse-sun-ray {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.7; }
        }
        .photon-ray {
          animation: photon-drop 2.8s linear infinite;
        }
        .photon-bounce {
          animation: photon-reflect 2s ease-out infinite;
        }
        .wire-charge-flow {
          stroke-dasharray: 6, 8;
          animation: electron-flow-anatomy 1.5s linear infinite;
        }
        .carrier-dot {
          animation: carrier-shimmy 2s ease-in-out infinite;
        }
        .sun-wave-pulsing {
          animation: pulse-sun-ray 4s ease-in-out infinite;
        }
        .layer-interactive {
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }
        .layer-interactive:hover {
          filter: brightness(1.2) drop-shadow(0 0 4px rgba(245, 158, 11, 0.4));
        }
        .layer-active {
          filter: brightness(1.3) drop-shadow(0 0 8px rgba(245, 158, 11, 0.6));
          stroke: #fbbf24 !important;
          stroke-width: 2px !important;
        }
      `}</style>

      {/* Header section with icons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-md font-display font-medium text-slate-100 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            Diagram Anatomi & Aliran Muatan Sel Surya
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Interaktif: Klik bagian diagram sel surya di bawah untuk membedah fungsinya dalam Bahasa Indonesia.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full text-[10px] font-semibold text-yellow-400 self-start">
          <Award className="w-3.5 h-3.5" />
          Efek Fotovoltaik
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Side: SVG Anatomy Diagram */}
        <div className="lg:col-span-7 flex justify-center bg-slate-950/60 rounded-2xl border border-slate-800/60 p-4 relative" style={{ minHeight: "380px" }}>
          
          <svg
            viewBox="0 0 680 440"
            className="w-full h-auto select-none"
            style={{ maxWidth: "600px" }}
          >
            {/* SVG STYLES & DEFINITIONS */}
            <defs>
              <linearGradient id="sun-gradient-anatomy" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <linearGradient id="layer-n-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f87171" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.75" />
              </linearGradient>
              <linearGradient id="layer-p-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.75" />
              </linearGradient>
              <linearGradient id="junction-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ea580c" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#fef08a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f1f5f9" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>

            {/* BACKGROUND LINES & GUIDELINES */}
            {/* Zoom connector dashed lines */}
            <path d="M 460 70 L 160 215" stroke="#334155" strokeWidth="1" strokeDasharray="3, 3" />
            <path d="M 520 100 L 480 230" stroke="#334155" strokeWidth="1" strokeDasharray="3, 3" />

            {/* SECTION A: SOLAR PANEL ASSEMBLY (TOP RIGHT ZOOM ORIGIN) */}
            <g transform="translate(420, 20)">
              {/* Backing shadow bounding box for Solar Panel assembly */}
              <polygon points="10 65, 170 35, 230 85, 70 115" fill="#090d16" opacity="0.6" />
              {/* Solar Panel Aluminum frame */}
              <polygon
                points="10 60, 170 30, 230 80, 70 110"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
                className="layer-interactive"
                onClick={() => setActivePart("photovoltaic")}
              />
              {/* Solar Blue Panel surface */}
              <polygon
                points="15 60, 168 33, 224 80, 71 107"
                fill="#1e3a8a"
              />
              {/* Grid cell lines on panel */}
              <line x1="53" y1="95" x2="183" y2="45" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
              <line x1="91" y1="81" x2="201" y2="59" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
              <line x1="130" y1="65" x2="215" y2="70" stroke="#3b82f6" strokeWidth="0.8" opacity="0.6" />

              <line x1="68" y1="50" x2="114" y2="92" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
              <line x1="110" y1="42" x2="160" y2="82" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
              <line x1="152" y1="35" x2="202" y2="75" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />

              {/* Dashed zoom target square */}
              <polygon
                points="42 85, 76 72, 92 85, 58 98"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeDasharray="2, 2"
              />
              {/* Text labels for the small panel */}
              <text x="120" y="20" textAnchor="middle" fill="#94a3b8" className="text-[12px] font-sans font-bold tracking-widest uppercase">Modul Panel Surya</text>
              <text x="120" y="125" textAnchor="middle" fill="#64748b" className="text-[10px] font-sans font-medium">Susunan Sel Seri-Paralel</text>
            </g>

            {/* SECTION B: THE SUN (TOP LEFT) */}
            <g transform="translate(90, 75)">
              <circle cx="0" cy="0" r="45" fill="url(#sun-gradient-anatomy)" className="pulse-ambient" />
              {/* Sun dial flares */}
              <path d="M 0 -50 L 0 -62 M 0 50 L 0 62 M -50 0 L -62 0 M 50 0 L 62 0 M -35 -35 L -44 -44 M 35 35 L 44 44 M -35 35 L -44 44 M 35 -35 L 44 -44" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              <circle cx="0" cy="0" r="35" fill="#fef08a" opacity="0.3" className="sun-wave-pulsing" />
              <circle cx="0" cy="0" r="28" fill="#ffffff" />
              <text x="0" y="4" textAnchor="middle" fill="#78350f" className="text-[10px] font-sans font-bold tracking-widest uppercase layer-interactive" onClick={() => setActivePart("foton")}>SUN</text>
            </g>

            {/* SECTION C: COLLIDED SOLAR PHOTON ANIMATED RAYS */}
            {/* Photon Ray 1 (Captured near left) */}
            <line x1="135" y1="120" x2="215" y2="280" stroke="#f59e0b" strokeWidth="2.5" opacity="0" className="photon-ray" style={{ animationDelay: "0s" }} />
            {/* Photon Ray 2 (Captured center) */}
            <line x1="155" y1="130" x2="255" y2="330" stroke="#fbbf24" strokeWidth="2.5" opacity="0" className="photon-ray" style={{ animationDelay: "0.9s" }} />
            {/* Photon Ray 3 (Bounce Reflection) */}
            <line x1="145" y1="125" x2="210" y2="255" stroke="#f59e0b" strokeWidth="2.5" opacity="0" className="photon-ray" style={{ animationDelay: "1.8s" }} />
            {/* Reflected bounce ray */}
            <line x1="210" y1="255" x2="280" y2="180" stroke="#ea580c" strokeWidth="2" opacity="0" strokeDasharray="3, 3" className="photon-bounce" style={{ animationDelay: "1.8s" }} />

            {/* Text description overlay on rays */}
            <g transform="translate(145, 160)" className="layer-interactive" onClick={() => setActivePart("foton")}>
              <text x="0" y="0" textAnchor="start" fill="#fbb624" className="text-[10px] font-sans font-bold tracking-wider">Cahaya Matahari (Foton)</text>
              <path d="M 0 5 L 45 30" stroke="#f59e0b" strokeWidth="1" markerEnd="url(#arrow)" />
            </g>

            {/* SECTION D: ENLARGED SOLAR CELL CROSS-SECTION BLOCK */}
            {/* Exploded diagram 3D coordinate block */}
            
            {/* 1. Base задний layer shadow */}
            <polygon points="120 370, 460 370, 460 380, 120 380" fill="#020617" />

            {/* 2. BACK ELECTRODE / BOTTOM CONTACT SHEET (Lapisan 6) */}
            <polygon
              points="120 365, 460 365, 460 380, 120 380"
              fill="url(#silver-grad)"
              stroke="#475569"
              strokeWidth="1.5"
              className={`layer-interactive ${activePart === "base" ? "layer-active" : ""}`}
              onClick={() => setActivePart("base")}
            />
            
            {/* 3. SEMIKONDUKTOR TIPE-P (Blue Layer 5) */}
            <polygon
              points="120 295, 460 295, 460 365, 120 365"
              fill="url(#layer-p-grad)"
              stroke="#0369a1"
              strokeWidth="1"
              className={`layer-interactive ${activePart === "typep" ? "layer-active" : ""}`}
              onClick={() => setActivePart("typep")}
            />

            {/* 4. P-N JUNCTION / PERMUKAAN SEPARATION DIODE (Layer 4) */}
            <polygon
              points="120 287, 460 287, 460 295, 120 295"
              fill="url(#junction-grad)"
              stroke="#fbbf24"
              strokeWidth="0.8"
              className={`layer-interactive ${activePart === "pnjunction" ? "layer-active" : ""}`}
              onClick={() => setActivePart("pnjunction")}
            />

            {/* 5. SEMIKONDUKTOR TIPE-N (Red Layer 3) */}
            <polygon
              points="120 230, 460 230, 460 287, 120 287"
              fill="url(#layer-n-grad)"
              stroke="#b91c1c"
              strokeWidth="1"
              className={`layer-interactive ${activePart === "typen" ? "layer-active" : ""}`}
              onClick={() => setActivePart("typen")}
            />

            {/* 6. TOP ELECTRODE GRID (Lapisan 2) */}
            {/* Draw Silver Fingers / Conductors on top of the N-Type layer */}
            <g className={`layer-interactive ${activePart === "grid" ? "layer-active" : ""}`} onClick={() => setActivePart("grid")}>
              {/* Busbar main bar */}
              <polygon points="120 215, 460 215, 465 224, 125 224" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
              {/* Finger lines branching off */}
              <polygon points="140 224, 140 230, 137 230, 137 224" fill="#94a3b8" />
              <polygon points="190 224, 190 230, 187 230, 187 224" fill="#94a3b8" />
              <polygon points="240 224, 240 230, 237 230, 237 224" fill="#94a3b8" />
              <polygon points="290 224, 290 230, 287 230, 287 224" fill="#94a3b8" />
              <polygon points="340 224, 340 230, 337 230, 337 224" fill="#94a3b8" />
              <polygon points="390 224, 390 230, 387 230, 387 224" fill="#94a3b8" />
              <polygon points="440 224, 440 230, 437 230, 437 224" fill="#94a3b8" />
            </g>

            {/* INTERNAL CHARGE CARRIER CARTOONS (Red circles inside N-type, Blue in P-type) */}
            {/* N-Type Layer Free Electrons (+) [Represented as red spheres with + inside exactly like references] */}
            <g transform="translate(0,0)" className="pointer-events-none text-xs">
              {/* Electron 1 */}
              <g transform="translate(160, 255)" className="carrier-dot" style={{ animationDelay: "0.2s" }}>
                <circle cx="0" cy="0" r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" className="font-bold text-[11px] font-mono">+</text>
              </g>
              {/* Electron 2 */}
              <g transform="translate(230, 270)" className="carrier-dot" style={{ animationDelay: "1.2s" }}>
                <circle cx="0" cy="0" r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" className="font-bold text-[11px] font-mono">+</text>
              </g>
              {/* Electron 3 */}
              <g transform="translate(300, 245)" className="carrier-dot" style={{ animationDelay: "0.5s" }}>
                <circle cx="0" cy="0" r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" className="font-bold text-[11px] font-mono">+</text>
              </g>
              {/* Electron 4 */}
              <g transform="translate(370, 260)" className="carrier-dot" style={{ animationDelay: "1.7s" }}>
                <circle cx="0" cy="0" r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" className="font-bold text-[11px] font-mono">+</text>
              </g>
              {/* Electron 5 */}
              <g transform="translate(430, 245)" className="carrier-dot" style={{ animationDelay: "0.9s" }}>
                <circle cx="0" cy="0" r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" className="font-bold text-[11px] font-mono">+</text>
              </g>
            </g>

            {/* P-Type Layer Free Holes (-) [Represented as blue spheres with - inside] */}
            <g transform="translate(0,0)" className="pointer-events-none text-xs">
              {/* Hole 1 */}
              <g transform="translate(150, 335)" className="carrier-dot" style={{ animationDelay: "0.6s" }}>
                <circle cx="0" cy="0" r="9" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
                <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" className="font-bold text-[13px] font-mono">-</text>
              </g>
              {/* Hole 2 */}
              <g transform="translate(220, 315)" className="carrier-dot" style={{ animationDelay: "1.4s" }}>
                <circle cx="0" cy="0" r="9" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
                <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" className="font-bold text-[13px] font-mono">-</text>
              </g>
              {/* Hole 3 */}
              <g transform="translate(290, 340)" className="carrier-dot" style={{ animationDelay: "0.1s" }}>
                <circle cx="0" cy="0" r="9" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
                <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" className="font-bold text-[13px] font-mono">-</text>
              </g>
              {/* Hole 4 */}
              <g transform="translate(360, 320)" className="carrier-dot" style={{ animationDelay: "1.9s" }}>
                <circle cx="0" cy="0" r="9" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
                <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" className="font-bold text-[13px] font-mono">-</text>
              </g>
              {/* Hole 5 */}
              <g transform="translate(420, 340)" className="carrier-dot" style={{ animationDelay: "0.8s" }}>
                <circle cx="0" cy="0" r="9" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
                <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" className="font-bold text-[13px] font-mono">-</text>
              </g>
            </g>

            {/* Upward small arrows through P-N junction */}
            <g stroke="#ffffff" strokeWidth="1" opacity="0.6">
              <line x1="180" y1="310" x2="180" y2="275" markerEnd="url(#arrow-small)" />
              <line x1="260" y1="310" x2="260" y2="275" markerEnd="url(#arrow-small)" />
              <line x1="340" y1="310" x2="340" y2="275" markerEnd="url(#arrow-small)" />
              <line x1="410" y1="310" x2="410" y2="275" markerEnd="url(#arrow-small)" />
            </g>


            {/* SECTION E: ELECTRIC CIRCUIT / CONNECTED ENTIRE LOOP WITH bulb */}
            {/* Wire from Top Electrode Busbar (left side) */}
            <path
              d="M 122 220 L 50 220 L 50 310 L 50 415 L 290 415"
              fill="none"
              stroke="#334155"
              strokeWidth="3.5"
            />
            {/* Animated electron current flow on left wire */}
            <path
              d="M 122 220 L 50 220 L 50 310 L 50 415 L 290 415"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              className="wire-charge-flow"
              opacity="0.8"
            />

            {/* Light bulb assembly (center bottom) */}
            <g transform="translate(290, 415)" className="layer-interactive" onClick={() => setActivePart("lamp")}>
              {/* Wire connectors */}
              <line x1="0" y1="0" x2="30" y2="0" stroke="#475569" strokeWidth="3" />
              {/* Light socket */}
              <rect x="30" y="-10" width="16" height="20" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
              {/* Bulb glass */}
              <circle cx="56" cy="0" r="21" fill="#fef08a" fillOpacity="0.45" stroke="#f59e0b" strokeWidth="2.5" className="pulse-ambient" />
              <circle cx="56" cy="0" r="14" fill="#fbbf24" fillOpacity="0.8" />
              {/* Filament */}
              <path d="M 45 -4 L 51 4 L 61 4 L 67 -4" fill="none" stroke="#ea580c" strokeWidth="1.5" />
              {/* Glow rays */}
              <line x1="56" y1="-28" x2="56" y2="-38" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
              <line x1="34" y1="-22" x2="27" y2="-29" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
              <line x1="78" y1="-22" x2="85" y2="-29" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
              <line x1="56" y1="28" x2="56" y2="38" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Wire returning to Bottom contact Sheet */}
            <path
              d="M 370 415 L 560 415 L 560 373 M 560 373 L 460 373"
              fill="none"
              stroke="#334155"
              strokeWidth="3.5"
            />
            <path
              d="M 370 415 L 560 415 L 560 373 M 560 373 L 460 373"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              className="wire-charge-flow"
              opacity="0.8"
            />

            {/* Flow directional indicators (Yellow wire bullets) */}
            <g transform="translate(0, 0)" fill="#fbbf24">
              {/* Right moving arrows */}
              <path d="M 50 280 L 47 285 L 53 285 Z" />
              <path d="M 520 415 L 515 412 L 515 418 Z" />
            </g>

            {/* Labels pointing to layers */}
            
            {/* Label top electrode */}
            <g transform="translate(485, 203)" className="layer-interactive" onClick={() => setActivePart("grid")}>
              <line x1="-30" y1="12" x2="10" y2="12" stroke="#64748b" strokeWidth="1" />
              <circle cx="-30" cy="12" r="2.5" fill="#e2e8f0" />
              <text x="16" y="16" fill="#94a3b8" className="text-[10px] font-sans font-bold uppercase tracking-wider">Elektroda Atas Jala Logam</text>
            </g>

            {/* Label N-type */}
            <g transform="translate(485, 245)" className="layer-interactive" onClick={() => setActivePart("typen")}>
              <line x1="-50" y1="12" x2="10" y2="12" stroke="#ef4444" strokeWidth="1" />
              <circle cx="-50" cy="12" r="2.5" fill="#ef4444" />
              <text x="16" y="16" fill="#f87171" className="text-[10px] font-sans font-bold uppercase tracking-wider">Semikonduktor Tipe-N (-)</text>
            </g>

            {/* Label P-N Junction */}
            <g transform="translate(485, 290)" className="layer-interactive" onClick={() => setActivePart("pnjunction")}>
              <line x1="-65" y1="0" x2="10" y2="0" stroke="#f59e0b" strokeWidth="1" />
              <circle cx="-65" cy="0" r="2.5" fill="#f59e0b" />
              <text x="16" y="4" fill="#fbbf24" className="text-[10px] font-sans font-bold uppercase tracking-wider">Sambungan P-N (Medan Listrik)</text>
            </g>

            {/* Label P-type */}
            <g transform="translate(485, 335)" className="layer-interactive" onClick={() => setActivePart("typep")}>
              <line x1="-55" y1="0" x2="10" y2="0" stroke="#38bdf8" strokeWidth="1" />
              <circle cx="-55" cy="0" r="2.5" fill="#38bdf8" />
              <text x="16" y="4" fill="#38bdf8" className="text-[10px] font-sans font-bold uppercase tracking-wider">Semikonduktor Tipe-P (+)</text>
            </g>

            {/* Label base contact */}
            <g transform="translate(485, 375)" className="layer-interactive" onClick={() => setActivePart("base")}>
              <line x1="-30" y1="0" x2="10" y2="0" stroke="#64748b" strokeWidth="1" />
              <circle cx="-30" cy="0" r="2.5" fill="#cbd5e1" />
              <text x="16" y="4" fill="#94a3b8" className="text-[10px] font-sans font-bold uppercase tracking-wider">Elektroda Bawah (Kontak Belakang)</text>
            </g>

            {/* Filament label / Electric current */}
            <g transform="translate(260, 440)" className="layer-interactive" onClick={() => setActivePart("lamp")}>
              <text x="0" y="-12" textAnchor="end" fill="#fbbf24" className="text-[9px] font-mono font-bold tracking-wider uppercase">Aliran Arus Listrik (e⁻)</text>
              <text x="175" y="-12" textAnchor="start" fill="#10b981" className="text-[9px] font-mono font-bold tracking-wider uppercase">Beban Lampu Menyala</text>
            </g>

            {/* Markers used in lines */}
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
              </marker>
              <marker id="arrow-small" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 2 L 6 5 L 0 8 z" fill="#ffffff" />
              </marker>
            </defs>
          </svg>

          {/* Quick instructions floating badge */}
          <div className="absolute top-3 left-3 bg-slate-900/80 border border-slate-800/80 rounded-lg px-2 py-1 text-[9px] text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-amber-500" />
            <span>Klik komponen diagram di atas</span>
          </div>
        </div>

        {/* Right Side: Detailed Interactive Explanation Card */}
        <div className="lg:col-span-5 flex flex-col gap-4 self-center">
          <div className={`p-5 rounded-2xl border transition-all duration-300 ${activeEx.color}`}>
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block mb-1">
              Informasi Eksplorasi
            </span>
            <h4 className="text-sm font-semibold tracking-tight uppercase mb-2">
              {activeEx.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {activeEx.desc}
            </p>
          </div>

          {/* Grid Quick Switch Tabs */}
          <div className="bg-slate-950/40 p-2 border border-slate-800/60 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] font-bold">
            <button
              onClick={() => setActivePart("foton")}
              className={`py-1.5 px-1 rounded-sm cursor-pointer transition-all ${
                activePart === "foton" ? "bg-yellow-500/20 text-yellow-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              1. Foton
            </button>
            <button
              onClick={() => setActivePart("typen")}
              className={`py-1.5 px-1 rounded-sm cursor-pointer transition-all ${
                activePart === "typen" ? "bg-red-500/25 text-red-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              2. Lapisan Tipe-N
            </button>
            <button
              onClick={() => setActivePart("pnjunction")}
              className={`py-1.5 px-1 rounded-sm cursor-pointer transition-all ${
                activePart === "pnjunction" ? "bg-amber-500/25 text-amber-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              3. Sambungan P-N
            </button>
            <button
              onClick={() => setActivePart("typep")}
              className={`py-1.5 px-1 rounded-sm cursor-pointer transition-all ${
                activePart === "typep" ? "bg-sky-500/25 text-sky-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              4. Lapisan Tipe-P
            </button>
          </div>

          <div className="text-[10px] text-slate-500 text-center font-mono leading-normal">
            Klik tab di atas atau hover/klik elemen gambar di sebelah kiri untuk melihat aliran listrik skala mikro secara mendalam.
          </div>
        </div>

      </div>
      
    </div>
  );
}
