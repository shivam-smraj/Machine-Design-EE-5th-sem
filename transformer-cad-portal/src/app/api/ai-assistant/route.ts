import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { prompt, inputs, outputs } = await req.json();

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API Key is missing. Please set GEMINI_API_KEY in your environment variables or Vercel dashboard.' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Active model fallback list
    const candidateModels = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.0-flash-exp',
      'gemini-1.0-pro'
    ];

    const systemContext = `You are TransformerGPT, an expert Electrical Machine Design AI Assistant following A.K. Sawhney's "A Course in Electrical Machine Design" standards and Indian Standards (IS:1897, IS:2026, IS:3024).

Current Transformer Design Parameters:
- Rating: ${inputs?.kva} kVA, ${inputs?.primaryKv} kV / ${inputs?.secondaryVls} V, ${inputs?.frequency} Hz, ${inputs?.phases}-Phase
- Core Type: Cruciform (d = ${outputs?.core?.d ? (outputs.core.d * 1000).toFixed(1) : 226.3} mm, Ai = ${outputs?.core?.ai ? (outputs.core.ai * 1e3).toFixed(2) : 28.67} k mm^2)
- Flux Density (Bm): ${inputs?.bm} Wb/m^2
- Current Density (delta): ${inputs?.deltaPrimary} A/mm^2
- LV Winding: ${inputs?.secondaryTs} turns, ${inputs?.stripX}x${inputs?.stripY} mm strip, Axial Clearance = ${outputs?.lv?.clearanceCls?.toFixed(1)} mm
- HV Winding: ${outputs?.hv?.tpModified?.toFixed(0)} turns (+5% tap), ${inputs?.wireBareDp1} mm wire, Axial Clearance = ${outputs?.hv?.clearanceClc?.toFixed(1)} mm
- Regulation: ${outputs?.regulation?.regulationPercent?.toFixed(2)}% at 0.8 lag PF
- Full Load Efficiency: ${outputs?.efficiency?.fullLoadEfficiency?.toFixed(2)}%
- No-Load Current: ${outputs?.noLoadCurrent?.ioPercent?.toFixed(1)}% of full load

Answer the user's questions clearly, concisely, with electrical machine engineering precision, formulas, and references to A.K. Sawhney's book.`;

    let responseText = '';
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([
          systemContext,
          `User Question: ${prompt}`,
        ]);
        responseText = result.response.text();
        if (responseText) break;
      } catch (err: unknown) {
        console.warn(`Model ${modelName} failed, trying next fallback...`, (err as Error)?.message);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error('No valid Gemini model succeeded.');
    }

    return NextResponse.json({ reply: responseText });
  } catch (error: unknown) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to communicate with Gemini AI API' },
      { status: 500 }
    );
  }
}
