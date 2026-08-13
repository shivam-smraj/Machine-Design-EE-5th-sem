'use client';

import React from 'react';
import { Cpu, Bot, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onToggleAiDrawer: () => void;
  onOpenRefTables: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleAiDrawer, onOpenRefTables }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-gradient-to-tr from-sky-600 to-blue-500 text-white rounded-xl shadow-lg shadow-sky-500/20 shrink-0">
          <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h1 className="text-sm sm:text-lg font-bold text-slate-100 flex flex-wrap items-center gap-1.5 leading-tight">
            Transformer CAD & AI Portal
            <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 bg-sky-950 text-sky-400 border border-sky-800 rounded-full">
              A.K. Sawhney Engine
            </span>
          </h1>
          <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">
            Interactive Electrical Machine Design, Step-by-Step KaTeX Derivations & AI Assistant
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          onClick={onOpenRefTables}
          className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 text-[11px] sm:text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          <span className="hidden xs:inline">Data Sheets</span>
          <span className="xs:hidden">Tables</span>
        </button>

        <button
          onClick={onToggleAiDrawer}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-[11px] sm:text-xs font-bold rounded-xl transition-all shadow-lg shadow-sky-600/30 flex items-center gap-1.5 shrink-0"
        >
          <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>TransformerGPT</span>
          <Sparkles className="w-3 h-3 text-amber-300 animate-pulse hidden sm:inline" />
        </button>
      </div>
    </header>
  );
};
