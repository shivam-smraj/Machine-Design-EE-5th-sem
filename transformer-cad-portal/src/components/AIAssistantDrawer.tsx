'use client';

import React, { useState } from 'react';
import { TransformerInputs, CalculationOutputs } from '@/types/transformer';
import { Bot, Send, X, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: TransformerInputs;
  outputs: CalculationOutputs;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  inputs,
  outputs,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am **TransformerGPT**, your AI Electrical Machine Design Assistant tuned with **A.K. Sawhney** principles.\n\nI can analyze your current **200 kVA, 33 kV / 433 V** design parameters, check IS:1897 conductor clearances, or suggest efficiency optimizations!`,
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInputPrompt('');
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          inputs,
          outputs,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'API request failed');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg((err as Error)?.message || 'Error connecting to Gemini API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg text-white shadow-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
              TransformerGPT AI <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">Powered by Google Gemini 1.5 Flash</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800 flex gap-2 overflow-x-auto">
        <button
          onClick={() => handleSend("Analyze my design and check if all clearances pass A.K. Sawhney rules.")}
          className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-sky-950 text-sky-300 hover:text-sky-200 border border-slate-700 hover:border-sky-700 rounded-full whitespace-nowrap transition-all"
        >
          Analyze Clearances
        </button>
        <button
          onClick={() => handleSend("How can I increase the transformer efficiency to 98%?")}
          className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-amber-950 text-amber-300 hover:text-amber-200 border border-slate-700 hover:border-amber-700 rounded-full whitespace-nowrap transition-all"
        >
          Optimize Efficiency
        </button>
        <button
          onClick={() => handleSend("Why is Cruciform core chosen over Square core for 200 kVA rating?")}
          className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-emerald-950 text-emerald-300 hover:text-emerald-200 border border-slate-700 hover:border-emerald-700 rounded-full whitespace-nowrap transition-all"
        >
          Explain Core Choice
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-sky-600 text-white rounded-br-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none shadow-md'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-sky-400 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              TransformerGPT is calculating recommendations...
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask AI about design rules, equations..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !inputPrompt.trim()}
            className="p-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl transition-colors shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
