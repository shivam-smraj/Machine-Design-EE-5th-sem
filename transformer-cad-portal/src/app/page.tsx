'use client';

import React, { useState, useMemo } from 'react';
import { TransformerInputs } from '@/types/transformer';
import { DEFAULT_TRANSFORMER_INPUTS } from '@/data/defaultPreset';
import { runTransformerCalculations } from '@/lib/transformerEngine';
import { Header } from '@/components/Header';
import { TransformerFormWizard } from '@/components/InputWizard/TransformerFormWizard';
import { CADVisualizer } from '@/components/CADVisualizer';
import { StepByStepBreakdown } from '@/components/StepByStepBreakdown';
import { ReportViewer } from '@/components/ReportViewer';
import { ReferenceTablesModal } from '@/components/ReferenceTablesModal';
import { AIAssistantDrawer } from '@/components/AIAssistantDrawer';
import { ShieldCheck, Zap, Layers, Activity } from 'lucide-react';

export default function Home() {
  const [inputs, setInputs] = useState<TransformerInputs>(DEFAULT_TRANSFORMER_INPUTS);
  const [isRefTablesOpen, setIsRefTablesOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // Recalculate instantly on input change
  const outputs = useMemo(() => {
    return runTransformerCalculations(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white pb-16 overflow-x-hidden">
      {/* Header */}
      <Header
        onToggleAiDrawer={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
        onOpenRefTables={() => setIsRefTablesOpen(true)}
      />

      {/* Hero Stats Banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:border-r sm:border-slate-800/80 sm:pr-4">
            <div className="p-2 sm:p-2.5 bg-sky-950 text-sky-400 rounded-xl border border-sky-800 shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Rating</p>
              <p className="text-sm sm:text-base font-bold text-slate-100">{inputs.kva} kVA</p>
              <p className="text-[10px] text-sky-400">{inputs.primaryKv}kV / {inputs.secondaryVls}V</p>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:border-r lg:border-slate-800/80 lg:pr-4">
            <div className="p-2 sm:p-2.5 bg-amber-950 text-amber-400 rounded-xl border border-amber-800 shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Full Load Efficiency</p>
              <p className="text-sm sm:text-base font-bold text-emerald-400">{outputs.efficiency.fullLoadEfficiency.toFixed(2)}%</p>
              <p className="text-[10px] text-slate-400">Max at {(outputs.efficiency.maxEfficiencyLoadingX * 100).toFixed(1)}% load</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:border-r sm:border-slate-800/80 sm:pr-4">
            <div className="p-2 sm:p-2.5 bg-purple-950 text-purple-400 rounded-xl border border-purple-800 shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Voltage Regulation</p>
              <p className="text-sm sm:text-base font-bold text-slate-100">{outputs.regulation.regulationPercent.toFixed(2)}%</p>
              <p className="text-[10px] text-slate-400">0.8 Lagging PF</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">No-Load Current</p>
              <p className="text-sm sm:text-base font-bold text-emerald-400">{outputs.noLoadCurrent.ioPercent.toFixed(1)}%</p>
              <p className="text-[10px] text-emerald-400/80 font-semibold">Guards Passed (≤ 5%)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-6 space-y-6 sm:space-y-8">
        {/* Top Section: Form Wizard (Left) & CAD Visualizer (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <TransformerFormWizard
              inputs={inputs}
              onChange={setInputs}
              onOpenRefTables={() => setIsRefTablesOpen(true)}
            />
          </div>

          <div className="lg:col-span-7">
            <CADVisualizer outputs={outputs} inputs={inputs} />
          </div>
        </div>

        {/* FULL PAGE WIDTH SECTION: Step-by-Step KaTeX Math Breakdown */}
        <div className="w-full">
          <StepByStepBreakdown outputs={outputs} inputs={inputs} />
        </div>

        {/* FULL PAGE WIDTH SECTION: Generated File Reports (CD.txt - NLC.txt) */}
        <div className="w-full">
          <ReportViewer outputs={outputs} />
        </div>
      </main>

      {/* Reference Tables Modal */}
      <ReferenceTablesModal
        isOpen={isRefTablesOpen}
        onClose={() => setIsRefTablesOpen(false)}
      />

      {/* Gemini AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        inputs={inputs}
        outputs={outputs}
      />
    </div>
  );
}
