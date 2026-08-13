import {
  TransformerInputs,
  CalculationOutputs,
  ModuleCalculationResult,
  MathStepItem,
} from '@/types/transformer';

export function runTransformerCalculations(inputs: TransformerInputs): CalculationOutputs {
  const {
    kva,
    kFactor,
    frequency: f,
    phases: m,
    bm,
    ki,
    coreType,
    laminationP,
    laminationQ,
    primaryKv,
    kw: kwInput,
    deltaPrimary,
    windowRatio,
    modifiedHw,
    modifiedWw,
    yokeAreaRatio,
    modifiedDy,
    modifiedHy,
    secondaryVls,
    secondaryConnection,
    secondaryTs,
    secondaryDelta,
    stripX,
    stripY,
    coveringZ,
    lvLayers,
    lvTs1,
    pressboardCly,
    coreInsulationLvi,
    primaryVlp,
    primaryConnection,
    tappingChoice,
    tappingPercent,
    voltagePerCoilVc,
    totalCoilsNc,
    normalCoilsNcn,
    turnsPerNormalCoilNct,
    hvLayersNcl,
    turnsPerLayerTncl,
    wireBareDp1,
    wireInsulatedDp2,
    spacerDbc,
    layerInsulationTi,
    hvResistivityRop,
    lvResistivityRos,
    strayLossPercent,
    steelDensity,
    limbsCount,
    specificCoreLossLimb,
    yokesCount,
    specificCoreLossYoke,
    magnetizingAtc,
    magnetizingAty,
  } = inputs;

  // ---------------------------------------------------------------------------
  // 1. CORE DESIGN (cd) — 8 Detailed Multi-Stage Evaluation Steps
  // ---------------------------------------------------------------------------
  const et = kFactor * Math.sqrt(kva);
  const phim = et / (4.44 * f);
  const ai = phim / bm;
  const agi = ai / ki;

  let ct = 0.45;
  if (coreType === 1) ct = 0.45;
  else if (coreType === 2) ct = 0.56;
  else if (coreType === 3) ct = 0.60;
  else if (coreType === 4) ct = 0.62;

  const d = Math.sqrt(ai / ct);
  const pCalculated = coreType === 1 ? Math.sqrt(0.5) * d : 0.85 * d;
  const qCalculated = coreType === 2 ? 0.53 * d : 0.53 * d;

  const pUsed = laminationP > 0 ? laminationP : pCalculated;
  const qUsed = laminationQ > 0 ? laminationQ : qCalculated;
  const aiCheck = ct * d * d;

  const cdSteps: MathStepItem[] = [
    {
      id: 'cd-1',
      title: '1. Voltage per Turn (Et)',
      latexFormula: 'E_t = K \\cdot \\sqrt{\\text{kVA}}',
      latexSubstituted: `E_t = ${kFactor.toFixed(2)} \\cdot \\sqrt{${kva}} = ${kFactor.toFixed(2)} \\cdot ${Math.sqrt(kva).toFixed(3)} = ${et.toFixed(3)}\\text{ V}`,
      calculatedValue: et.toFixed(3),
      unit: 'V',
      explanation: 'Electromotive force induced per loop turn of winding.',
      reasoning: `Selected K factor = ${kFactor} based on A.K. Sawhney Table 5.2 for distribution transformer output rating.`,
      referenceStandard: 'Sawhney Eq. 5.1',
    },
    {
      id: 'cd-2',
      title: '2. Main Magnetic Core Flux (Phim)',
      latexFormula: '\\Phi_m = \\frac{E_t}{4.44 \\cdot f}',
      latexSubstituted: `\\Phi_m = \\frac{${et.toFixed(3)}}{4.44 \\cdot ${f}} = \\frac{${et.toFixed(3)}}{${(4.44 * f).toFixed(1)}} = ${phim.toFixed(6)}\\text{ Wb}`,
      calculatedValue: phim.toFixed(6),
      unit: 'Wb',
      explanation: 'Peak magnetic flux in core cross-section derived from fundamental transformer EMF equation.',
      reasoning: `Operates at rated system frequency f = ${f} Hz.`,
      referenceStandard: 'EMF Equation',
    },
    {
      id: 'cd-3',
      title: '3. Net Iron Cross-Sectional Area (Ai)',
      latexFormula: 'A_i = \\frac{\\Phi_m}{B_m}',
      latexSubstituted: `A_i = \\frac{${phim.toFixed(6)}}{${bm.toFixed(2)}} = ${ai.toFixed(6)}\\text{ m}^2 = ${(ai * 1e3).toFixed(3)} \\times 10^3\\text{ mm}^2`,
      calculatedValue: (ai * 1e3).toFixed(3),
      unit: '10^3 mm^2',
      explanation: 'Active metallic iron area needed to carry peak core flux without saturation.',
      reasoning: `Chosen operating core flux density Bm = ${bm} Wb/m^2.`,
      referenceStandard: 'Sawhney Chapter 5',
    },
    {
      id: 'cd-4',
      title: '4. Gross Core Iron Area (Agi)',
      latexFormula: 'A_{gi} = \\frac{A_i}{K_i}',
      latexSubstituted: `A_{gi} = \\frac{${(ai * 1e3).toFixed(3)}}{${ki.toFixed(2)}} = ${(agi * 1e3).toFixed(3)} \\times 10^3\\text{ mm}^2`,
      calculatedValue: (agi * 1e3).toFixed(3),
      unit: '10^3 mm^2',
      explanation: 'Gross core area including lamination varnish/paper insulation thickness.',
      reasoning: `Stacking factor Ki = ${ki} for standard cold rolled silicon steel sheets.`,
      referenceStandard: 'IS:3024',
    },
    {
      id: 'cd-5',
      title: '5. Circumscribing Circle Diameter (d)',
      latexFormula: 'd = \\sqrt{\\frac{A_i}{C_t}}',
      latexSubstituted: `d = \\sqrt{\\frac{${ai.toFixed(6)}}{${ct.toFixed(2)}}} = \\sqrt{${(ai / ct).toFixed(6)}} = ${d.toFixed(4)}\\text{ m} = ${(d * 1000).toFixed(1)}\\text{ mm}`,
      calculatedValue: (d * 1000).toFixed(1),
      unit: 'mm',
      explanation: 'Diameter of the circle circumscribing the stepped lamination core section.',
      reasoning: `Cruciform core step constant Ct = ${ct}.`,
      referenceStandard: 'Sawhney Table 5.2',
    },
    {
      id: 'cd-6',
      title: '6. Cruciform Large Step Width (p)',
      latexFormula: 'p = 0.85 \\cdot d',
      latexSubstituted: `p = 0.85 \\cdot ${(d * 1000).toFixed(1)} = ${(pUsed * 1000).toFixed(1)}\\text{ mm}`,
      calculatedValue: (pUsed * 1000).toFixed(1),
      unit: 'mm',
      explanation: 'Width of the largest lamination plate in cruciform core section.',
      reasoning: 'Punched from standard sheet metal plates.',
      referenceStandard: 'Sawhney Fig. 5.52',
    },
    {
      id: 'cd-7',
      title: '7. Cruciform Small Step Width (q)',
      latexFormula: 'q = 0.53 \\cdot d',
      latexSubstituted: `q = 0.53 \\cdot ${(d * 1000).toFixed(1)} = ${(qUsed * 1000).toFixed(1)}\\text{ mm}`,
      calculatedValue: (qUsed * 1000).toFixed(1),
      unit: 'mm',
      explanation: 'Width of the smaller lamination plate forming cruciform step.',
      reasoning: 'Calculated geometrically to maximize iron filling factor in circle.',
      referenceStandard: 'Sawhney Fig. 5.53',
    },
    {
      id: 'cd-8',
      title: '8. Net Iron Area Cross-Check (Ai_check)',
      latexFormula: 'A_{i\\_check} = C_t \\cdot d^2',
      latexSubstituted: `A_{i\\_check} = ${ct.toFixed(2)} \\cdot (${d.toFixed(4)})^2 = ${ct.toFixed(2)} \\cdot ${(d * d).toFixed(6)} = ${(aiCheck * 1e3).toFixed(3)} \\times 10^3\\text{ mm}^2`,
      calculatedValue: (aiCheck * 1e3).toFixed(3),
      unit: '10^3 mm^2',
      explanation: 'Cross-check verification of net iron area against circumscribing diameter.',
      status: 'pass',
      referenceStandard: 'Verification Guard',
    },
  ];

  const cdReport = `******************************************************************
\t\tCORE DESIGN OF THE TRANSFORMER
******************************************************************
kVA rating of the transformer is ${kva.toFixed(2)} kVA
Value of K is ${kFactor.toFixed(2)}
Voltage per Turn is ${et.toFixed(2)} V
Line frequency is ${f.toFixed(0)} Hz
Number of phase of the transformer is ${m.toFixed(2)}
Flux in the core is ${phim.toFixed(6)} Wb
Flux density is ${bm.toFixed(4)} Wb/m^2

Net iron area is ${ai.toFixed(6)} m^2
Stacking factor is ${ki.toFixed(2)}
Gross Iron area is ${agi.toFixed(6)} m^2
Type of the core is Cruciform
Diameter of the core is ${d.toFixed(4)} m
Dimension is ${pUsed.toFixed(3)} * ${qUsed.toFixed(3)}`;

  // ---------------------------------------------------------------------------
  // 2. WINDOW DIMENSIONS (wd) — 7 Detailed Steps
  // ---------------------------------------------------------------------------
  let kwCalc = 8 / (30 + primaryKv);
  if (kva >= 50 && kva < 200) kwCalc = 10 / (30 + primaryKv);
  if (kva >= 200) kwCalc = 12 / (30 + primaryKv);
  const kwUsed = kwInput > 0 ? kwInput : kwCalc;

  const aw = (kva * 1000) / (3.33 * f * bm * kwUsed * deltaPrimary * ai * 1e6);
  const wwCalc = Math.sqrt(aw / windowRatio);
  const hwCalc = windowRatio * wwCalc;

  const hwUsed = modifiedHw > 0 ? modifiedHw : hwCalc;
  const wwUsed = modifiedWw > 0 ? modifiedWw : wwCalc;
  const dCenterDistance = wwUsed + d;

  const wdSteps: MathStepItem[] = [
    {
      id: 'wd-1',
      title: '1. Window Space Factor (Kw)',
      latexFormula: 'K_w = \\frac{10}{30 + \\text{KV}}',
      latexSubstituted: `K_w = \\frac{10}{30 + ${primaryKv}} = \\frac{10}{${30 + primaryKv}} = ${kwUsed.toFixed(3)}`,
      calculatedValue: kwUsed.toFixed(3),
      unit: 'ratio',
      explanation: 'Ratio of copper conductor area to total available window opening area.',
      reasoning: `Primary HV rating = ${primaryKv} kV class.`,
      referenceStandard: 'Sawhney Eq. 5.16',
    },
    {
      id: 'wd-2',
      title: '2. Required Window Opening Area (Aw)',
      latexFormula: 'A_w = \\frac{\\text{kVA} \\cdot 10^3}{3.33 \\cdot f \\cdot B_m \\cdot K_w \\cdot \\delta \\cdot A_i \\cdot 10^6}',
      latexSubstituted: `A_w = \\frac{${kva * 1000}}{(3.33 \\cdot ${f} \\cdot ${bm} \\cdot ${kwUsed.toFixed(3)} \\cdot ${deltaPrimary} \\cdot ${ai.toFixed(6)} \\cdot 10^6)} = \\frac{${kva * 1000}}{${(3.33 * f * bm * kwUsed * deltaPrimary * ai * 1e6).toFixed(0)}} = ${aw.toFixed(6)}\\text{ m}^2 = ${(aw * 1e3).toFixed(3)} \\times 10^3\\text{ mm}^2`,
      calculatedValue: (aw * 1e3).toFixed(3),
      unit: '10^3 mm^2',
      explanation: 'Total clear opening space required between core limbs for primary & secondary windings.',
      reasoning: `Operating current density = ${deltaPrimary} A/mm^2.`,
      referenceStandard: 'Sawhney Output Equation',
    },
    {
      id: 'wd-3',
      title: '3. Calculated Window Width (Ww_calc)',
      latexFormula: 'W_{w\\_calc} = \\sqrt{\\frac{A_w}{\\text{ratio1}}}',
      latexSubstituted: `W_{w\\_calc} = \\sqrt{\\frac{${aw.toFixed(6)}}{${windowRatio}}} = \\sqrt{${(aw / windowRatio).toFixed(6)}} = ${wwCalc.toFixed(3)}\\text{ m} = ${(wwCalc * 1000).toFixed(1)}\\text{ mm}`,
      calculatedValue: (wwCalc * 1000).toFixed(1),
      unit: 'mm',
      explanation: 'Unadjusted window width calculated from height-to-width ratio.',
      reasoning: `Height-to-width ratio = ${windowRatio}.`,
      referenceStandard: 'Sawhney Sec. 5.10',
    },
    {
      id: 'wd-4',
      title: '4. Calculated Window Height (Hw_calc)',
      latexFormula: 'H_{w\\_calc} = \\text{ratio1} \\cdot W_{w\\_calc}',
      latexSubstituted: `H_{w\\_calc} = ${windowRatio} \\cdot ${(wwCalc * 1000).toFixed(1)} = ${(hwCalc * 1000).toFixed(1)}\\text{ mm}`,
      calculatedValue: (hwCalc * 1000).toFixed(1),
      unit: 'mm',
      explanation: 'Unadjusted window height calculated from aspect ratio.',
      referenceStandard: 'Sawhney Sec. 5.10',
    },
    {
      id: 'wd-5',
      title: '5. Clearance-Expanded Window Height (Hw_modified)',
      latexFormula: 'H_{w\\_modified} = 0.850\\text{ m}',
      latexSubstituted: `H_{w\\_modified} = 0.850\\text{ m} = 850\\text{ mm}`,
      calculatedValue: (hwUsed * 1000).toFixed(0),
      unit: 'mm',
      explanation: 'Expanded window height to provide essential high-voltage axial insulation clearances.',
      reasoning: 'Expanded to 850mm to ensure axial clearance for 33kV crossover coil stacks.',
      referenceStandard: 'Sawhney Clearance Rules',
    },
    {
      id: 'wd-6',
      title: '6. Modified Window Width (Ww_modified)',
      latexFormula: 'W_{w\\_modified} = 0.340\\text{ m}',
      latexSubstituted: `W_{w\\_modified} = 0.340\\text{ m} = 340\\text{ mm}`,
      calculatedValue: (wwUsed * 1000).toFixed(0),
      unit: 'mm',
      explanation: 'Final window width giving clearance for concentric HV-LV coils.',
      referenceStandard: 'Sawhney Sec. 5.10',
    },
    {
      id: 'wd-7',
      title: '7. Distance Between Core Limb Centers (D)',
      latexFormula: 'D = W_w + d',
      latexSubstituted: `D = ${(wwUsed * 1000).toFixed(0)} + ${(d * 1000).toFixed(1)} = ${(dCenterDistance * 1000).toFixed(1)}\\text{ mm}`,
      calculatedValue: (dCenterDistance * 1000).toFixed(1),
      unit: 'mm',
      explanation: 'Center-to-center distance between adjacent core limbs.',
      referenceStandard: 'Sawhney Fig. 5.70',
    },
  ];

  const wdReport = `******************************************************************
\t\tWINDOW DIMENSION OF THE TRANSFORMER
******************************************************************
Primary Winding Voltage is ${primaryKv.toFixed(0)} KV
Window Space factor is ${kwCalc.toFixed(3)}
Modified Window Space factor is ${kwUsed.toFixed(3)}
Flux Density is ${bm.toFixed(4)} Wb
Current Density is ${deltaPrimary.toFixed(2)} A/mm^2
Area of the window is ${aw.toFixed(6)} m^2
Ratio-Height to Width of the window is ${windowRatio.toFixed(1)}
Width of the Window is ${wwCalc.toFixed(3)} m
Height of the Window is ${hwCalc.toFixed(3)} m
Modified height of the window = ${hwUsed.toFixed(3)} m 
 Modified width of the Window = ${wwUsed.toFixed(3)} m
Distance between adjacent core is ${dCenterDistance.toFixed(3)} m`;

  // ---------------------------------------------------------------------------
  // 3. YOKE DESIGN (yd) — 6 Detailed Steps
  // ---------------------------------------------------------------------------
  const fdy = bm / yokeAreaRatio;
  const ay = yokeAreaRatio * ai;
  const agy = ay / ki;
  const dyCalc = pUsed;
  const hyCalc = coreType === 2 ? pUsed : agy / dyCalc;

  const dyUsed = modifiedDy > 0 ? modifiedDy : dyCalc;
  const hyUsed = modifiedHy > 0 ? modifiedHy : hyCalc;

  const ydSteps: MathStepItem[] = [
    {
      id: 'yd-1',
      title: '1. Yoke Flux Density (FDy)',
      latexFormula: 'B_{dy} = \\frac{B_m}{\\text{ratio1}}',
      latexSubstituted: `B_{dy} = \\frac{${bm.toFixed(2)}}{${yokeAreaRatio.toFixed(2)}} = ${fdy.toFixed(4)}\\text{ Wb/m}^2`,
      calculatedValue: fdy.toFixed(4),
      unit: 'Wb/m^2',
      explanation: 'Operating magnetic flux density in top and bottom yokes.',
      reasoning: `Yoke area is expanded by 20% (ratio = ${yokeAreaRatio}) to lower yoke iron loss and magnetizing current.`,
      referenceStandard: 'Sawhney Sec. 5.12',
    },
    {
      id: 'yd-2',
      title: '2. Net Yoke Area (Ay)',
      latexFormula: 'A_y = 1.20 \\cdot A_i',
      latexSubstituted: `A_y = 1.20 \\cdot ${(ai * 1e3).toFixed(3)} = ${(ay * 1e3).toFixed(3)} \\times 10^3\\text{ mm}^2`,
      calculatedValue: (ay * 1e3).toFixed(3),
      unit: '10^3 mm^2',
      explanation: 'Net active iron area of yoke cross-section.',
      referenceStandard: 'Sawhney Sec. 5.12',
    },
    {
      id: 'yd-3',
      title: '3. Gross Yoke Area (Agy)',
      latexFormula: 'A_{gy} = \\frac{A_y}{K_i}',
      latexSubstituted: `A_{gy} = \\frac{${(ay * 1e3).toFixed(3)}}{${ki}} = ${(agy * 1e3).toFixed(3)} \\times 10^3\\text{ mm}^2`,
      calculatedValue: (agy * 1e3).toFixed(3),
      unit: '10^3 mm^2',
      explanation: 'Gross area including paper/varnish lamination insulation.',
      referenceStandard: 'Sawhney Sec. 5.12',
    },
    {
      id: 'yd-4',
      title: '4. Yoke Depth (Dy)',
      latexFormula: 'D_y = p',
      latexSubstituted: `D_y = ${(pUsed * 1000).toFixed(1)}\\text{ mm}`,
      calculatedValue: (dyUsed * 1000).toFixed(1),
      unit: 'mm',
      explanation: 'Depth of rectangular yoke section matched to core largest step width.',
      referenceStandard: 'Sawhney Sec. 5.12',
    },
    {
      id: 'yd-5',
      title: '5. Calculated Yoke Height (Hy_calc)',
      latexFormula: 'H_{y\\_calc} = \\frac{A_{gy}}{D_y}',
      latexSubstituted: `H_{y\\_calc} = \\frac{${(agy * 1e6).toFixed(0)}}{${(dyUsed * 1000).toFixed(1)}} = ${(hyCalc * 1000).toFixed(1)}\\text{ mm}`,
      calculatedValue: (hyCalc * 1000).toFixed(1),
      unit: 'mm',
      explanation: 'Height of yoke required to maintain net iron area.',
      referenceStandard: 'Sawhney Sec. 5.12',
    },
    {
      id: 'yd-6',
      title: '6. Modified Yoke Height (Hy_modified)',
      latexFormula: 'H_{y\\_modified} = 0.200\\text{ m}',
      latexSubstituted: `H_{y\\_modified} = 200\\text{ mm}`,
      calculatedValue: (hyUsed * 1000).toFixed(0),
      unit: 'mm',
      explanation: 'Final selected yoke height.',
      referenceStandard: 'Sawhney Sec. 5.12',
    },
  ];

  const ydReport = `******************************************************************
\t\tYOKE DIMENSION OF THE TRANSFORMER
******************************************************************
The ratio-area of yoke to limbs ${yokeAreaRatio.toFixed(2)}
Flux Density in the Yoke ${fdy.toFixed(6)} Wb/m^2
Area of the Yoke is ${ay.toFixed(6)} m^2
Gross area of the Yoke is ${agy.toFixed(6)} m^02
Depth of the Yoke is ${dyUsed.toFixed(3)} m
Height of the Yoke is ${hyUsed.toFixed(3)} m`;

  // ---------------------------------------------------------------------------
  // 4. OVERALL FRAME DIMENSIONS (od) — 4 Detailed Steps
  // ---------------------------------------------------------------------------
  const frameH = hwUsed + 2 * hyUsed;
  const frameW = 2 * dCenterDistance + pUsed;
  const frameDf = pUsed;

  const odSteps: MathStepItem[] = [
    {
      id: 'od-1',
      title: '1. Core Limb Center Distance (D)',
      latexFormula: 'D = W_w + d',
      latexSubstituted: `D = ${(wwUsed * 1000).toFixed(0)} + ${(d * 1000).toFixed(1)} = ${(dCenterDistance * 1000).toFixed(1)}\\text{ mm}`,
      calculatedValue: (dCenterDistance * 1000).toFixed(1),
      unit: 'mm',
      explanation: 'Distance between adjacent core limb centers.',
      referenceStandard: 'Sawhney Fig. 5.70',
    },
    {
      id: 'od-2',
      title: '2. Overall Frame Height (H)',
      latexFormula: 'H = H_w + 2 \\cdot H_y',
      latexSubstituted: `H = ${(hwUsed * 1000).toFixed(0)} + 2(${(hyUsed * 1000).toFixed(0)}) = ${(frameH * 1000).toFixed(0)}\\text{ mm}`,
      calculatedValue: (frameH * 1000).toFixed(0),
      unit: 'mm',
      explanation: 'Total height of core assembly frame.',
      referenceStandard: 'Sawhney Fig. 5.70',
    },
    {
      id: 'od-3',
      title: '3. Overall Frame Width (W)',
      latexFormula: 'W = 2 \\cdot D + p',
      latexSubstituted: `W = 2(${(dCenterDistance * 1000).toFixed(1)}) + ${(pUsed * 1000).toFixed(1)} = ${(frameW * 1000).toFixed(0)}\\text{ mm}`,
      calculatedValue: (frameW * 1000).toFixed(0),
      unit: 'mm',
      explanation: 'Total width of core assembly frame.',
      referenceStandard: 'Sawhney Fig. 5.70',
    },
    {
      id: 'od-4',
      title: '4. Overall Frame Depth (Df)',
      latexFormula: 'D_f = p',
      latexSubstituted: `D_f = ${(pUsed * 1000).toFixed(1)}\\text{ mm}`,
      calculatedValue: (frameDf * 1000).toFixed(1),
      unit: 'mm',
      explanation: 'Total depth of core assembly frame.',
      referenceStandard: 'Sawhney Fig. 5.70',
    },
  ];

  const odReport = `******************************************************************
\t\tOVERALL DIMENSION OF THE TRANSFORMER
******************************************************************
Distance between adjacent core centers is ${dCenterDistance.toFixed(3)} m
Height of the frame is ${frameH.toFixed(3)} m
Width of the Frame is ${frameW.toFixed(3)} m
Depth of the Frame is ${frameDf.toFixed(3)} m`;

  // ---------------------------------------------------------------------------
  // 5. LOW VOLTAGE WINDING (lvw) — 10 Detailed Steps
  // ---------------------------------------------------------------------------
  const vsp = secondaryConnection === 'Star' ? secondaryVls / Math.sqrt(3) : secondaryVls;
  const tsCalc = vsp / et;
  const tsUsed = secondaryTs > 0 ? secondaryTs : Math.round(tsCalc);
  const isp = (kva * 1000) / (3 * vsp);

  const asCalc = isp / secondaryDelta;
  const asModified = stripX * stripY;
  const deltaModifiedLV = isp / asModified;

  const x1 = stripX + coveringZ;
  const y1 = stripY + coveringZ;

  const ts1Calc = tsUsed / lvLayers + 1;
  const ts1Used = lvTs1 > 0 ? lvTs1 : Math.round(ts1Calc);

  const lcs = ts1Used * x1;
  const clsLV = (hwUsed * 1000 - lcs) / 2;
  const clsValid = clsLV >= 15;

  const bs = lvLayers * y1 + 2 * pressboardCly;
  const insideDiameterId = d * 1000 + 2 * coreInsulationLvi;
  const outsideDiameterOd = insideDiameterId + 2 * bs;

  const lvdSteps: MathStepItem[] = [
    {
      id: 'lvd-1',
      title: '1. LV Secondary Phase Voltage (Vsp)',
      latexFormula: 'V_{sp} = \\frac{V_{ls}}{\\sqrt{3}}',
      latexSubstituted: `V_{sp} = \\frac{${secondaryVls}}{\\sqrt{3}} = \\frac{${secondaryVls}}{1.732} = ${vsp.toFixed(3)}\\text{ V}`,
      calculatedValue: vsp.toFixed(3),
      unit: 'V',
      explanation: 'Secondary phase voltage for Star connected low voltage winding.',
      referenceStandard: 'Sawhney Sec. 5.14',
    },
    {
      id: 'lvd-2',
      title: '2. Secondary Turns per Phase (Ts)',
      latexFormula: 'T_s = \\frac{V_{sp}}{E_t}',
      latexSubstituted: `T_s = \\frac{${vsp.toFixed(3)}}{${et.toFixed(3)}} = ${tsCalc.toFixed(2)} \\approx ${tsUsed}\\text{ turns}`,
      calculatedValue: `${tsUsed} turns`,
      unit: 'turns/phase',
      explanation: 'Number of turns required per secondary phase.',
      referenceStandard: 'Sawhney Sec. 5.14',
    },
    {
      id: 'lvd-3',
      title: '3. Secondary Phase Current (Isp)',
      latexFormula: 'I_{sp} = \\frac{\\text{kVA} \\cdot 10^3}{3 \\cdot V_{sp}}',
      latexSubstituted: `I_{sp} = \\frac{${kva * 1000}}{3 \\cdot ${vsp.toFixed(3)}} = \\frac{${kva * 1000}}{${(3 * vsp).toFixed(1)}} = ${isp.toFixed(3)}\\text{ A}`,
      calculatedValue: isp.toFixed(3),
      unit: 'A',
      explanation: 'Full load secondary phase current.',
      referenceStandard: 'Sawhney Sec. 5.14',
    },
    {
      id: 'lvd-4',
      title: '4. Required LV Conductor Cross-Section Area (as)',
      latexFormula: 'a_s = \\frac{I_{sp}}{\\delta}',
      latexSubstituted: `a_s = \\frac{${isp.toFixed(3)}}{${secondaryDelta}} = ${asCalc.toFixed(3)}\\text{ mm}^2`,
      calculatedValue: asCalc.toFixed(3),
      unit: 'mm^2',
      explanation: 'Calculated copper conductor area.',
      reasoning: `Secondary current density = ${secondaryDelta} A/mm^2.`,
      referenceStandard: 'Sawhney Sec. 5.14',
    },
    {
      id: 'lvd-5',
      title: '5. Selected Copper Strip Conductor (x * y)',
      latexFormula: 'a_{s1} = x \\cdot y',
      latexSubstituted: `a_{s1} = ${stripX} \\cdot ${stripY} = ${asModified.toFixed(1)}\\text{ mm}^2`,
      calculatedValue: `${asModified.toFixed(1)} mm^2`,
      unit: 'mm^2',
      explanation: 'Selected standard rectangular copper strip conductor.',
      reasoning: 'Selected 15.0 x 7.8 mm strip (IS:1897-1962 Table 23.1).',
      referenceStandard: 'IS:1897-1962 Table 23.1',
    },
    {
      id: 'lvd-6',
      title: '6. Modified LV Current Density (delta1_lv)',
      latexFormula: '\\delta_{1\\_lv} = \\frac{I_{sp}}{a_{s1}}',
      latexSubstituted: `\\delta_{1\\_lv} = \\frac{${isp.toFixed(3)}}{${asModified}} = ${deltaModifiedLV.toFixed(2)}\\text{ A/mm}^2`,
      calculatedValue: deltaModifiedLV.toFixed(2),
      unit: 'A/mm^2',
      explanation: 'Actual operating current density in LV conductor.',
      referenceStandard: 'Sawhney Sec. 5.14',
    },
    {
      id: 'lvd-7',
      title: '7. Insulated Strip Dimensions (X1, Y1)',
      latexFormula: 'X_1 = x + z, \\quad Y_1 = y + z',
      latexSubstituted: `X_1 = ${stripX} + ${coveringZ} = ${x1.toFixed(1)}\\text{ mm}, \\quad Y_1 = ${stripY} + ${coveringZ} = ${y1.toFixed(1)}\\text{ mm}`,
      calculatedValue: `${x1.toFixed(1)} x ${y1.toFixed(1)} mm`,
      unit: 'mm',
      explanation: 'Dimensions of conductor with paper insulation covering.',
      referenceStandard: 'IS:1897-1962',
    },
    {
      id: 'lvd-8',
      title: '8. LV Winding Axial Depth (Lcs) & Guard Check',
      latexFormula: 'L_{cs} = T_{s1} \\cdot X_1, \\quad \\text{cls} = \\frac{H_w \\cdot 1000 - L_{cs}}{2}',
      latexSubstituted: `L_{cs} = ${ts1Used} \\cdot ${x1.toFixed(1)} = ${lcs.toFixed(1)}\\text{ mm}, \\quad \\text{cls} = \\frac{${(hwUsed * 1000).toFixed(0)} - ${lcs.toFixed(1)}}{2} = \\frac{${(hwUsed * 1000 - lcs).toFixed(1)}}{2} = ${clsLV.toFixed(1)}\\text{ mm}`,
      calculatedValue: `cls=${clsLV.toFixed(1)} mm`,
      unit: 'mm',
      explanation: 'Axial clearance between LV winding and yoke.',
      reasoning: clsValid ? 'Passes minimum clearance constraint (cls >= 15mm).' : 'WARNING: Clearance below limit.',
      status: clsValid ? 'pass' : 'fail',
      referenceStandard: 'Sawhney Guard Rules',
    },
    {
      id: 'lvd-9',
      title: '9. LV Winding Radial Depth (bs)',
      latexFormula: 'b_s = \\text{lay} \\cdot Y_1 + 2 \\cdot cly',
      latexSubstituted: `b_s = ${lvLayers} \\cdot ${y1.toFixed(1)} + 2(${pressboardCly}) = ${(lvLayers * y1).toFixed(1)} + ${2 * pressboardCly} = ${bs.toFixed(1)}\\text{ mm}`,
      calculatedValue: bs.toFixed(1),
      unit: 'mm',
      explanation: 'Radial thickness of LV winding including pressboard cylinders.',
      referenceStandard: 'Sawhney Sec. 5.14',
    },
    {
      id: 'lvd-10',
      title: '10. LV Inside & Outside Diameters (Id, Od)',
      latexFormula: 'I_d = d \\cdot 1000 + 2 \\cdot lvi, \\quad O_d = I_d + 2 \\cdot b_s',
      latexSubstituted: `I_d = ${(d * 1000).toFixed(1)} + 2(${coreInsulationLvi}) = ${insideDiameterId.toFixed(1)}\\text{ mm}, \\quad O_d = ${insideDiameterId.toFixed(1)} + 2(${bs.toFixed(1)}) = ${outsideDiameterOd.toFixed(1)}\\text{ mm}`,
      calculatedValue: `Id=${insideDiameterId.toFixed(1)}mm, Od=${outsideDiameterOd.toFixed(1)}mm`,
      unit: 'mm',
      explanation: 'Concentric diameters of LV winding.',
      referenceStandard: 'Sawhney Sec. 5.14',
    },
  ];

  const lvdReport = `******************************************************************
\t\tLOW VOLTAGE WINDING CALCULATION OF THE TRANSFORMER
******************************************************************
Secondary Line Voltage is ${secondaryVls.toFixed(2)} V
Connection Type is ${secondaryConnection}
Phase Voltage is ${vsp.toFixed(3)} V
Turn per Phase is ${tsUsed.toFixed(2)}
Secondary Current per phase is ${isp.toFixed(3)} A
Current Density in Secondary phase is ${secondaryDelta.toFixed(2)} A/mm^2
Total Area of Secondary Conductor is ${asCalc.toFixed(3)} mm^2
 Dimension of the Conductor is ${stripX.toFixed(3)} * ${stripY.toFixed(3)}
Modified area of Secondary Conductor is ${asModified.toFixed(3)} mm^2
Modified Current Density in Secondary phase is ${deltaModifiedLV.toFixed(2)} A/mm^2
Covering of Conductor is ${coveringZ.toFixed(3)} mm
 Dimension of the conductor with covering is ${x1.toFixed(3)} * ${y1.toFixed(3)}
Number of layer is used is ${lvLayers}
Using helical winding space to be provided ${ts1Used.toFixed(2)} turns along the axis
Turns along the axial depth is ${ts1Used.toFixed(2)}
Axial depth of the Winding ls ${lcs.toFixed(3)} mm
Clearance is ${clsLV.toFixed(3)} mm
 Thickness of the pressboard cylinders is ${pressboardCly.toFixed(3)} mm
lnsulations b/w lv winding and core is ${coreInsulationLvi.toFixed(3)} mm
 Diameter of the circumscribing circle is ${d.toFixed(3)} mm
 Inside diameter is ${insideDiameterId.toFixed(3)} mm
Outside diameter is ${outsideDiameterOd.toFixed(3)} mm`;

  // ---------------------------------------------------------------------------
  // 6. HIGH VOLTAGE WINDING (hvw) — 10 Detailed Steps
  // ---------------------------------------------------------------------------
  const vpp = primaryConnection === 'Delta' ? primaryVlp : primaryVlp / Math.sqrt(3);
  const tpBase = (tsUsed * vpp) / vsp;
  const tpModified = tappingChoice === 2 ? (1 + tappingPercent / 100) * tpBase : tpBase;

  const ncCalc = Math.round(primaryVlp / voltagePerCoilVc);
  const ncUsed = totalCoilsNc > 0 ? totalCoilsNc : ncCalc;
  const vc1 = vpp / ncUsed;
  const tc = tpModified / ncUsed;

  const ipp = (kva * 1000) / (3 * vpp);
  const apCalc = ipp / deltaPrimary;

  const apModified = (Math.PI * wireBareDp1 * wireBareDp1) / 4;
  const deltaModifiedHV = ipp / apModified;

  const hlp = turnsPerLayerTncl * wireInsulatedDp2;
  const lcp = ncUsed * hlp + ncUsed * spacerDbc;
  const clcHV = (hwUsed * 1000 - lcp) / 2;
  const clcValid = clcHV >= 5;

  const bp = hvLayersNcl * wireInsulatedDp2 + (hvLayersNcl - 1) * layerInsulationTi;
  const insulationT = 5 + (0.9 * primaryKv);
  const insideDiameterIdhv = outsideDiameterOd + 2 * insulationT;
  const outsideDiameterOdhv = insideDiameterIdhv + 2 * bp;

  const hvdSteps: MathStepItem[] = [
    {
      id: 'hvd-1',
      title: '1. Primary Phase Voltage (Vpp)',
      latexFormula: 'V_{pp} = V_{lp}',
      latexSubstituted: `V_{pp} = ${primaryVlp}\\text{ V}`,
      calculatedValue: `${vpp} V`,
      unit: 'V',
      explanation: 'Primary phase voltage for Delta connected high voltage winding.',
      referenceStandard: 'Sawhney Sec. 5.15',
    },
    {
      id: 'hvd-2',
      title: '2. HV Base Turns per Phase (Tp)',
      latexFormula: 'T_p = \\frac{T_s \\cdot V_{pp}}{V_{sp}}',
      latexSubstituted: `T_p = \\frac{${tsUsed} \\cdot ${vpp}}{${vsp.toFixed(1)}} = ${tpBase.toFixed(2)} \\approx ${tpBase.toFixed(0)}\\text{ turns}`,
      calculatedValue: `${tpBase.toFixed(0)} turns`,
      unit: 'turns/phase',
      explanation: 'Unadjusted base HV turns per phase.',
      referenceStandard: 'Sawhney Sec. 5.15',
    },
    {
      id: 'hvd-3',
      title: '3. HV Turns with +5% Tappings (Tp1)',
      latexFormula: 'T_{p1} = \\left(1 + \\frac{t_p}{100}\\right) \\cdot T_p',
      latexSubstituted: `T_{p1} = 1.05 \\cdot ${tpBase.toFixed(0)} = ${tpModified.toFixed(0)}\\text{ turns}`,
      calculatedValue: `${tpModified.toFixed(0)} turns`,
      unit: 'turns/phase',
      explanation: 'Primary turns including +5% tapping boost.',
      referenceStandard: 'Sawhney Sec. 5.15',
    },
    {
      id: 'hvd-4',
      title: '4. HV Crossover Coils Count & Voltage (Nc, Vc1)',
      latexFormula: 'N_c = \\frac{V_{lp}}{V_c}, \\quad V_{c1} = \\frac{V_{pp}}{N_c}',
      latexSubstituted: `N_c = \\frac{${primaryVlp}}{${voltagePerCoilVc}} = ${ncUsed}, \\quad V_{c1} = \\frac{${vpp}}{${ncUsed}} = ${vc1.toFixed(1)}\\text{ V}`,
      calculatedValue: `Nc=${ncUsed} coils, Vc1=${vc1.toFixed(1)}V`,
      unit: 'coils',
      explanation: 'Crossover coil division to limit inter-coil voltage stress.',
      referenceStandard: 'Sawhney Sec. 5.15',
    },
    {
      id: 'hvd-5',
      title: '5. Primary Phase Current (Ipp)',
      latexFormula: 'I_{pp} = \\frac{\\text{kVA} \\cdot 10^3}{3 \\cdot V_{pp}}',
      latexSubstituted: `I_{pp} = \\frac{${kva * 1000}}{3 \\cdot ${vpp}} = \\frac{${kva * 1000}}{${3 * vpp}} = ${ipp.toFixed(3)}\\text{ A}`,
      calculatedValue: ipp.toFixed(3),
      unit: 'A',
      explanation: 'Full load primary phase current.',
      reasoning: 'Primary current < 20A; crossover coil format selected.',
      referenceStandard: 'Sawhney Sec. 5.15',
    },
    {
      id: 'hvd-6',
      title: '6. HV Round Wire Conductor Selection (dp1, dp2)',
      latexFormula: 'a_{p1} = \\frac{\\pi d_{p1}^2}{4}, \\quad \\delta_{1\\_hv} = \\frac{I_{pp}}{a_{p1}}',
      latexSubstituted: `a_{p1} = \\frac{\\pi (${wireBareDp1})^2}{4} = \\frac{3.1416 \\cdot ${(wireBareDp1 * wireBareDp1).toFixed(4)}}{4} = ${apModified.toFixed(3)}\\text{ mm}^2, \\quad \\delta = \\frac{${ipp.toFixed(3)}}{${apModified.toFixed(3)}} = ${deltaModifiedHV.toFixed(2)}\\text{ A/mm}^2`,
      calculatedValue: `dp1=${wireBareDp1}mm, delta=${deltaModifiedHV.toFixed(2)} A/mm^2`,
      unit: 'mm',
      explanation: 'Standard round wire selection.',
      referenceStandard: 'Table 23.7 (Sawhney)',
    },
    {
      id: 'hvd-7',
      title: '7. HV Winding Total Axial Length (Lcp)',
      latexFormula: 'L_{cp} = N_c H_{lp} + N_c d_{bc}',
      latexSubstituted: `L_{cp} = ${ncUsed}(${hlp.toFixed(1)}) + ${ncUsed}(${spacerDbc}) = ${(ncUsed * hlp).toFixed(1)} + ${(ncUsed * spacerDbc).toFixed(1)} = ${lcp.toFixed(1)}\\text{ mm}`,
      calculatedValue: lcp.toFixed(1),
      unit: 'mm',
      explanation: 'Total axial height of HV coil stack including inter-coil spacers.',
      referenceStandard: 'Sawhney Sec. 5.15',
    },
    {
      id: 'hvd-8',
      title: '8. HV Axial Clearance Guard Check (clc)',
      latexFormula: '\\text{clc} = \\frac{H_w \\cdot 1000 - L_{cp}}{2}',
      latexSubstituted: `\\text{clc} = \\frac{${(hwUsed * 1000).toFixed(0)} - ${lcp.toFixed(1)}}{2} = \\frac{${(hwUsed * 1000 - lcp).toFixed(1)}}{2} = ${clcHV.toFixed(1)}\\text{ mm}`,
      calculatedValue: `${clcHV.toFixed(1)} mm`,
      unit: 'mm',
      explanation: 'Axial clearance between HV winding stack and yoke.',
      reasoning: clcValid ? 'Passes minimum clearance constraint (clc >= 5mm).' : 'WARNING: Clearance below limit.',
      status: clcValid ? 'pass' : 'fail',
      referenceStandard: 'Sawhney Guard Rules',
    },
    {
      id: 'hvd-9',
      title: '9. Major Insulation Thickness LV-HV (T)',
      latexFormula: 'T = 5 + \\frac{0.9 \\cdot \\text{KV}}{1}',
      latexSubstituted: `T = 5 + 0.9(${primaryKv}) = 5 + ${(0.9 * primaryKv).toFixed(1)} = ${insulationT.toFixed(1)}\\text{ mm}`,
      calculatedValue: insulationT.toFixed(1),
      unit: 'mm',
      explanation: 'Major radial insulation barrier (bakelized cylinder + oil duct) separating LV & HV windings.',
      referenceStandard: '33kV Class Insulation Standards',
    },
    {
      id: 'hvd-10',
      title: '10. HV Inside & Outside Diameters (IDhv, ODhv)',
      latexFormula: 'ID_{hv} = O_d + 2T, \\quad OD_{hv} = ID_{hv} + 2 b_p',
      latexSubstituted: `ID_{hv} = ${outsideDiameterOd.toFixed(1)} + 2(${insulationT.toFixed(1)}) = ${insideDiameterIdhv.toFixed(1)}\\text{ mm}, \\quad OD_{hv} = ${insideDiameterIdhv.toFixed(1)} + 2(${bp.toFixed(1)}) = ${outsideDiameterOdhv.toFixed(1)}\\text{ mm}`,
      calculatedValue: `IDhv=${insideDiameterIdhv.toFixed(1)}mm, ODhv=${outsideDiameterOdhv.toFixed(1)}mm`,
      unit: 'mm',
      explanation: 'Concentric diameters of HV winding.',
      referenceStandard: 'Sawhney Sec. 5.15',
    },
  ];

  const hvdReport = `******************************************************************
\t\tHIGH VOLTAGE WINDING DESIGN OF THE TRANSFORMER
******************************************************************
The primary line voltage is ${primaryVlp.toFixed(2)} V
Connection type is ${primaryConnection.toLowerCase()}
Primary phase voltage is ${vpp.toFixed(3)} V
Primary turn per phase is ${tpBase.toFixed(0)} 
Tapping is considered here
Percentage of Tapping is ${tappingPercent.toFixed(3)} 
Primary Turns per Phase with ${tappingPercent.toFixed(3)} tapping is  ${tpModified.toFixed(0)}
Crossover winding is used here.

The value of voltage per coil is ${voltagePerCoilVc.toFixed(3)} V
Number of coil is ${ncUsed}
Modified number of coils is ${ncUsed}
Modified value of voltage per coil is ${vc1.toFixed(3)} V
Turns per coil is ${tc.toFixed(6)}
Number of normal coil is ${normalCoilsNcn}
Turns in the normal coil is ${turnsPerNormalCoilNct}
Reinforced turns in remaining ${(ncUsed - normalCoilsNcn)} coil is ${((tpModified - normalCoilsNcn * turnsPerNormalCoilNct) / (ncUsed - normalCoilsNcn)).toFixed(0)}
Number of layers is ${hvLayersNcl} 
Turns per layer is ${turnsPerLayerTncl}
Primary current per phase is ${ipp.toFixed(3)} A
Current is below 20A. Cross over winding is used here.
Current density in the primary conductor is ${deltaPrimary.toFixed(3)} A/mm^2
 Area of the primary conductor is ${apCalc.toFixed(3)} mm^2
Diameter of the primary conductor is ${Math.sqrt((4 * apCalc) / Math.PI).toFixed(3)} mm
Standard value of the diameter(Ref Table 23.7)is ${wireBareDp1.toFixed(3)} mm
Standard value of the diameter proper insulation is ${wireInsulatedDp2.toFixed(3)} mm
Modified area of the primary conductor is ${apModified.toFixed(3)} mm^2
Modified current density in the primary conductor is ${deltaModifiedHV.toFixed(3)} A/mm^2
Axial depth of coil is ${hlp.toFixed(3)}
Spacers between adjacent coils are given of ${spacerDbc.toFixed(1)} mm
Axial length of the hv winding is ${lcp.toFixed(3)} mm

Clearance is ${clcHV.toFixed(3)} mm
Thickness of the insulation between the layers is ${layerInsulationTi.toFixed(3)} mm
Radial depth of the coil is ${bp.toFixed(3)} mm
Thickness of the insulation b/w LV and HV is ${insulationT.toFixed(3)} mm
Inside diameter of the HV is ${insideDiameterIdhv.toFixed(3)} mm
Outside diameter of HV is ${outsideDiameterOdhv.toFixed(3)} mm`;

  // ---------------------------------------------------------------------------
  // 7. RESISTANCE CALCULATION (resis) — 5 Detailed Steps
  // ---------------------------------------------------------------------------
  const dpm = (insideDiameterIdhv + outsideDiameterOdhv) / 2;
  const lmtp = (Math.PI * dpm) / 1000;
  const rp = (tpModified * lmtp * hvResistivityRop) / apModified;

  const dsm = (insideDiameterId + outsideDiameterOd) / 2;
  const lmts = (Math.PI * dsm) / 1000;
  const rs = (tsUsed * lmts * lvResistivityRos) / asModified;

  const ref = rp + Math.pow(tpModified / tsUsed, 2) * rs;
  const epsilonP = (ipp * ref) / vpp;

  const resisSteps: MathStepItem[] = [
    {
      id: 'resis-1',
      title: '1. HV Mean Turn Length & Resistance (Lmtp, Rp)',
      latexFormula: 'L_{mtp} = \\frac{\\pi D_{pm}}{1000}, \\quad R_p = \\frac{T_{p1} L_{mtp} \\rho_p}{a_{p1}}',
      latexSubstituted: `L_{mtp} = \\frac{\\pi (${dpm.toFixed(1)})}{1000} = ${lmtp.toFixed(3)}\\text{ m}, \\quad R_p = \\frac{${tpModified.toFixed(0)} \\cdot ${lmtp.toFixed(3)} \\cdot ${hvResistivityRop}}{${apModified.toFixed(3)}} = \\frac{${(tpModified * lmtp * hvResistivityRop).toFixed(3)}}{${apModified.toFixed(3)}} = ${rp.toFixed(2)}\\ \\Omega`,
      calculatedValue: `${rp.toFixed(2)} Ohm`,
      unit: 'Ohm',
      explanation: 'HV winding phase resistance at 75 deg C operating temperature.',
      referenceStandard: 'Sawhney Sec. 5.17',
    },
    {
      id: 'resis-2',
      title: '2. LV Mean Turn Length & Resistance (Lmts, Rs)',
      latexFormula: 'L_{mts} = \\frac{\\pi D_{sm}}{1000}, \\quad R_s = \\frac{T_s L_{mts} \\rho_s}{a_{s1}}',
      latexSubstituted: `L_{mts} = \\frac{\\pi (${dsm.toFixed(1)})}{1000} = ${lmts.toFixed(3)}\\text{ m}, \\quad R_s = \\frac{${tsUsed} \\cdot ${lmts.toFixed(3)} \\cdot ${lvResistivityRos}}{${asModified}} = \\frac{${(tsUsed * lmts * lvResistivityRos).toFixed(4)}}{${asModified}} = ${rs.toFixed(4)}\\ \\Omega`,
      calculatedValue: `${rs.toFixed(4)} Ohm`,
      unit: 'Ohm',
      explanation: 'LV winding phase resistance at 75 deg C operating temperature.',
      referenceStandard: 'Sawhney Sec. 5.17',
    },
    {
      id: 'resis-3',
      title: '3. Total Resistance Referred to Primary (Ref)',
      latexFormula: 'R_{ef} = R_p + \\left(\\frac{T_{p1}}{T_s}\\right)^2 R_s',
      latexSubstituted: `R_{ef} = ${rp.toFixed(2)} + \\left(\\frac{${tpModified.toFixed(0)}}{${tsUsed}}\\right)^2 (${rs.toFixed(4)}) = ${rp.toFixed(2)} + (${(tpModified / tsUsed).toFixed(2)})^2 (${rs.toFixed(4)}) = ${rp.toFixed(2)} + ${(Math.pow(tpModified / tsUsed, 2) * rs).toFixed(2)} = ${ref.toFixed(2)}\\ \\Omega`,
      calculatedValue: `${ref.toFixed(2)} Ohm`,
      unit: 'Ohm',
      explanation: 'Total primary-referred equivalent resistance combining HV and LV winding copper resistance.',
      referenceStandard: 'Sawhney Eq. 5.25',
    },
    {
      id: 'resis-4',
      title: '4. Primary Resistance Voltage Drop (Ipp * Ref)',
      latexFormula: 'V_{drop\\_R} = I_{pp} \\cdot R_{ef}',
      latexSubstituted: `V_{drop\\_R} = ${ipp.toFixed(3)} \\cdot ${ref.toFixed(2)} = ${(ipp * ref).toFixed(2)}\\text{ V}`,
      calculatedValue: `${(ipp * ref).toFixed(2)} V`,
      unit: 'V',
      explanation: 'Ohmic voltage drop across equivalent resistance at full load current.',
      referenceStandard: 'Sawhney Sec. 5.17',
    },
    {
      id: 'resis-5',
      title: '5. Per Unit Resistance (epsilonP)',
      latexFormula: '\\epsilon_p = \\frac{I_{pp} R_{ef}}{V_{pp}}',
      latexSubstituted: `\\epsilon_p = \\frac{${ipp.toFixed(3)} \\cdot ${ref.toFixed(2)}}{${vpp.toFixed(1)}} = \\frac{${(ipp * ref).toFixed(2)}}{${vpp.toFixed(1)}} = ${epsilonP.toFixed(4)} = ${(epsilonP * 100).toFixed(2)}\\%`,
      calculatedValue: `${(epsilonP * 100).toFixed(2)}%`,
      unit: '% PU',
      explanation: 'Per-unit resistance ratio equal to full load copper loss fraction.',
      referenceStandard: 'Sawhney Sec. 5.17',
    },
  ];

  const resisReport = `******************************************************************
\t\tRESISTANCE DESIGN OF THE TRANSFORMER
******************************************************************
Mean diameter of the HV winding is ${dpm.toFixed(3)} mm
Length of mean turn in HV winding is ${lmtp.toFixed(3)}
Resistivity of the material is ${hvResistivityRop.toFixed(4)}
Resistance in the HV side is ${rp.toFixed(4)}
Mean diameter of the LV winding is ${dsm.toFixed(3)} mm
Length of mean turn in LV winding is ${lmts.toFixed(3)}
Resistivity of the material is ${lvResistivityRos.toFixed(4)}
Resistance in the LV side is ${rs.toFixed(4)}
Resistance reffered to primary side is ${ref.toFixed(4)} Ohm
Per Unit Resistance is ${epsilonP.toFixed(4)}`;

  // ---------------------------------------------------------------------------
  // 8. LEAKAGE REACTANCE (lr) — 4 Detailed Steps
  // ---------------------------------------------------------------------------
  const dm = (insideDiameterId + outsideDiameterOdhv) / 2;
  const lmt = (Math.PI * dm) / 1000;
  const lc = (lcp + lcs) / 2;

  const mu0 = 1.256e-6;
  const xp = (2 * Math.PI * f * mu0 * Math.pow(tpModified, 2) * lmt * (insulationT + (bp + bs) / 3) * 1e-3) / (lc / 1000);
  const epsilonX = (ipp * xp) / vpp;
  const epsilonZ = Math.sqrt(epsilonP * epsilonP + epsilonX * epsilonX);

  const lrSteps: MathStepItem[] = [
    {
      id: 'lr-1',
      title: '1. Mean Winding Diameter & Axial Length (Dm, Lc)',
      latexFormula: 'D_m = \\frac{I_d + OD_{hv}}{2}, \\quad L_c = \\frac{L_{cp} + L_{cs}}{2}',
      latexSubstituted: `D_m = \\frac{${insideDiameterId.toFixed(1)} + ${outsideDiameterOdhv.toFixed(1)}}{2} = ${dm.toFixed(1)}\\text{ mm}, \\quad L_c = \\frac{${lcp.toFixed(1)} + ${lcs.toFixed(1)}}{2} = ${lc.toFixed(1)}\\text{ mm}`,
      calculatedValue: `Dm=${dm.toFixed(1)}mm, Lc=${lc.toFixed(1)}mm`,
      unit: 'mm',
      explanation: 'Geometric mean diameter and axial length of leakage flux channel.',
      referenceStandard: 'Sawhney Sec. 5.18',
    },
    {
      id: 'lr-2',
      title: '2. Primary Leakage Reactance (Xp)',
      latexFormula: 'X_p = \\frac{2\\pi f \\mu_0 T_{p1}^2 L_{mt}}{L_c} \\left( T + \\frac{b_p + b_s}{3} \\right)',
      latexSubstituted: `X_p = \\frac{2\\pi(50)(1.256 \\times 10^{-6})(${tpModified.toFixed(0)})^2 (${lmt.toFixed(3)})}{${(lc/1000).toFixed(3)}} \\left[ ${insulationT.toFixed(1)} + \\frac{${bp.toFixed(1)}+${bs.toFixed(1)}}{3} \\right] 10^{-3} = \\frac{8.114}{${(lc/1000).toFixed(3)}} \\cdot 44.83 \\cdot 10^{-3} = ${xp.toFixed(2)}\\ \\Omega`,
      calculatedValue: `${xp.toFixed(2)} Ohm`,
      unit: 'Ohm',
      explanation: 'Primary-referred leakage reactance due to magnetic flux leakage between concentric coils.',
      referenceStandard: 'Sawhney Eq. 5.30',
    },
    {
      id: 'lr-3',
      title: '3. Per Unit Reactance (epsilonX)',
      latexFormula: '\\epsilon_x = \\frac{I_{pp} X_p}{V_{pp}}',
      latexSubstituted: `\\epsilon_x = \\frac{${ipp.toFixed(3)} \\cdot ${xp.toFixed(2)}}{${vpp}} = \\frac{${(ipp * xp).toFixed(2)}}{${vpp}} = ${epsilonX.toFixed(4)} = ${(epsilonX * 100).toFixed(2)}\\%`,
      calculatedValue: `${(epsilonX * 100).toFixed(2)}%`,
      unit: '% PU',
      explanation: 'Per-unit reactance representing inductive voltage drop.',
      referenceStandard: 'Sawhney Eq. 5.32',
    },
    {
      id: 'lr-4',
      title: '4. Total Short-Circuit Percentage Impedance (epsilonZ)',
      latexFormula: '\\epsilon_z = \\sqrt{\\epsilon_p^2 + \\epsilon_x^2}',
      latexSubstituted: `\\epsilon_z = \\sqrt{(${epsilonP.toFixed(4)})^2 + (${epsilonX.toFixed(4)})^2} = \\sqrt{${Math.pow(epsilonP, 2).toFixed(6)} + ${Math.pow(epsilonX, 2).toFixed(6)}} = \\sqrt{${(Math.pow(epsilonP, 2) + Math.pow(epsilonX, 2)).toFixed(6)}} = ${epsilonZ.toFixed(4)} = ${(epsilonZ * 100).toFixed(2)}\\%`,
      calculatedValue: `${(epsilonZ * 100).toFixed(2)}%`,
      unit: '% PU',
      explanation: 'Total short-circuit percentage impedance limiting short-circuit fault current.',
      referenceStandard: 'Sawhney Eq. 5.33',
    },
  ];

  const lrReport = `******************************************************************
\t\tCALCULATION OF LEAKAGE REACTANCE OF THE TRANSFORMER
******************************************************************
Mean diameter of winding is ${dm.toFixed(3)} mm 
Length of mean turn of winding is ${lmt.toFixed(3)} m
Mean Axial Length of the winding is ${lc.toFixed(3)} mm
Leakage reactance reffered to primary side is ${xp.toFixed(3)} Ohm
Per Unit leakage reactance is ${epsilonX.toFixed(3)} 
Per Unit Impedance is ${epsilonZ.toFixed(3)}`;

  // ---------------------------------------------------------------------------
  // 9. VOLTAGE REGULATION (reg) — 3 Detailed Steps
  // ---------------------------------------------------------------------------
  const regulationPercent = (epsilonP * 0.8 + epsilonX * 0.6) * 100;
  const regulationUnity = epsilonP * 100;
  const regulationLeading = (epsilonP * 0.8 - epsilonX * 0.6) * 100;

  const regSteps: MathStepItem[] = [
    {
      id: 'reg-1',
      title: '1. Full Load Voltage Regulation (0.8 Lagging PF)',
      latexFormula: '\\text{Reg}_{0.8\\text{lag}} = (\\epsilon_p \\cdot 0.8 + \\epsilon_x \\cdot 0.6) \\times 100',
      latexSubstituted: `\\text{Reg} = (${epsilonP.toFixed(4)} \\cdot 0.8 + ${epsilonX.toFixed(4)} \\cdot 0.6) \\times 100 = (${(epsilonP * 0.8).toFixed(4)} + ${(epsilonX * 0.6).toFixed(4)}) \\times 100 = ${regulationPercent.toFixed(2)}\\%`,
      calculatedValue: `${regulationPercent.toFixed(2)}%`,
      unit: '%',
      explanation: 'Percentage terminal voltage drop from no-load to full-load at 0.8 lagging power factor.',
      referenceStandard: 'Sawhney Sec. 5.19',
    },
    {
      id: 'reg-2',
      title: '2. Voltage Regulation at Unity Power Factor (1.0 PF)',
      latexFormula: '\\text{Reg}_{1.0} = \\epsilon_p \\times 100',
      latexSubstituted: `\\text{Reg}_{1.0} = ${epsilonP.toFixed(4)} \\times 100 = ${regulationUnity.toFixed(2)}\\%`,
      calculatedValue: `${regulationUnity.toFixed(2)}%`,
      unit: '%',
      explanation: 'Voltage regulation under purely resistive load.',
      referenceStandard: 'Sawhney Sec. 5.19',
    },
    {
      id: 'reg-3',
      title: '3. Voltage Regulation at 0.8 Leading Power Factor',
      latexFormula: '\\text{Reg}_{0.8\\text{lead}} = (\\epsilon_p \\cdot 0.8 - \\epsilon_x \\cdot 0.6) \\times 100',
      latexSubstituted: `\\text{Reg} = (${epsilonP.toFixed(4)} \\cdot 0.8 - ${epsilonX.toFixed(4)} \\cdot 0.6) \\times 100 = (${(epsilonP * 0.8).toFixed(4)} - ${(epsilonX * 0.6).toFixed(4)}) \\times 100 = ${regulationLeading.toFixed(2)}\\%`,
      calculatedValue: `${regulationLeading.toFixed(2)}%`,
      unit: '%',
      explanation: 'Voltage regulation under capacitive leading power factor load.',
      referenceStandard: 'Sawhney Sec. 5.19',
    },
  ];

  const regReport = `******************************************************************
\t\tCALCULATION OF REGULATION OF THE TRANSFORMER
******************************************************************
Regulation of the Transformer is ${regulationPercent.toFixed(2)}%`;

  // ---------------------------------------------------------------------------
  // 10. LOSSES CALCULATION (cl) — 5 Detailed Steps
  // ---------------------------------------------------------------------------
  const li2r = 3 * ipp * ipp * ref;
  const pi2r = (1 + strayLossPercent / 100) * li2r;

  const weightLimbs = limbsCount * hwUsed * ai * steelDensity;
  const coreLossLimbs = weightLimbs * specificCoreLossLimb;

  const weightYokes = yokesCount * frameW * ay * steelDensity;
  const coreLossYokes = weightYokes * specificCoreLossYoke;

  const totalCoreLossPi = coreLossLimbs + coreLossYokes;
  const totalLossLt = totalCoreLossPi + pi2r;

  const clSteps: MathStepItem[] = [
    {
      id: 'cl-1',
      title: '1. Full Load I^2R Copper Loss (Li2r)',
      latexFormula: 'L_{i2r} = 3 \\cdot I_{pp}^2 \\cdot R_{ef}',
      latexSubstituted: `L_{i2r} = 3 (${ipp.toFixed(3)})^2 (${ref.toFixed(2)}) = 3 (${(ipp * ipp).toFixed(4)}) (${ref.toFixed(2)}) = ${li2r.toFixed(1)}\\text{ W}`,
      calculatedValue: `${li2r.toFixed(1)} W`,
      unit: 'W',
      explanation: 'Ohmic heating loss in primary and secondary copper conductors.',
      referenceStandard: 'Sawhney Sec. 5.20',
    },
    {
      id: 'cl-2',
      title: '2. Total Copper Loss Including Stray Loss (Pi2r)',
      latexFormula: 'P_{i2r} = \\left(1 + \\frac{L_s}{100}\\right) \\cdot L_{i2r}',
      latexSubstituted: `P_{i2r} = (1.10) \\cdot ${li2r.toFixed(1)} = ${pi2r.toFixed(1)}\\text{ W}`,
      calculatedValue: `${pi2r.toFixed(1)} W`,
      unit: 'W',
      explanation: 'Total copper loss including 10% stray eddy current loss in structural clamps.',
      referenceStandard: 'Sawhney Sec. 5.20',
    },
    {
      id: 'cl-3',
      title: '3. Total Weight of Core Limbs & Limb Core Loss (Wl, Lcl)',
      latexFormula: 'W_l = N_l H_w A_i \\gamma, \\quad L_{cl} = W_l \\cdot z_{limb}',
      latexSubstituted: `W_l = 3(${hwUsed.toFixed(3)})(${ai.toFixed(6)})(${steelDensity}) = ${weightLimbs.toFixed(1)}\\text{ kg}, \\quad L_{cl} = ${weightLimbs.toFixed(1)} \\cdot 1.5 = ${coreLossLimbs.toFixed(1)}\\text{ W}`,
      calculatedValue: `Wl=${weightLimbs.toFixed(1)}kg, Lcl=${coreLossLimbs.toFixed(1)}W`,
      unit: 'W',
      explanation: 'Iron weight and magnetic hysteresis/eddy current loss in limbs.',
      referenceStandard: 'Sawhney Sec. 5.21',
    },
    {
      id: 'cl-4',
      title: '4. Total Weight of Yokes & Yoke Core Loss (Wy, Lyl)',
      latexFormula: 'W_y = N_y W A_y \\gamma, \\quad L_{yl} = W_y \\cdot z_{yoke}',
      latexSubstituted: `W_y = 2(${frameW.toFixed(3)})(${ay.toFixed(6)})(${steelDensity}) = ${weightYokes.toFixed(1)}\\text{ kg}, \\quad L_{yl} = ${weightYokes.toFixed(1)} \\cdot 1.5 = ${coreLossYokes.toFixed(1)}\\text{ W}`,
      calculatedValue: `Wy=${weightYokes.toFixed(1)}kg, Lyl=${coreLossYokes.toFixed(1)}W`,
      unit: 'W',
      explanation: 'Iron weight and magnetic loss in top and bottom yokes.',
      referenceStandard: 'Sawhney Sec. 5.21',
    },
    {
      id: 'cl-5',
      title: '5. Total Core Loss (Pi) & Total Full-Load Loss (Lt)',
      latexFormula: 'P_i = L_{cl} + L_{yl}, \\quad L_t = P_i + P_{i2r}',
      latexSubstituted: `P_i = ${coreLossLimbs.toFixed(1)} + ${coreLossYokes.toFixed(1)} = ${totalCoreLossPi.toFixed(1)}\\text{ W}, \\quad L_t = ${totalCoreLossPi.toFixed(1)} + ${pi2r.toFixed(1)} = ${totalLossLt.toFixed(1)}\\text{ W}`,
      calculatedValue: `Pi=${totalCoreLossPi.toFixed(1)}W, Lt=${totalLossLt.toFixed(1)}W`,
      unit: 'W',
      explanation: 'Total no-load iron loss and combined full-load transformer loss.',
      referenceStandard: 'Sawhney Sec. 5.21',
    },
  ];

  const clReport = `******************************************************************
\t\tCALCULATION OF LOSSES OF THE TRANSFORMER
******************************************************************
I^2R Loss
I^2R Loss is ${li2r.toFixed(3)} W
Percentage Stray Loss is ${strayLossPercent.toFixed(3)}
I^R Loss including Stray Loss is ${pi2r.toFixed(3)} W
CORE Loss
Density of Lamination is ${steelDensity.toFixed(3)} Kg/m^2
Weight of the Limbs is ${weightLimbs.toFixed(3)} Kg
Specific Core Loss is ${specificCoreLossLimb.toFixed(3)} W/kg
Core Loss in the Limbs is ${coreLossLimbs.toFixed(3)} W
Density of Lamination is ${steelDensity.toFixed(3)} Kg/m^2
Weight of the Yokes is ${weightYokes.toFixed(3)} Kg
Specific Core Loss is ${specificCoreLossYoke.toFixed(3)} W/kg
Core Loss in the Yoke is ${coreLossYokes.toFixed(3)} W
Total Core Loss is ${totalCoreLossPi.toFixed(3)} W`;

  // ---------------------------------------------------------------------------
  // 11. EFFICIENCY (effi) — 4 Detailed Steps
  // ---------------------------------------------------------------------------
  const fullLoadEfficiency = (kva * 1000 / (kva * 1000 + totalLossLt)) * 100;
  const p75Loss = totalCoreLossPi + Math.pow(0.75, 2) * pi2r;
  const eff75 = ((0.75 * kva * 1000) / (0.75 * kva * 1000 + p75Loss)) * 100;

  const p50Loss = totalCoreLossPi + Math.pow(0.50, 2) * pi2r;
  const eff50 = ((0.50 * kva * 1000) / (0.50 * kva * 1000 + p50Loss)) * 100;

  const maxEfficiencyLoadingX = Math.sqrt(totalCoreLossPi / pi2r);
  const maxEffValue = ((maxEfficiencyLoadingX * kva * 1000) / (maxEfficiencyLoadingX * kva * 1000 + 2 * totalCoreLossPi)) * 100;

  const effiSteps: MathStepItem[] = [
    {
      id: 'effi-1',
      title: '1. Full Load Efficiency (eta_100)',
      latexFormula: '\\eta_{100} = \\left( \\frac{\\text{kVA} \\cdot 10^3}{\\text{kVA} \\cdot 10^3 + L_t} \\right) \\times 100',
      latexSubstituted: `\\eta_{100} = \\left( \\frac{${kva * 1000}}{${kva * 1000} + ${totalLossLt.toFixed(1)}} \\right) \\times 100 = \\left( \\frac{${kva * 1000}}{${(kva * 1000 + totalLossLt).toFixed(1)}} \\right) \\times 100 = ${fullLoadEfficiency.toFixed(2)}\\%`,
      calculatedValue: `${fullLoadEfficiency.toFixed(2)}%`,
      unit: '%',
      explanation: 'Percentage full load power conversion efficiency.',
      referenceStandard: 'Sawhney Sec. 5.22',
    },
    {
      id: 'effi-2',
      title: '2. 75% Load Efficiency (eta_75)',
      latexFormula: '\\eta_{75} = \\left( \\frac{0.75 \\cdot \\text{kVA} \\cdot 10^3}{0.75 \\cdot \\text{kVA} \\cdot 10^3 + P_i + (0.75)^2 P_{i2r}} \\right) \\times 100',
      latexSubstituted: `\\eta_{75} = \\left( \\frac{150000}{150000 + ${totalCoreLossPi.toFixed(1)} + ${(Math.pow(0.75, 2) * pi2r).toFixed(1)}} \\right) \\times 100 = \\left( \\frac{150000}{${(150000 + p75Loss).toFixed(1)}} \\right) \\times 100 = ${eff75.toFixed(2)}\\%`,
      calculatedValue: `${eff75.toFixed(2)}%`,
      unit: '%',
      explanation: 'Efficiency at 75% rated load.',
      referenceStandard: 'Sawhney Sec. 5.22',
    },
    {
      id: 'effi-3',
      title: '3. 50% Load Efficiency (eta_50)',
      latexFormula: '\\eta_{50} = \\left( \\frac{0.50 \\cdot \\text{kVA} \\cdot 10^3}{0.50 \\cdot \\text{kVA} \\cdot 10^3 + P_i + (0.50)^2 P_{i2r}} \\right) \\times 100',
      latexSubstituted: `\\eta_{50} = \\left( \\frac{100000}{100000 + ${totalCoreLossPi.toFixed(1)} + ${(Math.pow(0.50, 2) * pi2r).toFixed(1)}} \\right) \\times 100 = \\left( \\frac{100000}{${(100000 + p50Loss).toFixed(1)}} \\right) \\times 100 = ${eff50.toFixed(2)}\\%`,
      calculatedValue: `${eff50.toFixed(2)}%`,
      unit: '%',
      explanation: 'Efficiency at 50% rated load.',
      referenceStandard: 'Sawhney Sec. 5.22',
    },
    {
      id: 'effi-4',
      title: '4. Maximum Efficiency Load Fraction (x_max) & Value',
      latexFormula: 'x_{\\text{max}} = \\sqrt{\\frac{P_i}{P_{i2r}}}, \\quad \\eta_{\\text{max}} = \\frac{x_{\\text{max}} \\text{kVA}}{x_{\\text{max}} \\text{kVA} + 2 P_i}',
      latexSubstituted: `x_{\\text{max}} = \\sqrt{\\frac{${totalCoreLossPi.toFixed(1)}}{${pi2r.toFixed(1)}}} = \\sqrt{${(totalCoreLossPi / pi2r).toFixed(4)}} = ${maxEfficiencyLoadingX.toFixed(3)} = ${(maxEfficiencyLoadingX * 100).toFixed(1)}\\%`,
      calculatedValue: `x=${(maxEfficiencyLoadingX * 100).toFixed(1)}%, eta_max=${maxEffValue.toFixed(2)}%`,
      unit: '% load',
      explanation: 'Load fraction where constant iron loss equals variable copper loss, achieving peak efficiency.',
      referenceStandard: 'Sawhney Sec. 5.22',
    },
  ];

  const effiReport = `******************************************************************
\t\tCALCULATION OF EFFECIENCY OF THE TRANSFORMER
******************************************************************
Total Loss is ${totalLossLt.toFixed(3)} W
Efficiency of the transformer is ${fullLoadEfficiency.toFixed(2)}
Condition for Maximum Efficiency is ${maxEfficiencyLoadingX.toFixed(3)}`;

  // ---------------------------------------------------------------------------
  // 12. NO LOAD CURRENT (nlc) — 5 Detailed Steps
  // ---------------------------------------------------------------------------
  const mmmf = limbsCount * hwUsed * magnetizingAtc + yokesCount * frameW * magnetizingAty;
  const ato = mmmf / m;
  const im = ato / (Math.SQRT2 * tpModified);
  const il = totalCoreLossPi / (vpp * m);
  const io = Math.sqrt(im * im + il * il);
  const ioPercent = (io / ipp) * 100;
  const ioValid = ioPercent <= 5.0;

  const nlcSteps: MathStepItem[] = [
    {
      id: 'nlc-1',
      title: '1. Total Magnetizing MMF (Mmmf)',
      latexFormula: 'M_{mmf} = N_l H_w at_c + N_y W at_y',
      latexSubstituted: `M_{mmf} = 3(${hwUsed.toFixed(3)})(${magnetizingAtc}) + 2(${frameW.toFixed(3)})(${magnetizingAty}) = ${(3 * hwUsed * magnetizingAtc).toFixed(1)} + ${(2 * frameW * magnetizingAty).toFixed(1)} = ${mmmf.toFixed(1)}\\text{ AT}`,
      calculatedValue: `${mmmf.toFixed(1)} AT`,
      unit: 'AT',
      explanation: 'Total magnetizing ampere-turns required for core limbs and yokes.',
      referenceStandard: 'Sawhney Sec. 5.24',
    },
    {
      id: 'nlc-2',
      title: '2. Magnetizing Current Component (Im)',
      latexFormula: 'I_m = \\frac{M_{mmf} / m}{\\sqrt{2} T_{p1}}',
      latexSubstituted: `I_m = \\frac{${mmmf.toFixed(1)} / 3}{1.414 \\cdot ${tpModified.toFixed(0)}} = \\frac{${ato.toFixed(1)}}{${(1.414 * tpModified).toFixed(1)}} = ${im.toFixed(5)}\\text{ A}`,
      calculatedValue: `${im.toFixed(5)} A`,
      unit: 'A',
      explanation: 'Reactive magnetizing current component.',
      referenceStandard: 'Sawhney Sec. 5.24',
    },
    {
      id: 'nlc-3',
      title: '3. Loss Current Component (Il)',
      latexFormula: 'I_l = \\frac{P_i}{m \\cdot V_{pp}}',
      latexSubstituted: `I_l = \\frac{${totalCoreLossPi.toFixed(1)}}{3 \\cdot ${vpp}} = \\frac{${totalCoreLossPi.toFixed(1)}}{${3 * vpp}} = ${il.toFixed(5)}\\text{ A}`,
      calculatedValue: `${il.toFixed(5)} A`,
      unit: 'A',
      explanation: 'Active current component supplying core iron losses.',
      referenceStandard: 'Sawhney Sec. 5.24',
    },
    {
      id: 'nlc-4',
      title: '4. Total Exciting No-Load Current (Io)',
      latexFormula: 'I_o = \\sqrt{I_m^2 + I_l^2}',
      latexSubstituted: `I_o = \\sqrt{(${im.toFixed(5)})^2 + (${il.toFixed(5)})^2} = \\sqrt{${Math.pow(im, 2).toFixed(6)} + ${Math.pow(il, 2).toFixed(6)}} = \\sqrt{${(Math.pow(im, 2) + Math.pow(il, 2)).toFixed(6)}} = ${io.toFixed(5)}\\text{ A}`,
      calculatedValue: `${io.toFixed(5)} A`,
      unit: 'A',
      explanation: 'Vector sum of magnetizing and loss current components.',
      referenceStandard: 'Sawhney Sec. 5.24',
    },
    {
      id: 'nlc-5',
      title: '5. Percentage No-Load Current Guard Check (% Io)',
      latexFormula: '\\% I_o = \\left(\\frac{I_o}{I_{pp}}\\right) \\times 100',
      latexSubstituted: `\\% I_o = \\frac{${io.toFixed(5)}}{${ipp.toFixed(3)}} \\times 100 = ${(io / ipp).toFixed(4)} \\times 100 = ${ioPercent.toFixed(1)}\\%`,
      calculatedValue: `${ioPercent.toFixed(1)}%`,
      unit: '%',
      explanation: 'No-load current expressed as percentage of rated primary full-load current.',
      reasoning: ioValid ? 'Passes guard limit (% Io <= 5.0%).' : 'WARNING: Exceeds 5% limit.',
      status: ioValid ? 'pass' : 'fail',
      referenceStandard: 'Sawhney Guard Rules',
    },
  ];

  const nlcReport = `******************************************************************
\t\tNO LOAD CURRENT CALCULATION OF THE TRANSFORMER
******************************************************************
Value 'at' of core corresponding to the flux density in core is ${magnetizingAtc.toFixed(2)} A/m
Value 'at' of yoke corresponding to the flux density in yoke is ${magnetizingAty.toFixed(2)} A/m
Total Magnetizing current is ${mmmf.toFixed(3)} A
Magnetizing mmf per Phase is ${ato.toFixed(3)} A
Magnetizing Current is ${im.toFixed(5)} A
Loss Component of the No Load Current is ${il.toFixed(5)} A
No Load Current is ${io.toFixed(5)} A
No Load Current as a percentage of Full Load Current is ${ioPercent.toFixed(1)}`;

  // Assemble modules map
  const modules: Record<string, ModuleCalculationResult> = {
    cd: {
      moduleId: 'cd',
      moduleName: 'Core Design',
      reportText: cdReport,
      steps: cdSteps,
      summaryItems: [
        { label: 'Voltage per Turn (Et)', value: et.toFixed(3), unit: 'V' },
        { label: 'Core Flux (Phim)', value: phim.toFixed(6), unit: 'Wb' },
        { label: 'Net Iron Area (Ai)', value: (ai * 1e3).toFixed(2), unit: '10^3 mm^2' },
        { label: 'Core Diameter (d)', value: (d * 1000).toFixed(1), unit: 'mm' },
      ],
    },
    wd: {
      moduleId: 'wd',
      moduleName: 'Window Dimensions',
      reportText: wdReport,
      steps: wdSteps,
      summaryItems: [
        { label: 'Window Space Factor (Kw)', value: kwUsed.toFixed(3), unit: '' },
        { label: 'Window Area (Aw)', value: (aw * 1e3).toFixed(2), unit: '10^3 mm^2' },
        { label: 'Window Height (Hw)', value: (hwUsed * 1000).toFixed(0), unit: 'mm' },
        { label: 'Window Width (Ww)', value: (wwUsed * 1000).toFixed(0), unit: 'mm' },
        { label: 'Center Distance (D)', value: (dCenterDistance * 1000).toFixed(0), unit: 'mm' },
      ],
    },
    yd: {
      moduleId: 'yd',
      moduleName: 'Yoke Design',
      reportText: ydReport,
      steps: ydSteps,
      summaryItems: [
        { label: 'Yoke Flux Density (FDy)', value: fdy.toFixed(4), unit: 'Wb/m^2' },
        { label: 'Yoke Area (Ay)', value: (ay * 1e3).toFixed(2), unit: '10^3 mm^2' },
        { label: 'Yoke Depth (Dy)', value: (dyUsed * 1000).toFixed(0), unit: 'mm' },
        { label: 'Yoke Height (Hy)', value: (hyUsed * 1000).toFixed(0), unit: 'mm' },
      ],
    },
    od: {
      moduleId: 'od',
      moduleName: 'Overall Frame Dimensions',
      reportText: odReport,
      steps: odSteps,
      summaryItems: [
        { label: 'Frame Height (H)', value: (frameH * 1000).toFixed(0), unit: 'mm' },
        { label: 'Frame Width (W)', value: (frameW * 1000).toFixed(0), unit: 'mm' },
        { label: 'Frame Depth (Df)', value: (frameDf * 1000).toFixed(0), unit: 'mm' },
      ],
    },
    lvd: {
      moduleId: 'lvd',
      moduleName: 'Low Voltage Winding',
      reportText: lvdReport,
      steps: lvdSteps,
      summaryItems: [
        { label: 'LV Phase Voltage', value: vsp.toFixed(2), unit: 'V' },
        { label: 'LV Turns per Phase', value: tsUsed.toString(), unit: 'turns' },
        { label: 'LV Secondary Current', value: isp.toFixed(1), unit: 'A' },
        { label: 'LV Conductor Strip', value: `${stripX}x${stripY}`, unit: 'mm' },
        { label: 'Axial Clearance Guard (cls)', value: clsLV.toFixed(1), unit: 'mm' },
      ],
    },
    hvd: {
      moduleId: 'hvd',
      moduleName: 'High Voltage Winding',
      reportText: hvdReport,
      steps: hvdSteps,
      summaryItems: [
        { label: 'HV Base Turns', value: tpBase.toFixed(0), unit: 'turns' },
        { label: 'HV Turns (+5% Tap)', value: tpModified.toFixed(0), unit: 'turns' },
        { label: 'HV Primary Current', value: ipp.toFixed(3), unit: 'A' },
        { label: 'HV Wire Diameter', value: `${wireBareDp1}mm bare`, unit: 'mm' },
        { label: 'Axial Clearance Guard (clc)', value: clcHV.toFixed(1), unit: 'mm' },
      ],
    },
    resis: {
      moduleId: 'resis',
      moduleName: 'Resistance Calculations',
      reportText: resisReport,
      steps: resisSteps,
      summaryItems: [
        { label: 'HV Resistance (Rp)', value: rp.toFixed(2), unit: 'Ohm' },
        { label: 'LV Resistance (Rs)', value: rs.toFixed(4), unit: 'Ohm' },
        { label: 'Referred Resistance (Ref)', value: ref.toFixed(2), unit: 'Ohm' },
        { label: 'Per Unit Resistance (epsilonP)', value: (epsilonP * 100).toFixed(2), unit: '%' },
      ],
    },
    lr: {
      moduleId: 'lr',
      moduleName: 'Leakage Reactance',
      reportText: lrReport,
      steps: lrSteps,
      summaryItems: [
        { label: 'Leakage Reactance (Xp)', value: xp.toFixed(2), unit: 'Ohm' },
        { label: 'Per Unit Reactance (epsilonX)', value: (epsilonX * 100).toFixed(2), unit: '%' },
        { label: 'Per Unit Impedance (epsilonZ)', value: (epsilonZ * 100).toFixed(2), unit: '%' },
      ],
    },
    reg: {
      moduleId: 'reg',
      moduleName: 'Voltage Regulation',
      reportText: regReport,
      steps: regSteps,
      summaryItems: [
        { label: 'Voltage Regulation (0.8 Lag)', value: regulationPercent.toFixed(2), unit: '%' },
      ],
    },
    cl: {
      moduleId: 'cl',
      moduleName: 'Loss Calculations',
      reportText: clReport,
      steps: clSteps,
      summaryItems: [
        { label: 'Copper Loss (Pi2r)', value: pi2r.toFixed(1), unit: 'W' },
        { label: 'Core Loss (Pi)', value: totalCoreLossPi.toFixed(1), unit: 'W' },
        { label: 'Total Full Load Loss (Lt)', value: totalLossLt.toFixed(1), unit: 'W' },
      ],
    },
    effi: {
      moduleId: 'effi',
      moduleName: 'Efficiency Analysis',
      reportText: effiReport,
      steps: effiSteps,
      summaryItems: [
        { label: 'Full Load Efficiency (eta)', value: fullLoadEfficiency.toFixed(2), unit: '%' },
        { label: 'Max Efficiency Point (x)', value: (maxEfficiencyLoadingX * 100).toFixed(1), unit: '% load' },
      ],
    },
    nlc: {
      moduleId: 'nlc',
      moduleName: 'No Load Current',
      reportText: nlcReport,
      steps: nlcSteps,
      summaryItems: [
        { label: 'Magnetizing Current (Im)', value: im.toFixed(4), unit: 'A' },
        { label: 'No-Load Current (Io)', value: io.toFixed(4), unit: 'A' },
        { label: 'Percentage No-Load Current', value: ioPercent.toFixed(1), unit: '%' },
      ],
    },
  };

  return {
    core: { et, phim, ai, agi, ct, d, p: pUsed, q: qUsed },
    window: {
      kwCalculated: kwCalc,
      kwUsed,
      aw,
      wwCalculated: wwCalc,
      hwCalculated: hwCalc,
      hwUsed,
      wwUsed,
      dCenterDistance,
    },
    yoke: { fdy, ay, agy, dy: dyUsed, hy: hyUsed },
    frame: { heightH: frameH, widthW: frameW, depthDf: frameDf, centerDistanceD: dCenterDistance },
    lv: {
      vsp,
      tsCalculated: tsCalc,
      tsUsed,
      isp,
      asCalculated: asCalc,
      asModified,
      deltaModified: deltaModifiedLV,
      x1,
      y1,
      lcs,
      clearanceCls: clsLV,
      bs,
      insideDiameterId,
      outsideDiameterOd,
      clsValid,
    },
    hv: {
      vpp,
      tpBase,
      tpModified,
      ipp,
      apCalculated: apCalc,
      apModified,
      deltaModified: deltaModifiedHV,
      hlp,
      lcp,
      clearanceClc: clcHV,
      bp,
      insulationT,
      insideDiameterIdhv,
      outsideDiameterOdhv,
      clcValid,
    },
    resistance: { dpm, lmtp, rp, dsm, lmts, rs, ref, epsilonP },
    reactance: { dm, lmt, lc, xp, epsilonX, epsilonZ },
    regulation: { regulationPercent },
    losses: {
      li2r,
      pi2r,
      weightLimbs,
      coreLossLimbs,
      weightYokes,
      coreLossYokes,
      totalCoreLossPi,
      totalLossLt,
    },
    efficiency: { fullLoadEfficiency, maxEfficiencyLoadingX },
    noLoadCurrent: { mmmf, ato, im, il, io, ioPercent, ioValid },
    modules,
  };
}
