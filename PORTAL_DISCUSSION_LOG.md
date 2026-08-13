# Transformer CAD Portal — Discussion & Architectural Log

> **Project Name**: Transformer CAD & AI Engineering Portal  
> **Target Path**: [`c:\Users\Shivam\Desktop\Machine_Design\transformer-cad-portal`](file:///c:/Users/Shivam/Desktop/Machine_Design/transformer-cad-portal)  
> **Reference Standard**: A.K. Sawhney's *A Course in Electrical Machine Design*  
> **Primary Technology Stack**: Next.js 14+ (App Router), TypeScript, TailwindCSS, KaTeX LaTeX Engine, Google Gemini AI API (`@google/generative-ai`)

---

## Log Entry 1: Core Decisions & Feature Scope Alignment

### 1. Project Directory Structure
- Created dedicated directory: `transformer-cad-portal` inside `c:\Users\Shivam\Desktop\Machine_Design\`.
- Decouples web application codebase from the original C source code (`machine.c`) and stand-alone report files.

### 2. Default Preset Calibration
- **Default Problem**: 3-Phase, 200 kVA, 33 kV / 433 V, 50 Hz, Delta-Star Distribution/Power Transformer with $\pm 2.5\%, \pm 5.0\%$ tappings.
- **Default Constants**:
  - $K = 0.45$ (Voltage per turn constant)
  - $B_m = 1.0\text{ Wb/m}^2$ (Maximum core flux density)
  - $K_i = 0.90$ (Stacking factor)
  - Core Profile: Cruciform ($A_i = 0.56 d^2$)
  - Current Density $\delta = 2.3\text{ A/mm}^2$
  - Window Space Factor $K_w = \frac{10}{30 + KV} = 0.160$
  - Insulation & Spacers: $33\text{ kV}$ class insulation ($T = 34.7\text{ mm}$ Major LV-HV separation)

### 3. User Input & AI Integration Strategy
- **Input Method**: Tabbed Form Wizard + Interactive Parameter Table with instant validation & range guards.
- **AI Assistant**: Powered by Google Gemini API (`@google/generative-ai`) using `process.env.GEMINI_API_KEY`.
- **AI Capabilities**:
  - **Engineering Design Critic**: Analyzes calculated values (e.g. clearance, efficiency, regulation, temperature rise, $\% I_o$) and provides design feedback.
  - **A.K. Sawhney Knowledge Advisor**: Explains design choices (e.g. why cruciform core is chosen over square, why crossover winding is selected for HV $< 20\text{ A}$).
  - **Optimization Recommendations**: Suggests how to modify current density or core area ratio to maximize efficiency or reduce copper weight.
  - **Image Parsing**: Deferred for initial phase; user inputs via interactive forms/tables.

---

## Log Entry 2: Deep Feature Roadmap & Portal Sections

```
                                  PORTAL ARCHITECTURE
 ┌───────────────────────────────────────────────────────────────────────────────────┐
 │                                TOP NAVIGATION BAR                                 │
 │  [Logo & Preset Switcher] | [Input Mode] | [AI Assistant] | [Export PDF/ZIP]      │
 └───────────────────────────────────────────────────────────────────────────────────┘
                                           │
 ┌─────────────────────────────────────────┴─────────────────────────────────────────┐
 │                            MAIN WORKSPACE DASHBOARD                               │
 ├─────────────────────────────────────────┬─────────────────────────────────────────┤
 │     LEFT PANEL: INPUT WIZARD & TABLES   │    RIGHT PANEL: STEP-BY-STEP CAD ENGINE │
 │ 1. General & Rating Parameters          │ 1. Core Design Breakdown (KaTeX)        │
 │ 2. Core & Magnetic Geometry             │ 2. Window & Yoke Calculations (KaTeX)   │
 │ 3. Window & Frame Dimensions            │ 3. LV & HV Winding Geometry (KaTeX)     │
 │ 4. LV & HV Winding Specifications       │ 4. Resistance & Reactance Math          │
 │ 5. Material & Loss Coefficients         │ 5. Loss, Efficiency & NLC Analysis      │
 │ 6. Reference Tables (IS:1897, Sawhney)  │ 6. Interactive 2D Dynamic CAD Visualizer│
 └─────────────────────────────────────────┴─────────────────────────────────────────┘
                                           │
 ┌─────────────────────────────────────────┴─────────────────────────────────────────┐
 │                   FOOTER: REPORT FILES & GEMINI AI ASSISTANT                      │
 │ [CD.txt] [WD.txt] [YD.txt] [OD.txt] [LVD.txt] [HVD.txt] ... [Gemini AI Drawer]   │
 └───────────────────────────────────────────────────────────────────────────────────┘
```

---

## Log Entry 3: UX & Layout Refinements (Continuous Scroll & SVG Flow Badges)

Based on user feedback:
1. **Continuous Scrollable Document View**:
   - Transformed the Step-by-Step Mathematical Calculations section from a single-active-tab view into a **continuous, vertically scrollable document feed** showing ALL 12 modules sequentially in order.
   - Added a **sticky top quick-jump navigation bar** with numbered badges (`[1 Core Design] [2 Window] [3 Yoke] ... [12 No Load Current]`) for smooth-scrolling directly to any module.
2. **CAD Concentric Winding Legend & Arrow Formatting**:
   - Fixed raw `$\rightarrow$` text string to render clean styled badges with unicode directional arrows `→`:
     `Core Circle → LV Pressboard → LV Winding → Bakelized Cylinder & Duct → HV Crossover Coils`.
   - Adjusted Concentric Winding SVG diagram radii and text positioning to eliminate label overlaps.

---

## Log Entry 4: Layout Expansion & Gemini Model Resolution

1. **Full Page-Width KaTeX Calculation Engine**:
   - Updated layout in [`src/app/page.tsx`](file:///c:/Users/Shivam/Desktop/Machine_Design/transformer-cad-portal/src/app/page.tsx) so **Step-by-Step Mathematical Calculations (KaTeX Engine)** and **Report Viewer** span the full 100% container width across the page.
   - Gives maximum workspace width for 2-column KaTeX formula cards, general formulas, and substituted equations.
2. **Gemini API Model Fallback**:
   - Fixed `404 Not Found` model route in [`src/app/api/ai-assistant/route.ts`](file:///c:/Users/Shivam/Desktop/Machine_Design/transformer-cad-portal/src/app/api/ai-assistant/route.ts) by implementing sequential fallback logic: `['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp', 'gemini-1.0-pro']`.

---

## Log Entry 5: Complete 50+ Step KaTeX Math Expansion & Real-Time Search Filter

1. **50+ Step Mathematical Engine**:
   - Expanded [`transformerEngine.ts`](file:///c:/Users/Shivam/Desktop/Machine_Design/transformer-cad-portal/src/lib/transformerEngine.ts) to explicitly compute and display 50+ intermediate calculation steps across all 12 modules.
2. **Real-Time Step Search Filter**:
   - Added a live search filter input in [`StepByStepBreakdown.tsx`](file:///c:/Users/Shivam/Desktop/Machine_Design/transformer-cad-portal/src/components/StepByStepBreakdown.tsx).

---

## Log Entry 6: Textbook Multi-Stage Math Evaluation Chains & 10 Dynamic CAD Schematics

1. **Full Textbook Evaluation Chains**:
   - Every single step in [`transformerEngine.ts`](file:///c:/Users/Shivam/Desktop/Machine_Design/transformer-cad-portal/src/lib/transformerEngine.ts) now renders the complete multi-stage math evaluation chain:
     Symbolic Formula $\rightarrow$ Direct Substitution $\rightarrow$ Intermediate Term Reduction $\rightarrow$ Final Numerical Result with Units!
2. **10 Dynamic Labeled Parametric Schematics (`CADVisualizer.tsx`)**:
   - Added quick selection tab system featuring **10 dedicated SVG technical schematics**:
     - `Core & Frame`, `Concentric Windings`, `Cruciform Core Step`, `LV Strip Conductor`, `HV Crossover Stack`, `Equivalent Circuit`, `Regulation Phasor`, `Loss & Power Flow`, `No-Load Current Vector`, `Clearance & Insulation Map`.

---

## Log Entry 7: Embedded Inline Section Diagrams for Every Module

1. **Inline 2D Diagrams for All 12 Modules**:
   - Embedded a custom 2D SVG schematic diagram **directly inside each of the 12 calculation sections** in [`StepByStepBreakdown.tsx`](file:///c:/Users/Shivam/Desktop/Machine_Design/transformer-cad-portal/src/components/StepByStepBreakdown.tsx).
   - As users scroll through the continuous mathematical derivations feed, every section now features its own dedicated visual diagram right above the KaTeX formula cards!

---

## Log Entry 8: Comprehensive Mobile-First Responsiveness

1. **Responsive Header & Action Buttons**:
   - Header title, version badge, data sheet button, and AI Assistant button adapt to screens down to 320px width (`xs` / `sm`).
2. **Mobile Hero Stats Grid**:
   - Changed fixed grid to `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3` for clean vertical stacking on phones.
3. **Form Wizard Mobile Layout**:
   - Tabs bar uses touch horizontal scrolling (`overflow-x-auto scrollbar-thin`). Form inputs use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` to prevent overlapping text.
4. **KaTeX Math Container Overflow Protection**:
   - KaTeX formula cards use `overflow-x-auto scrollbar-thin max-w-full` so long equations scroll horizontally on mobile screens without blowing out page borders.
5. **Full Width AI Assistant Drawer**:
   - AI Assistant drawer takes 100% viewport width on mobile phones with touch scrolling.

---

## Log Entry 9: Git Version Control & Vercel Deployment Configuration

1. **Repository Initialized & Pushed**:
   - Initialized Git repository and set remote origin to `https://github.com/shivam-smraj/Machine-Design-EE-5th-sem.git`.
   - Created 10 feature-by-feature commits with concise commit messages.
   - Pushed `main` branch to GitHub remote origin.
2. **Vercel Zero-Config Deployment**:
   - Configured `vercel.json` in root and portal directory.
   - Ready for instant deployment on Vercel platform.

---

## Log Entry 10: Vercel Root Directory & Build Fix

1. **Root `package.json` Added**:
   - Created root [`package.json`](file:///c:/Users/Shivam/Desktop/Machine_Design/package.json) with npm `--prefix transformer-cad-portal` build and install commands.
   - Fixed Vercel `sh: line 1: cd: transformer-cad-portal: No such file or directory` error.
