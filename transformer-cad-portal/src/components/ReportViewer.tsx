'use client';

import React, { useState } from 'react';
import { CalculationOutputs } from '@/types/transformer';
import { FileText, Download, Copy, Check } from 'lucide-react';

interface ReportViewerProps {
  outputs: CalculationOutputs;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ outputs }) => {
  const [selectedFileKey, setSelectedFileKey] = useState<string>('cd');
  const [copied, setCopied] = useState(false);

  const fileKeys = [
    { key: 'cd', name: 'CD.txt', label: 'Core Design' },
    { key: 'wd', name: 'WD.txt', label: 'Window Dimensions' },
    { key: 'yd', name: 'YD.txt', label: 'Yoke Design' },
    { key: 'od', name: 'OD.txt', label: 'Overall Frame' },
    { key: 'lvd', name: 'LVD.txt', label: 'LV Winding' },
    { key: 'hvd', name: 'HVD.txt', label: 'HV Winding' },
    { key: 'resis', name: 'RESIS.txt', label: 'Resistance' },
    { key: 'lr', name: 'LEAKAGE.txt', label: 'Leakage Reactance' },
    { key: 'reg', name: 'REGULATION.txt', label: 'Voltage Regulation' },
    { key: 'cl', name: 'LOSSES.txt', label: 'Losses' },
    { key: 'effi', name: 'EFFICIENCY.txt', label: 'Efficiency' },
    { key: 'nlc', name: 'NLC.txt', label: 'No-Load Current' },
  ];

  const currentModule = outputs.modules[selectedFileKey];
  const reportText = currentModule?.reportText || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const currentMeta = fileKeys.find((f) => f.key === selectedFileKey);
    const filename = currentMeta?.name || 'report.txt';
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-sky-400 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generated File Reports (CD.txt - NLC.txt)
          </h3>
          <p className="text-xs text-slate-400">
            Recreated file reports identical to original machine.c output structure
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button
            onClick={handleDownloadSingle}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-xs font-semibold rounded-lg text-white transition-colors shadow-md"
          >
            <Download className="w-4 h-4" /> Download Report
          </button>
        </div>
      </div>

      {/* File Key Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 border-b border-slate-800">
        {fileKeys.map((item) => {
          const isActive = item.key === selectedFileKey;
          return (
            <button
              key={item.key}
              onClick={() => setSelectedFileKey(item.key)}
              className={`px-3 py-1.5 text-xs font-mono rounded-md whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-600 text-white font-bold shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {/* Code Text Viewer */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap overflow-x-auto max-h-96">
        {reportText}
      </div>
    </div>
  );
};
