'use client';

import React, { useState } from 'react';
import {
  STRIP_CONDUCTOR_TABLE,
  ROUND_WIRE_TABLE,
  CORE_STEPPING_TABLE,
  ENGINEERING_GUIDANCE_RANGES,
} from '@/data/referenceTables';
import { X, BookOpen, Layers, Zap, Gauge } from 'lucide-react';

interface ReferenceTablesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceTablesModal: React.FC<ReferenceTablesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'strips' | 'wires' | 'core' | 'guidance'>('strips');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-950 text-sky-400 rounded-lg border border-sky-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">A.K. Sawhney Engineering Data Sheets</h2>
              <p className="text-xs text-slate-400">Standard copper conductors (IS:1897), core stepping ratios, and flux density guidelines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('strips')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'strips'
                ? 'border-sky-500 text-sky-400 bg-sky-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" /> Strip Conductors (IS:1897)
          </button>
          <button
            onClick={() => setActiveTab('wires')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'wires'
                ? 'border-sky-500 text-sky-400 bg-sky-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-4 h-4" /> Round Wires (Table 23.7)
          </button>
          <button
            onClick={() => setActiveTab('core')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'core'
                ? 'border-sky-500 text-sky-400 bg-sky-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" /> Core Stepping (Table 5.2)
          </button>
          <button
            onClick={() => setActiveTab('guidance')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'guidance'
                ? 'border-sky-500 text-sky-400 bg-sky-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Guidance Ranges
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'strips' && (
            <div>
              <h3 className="text-sm font-semibold text-sky-400 mb-2">Table 23.1: Standard Rectangular Copper Strip Conductors (IS:1897-1962)</h3>
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Standard Dimension (mm)</th>
                      <th className="p-3">Bare Width (mm)</th>
                      <th className="p-3">Bare Thickness (mm)</th>
                      <th className="p-3">Bare Area (mm²)</th>
                      <th className="p-3">Covered Width (X1)</th>
                      <th className="p-3">Covered Thickness (Y1)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {STRIP_CONDUCTOR_TABLE.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-sky-300">{row.standardDimension}</td>
                        <td className="p-3">{row.widthBareMm}</td>
                        <td className="p-3">{row.thicknessBareMm}</td>
                        <td className="p-3 font-mono">{row.areaMm2.toFixed(2)}</td>
                        <td className="p-3">{row.paperCoveredWidthMm}</td>
                        <td className="p-3">{row.paperCoveredThicknessMm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'wires' && (
            <div>
              <h3 className="text-sm font-semibold text-sky-400 mb-2">Table 23.7: Standard Round Conductor Wires</h3>
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">SWG Rating</th>
                      <th className="p-3">Bare Diameter (dp1 mm)</th>
                      <th className="p-3">Insulated Diameter (dp2 mm)</th>
                      <th className="p-3">Cross-Sectional Area (ap mm²)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {ROUND_WIRE_TABLE.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-amber-300">{row.swg}</td>
                        <td className="p-3 font-mono">{row.bareDiameterMm}</td>
                        <td className="p-3 font-mono">{row.insulatedDiameterMm}</td>
                        <td className="p-3 font-mono">{row.areaMm2.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'core' && (
            <div>
              <h3 className="text-sm font-semibold text-sky-400 mb-2">Table 5.2: Core Stepping Constants & Lamination Width Ratios</h3>
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Core Profile</th>
                      <th className="p-3">Steps</th>
                      <th className="p-3">Ct Factor</th>
                      <th className="p-3">Area Formula</th>
                      <th className="p-3">Lamination Step Ratios</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {CORE_STEPPING_TABLE.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-emerald-300">{row.type}</td>
                        <td className="p-3">{row.steps}</td>
                        <td className="p-3 font-mono font-bold text-sky-400">{row.ctFactor}</td>
                        <td className="p-3 font-mono">{row.formula}</td>
                        <td className="p-3 font-mono text-slate-400">{row.widthRatios}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'guidance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">Flux Density (Bm) Guidelines</h4>
                <ul className="text-xs space-y-2 text-slate-300">
                  <li><strong className="text-slate-100">Distribution Transformers:</strong> {ENGINEERING_GUIDANCE_RANGES.fluxDensityDistribution.min} to {ENGINEERING_GUIDANCE_RANGES.fluxDensityDistribution.max} Wb/m² (Default: 1.0)</li>
                  <li><strong className="text-slate-100">Power Transformers:</strong> {ENGINEERING_GUIDANCE_RANGES.fluxDensityPower.min} to {ENGINEERING_GUIDANCE_RANGES.fluxDensityPower.max} Wb/m²</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Current Density (delta) Guidelines</h4>
                <ul className="text-xs space-y-2 text-slate-300">
                  <li><strong className="text-slate-100">Natural Oil Cooled (ONAN):</strong> {ENGINEERING_GUIDANCE_RANGES.currentDensitySelfOilCooling.min} to {ENGINEERING_GUIDANCE_RANGES.currentDensitySelfOilCooling.max} A/mm² (Default: 2.3)</li>
                  <li><strong className="text-slate-100">Forced Oil / Water Cooled (OFAF):</strong> {ENGINEERING_GUIDANCE_RANGES.currentDensityForcedOilCooling.min} to {ENGINEERING_GUIDANCE_RANGES.currentDensityForcedOilCooling.max} A/mm²</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
