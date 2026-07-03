import React from "react";
import { 
  Calculator, 
  HelpCircle, 
  BookOpen, 
  Settings, 
  Cpu, 
  Gauge, 
  LineChart, 
  Layers
} from "lucide-react";
import SolarAnatomy from "./SolarAnatomy";

export default function SolarFormulas() {
  return (
    <div className="space-y-10" id="theory-educational-page">
      
      {/* SECTION 1: MATHEMATICAL FORMULAS (SIMILAR TO SECOND ATTACHED IMAGE) */}
      <div className="bg-slate-900 border border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-md space-y-6">
        
        {/* Module Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500 border border-amber-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-md font-display font-semibold text-slate-100 tracking-tight">
              Model Matematika & Dasar Teori Simulasi
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Formulasi ilmiah dan koefisien yang mendasari perhitungan produksi energi serta kelayakan investasi (ROI).
            </p>
          </div>
        </div>

        {/* Dynamic Formula Display Box [Color-coded, deep contrast] */}
        <div className="bg-slate-950 border border-slate-800/60 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block mb-3">
            FORMULA UTAMA PRODUKSI ENERGI (AC OUTPUT)
          </span>

          <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xl sm:text-2xl font-mono font-bold text-slate-100">
            <span className="text-yellow-450 text-amber-400">E<sub>daily</sub></span>
            <span className="text-slate-400">=</span>
            <span className="text-indigo-400 px-1 hover:scale-105 transition-transform" title="Panel Area (m²)">A</span>
            <span className="text-slate-400">×</span>
            <span className="text-amber-400 px-1 hover:scale-105 transition-transform" title="Solar Radiation (Insolation)">R</span>
            <span className="text-slate-400">×</span>
            <span className="text-teal-400 px-1 hover:scale-105 transition-transform" title="Panel Efficiency (η)">η</span>
            <span className="text-slate-400">×</span>
            <span className="text-rose-400 px-1 hover:scale-105 transition-transform" title="Performance Ratio / Loss Factor">PR</span>
          </div>
        </div>

        {/* Parameters Definition List [Color-coded indicator blocks matching formulas] */}
        <div className="space-y-4">
          <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block">
            DEFINISI VARIABEL & OPERATOR:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* E_daily card */}
            <div className="flex gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-mono font-bold text-amber-400 shrink-0 select-none">
                E
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Energi Harian (kWh/hari)</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Total output listrik bersih AC siap pakai yang sukses dialirkan dari seluruh rangkaian inverter ke jaringan sekring rumah tinggal Anda setiap harinya.
                </p>
              </div>
            </div>

            {/* A card */}
            <div className="flex gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
              <div className="w-10 h-10 rounded-lg bg-indigo-550/10 border border-indigo-500/20 flex items-center justify-center font-mono font-bold text-indigo-400 shrink-0 select-none">
                A
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Panel Area (m²)</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Luas dimensi fisik keseluruhan tapak atap atau area tanah datar yang dilapisi modul sel surya. Ditentukan langsung dari slider luas di panel kontrol.
                </p>
              </div>
            </div>

            {/* R card */}
            <div className="flex gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-mono font-bold text-amber-400 shrink-0 select-none">
                R
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Radiasi Harian (kWh/m²/hari)</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Rata-rata energi pemaparan insolasi matahari harian hulu (Peak Sun Hours) yang menyentuh m² bidang panel di wilayah kabupaten terpilih (misal, {4.8} jam di Surabaya).
                </p>
              </div>
            </div>

            {/* Eta/η card */}
            <div className="flex gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-mono font-bold text-teal-400 shrink-0 select-none">
                η
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Panel Efficiency (η)</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Faktor efisiensi penyerapan sel silikon semikonduktor berdasarkan jenis (misal, 21% untuk Monocrystalline vs. 17% untuk Polycrystalline), dikonversi dalam pecahan desimal.
                </p>
              </div>
            </div>

            {/* PR/PR card */}
            <div className="flex gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-850 md:col-span-2">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-mono font-bold text-rose-400 shrink-0 select-none">
                PR
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Rasio Unjuk Kerja / Performance Ratio (default: 0.82)</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Multiplier pengurang realistis sebesar <b>82%</b> untuk mengoreksi faktor kehilangan daya sekunder di lapangan: kenaikan panas temperatur sel saat terik, susut konversi sirkuit AC/DC inverter, rugi tahanan kabel transmisi eksternal, penutupan bayangan mikro, dan timbunan debu musiman.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: OTHER CORE EQUATIONS IN THE APP */}
        <div className="border-t border-slate-800/80 pt-6 space-y-4">
          <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block">
            FORMULA TERINTEGRASI LAINNYA PADA APLIKASI:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-slate-300">
            
            <div className="p-4 bg-slate-950/30 rounded-2xl border border-slate-800/40 space-y-2">
              <span className="text-[8px] font-mono tracking-wide text-indigo-400 block uppercase font-bold">kWp Generator Capacity</span>
              <div className="font-mono bg-slate-950/80 p-2 rounded-lg border border-slate-900 text-slate-200 text-[11px]">
                Kapasitas Puncak (kWp) = Luas (m²) × Efisiensi (η)
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Menghitung daya terpasang maksimum teoritis array panel surya di bawah pengujian laboratorium intensitas standar 1000 W/m² (STC).
              </p>
            </div>

            <div className="p-4 bg-slate-950/30 rounded-2xl border border-slate-800/40 space-y-2">
              <span className="text-[8px] font-mono tracking-wide text-amber-500 block uppercase font-bold">Faktor Penyusutan Jangka Panjang</span>
              <div className="font-mono bg-slate-950/80 p-2 rounded-lg border border-slate-900 text-slate-200 text-[11px]">
                E_annual_tahun_t = E_annual_awal × (0.995) <sup>(t - 1)</sup>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Memodelkan penyusutan efisiensi degradasi fisik panel surya silikon secara bertahap sebesar <b>0.5% setiap tahun</b> selama siklus hidup 25 tahun ke depan.
              </p>
            </div>

            <div className="p-4 bg-slate-950/30 rounded-2xl border border-slate-800/40 space-y-2">
              <span className="text-[8px] font-mono tracking-wide text-teal-400 block uppercase font-bold">Laju Inflasi Harga Tarif Listrik PLN</span>
              <div className="font-mono bg-slate-950/80 p-2 rounded-lg border border-slate-900 text-slate-200 text-[11px]">
                Tarif_tahun_t = Tarif_Beli_Awal × (1.025) <sup>(t - 1)</sup>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Memproyeksikan asumsi kenaikan rata-rata tagihan listrik PLN komanditer tahunan akibat inflasi batu bara sebesar <b>2.5% per tahun</b>. Sejalan dengan meningkatnya daya hemat sistem surya kita.
              </p>
            </div>

            <div className="p-4 bg-slate-950/30 rounded-2xl border border-slate-800/40 space-y-2">
              <span className="text-[8px] font-mono tracking-wide text-rose-455 text-rose-400 block uppercase font-bold">Skema Kredit Ekspor Net-Metering</span>
              <div className="font-mono bg-slate-950/80 p-2 rounded-lg border border-slate-900 text-slate-200 text-[11px]">
                Kredit_Ekspor = E_ekspor × Rp 1.084 / kWh
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Meteran EXIM merekam daya surplus yang dikirim balik ke PLN. Tarif kredit dihargai Rp 1.084/kWh (75% tarif R-1/TR Rp 1.445/kWh sesuai regulasi lokal ESDM terkini).
              </p>
            </div>

          </div>
        </div>

        {/* SECTION 3: CONSTANTS TABLE */}
        <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850/80 space-y-3">
          <span className="text-[9px] font-mono tracking-widest text-slate-550 text-slate-400 uppercase block">
            KONSTANTA SIMULASI UTAMA YANG DIIMBANGI SISTEM:
          </span>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Faktor Rugi</span>
              <span className="text-sm font-mono font-bold text-slate-200">18% (0.82 PR)</span>
              <p className="text-[9px] text-slate-400 mt-1">Suhu, kabel & inverter</p>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Emisi Karbon</span>
              <span className="text-sm font-mono font-bold text-slate-200">0.385 kg/kWh</span>
              <p className="text-[9px] text-slate-400 mt-1">Reduksi CO₂ per kWh</p>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Serapan CO₂ Pohon</span>
              <span className="text-sm font-mono font-bold text-slate-200">22 kg/tahun</span>
              <p className="text-[9px] text-slate-400 mt-1">Setara satu pohon dewasa</p>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Batu Bara Hemat</span>
              <span className="text-sm font-mono font-bold text-slate-200">0.45 kg/kWh</span>
              <p className="text-[9px] text-slate-400 mt-1">Bobot batu bara dihindari</p>
            </div>

          </div>
        </div>

      </div>

      {/* SECTION 4: INTEGRATED HOVERABLE SOLAR ANATOMY WORKBENCH */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-display font-semibold text-slate-200">
            Anatomi Detail & Aliran Fisika Sel Surya
          </h3>
        </div>
        <SolarAnatomy />
      </div>

    </div>
  );
}
