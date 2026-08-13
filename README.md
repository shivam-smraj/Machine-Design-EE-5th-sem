# Machine-Design-EE-5th-sem

> **EE 5th Semester Electrical Machine Design CAD & AI Engineering Portal**  
> Based on A.K. Sawhney's *A Course in Electrical Machine Design* & Indian Standards (IS:1897, IS:2026, IS:3024).

---

## ⚡ Overview

An interactive, high-performance web portal for **3-Phase Transformer Computer-Aided Design (CAD)** and step-by-step mathematical calculations.

- **Benchmark Specs**: 3-Phase, 200 kVA, 33 kV / 433 V, 50 Hz, Delta-Star Core-Type Distribution Transformer ($\pm 2.5\%, \pm 5.0\%$ tappings).
- **Core Geometry**: Stepped Cruciform Core ($A_i = 0.56 d^2$) with $B_m = 1.0\text{ Wb/m}^2$, $K_i = 0.90$.
- **Windings**: LV Helical Strip ($15.0 \times 7.8\text{ mm}$) and HV Crossover Stack (22 coils, $1.06\text{ mm}$ wire, $5.0\text{ mm}$ spacers).

---

## 🚀 Key Features

1. **Step-by-Step KaTeX Derivations**:
   Full textbook-style math evaluation chains across 12 modules:
   $$\text{Symbolic Formula} \longrightarrow \text{Direct Substitution} \longrightarrow \text{Intermediate Terms} \longrightarrow \text{Final Evaluated Result}$$
2. **10 Dynamic Technical CAD Schematics**:
   Real-time 2D SVG schematics (`Core & Frame`, `Concentric Windings`, `Cruciform Core Step`, `LV Strip Conductor`, `HV Crossover Stack`, `Equivalent Circuit`, `Regulation Phasor`, `Loss & Power Flow`, `No-Load Current Vector`, `Clearance & Insulation Map`).
3. **Embedded Inline Section Diagrams**:
   Each calculation section features its own dedicated visual diagram right next to the KaTeX formula cards.
4. **TransformerGPT AI Assistant**:
   Powered by Google Gemini API for real-time design critique, clearance auditing, and efficiency optimization.
5. **A.K. Sawhney & IS:1897 Reference Tables**:
   Built-in interactive modals for copper conductor dimensions, window space factors, and flux density limits.
6. **Mobile-First Responsive Layout**:
   Fully responsive UI optimized for desktop, tablet, and mobile devices down to 320px screen width.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Math Engine**: KaTeX
- **AI Integration**: `@google/generative-ai` (Gemini 1.5 Flash / Pro)
- **Deployment**: Vercel Ready

---

## 📦 Local Development

```bash
# Navigate to portal directory
cd transformer-cad-portal

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Visit `http://localhost:3000` to interact with the portal.

---

## 🌐 Vercel Deployment

This repository is pre-configured with `vercel.json` for zero-config Vercel deployment:
1. Import repository `Machine-Design-EE-5th-sem` on Vercel.
2. Build command and framework settings are automatically detected.
3. Deploy!
