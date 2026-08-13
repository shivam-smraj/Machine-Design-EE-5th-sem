'use client';

import React, { useState } from 'react';
import { CalculationOutputs, TransformerInputs } from '@/types/transformer';

interface CADVisualizerProps {
  outputs: CalculationOutputs;
  inputs?: TransformerInputs;
}

export type DiagramTabKey =
  | 'frame'
  | 'concentric'
  | 'cruciform'
  | 'lv_conductor'
  | 'hv_crossover'
  | 'equivalent_circuit'
  | 'phasor'
  | 'sankey'
  | 'noload_vector'
  | 'clearance_map';

export const CADVisualizer: React.FC<CADVisualizerProps> = ({ outputs, inputs }) => {
  const [activeTab, setActiveTab] = useState<DiagramTabKey>('frame');

  const { core, window: win, yoke, lv, hv, resistance, reactance, regulation, losses, efficiency, noLoadCurrent } = outputs;

  // Safe fallback values from inputs if passed
  const kiVal = inputs?.ki ?? 0.90;
  const stripXVal = inputs?.stripX ?? 15.0;
  const stripYVal = inputs?.stripY ?? 7.8;
  const coveringZVal = inputs?.coveringZ ?? 0.5;
  const secondaryTsVal = inputs?.secondaryTs ?? 39;
  const lvLayersVal = inputs?.lvLayers ?? 2;
  const lvTs1Val = inputs?.lvTs1 ?? 20;
  const totalCoilsNcVal = inputs?.totalCoilsNc ?? 22;
  const wireBareDp1Val = inputs?.wireBareDp1 ?? 1.06;
  const spacerDbcVal = inputs?.spacerDbc ?? 5.0;
  const kvaVal = inputs?.kva ?? 200;

  const diagramTabs: { key: DiagramTabKey; label: string; tag: string }[] = [
    { key: 'frame', label: 'Core & Frame', tag: '3-Limb 2D' },
    { key: 'concentric', label: 'Concentric Windings', tag: 'Radial' },
    { key: 'cruciform', label: 'Cruciform Core Step', tag: 'Lamination' },
    { key: 'lv_conductor', label: 'LV Strip Conductor', tag: 'Helical' },
    { key: 'hv_crossover', label: 'HV Crossover Stack', tag: 'Coils' },
    { key: 'equivalent_circuit', label: 'Equivalent Circuit', tag: 'Electrical' },
    { key: 'phasor', label: 'Regulation Phasor', tag: 'Vector' },
    { key: 'sankey', label: 'Loss & Power Flow', tag: 'Energy' },
    { key: 'noload_vector', label: 'No-Load Current Vector', tag: 'Magnetic' },
    { key: 'clearance_map', label: 'Clearance & Insulation Map', tag: 'Guard' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl text-slate-100">
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-sky-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2V4zM4 7a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
            </svg>
            Dynamic Parametric CAD Suite (10 Technical Schematics)
          </h3>
          <p className="text-xs text-slate-400">
            Real-time parametric CAD schematics, circuit models, vector phasors & lamination cross-sections
          </p>
        </div>
      </div>

      {/* 10 Diagram Quick Selection Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 border-b border-slate-800 scrollbar-thin">
        {diagramTabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-sky-800 text-sky-200' : 'bg-slate-900 text-slate-500'}`}>
                {tab.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* SVG Canvas Box */}
      <div className="relative bg-slate-950 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-800 min-h-[380px]">
        {/* 1. CORE & FRAME DIAGRAM */}
        {activeTab === 'frame' && (
          <svg viewBox="0 0 600 380" className="w-full h-80 max-w-xl">
            <defs>
              <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient id="lvGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="hvGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
            <rect width="600" height="380" fill="url(#grid)" opacity="0.4" />
            <rect x="50" y="20" width="500" height="340" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4,4" />
            <rect x="100" y="40" width="400" height="45" fill="url(#coreGrad)" stroke="#64748b" strokeWidth="2" rx="3" />
            <text x="300" y="68" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">TOP YOKE (Hy = {(yoke.hy * 1000).toFixed(0)}mm)</text>
            <rect x="100" y="295" width="400" height="45" fill="url(#coreGrad)" stroke="#64748b" strokeWidth="2" rx="3" />
            <text x="300" y="323" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">BOTTOM YOKE</text>
            <rect x="120" y="85" width="40" height="210" fill="url(#coreGrad)" stroke="#64748b" strokeWidth="1.5" />
            <rect x="280" y="85" width="40" height="210" fill="url(#coreGrad)" stroke="#64748b" strokeWidth="1.5" />
            <rect x="440" y="85" width="40" height="210" fill="url(#coreGrad)" stroke="#64748b" strokeWidth="1.5" />
            <rect x="110" y="110" width="60" height="160" fill="url(#lvGrad)" opacity="0.6" stroke="#fbbf24" strokeWidth="1" rx="2" />
            <rect x="270" y="110" width="60" height="160" fill="url(#lvGrad)" opacity="0.6" stroke="#fbbf24" strokeWidth="1" rx="2" />
            <rect x="430" y="110" width="60" height="160" fill="url(#lvGrad)" opacity="0.6" stroke="#fbbf24" strokeWidth="1" rx="2" />
            <rect x="102" y="120" width="76" height="140" fill="url(#hvGrad)" opacity="0.4" stroke="#38bdf8" strokeWidth="1.5" rx="3" />
            <rect x="262" y="120" width="76" height="140" fill="url(#hvGrad)" opacity="0.4" stroke="#38bdf8" strokeWidth="1.5" rx="3" />
            <rect x="422" y="120" width="76" height="140" fill="url(#hvGrad)" opacity="0.4" stroke="#38bdf8" strokeWidth="1.5" rx="3" />
            <line x1="200" y1="85" x2="200" y2="295" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="210" y="195" fill="#38bdf8" fontSize="11" fontWeight="bold">Hw = {(win.hwUsed * 1000).toFixed(0)}mm</text>
            <line x1="160" y1="100" x2="280" y2="100" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="220" y="95" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">Ww = {(win.wwUsed * 1000).toFixed(0)}mm</text>
            <line x1="140" y1="355" x2="300" y2="355" stroke="#a855f7" strokeWidth="1.5" />
            <text x="220" y="370" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="bold">Center Distance D = {(win.dCenterDistance * 1000).toFixed(0)}mm</text>
          </svg>
        )}

        {/* 2. CONCENTRIC WINDINGS DIAGRAM */}
        {activeTab === 'concentric' && (
          <svg viewBox="0 0 500 360" className="w-full h-80 max-w-lg">
            <circle cx="250" cy="180" r="45" fill="#334155" stroke="#64748b" strokeWidth="2" />
            <text x="250" y="184" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">Core (d={(core.d * 1000).toFixed(0)}mm)</text>
            <circle cx="250" cy="180" r="75" fill="none" stroke="#f59e0b" strokeWidth="16" opacity="0.8" />
            <text x="250" y="90" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">LV Winding (Id={lv.insideDiameterId.toFixed(0)}mm, Od={lv.outsideDiameterOd.toFixed(0)}mm)</text>
            <circle cx="250" cy="180" r="105" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3,3" />
            <circle cx="250" cy="180" r="135" fill="none" stroke="#0284c7" strokeWidth="20" opacity="0.8" />
            <text x="250" y="26" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">HV Winding (ID={hv.insideDiameterIdhv.toFixed(0)}mm, OD={hv.outsideDiameterOdhv.toFixed(0)}mm)</text>
            <line x1="250" y1="180" x2="385" y2="180" stroke="#f43f5e" strokeWidth="1.5" />
            <text x="320" y="172" textAnchor="middle" fill="#fb7185" fontSize="10" fontWeight="bold">Major Insul T = {hv.insulationT.toFixed(1)}mm</text>
          </svg>
        )}

        {/* 3. STEPPED CRUCIFORM CORE LAMINATION DIAGRAM */}
        {activeTab === 'cruciform' && (
          <svg viewBox="0 0 500 360" className="w-full h-80 max-w-lg">
            <circle cx="250" cy="180" r="140" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,4" />
            <text x="250" y="25" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">Circumscribing Circle d = {(core.d * 1000).toFixed(1)}mm</text>
            {/* Step 1 Large Plate */}
            <rect x="140" y="60" width="220" height="240" fill="#334155" stroke="#94a3b8" strokeWidth="2" rx="2" />
            <text x="250" y="175" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="bold">Large Step p = {(core.p * 1000).toFixed(1)}mm</text>
            {/* Step 2 Small Plate */}
            <rect x="180" y="90" width="140" height="180" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" rx="2" />
            <text x="250" y="195" textAnchor="middle" fill="#cbd5e1" fontSize="10">Small Step q = {(core.q * 1000).toFixed(1)}mm</text>
            <line x1="140" y1="50" x2="360" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="250" y="45" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">Net Iron Area Ai = {(core.ai * 1e3).toFixed(2)} k mm² (Ki = {kiVal})</text>
          </svg>
        )}

        {/* 4. LV STRIP CONDUCTOR DETAIL DIAGRAM */}
        {activeTab === 'lv_conductor' && (
          <svg viewBox="0 0 500 360" className="w-full h-80 max-w-lg">
            <rect x="150" y="80" width="200" height="180" fill="#d97706" stroke="#fbbf24" strokeWidth="3" rx="4" />
            <rect x="140" y="70" width="220" height="200" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" rx="6" />
            <text x="250" y="165" textAnchor="middle" fill="#fef3c7" fontSize="14" fontWeight="bold">Bare Copper Strip: {stripXVal}mm x {stripYVal}mm</text>
            <text x="250" y="190" textAnchor="middle" fill="#fde68a" fontSize="12">Area as1 = {lv.asModified.toFixed(1)} mm²</text>
            <line x1="150" y1="280" x2="350" y2="280" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="250" y="295" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">Insulated Strip X1 = {lv.x1.toFixed(1)}mm (z = {coveringZVal}mm paper)</text>
            <text x="250" y="40" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">LV Helical Winding: {secondaryTsVal} turns, {lvLayersVal} layers ({lvTs1Val} turns/layer)</text>
          </svg>
        )}

        {/* 5. HV CROSSOVER COIL STACK DIAGRAM */}
        {activeTab === 'hv_crossover' && (
          <svg viewBox="0 0 500 360" className="w-full h-80 max-w-lg">
            {/* Stack of 6 coil representations */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <g key={i}>
                <rect x="140" y={40 + i * 48} width="220" height="34" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" rx="3" />
                <text x="250" y={62 + i * 48} textAnchor="middle" fill="#f0f9ff" fontSize="11" fontWeight="bold">
                  HV Coil {i + 1} (Vc1 = {(hv.vpp / totalCoilsNcVal).toFixed(1)}V, tc = {(hv.tpModified / totalCoilsNcVal).toFixed(1)} turns)
                </text>
                {i < 5 && (
                  <rect x="160" y={74 + i * 48} width="180" height="14" fill="#1e293b" stroke="#64748b" strokeWidth="1" rx="1" />
                )}
              </g>
            ))}
            <text x="440" y="180" fill="#38bdf8" fontSize="10" fontWeight="bold">Spacer dbc = {spacerDbcVal}mm</text>
            <text x="250" y="348" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">Total Coils Nc = {totalCoilsNcVal}, Wire dp1 = {wireBareDp1Val}mm bare</text>
          </svg>
        )}

        {/* 6. EQUIVALENT CIRCUIT DIAGRAM */}
        {activeTab === 'equivalent_circuit' && (
          <svg viewBox="0 0 550 360" className="w-full h-80 max-w-xl">
            {/* Primary Terminals */}
            <circle cx="40" cy="100" r="4" fill="#38bdf8" />
            <circle cx="40" cy="260" r="4" fill="#38bdf8" />
            <text x="35" y="85" textAnchor="end" fill="#38bdf8" fontSize="11" fontWeight="bold">Primary Vpp = {hv.vpp}V</text>
            {/* Rp Resistor */}
            <path d="M 40 100 L 90 100 L 95 90 L 105 110 L 115 90 L 125 110 L 135 90 L 140 100 L 170 100" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <text x="115" y="75" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">Ref = {resistance.ref.toFixed(2)} Ω</text>
            {/* Xp Inductor */}
            <path d="M 170 100 Q 180 80 190 100 Q 200 80 210 100 Q 220 80 230 100 L 270 100" fill="none" stroke="#0284c7" strokeWidth="2" />
            <text x="210" y="75" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">Xp = {reactance.xp.toFixed(2)} Ω</text>
            {/* Magnetizing Branch */}
            <line x1="270" y1="100" x2="270" y2="150" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Rm */}
            <line x1="240" y1="150" x2="300" y2="150" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="230" y="165" width="20" height="40" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="210" y="190" textAnchor="end" fill="#94a3b8" fontSize="10">Il = {noLoadCurrent.il.toFixed(4)}A</text>
            {/* Xm */}
            <path d="M 290 165 Q 310 175 290 185 Q 310 195 290 205" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="320" y="190" fill="#38bdf8" fontSize="10">Im = {noLoadCurrent.im.toFixed(4)}A</text>
            <line x1="240" y1="220" x2="300" y2="220" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="270" y1="220" x2="270" y2="260" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Secondary Terminals */}
            <line x1="270" y1="100" x2="480" y2="100" stroke="#38bdf8" strokeWidth="2" />
            <line x1="40" y1="260" x2="480" y2="260" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="480" cy="100" r="4" fill="#38bdf8" />
            <circle cx="480" cy="260" r="4" fill="#38bdf8" />
            <text x="490" y="180" fill="#a855f7" fontSize="11" fontWeight="bold">Output Vsp'</text>
            <text x="270" y="320" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold">Total Short-Circuit Impedance εz = {(reactance.epsilonZ * 100).toFixed(2)}% (εp = {(resistance.epsilonP * 100).toFixed(2)}%, εx = {(reactance.epsilonX * 100).toFixed(2)}%)</text>
          </svg>
        )}

        {/* 7. VOLTAGE REGULATION PHASOR DIAGRAM */}
        {activeTab === 'phasor' && (
          <svg viewBox="0 0 500 360" className="w-full h-80 max-w-lg">
            <line x1="80" y1="280" x2="420" y2="280" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="430" y="284" fill="#94a3b8" fontSize="11">Current I (Ref axis)</text>
            {/* Vp Vector */}
            <line x1="80" y1="280" x2="360" y2="120" stroke="#38bdf8" strokeWidth="3" />
            <text x="200" y="180" fill="#38bdf8" fontSize="12" fontWeight="bold">Primary Voltage Vp</text>
            {/* IR Drop */}
            <line x1="360" y1="120" x2="410" y2="120" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="385" y="105" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">I·Ref = {(hv.ipp * resistance.ref).toFixed(1)}V</text>
            {/* IX Drop */}
            <line x1="410" y1="120" x2="410" y2="50" stroke="#a855f7" strokeWidth="2.5" />
            <text x="420" y="85" fill="#c084fc" fontSize="10" fontWeight="bold">I·Xp = {(hv.ipp * reactance.xp).toFixed(1)}V</text>
            {/* Angle phi */}
            <path d="M 130 280 A 50 50 0 0 0 120 255" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
            <text x="145" y="265" fill="#fb7185" fontSize="11" fontWeight="bold">φ = 36.87° (0.8 Lag PF)</text>
            <text x="250" y="330" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">Full Load Regulation = {regulation.regulationPercent.toFixed(2)}%</text>
          </svg>
        )}

        {/* 8. LOSS & SANKEY POWER FLOW DIAGRAM */}
        {activeTab === 'sankey' && (
          <svg viewBox="0 0 550 360" className="w-full h-80 max-w-xl">
            {/* Input Power Block */}
            <rect x="40" y="100" width="140" height="160" fill="#0284c7" rx="6" />
            <text x="110" y="170" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">Input Power Pin</text>
            <text x="110" y="195" textAnchor="middle" fill="#e0f2fe" fontSize="11">{kvaVal} kVA</text>

            {/* Core Loss Diverted Top */}
            <path d="M 180 120 C 240 120, 240 40, 320 40" fill="none" stroke="#ef4444" strokeWidth="16" />
            <text x="340" y="45" fill="#f87171" fontSize="11" fontWeight="bold">Core Loss Pi = {losses.totalCoreLossPi.toFixed(1)} W</text>
            <text x="340" y="60" fill="#94a3b8" fontSize="10">(Limbs: {losses.coreLossLimbs.toFixed(1)}W, Yokes: {losses.coreLossYokes.toFixed(1)}W)</text>

            {/* Copper Loss Diverted Bottom */}
            <path d="M 180 240 C 240 240, 240 320, 320 320" fill="none" stroke="#f59e0b" strokeWidth="24" />
            <text x="340" y="325" fill="#fbbf24" fontSize="11" fontWeight="bold">Copper Loss Pi2r = {losses.pi2r.toFixed(1)} W</text>
            <text x="340" y="340" fill="#94a3b8" fontSize="10">(I²R + 10% Stray Loss)</text>

            {/* Output Power Main Channel */}
            <rect x="280" y="130" width="220" height="100" fill="#10b981" rx="6" />
            <text x="390" y="170" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">Output Power Pout</text>
            <text x="390" y="195" textAnchor="middle" fill="#d1fae5" fontSize="12" fontWeight="bold">Full Load Efficiency = {efficiency.fullLoadEfficiency.toFixed(2)}%</text>
          </svg>
        )}

        {/* 9. NO-LOAD CURRENT VECTOR DIAGRAM */}
        {activeTab === 'noload_vector' && (
          <svg viewBox="0 0 500 360" className="w-full h-80 max-w-lg">
            {/* Vertical Voltage Axis */}
            <line x1="120" y1="300" x2="120" y2="40" stroke="#38bdf8" strokeWidth="2" />
            <text x="120" y="30" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">Primary Voltage Vpp ({hv.vpp}V)</text>
            {/* Horizontal Flux Axis */}
            <line x1="120" y1="300" x2="440" y2="300" stroke="#f59e0b" strokeWidth="2" />
            <text x="450" y="304" fill="#fbbf24" fontSize="11" fontWeight="bold">Core Flux Φm</text>
            {/* Im Vector along flux */}
            <line x1="120" y1="300" x2="380" y2="300" stroke="#f59e0b" strokeWidth="3" />
            <text x="260" y="320" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">Im = {noLoadCurrent.im.toFixed(4)} A (Magnetizing)</text>
            {/* Il Vector along voltage */}
            <line x1="120" y1="300" x2="120" y2="200" stroke="#ef4444" strokeWidth="3" />
            <text x="110" y="250" textAnchor="end" fill="#f87171" fontSize="11" fontWeight="bold">Il = {noLoadCurrent.il.toFixed(4)} A (Core Loss)</text>
            {/* Resultant Io Vector */}
            <line x1="120" y1="300" x2="380" y2="200" stroke="#a855f7" strokeWidth="3.5" />
            <line x1="380" y1="200" x2="380" y2="300" stroke="#94a3b8" strokeDasharray="3,3" />
            <line x1="380" y1="200" x2="120" y2="200" stroke="#94a3b8" strokeDasharray="3,3" />
            <text x="395" y="195" fill="#c084fc" fontSize="12" fontWeight="bold">Io = {noLoadCurrent.io.toFixed(4)} A ({noLoadCurrent.ioPercent.toFixed(1)}% of Ipp)</text>
          </svg>
        )}

        {/* 10. CLEARANCE & INSULATION MAP DIAGRAM */}
        {activeTab === 'clearance_map' && (
          <svg viewBox="0 0 550 360" className="w-full h-80 max-w-xl">
            {/* Yoke bounds */}
            <rect x="50" y="20" width="450" height="30" fill="#334155" rx="2" />
            <text x="275" y="40" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold">TOP YOKE</text>
            <rect x="50" y="310" width="450" height="30" fill="#334155" rx="2" />
            <text x="275" y="330" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold">BOTTOM YOKE</text>
            {/* Core Limb */}
            <rect x="80" y="50" width="60" height="260" fill="#475569" />
            <text x="110" y="180" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" transform="rotate(-90 110 180)">Core Limb d={(core.d * 1000).toFixed(0)}mm</text>
            {/* LV Winding */}
            <rect x="160" y="90" width="50" height="180" fill="#d97706" rx="2" />
            <text x="185" y="180" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" transform="rotate(-90 185 180)">LV Winding (Lcs = {lv.lcs.toFixed(0)}mm)</text>
            {/* Major Insulation Gap T */}
            <rect x="215" y="50" width="35" height="260" fill="#0284c7" opacity="0.3" />
            <text x="232" y="180" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold" transform="rotate(-90 232 180)">Major T = {hv.insulationT.toFixed(1)}mm</text>
            {/* HV Coil Stack */}
            <rect x="255" y="70" width="60" height="220" fill="#0369a1" rx="2" />
            <text x="285" y="180" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" transform="rotate(-90 285 180)">HV Coils (Lcp = {hv.lcp.toFixed(0)}mm)</text>
            {/* Clearance Callouts */}
            <line x1="185" y1="50" x2="185" y2="90" stroke="#10b981" strokeWidth="2" />
            <text x="190" y="70" fill="#34d399" fontSize="10" fontWeight="bold">cls = {lv.clearanceCls.toFixed(1)}mm (≥15mm PASS)</text>
            <line x1="285" y1="50" x2="285" y2="70" stroke="#10b981" strokeWidth="2" />
            <text x="290" y="62" fill="#34d399" fontSize="10" fontWeight="bold">clc = {hv.clearanceClc.toFixed(1)}mm (≥5mm PASS)</text>
          </svg>
        )}
      </div>

      {/* Clean Step Flow Legend */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 text-[11px]">
        <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-md font-semibold text-slate-200">
          Core Circle
        </span>
        <span className="text-sky-400 font-bold">→</span>
        <span className="px-2 py-0.5 bg-amber-950/80 border border-amber-800 rounded-md font-semibold text-amber-300">
          LV Pressboard
        </span>
        <span className="text-sky-400 font-bold">→</span>
        <span className="px-2 py-0.5 bg-amber-900/80 border border-amber-700 rounded-md font-semibold text-amber-200">
          LV Winding
        </span>
        <span className="text-sky-400 font-bold">→</span>
        <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-md font-semibold text-slate-300">
          Bakelized Cylinder & Duct
        </span>
        <span className="text-sky-400 font-bold">→</span>
        <span className="px-2 py-0.5 bg-sky-950/80 border border-sky-800 rounded-md font-semibold text-sky-300">
          HV Crossover Coils
        </span>
      </div>
    </div>
  );
};
