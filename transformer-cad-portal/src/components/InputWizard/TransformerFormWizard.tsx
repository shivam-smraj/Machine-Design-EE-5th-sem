'use client';

import React, { useState } from 'react';
import { TransformerInputs } from '@/types/transformer';
import { Settings, Zap, Layers, Maximize2, ShieldAlert, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { DEFAULT_TRANSFORMER_INPUTS } from '@/data/defaultPreset';

interface TransformerFormWizardProps {
  inputs: TransformerInputs;
  onChange: (updatedInputs: TransformerInputs) => void;
  onOpenRefTables: () => void;
}

export const TransformerFormWizard: React.FC<TransformerFormWizardProps> = ({
  inputs,
  onChange,
  onOpenRefTables,
}) => {
  const [activeTab, setActiveTab] = useState<'rating' | 'core' | 'window' | 'lv' | 'hv' | 'loss'>('rating');

  const updateField = <K extends keyof TransformerInputs>(field: K, val: TransformerInputs[K]) => {
    onChange({
      ...inputs,
      [field]: val,
    });
  };

  const resetToDefault = () => {
    onChange(DEFAULT_TRANSFORMER_INPUTS);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-5 shadow-2xl text-slate-100">
      {/* Form Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 sm:pb-4 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-sky-400 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
            Transformer Parameters
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Modify rating, core, winding, and material parameters in real-time
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenRefTables}
            className="px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-sky-950 text-sky-300 hover:text-sky-200 border border-slate-700 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Data Sheets
          </button>
          <button
            onClick={resetToDefault}
            className="px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Preset (200kVA)
          </button>
        </div>
      </div>

      {/* Form Wizard Navigation Tabs */}
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-4 sm:mb-5 border-b border-slate-800 scrollbar-thin">
        <button
          onClick={() => setActiveTab('rating')}
          className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'rating'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Settings className="w-3.5 h-3.5" /> Rating & Voltages
        </button>

        <button
          onClick={() => setActiveTab('core')}
          className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'core'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Core & Flux Density
        </button>

        <button
          onClick={() => setActiveTab('window')}
          className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'window'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" /> Window & Frame
        </button>

        <button
          onClick={() => setActiveTab('lv')}
          className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'lv'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> LV Winding
        </button>

        <button
          onClick={() => setActiveTab('hv')}
          className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'hv'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" /> HV Winding
        </button>

        <button
          onClick={() => setActiveTab('loss')}
          className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'loss'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Settings className="w-3.5 h-3.5" /> Losses & Coefficients
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
        {/* Rating & Voltages Tab */}
        {activeTab === 'rating' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">kVA Rating (Q)</label>
              <input
                type="number"
                value={inputs.kva}
                onChange={(e) => updateField('kva', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Primary Voltage (kV)</label>
              <input
                type="number"
                value={inputs.primaryKv}
                onChange={(e) => updateField('primaryKv', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Secondary Voltage (V)</label>
              <input
                type="number"
                value={inputs.secondaryVls}
                onChange={(e) => updateField('secondaryVls', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">K Factor (0.45 Dist / 0.6 Power)</label>
              <input
                type="number"
                step="0.01"
                value={inputs.kFactor}
                onChange={(e) => updateField('kFactor', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Line Frequency (Hz)</label>
              <input
                type="number"
                value={inputs.frequency}
                onChange={(e) => updateField('frequency', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Number of Phases</label>
              <input
                type="number"
                value={inputs.phases}
                onChange={(e) => updateField('phases', parseInt(e.target.value) || 3)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>
          </div>
        )}

        {/* Core & Magnetic Tab */}
        {activeTab === 'core' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Flux Density Bm (Wb/m²)</label>
              <input
                type="number"
                step="0.05"
                value={inputs.bm}
                onChange={(e) => updateField('bm', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Stacking Factor (Ki)</label>
              <input
                type="number"
                step="0.01"
                value={inputs.ki}
                onChange={(e) => updateField('ki', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Core Stepping Type</label>
              <select
                value={inputs.coreType}
                onChange={(e) => updateField('coreType', parseInt(e.target.value) as 1 | 2 | 3 | 4)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              >
                <option value={1}>1 - Square Core (Ct=0.45)</option>
                <option value={2}>2 - Cruciform Core (Ct=0.56)</option>
                <option value={3}>3 - 3-Stepped Core (Ct=0.60)</option>
                <option value={4}>4 - 4-Stepped Core (Ct=0.62)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Lamination Width p (m)</label>
              <input
                type="number"
                step="0.001"
                value={inputs.laminationP}
                onChange={(e) => updateField('laminationP', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Lamination Width q (m)</label>
              <input
                type="number"
                step="0.001"
                value={inputs.laminationQ}
                onChange={(e) => updateField('laminationQ', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>
          </div>
        )}

        {/* Window & Frame Tab */}
        {activeTab === 'window' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Window Space Factor Kw</label>
              <input
                type="number"
                step="0.005"
                value={inputs.kw}
                onChange={(e) => updateField('kw', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Current Density delta (A/mm²)</label>
              <input
                type="number"
                step="0.1"
                value={inputs.deltaPrimary}
                onChange={(e) => updateField('deltaPrimary', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Window Hw/Ww Ratio (2.0 to 4.0)</label>
              <input
                type="number"
                step="0.1"
                value={inputs.windowRatio}
                onChange={(e) => updateField('windowRatio', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Modified Window Height Hw (m)</label>
              <input
                type="number"
                step="0.005"
                value={inputs.modifiedHw}
                onChange={(e) => updateField('modifiedHw', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Modified Window Width Ww (m)</label>
              <input
                type="number"
                step="0.005"
                value={inputs.modifiedWw}
                onChange={(e) => updateField('modifiedWw', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>
          </div>
        )}

        {/* LV Winding Tab */}
        {activeTab === 'lv' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Secondary Connection</label>
              <select
                value={inputs.secondaryConnection}
                onChange={(e) => updateField('secondaryConnection', e.target.value as 'Star' | 'Delta')}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              >
                <option value="Star">Star</option>
                <option value="Delta">Delta</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">LV Turns per Phase (Ts)</label>
              <input
                type="number"
                value={inputs.secondaryTs}
                onChange={(e) => updateField('secondaryTs', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Strip Conductor Width x (mm)</label>
              <input
                type="number"
                step="0.1"
                value={inputs.stripX}
                onChange={(e) => updateField('stripX', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Strip Conductor Thickness y (mm)</label>
              <input
                type="number"
                step="0.1"
                value={inputs.stripY}
                onChange={(e) => updateField('stripY', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Covering z (mm)</label>
              <input
                type="number"
                step="0.1"
                value={inputs.coveringZ}
                onChange={(e) => updateField('coveringZ', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">LV Layers Count</label>
              <input
                type="number"
                value={inputs.lvLayers}
                onChange={(e) => updateField('lvLayers', parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>
          </div>
        )}

        {/* HV Winding Tab */}
        {activeTab === 'hv' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Primary Connection</label>
              <select
                value={inputs.primaryConnection}
                onChange={(e) => updateField('primaryConnection', e.target.value as 'Star' | 'Delta')}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              >
                <option value="Delta">Delta</option>
                <option value="Star">Star</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Tapping Percentage (%)</label>
              <input
                type="number"
                step="0.5"
                value={inputs.tappingPercent}
                onChange={(e) => updateField('tappingPercent', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Total HV Coils (Nc)</label>
              <input
                type="number"
                value={inputs.totalCoilsNc}
                onChange={(e) => updateField('totalCoilsNc', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Wire Bare Diameter dp1 (mm)</label>
              <input
                type="number"
                step="0.01"
                value={inputs.wireBareDp1}
                onChange={(e) => updateField('wireBareDp1', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Wire Insulated Diameter dp2 (mm)</label>
              <input
                type="number"
                step="0.01"
                value={inputs.wireInsulatedDp2}
                onChange={(e) => updateField('wireInsulatedDp2', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Coil Spacer Height dbc (mm)</label>
              <input
                type="number"
                step="0.5"
                value={inputs.spacerDbc}
                onChange={(e) => updateField('spacerDbc', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>
          </div>
        )}

        {/* Loss & Coefficients Tab */}
        {activeTab === 'loss' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Stray Loss Percentage (%)</label>
              <input
                type="number"
                step="1"
                value={inputs.strayLossPercent}
                onChange={(e) => updateField('strayLossPercent', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Specific Core Loss z (W/kg)</label>
              <input
                type="number"
                step="0.1"
                value={inputs.specificCoreLossLimb}
                onChange={(e) => updateField('specificCoreLossLimb', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Magnetizing AT Core (atc A/m)</label>
              <input
                type="number"
                value={inputs.magnetizingAtc}
                onChange={(e) => updateField('magnetizingAtc', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Magnetizing AT Yoke (aty A/m)</label>
              <input
                type="number"
                value={inputs.magnetizingAty}
                onChange={(e) => updateField('magnetizingAty', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:border-sky-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
