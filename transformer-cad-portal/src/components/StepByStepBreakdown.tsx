'use client';

import React, { useState } from 'react';
import { CalculationOutputs, TransformerInputs } from '@/types/transformer';
import { MathView } from './MathView';
import { CheckCircle2, AlertTriangle, BookOpen, ChevronRight, FileText, Search, Image as ImageIcon } from 'lucide-react';

interface StepByStepBreakdownProps {
  outputs: CalculationOutputs;
  inputs?: TransformerInputs;
}

export const StepByStepBreakdown: React.FC<StepByStepBreakdownProps> = ({ outputs, inputs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const moduleKeys = Object.keys(outputs.modules);

  const { core, window: win, yoke, frame, lv, hv, resistance, reactance, regulation, losses, efficiency, noLoadCurrent } = outputs;

  // Safe fallback values from inputs if passed
  const kiVal = inputs?.ki ?? 0.90;
  const stripXVal = inputs?.stripX ?? 15.0;
  const stripYVal = inputs?.stripY ?? 7.8;
  const totalCoilsNcVal = inputs?.totalCoilsNc ?? 22;

  const scrollToSection = (key: string) => {
    const el = document.getElementById(`sec-${key}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const totalStepsCount = moduleKeys.reduce(
    (acc, key) => acc + outputs.modules[key].steps.length,
    0
  );

  // Helper to render dedicated inline diagrams for each of the 12 modules
  const renderModuleInlineDiagram = (moduleKey: string) => {
    switch (moduleKey) {
      case 'cd':
        return (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 my-4 flex flex-col items-center shadow-inner overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-400">
              <ImageIcon className="w-4 h-4" /> Core Stepped Section Technical Schematic
            </div>
            <svg viewBox="0 0 400 240" className="w-full h-auto max-h-56 max-w-md">
              <circle cx="200" cy="120" r="95" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
              <rect x="130" y="40" width="140" height="160" fill="#334155" stroke="#94a3b8" strokeWidth="2" rx="2" />
              <rect x="155" y="60" width="90" height="120" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" rx="2" />
              <text x="200" y="115" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">Large Step p = {(core.p * 1000).toFixed(1)}mm</text>
              <text x="200" y="132" textAnchor="middle" fill="#cbd5e1" fontSize="9">Small Step q = {(core.q * 1000).toFixed(1)}mm</text>
              <text x="200" y="20" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">Circumscribing Circle d = {(core.d * 1000).toFixed(1)}mm</text>
              <text x="200" y="225" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">Net Iron Area Ai = {(core.ai * 1e3).toFixed(2)} k mm² (Ki = {kiVal})</text>
            </svg>
          </div>
        );
      case 'wd':
        return (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 my-4 flex flex-col items-center shadow-inner overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-400">
              <ImageIcon className="w-4 h-4" /> Window & Limb Center Geometry Diagram
            </div>
            <svg viewBox="0 0 440 220" className="w-full h-auto max-h-56 max-w-md">
              <rect x="40" y="20" width="360" height="180" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3" />
              <rect x="60" y="30" width="40" height="160" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
              <rect x="200" y="30" width="40" height="160" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
              <rect x="340" y="30" width="40" height="160" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
              <line x1="100" y1="110" x2="200" y2="110" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" />
              <text x="150" y="102" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">Ww = {(win.wwUsed * 1000).toFixed(0)}mm</text>
              <line x1="105" y1="30" x2="105" y2="190" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2,2" />
              <text x="115" y="115" fill="#38bdf8" fontSize="10" fontWeight="bold">Hw = {(win.hwUsed * 1000).toFixed(0)}mm</text>
              <line x1="80" y1="205" x2="220" y2="205" stroke="#a855f7" strokeWidth="1.5" />
              <text x="150" y="217" textAnchor="middle" fill="#c084fc" fontSize="10" fontWeight="bold">Center Distance D = {(win.dCenterDistance * 1000).toFixed(0)}mm</text>
            </svg>
          </div>
        );
      case 'yd':
        return (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 my-4 flex flex-col items-center shadow-inner overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-400">
              <ImageIcon className="w-4 h-4" /> Yoke Section & Flux Flow Diagram
            </div>
            <svg viewBox="0 0 400 200" className="w-full h-auto max-h-48 max-w-md">
              <rect x="40" y="30" width="320" height="80" fill="#334155" stroke="#64748b" strokeWidth="2" rx="3" />
              <text x="200" y="65" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">Top Yoke Section (Ay = {(yoke.ay * 1e3).toFixed(2)} k mm²)</text>
              <text x="200" y="85" textAnchor="middle" fill="#cbd5e1" fontSize="10">Height Hy = {(yoke.hy * 1000).toFixed(0)}mm, Depth Dy = {(yoke.dy * 1000).toFixed(0)}mm</text>
              <line x1="60" y1="70" x2="340" y2="70" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
              <text x="200" y="130" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">Yoke Flux Density BDy = {yoke.fdy.toFixed(4)} Wb/m² (1.20 x Ai)</text>
            </svg>
          </div>
        );
      case 'od':
        return (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 my-4 flex flex-col items-center shadow-inner overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-400">
              <ImageIcon className="w-4 h-4" /> Overall 3-Limb Frame Dimensions Diagram
            </div>
            <svg viewBox="0 0 440 220" className="w-full h-auto max-h-52 max-w-md">
              <rect x="50" y="20" width="340" height="180" fill="none" stroke="#38bdf8" strokeWidth="2" rx="4" />
              <text x="220" y="105" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">Overall Frame (H x W x Df)</text>
              <text x="220" y="130" textAnchor="middle" fill="#e0f2fe" fontSize="11">H = {(frame.heightH * 1000).toFixed(0)}mm | W = {(frame.widthW * 1000).toFixed(0)}mm | Df = {(frame.depthDf * 1000).toFixed(0)}mm</text>
            </svg>
          </div>
        );
      case 'lvd':
        return (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 my-4 flex flex-col items-center shadow-inner overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-400">
              <ImageIcon className="w-4 h-4" /> LV Helical Conductor & Clearance Diagram
            </div>
            <svg viewBox="0 0 440 220" className="w-full h-auto max-h-52 max-w-md">
              <rect x="140" y="50" width="160" height="120" fill="#d97706" stroke="#fbbf24" strokeWidth="2" rx="3" />
              <text x="220" y="105" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">LV Copper Strip {stripXVal}x{stripYVal}mm</text>
              <text x="220" y="125" textAnchor="middle" fill="#fde68a" fontSize="10">Insulated X1 = {lv.x1.toFixed(1)}mm, Y1 = {lv.y1.toFixed(1)}mm</text>
              <text x="220" y="195" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">Axial Clearance cls = {lv.clearanceCls.toFixed(1)}mm (≥15mm PASS)</text>
              <text x="220" y="212" textAnchor="middle" fill="#cbd5e1" fontSize="9">Concentric Id = {lv.insideDiameterId.toFixed(0)}mm, Od = {lv.outsideDiameterOd.toFixed(0)}mm</text>
            </svg>
          </div>
        );
      case 'hvd':
        return (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 my-4 flex flex-col items-center shadow-inner overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-400">
              <ImageIcon className="w-4 h-4" /> HV Crossover Coil Stack & Major Insulation Diagram
            </div>
            <svg viewBox="0 0 440 240" className="w-full h-auto max-h-56 max-w-md">
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x="120" y={25 + i * 38} width="200" height="26" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" rx="2" />
              ))}
              <text x="220" y="95" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">HV Crossover Stack ({hv.tpModified.toFixed(0)} turns, {totalCoilsNcVal} coils)</text>
              <text x="220" y="185" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">Major Insulation Barrier T = {hv.insulationT.toFixed(1)}mm (Bakelized Cylinder)</text>
              <text x="220" y="205" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">Axial Clearance clc = {hv.clearanceClc.toFixed(1)}mm (≥5mm PASS)</text>
              <text x="220" y="222" textAnchor="middle" fill="#cbd5e1" fontSize="9">IDhv = {hv.insideDiameterIdhv.toFixed(0)}mm, ODhv = {hv.outsideDiameterOdhv.toFixed(0)}mm</text>
            </svg>
          </div>
        );
      case 'resis':
        return (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 my-4 flex flex-col items-center shadow-inner overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-400">
              <ImageIcon className="w-4 h-4" /> Winding Mean Turn & Equivalent Resistance Model
            </div>
            <svg viewBox="0 0 440 200" className="w-full h-auto max-h-48 max-w-md">
              <circle cx="130" cy="100" r="55" fill="none" stroke="#f59e0b" strokeWidth="3" />
              <text x="130" y="95" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">LV Lmts = {resistance.lmts.toFixed(3)}m</text>
              <text x="130" y="112" textAnchor="middle" fill="#fbbf24" fontSize="9">Rs = {resistance.rs.toFixed(4)} Ω</text>
              <circle cx="310" cy="100" r="70" fill="none" stroke="#0284c7" strokeWidth="3" />
              <text x="310" y="95" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">HV Lmtp = {resistance.lmtp.toFixed(3)}m</text>
              <text x="310" y="112" textAnchor="middle" fill="#38bdf8" fontSize="9">Rp = {resistance.rp.toFixed(2)} Ω</text>
              <text x="220" y="185" textAnchor="middle" fill="#a855f7" fontSize="11" fontWeight="bold">Total Equivalent Resistance Ref = {resistance.ref.toFixed(2)} Ω (εp = {(resistance.epsilonP * 100).toFixed(2)}%)</text>
            </svg>
          </div>
        );
      case 'lr':
        return (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 my-4 flex flex-col items-center shadow-inner overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-400">
              <ImageIcon className="w-4 h-4" /> Leakage Flux Channel & Impedance Model
            </div>
            <svg viewBox="0 0 440 200" className="w-full h-auto max-h-48 max-w-md">
              <rect x="80" y="40" width="280" height="100" fill="#0284c7" opacity="0.2" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
              <text x="220" y="85" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">Leakage Reactance Xp = {reactance.xp.toFixed(2)} Ω</text>
              <text x="220" y="105" textAnchor="middle" fill="#cbd5e1" fontSize="10">Mean Axial Length Lc = {reactance.lc.toFixed(0)}mm | Dm = {reactance.dm.toFixed(0)}mm</text>
              <text x="220" y="170" textAnchor="middle" fill="#a855f7" fontSize="11" fontWeight="bold">Short-Circuit Impedance εz = {(reactance.epsilonZ * 100).toFixed(2)}% (εx = {(reactance.epsilonX * 100).toFixed(2)}%)</text>
            </svg>
          </div>
        );
      case 'reg':
        return (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 my-4 flex flex-col items-center shadow-inner overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-400">
              <ImageIcon className="w-4 h-4" /> Voltage Regulation Curve Diagram
            </div>
            <svg viewBox="0 0 440 200" className="w-full h-auto max-h-48 max-w-md">
              <line x1="50" y1="160" x2="390" y2="160" stroke="#64748b" strokeWidth="1.5" />
              <line x1="50" y1="160" x2="50" y2="30" stroke="#64748b" strokeWidth="1.5" />
              <path d="M 50 70 Q 200 60 390 150" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <text x="200" y="45" fill="#38bdf8" fontSize="11" fontWeight="bold">Reg (0.8 Lag PF) = {regulation.regulationPercent.toFixed(2)}%</text>
              <text x="50" y="20" fill="#94a3b8" fontSize="10">% Regulation</text>
              <text x="360" y="178" fill="#94a3b8" fontSize="10">Power Factor</text>
            </svg>
          </div>
        );
      case 'cl':
        return (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 my-4 flex flex-col items-center shadow-inner overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-400">
              <ImageIcon className="w-4 h-4" /> Transformer Losses Breakdown Diagram
            </div>
            <svg viewBox="0 0 440 200" className="w-full h-auto max-h-48 max-w-md">
              <rect x="50" y="50" width="150" height="100" fill="#ef4444" opacity="0.8" rx="4" />
              <text x="125" y="95" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">Core Loss Pi</text>
              <text x="125" y="115" textAnchor="middle" fill="#fee2e2" fontSize="12" fontWeight="bold">{losses.totalCoreLossPi.toFixed(1)} W</text>
              <rect x="240" y="50" width="150" height="100" fill="#f59e0b" opacity="0.8" rx="4" />
              <text x="315" y="95" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">Copper Loss Pi2r</text>
              <text x="315" y="115" textAnchor="middle" fill="#fef3c7" fontSize="12" fontWeight="bold">{losses.pi2r.toFixed(1)} W</text>
              <text x="220" y="180" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">Total Full Load Loss Lt = {losses.totalLossLt.toFixed(1)} W</text>
            </svg>
          </div>
        );
      case 'effi':
        return (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 my-4 flex flex-col items-center shadow-inner overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-400">
              <ImageIcon className="w-4 h-4" /> Efficiency vs Load Curve Diagram
            </div>
            <svg viewBox="0 0 440 200" className="w-full h-auto max-h-48 max-w-md">
              <line x1="50" y1="160" x2="390" y2="160" stroke="#64748b" strokeWidth="1.5" />
              <line x1="50" y1="160" x2="50" y2="30" stroke="#64748b" strokeWidth="1.5" />
              <path d="M 50 140 Q 200 40 390 80" fill="none" stroke="#10b981" strokeWidth="2.5" />
              <circle cx="210" cy="45" r="5" fill="#f59e0b" />
              <text x="220" y="42" fill="#fbbf24" fontSize="10" fontWeight="bold">Peak η at x = {(efficiency.maxEfficiencyLoadingX * 100).toFixed(1)}% load</text>
              <text x="340" y="70" fill="#10b981" fontSize="10" fontWeight="bold">Full Load η = {efficiency.fullLoadEfficiency.toFixed(2)}%</text>
            </svg>
          </div>
        );
      case 'nlc':
        return (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 my-4 flex flex-col items-center shadow-inner overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-400">
              <ImageIcon className="w-4 h-4" /> Exciting No-Load Current Vector Diagram
            </div>
            <svg viewBox="0 0 440 200" className="w-full h-auto max-h-48 max-w-md">
              <line x1="80" y1="160" x2="360" y2="160" stroke="#f59e0b" strokeWidth="2" />
              <text x="240" y="180" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">Im = {noLoadCurrent.im.toFixed(4)} A (Magnetizing)</text>
              <line x1="80" y1="160" x2="80" y2="60" stroke="#ef4444" strokeWidth="2" />
              <text x="70" y="110" textAnchor="end" fill="#f87171" fontSize="10" fontWeight="bold">Il = {noLoadCurrent.il.toFixed(4)} A (Loss)</text>
              <line x1="80" y1="160" x2="360" y2="60" stroke="#a855f7" strokeWidth="2.5" />
              <text x="240" y="40" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="bold">Resultant Io = {noLoadCurrent.io.toFixed(4)} A ({noLoadCurrent.ioPercent.toFixed(1)}% PASS ≤ 5%)</text>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-5 shadow-2xl text-slate-100">
      {/* Header & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 sm:pb-4 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-sky-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            Step-by-Step Derivations & Diagrams
            <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 bg-sky-950 text-sky-300 border border-sky-800 rounded-full">
              {totalStepsCount} Steps
            </span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Full textbook-style math evaluation chains with inline 2D technical schematics for every single section
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-auto min-w-[200px] sm:min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search 50+ steps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
          />
        </div>
      </div>

      {/* Sticky Quick Jump Navigation Bar */}
      <div className="sticky top-12 sm:top-14 z-30 bg-slate-950/90 backdrop-blur-md p-1.5 sm:p-2 rounded-xl border border-slate-800 flex gap-1.5 sm:gap-2 overflow-x-auto mb-5 sm:mb-6 shadow-lg scrollbar-thin">
        {moduleKeys.map((key, idx) => {
          const mod = outputs.modules[key];
          return (
            <button
              key={key}
              onClick={() => scrollToSection(key)}
              className="px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold bg-slate-900 hover:bg-sky-950 text-slate-300 hover:text-sky-300 border border-slate-800 hover:border-sky-800 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5"
            >
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-slate-800 text-[9px] sm:text-[10px] text-sky-400 flex items-center justify-center font-mono font-bold">
                {idx + 1}
              </span>
              {mod.moduleName}
              <span className="text-[9px] sm:text-[10px] text-slate-500">({mod.steps.length})</span>
            </button>
          );
        })}
      </div>

      {/* Continuous Scrollable Modules Feed Feed */}
      <div className="space-y-6 sm:space-y-8">
        {moduleKeys.map((key, idx) => {
          const activeModule = outputs.modules[key];

          const filteredSteps = activeModule.steps.filter((step) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
              step.title.toLowerCase().includes(q) ||
              step.explanation.toLowerCase().includes(q) ||
              (step.reasoning && step.reasoning.toLowerCase().includes(q)) ||
              (step.referenceStandard && step.referenceStandard.toLowerCase().includes(q))
            );
          });

          if (searchQuery.trim() && filteredSteps.length === 0) {
            return null;
          }

          return (
            <section
              id={`sec-${key}`}
              key={key}
              className="scroll-mt-28 sm:scroll-mt-32 bg-slate-950 border border-slate-800/90 rounded-2xl p-3.5 sm:p-5 shadow-xl transition-colors hover:border-slate-700/80"
            >
              {/* Module Title Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-sky-950 border border-sky-800 text-sky-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-100 flex flex-wrap items-center gap-2">
                      <FileText className="w-4 h-4 text-sky-400 hidden xs:inline" />
                      Module {idx + 1}: {activeModule.moduleName} Derivations
                      <span className="text-[10px] sm:text-xs font-normal text-slate-400">({activeModule.steps.length} steps)</span>
                    </h4>
                  </div>
                </div>
              </div>

              {/* Quick Summary Chips */}
              {activeModule.summaryItems.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-4">
                  {activeModule.summaryItems.map((item, sIdx) => (
                    <div key={sIdx} className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-800">
                      <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">{item.label}</p>
                      <p className="text-xs sm:text-sm font-bold text-sky-400 mt-0.5">
                        {item.value} <span className="text-[10px] sm:text-xs font-normal text-slate-400">{item.unit}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Dedicated Section Diagram Embedded Directly Here */}
              {renderModuleInlineDiagram(key)}

              {/* Detailed Math Steps */}
              <div className="space-y-3.5 sm:space-y-4 mt-4 sm:mt-6">
                {filteredSteps.map((step) => (
                  <div
                    key={step.id}
                    className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 sm:p-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h5 className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 shrink-0" />
                        {step.title}
                      </h5>
                      {step.status && (
                        <span
                          className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            step.status === 'pass'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {step.status === 'pass' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> PASS
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3" /> ATTENTION
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    {/* KaTeX Math Boxes with Horizontal Overflow Protection for Mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
                      <div className="bg-slate-950 p-2.5 sm:p-3 rounded-lg border border-slate-800/80 overflow-x-auto scrollbar-thin max-w-full">
                        <p className="text-[9px] sm:text-[10px] text-slate-400 mb-1 font-semibold">General Symbolic Formula:</p>
                        <MathView math={step.latexFormula} />
                      </div>
                      <div className="bg-slate-950 p-2.5 sm:p-3 rounded-lg border border-slate-800/80 overflow-x-auto scrollbar-thin max-w-full">
                        <p className="text-[9px] sm:text-[10px] text-sky-400 mb-1 font-semibold">Full Evaluation Chain (Substitution → Result):</p>
                        <MathView math={step.latexSubstituted} />
                      </div>
                    </div>

                    {/* Physical Explanation & Sawhney Reason */}
                    <div className="text-[11px] sm:text-xs space-y-1 text-slate-300 mt-2 bg-slate-950/60 p-2.5 sm:p-3 rounded-lg border border-slate-800/60">
                      <p>
                        <strong className="text-slate-200">Physical Concept:</strong> {step.explanation}
                      </p>
                      {step.reasoning && (
                        <p>
                          <strong className="text-sky-300">Design Reason / Assumption:</strong> {step.reasoning}
                        </p>
                      )}
                      {step.referenceStandard && (
                        <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono">
                          Ref: {step.referenceStandard}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
