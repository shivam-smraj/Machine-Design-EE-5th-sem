export type ConnectionType = 'Star' | 'Delta';
export type CoreTypeIndex = 1 | 2 | 3 | 4; // 1: Square, 2: Cruciform, 3: 3-Stepped, 4: 4-Stepped
export type ConductorTypeIndex = 1 | 2; // 1: Round, 2: Rectangular

export interface TransformerInputs {
  // General
  transformerCategory: 1 | 2; // 1: Distribution, 2: Power
  kva: number; // e.g. 200
  kFactor: number; // e.g. 0.45
  frequency: number; // e.g. 50 Hz
  phases: number; // e.g. 3

  // Core & Magnetic
  bm: number; // Flux density in Wb/m^2 (e.g. 1.0)
  ki: number; // Stacking factor (e.g. 0.90)
  coreType: CoreTypeIndex; // 2: Cruciform
  laminationP: number; // in meters (e.g. 0.192)
  laminationQ: number; // in meters (e.g. 0.120)

  // Window & Frame
  primaryKv: number; // e.g. 33 kV
  kw: number; // Window space factor (e.g. 0.16)
  deltaPrimary: number; // Current density A/mm^2 (e.g. 2.3)
  windowRatio: number; // Hw / Ww ratio (e.g. 2.5)
  modifiedHw: number; // in meters (e.g. 0.850)
  modifiedWw: number; // in meters (e.g. 0.340)

  // Yoke
  yokeAreaRatio: number; // ratio Ay / Ai (e.g. 1.20)
  modifiedDy: number; // in meters (e.g. 0.192)
  modifiedHy: number; // in meters (e.g. 0.200)

  // LV Winding
  secondaryVls: number; // Line voltage V (e.g. 433)
  secondaryConnection: ConnectionType; // Star
  secondaryTs: number; // Turns per phase (e.g. 39)
  secondaryDelta: number; // Current density A/mm^2 (e.g. 2.3)
  stripX: number; // Conductor width mm (e.g. 15.0)
  stripY: number; // Conductor thickness mm (e.g. 7.8)
  coveringZ: number; // Paper insulation covering mm (e.g. 0.5)
  lvLayers: number; // Number of layers (e.g. 2)
  lvTs1: number; // Turns along axial depth (e.g. 20)
  pressboardCly: number; // Pressboard thickness mm (e.g. 1.0)
  coreInsulationLvi: number; // Insulation LV to core mm (e.g. 2.5)

  // HV Winding
  primaryVlp: number; // Primary line voltage V (e.g. 33000)
  primaryConnection: ConnectionType; // Delta
  tappingChoice: 1 | 2; // 1: No tapping, 2: Tapping
  tappingPercent: number; // % tapping (e.g. 5.0)
  voltagePerCoilVc: number; // V per coil (e.g. 1500)
  totalCoilsNc: number; // Total coils (e.g. 22)
  normalCoilsNcn: number; // Normal coils (e.g. 20)
  turnsPerNormalCoilNct: number; // Turns in normal coil (e.g. 246)
  hvLayersNcl: number; // Layers per coil (e.g. 10)
  turnsPerLayerTncl: number; // Turns per layer (e.g. 25)
  hvConductorType: ConductorTypeIndex; // 1: Round
  wireBareDp1: number; // Bare diameter mm (e.g. 1.06)
  wireInsulatedDp2: number; // Insulated diameter mm (e.g. 1.18)
  spacerDbc: number; // Spacer height mm (e.g. 5.0)
  layerInsulationTi: number; // Layer insulation thickness mm (e.g. 0.3)

  // Electrical & Material Coefficients
  hvResistivityRop: number; // ohm*mm^2/m (e.g. 0.021)
  lvResistivityRos: number; // ohm*mm^2/m (e.g. 0.021)
  strayLossPercent: number; // % (e.g. 10.0)
  steelDensity: number; // kg/m^3 (e.g. 7600)
  limbsCount: number; // (e.g. 3)
  specificCoreLossLimb: number; // W/kg (e.g. 1.5)
  yokesCount: number; // (e.g. 2)
  specificCoreLossYoke: number; // W/kg (e.g. 1.5)
  magnetizingAtc: number; // A/m core (e.g. 250)
  magnetizingAty: number; // A/m yoke (e.g. 200)
}

export interface MathStepItem {
  id: string;
  title: string;
  latexFormula: string;
  latexSubstituted: string;
  calculatedValue: string;
  unit: string;
  explanation: string;
  reasoning?: string;
  referenceStandard?: string;
  status?: 'pass' | 'fail' | 'info';
}

export interface ModuleCalculationResult {
  moduleId: string;
  moduleName: string;
  reportText: string;
  steps: MathStepItem[];
  summaryItems: { label: string; value: string; unit: string }[];
}

export interface CalculationOutputs {
  core: {
    et: number;
    phim: number;
    ai: number;
    agi: number;
    ct: number;
    d: number;
    p: number;
    q: number;
  };
  window: {
    kwCalculated: number;
    kwUsed: number;
    aw: number;
    wwCalculated: number;
    hwCalculated: number;
    hwUsed: number;
    wwUsed: number;
    dCenterDistance: number;
  };
  yoke: {
    fdy: number;
    ay: number;
    agy: number;
    dy: number;
    hy: number;
  };
  frame: {
    heightH: number;
    widthW: number;
    depthDf: number;
    centerDistanceD: number;
  };
  lv: {
    vsp: number;
    tsCalculated: number;
    tsUsed: number;
    isp: number;
    asCalculated: number;
    asModified: number;
    deltaModified: number;
    x1: number;
    y1: number;
    lcs: number;
    clearanceCls: number;
    bs: number;
    insideDiameterId: number;
    outsideDiameterOd: number;
    clsValid: boolean;
  };
  hv: {
    vpp: number;
    tpBase: number;
    tpModified: number;
    ipp: number;
    apCalculated: number;
    apModified: number;
    deltaModified: number;
    hlp: number;
    lcp: number;
    clearanceClc: number;
    bp: number;
    insulationT: number;
    insideDiameterIdhv: number;
    outsideDiameterOdhv: number;
    clcValid: boolean;
  };
  resistance: {
    dpm: number;
    lmtp: number;
    rp: number;
    dsm: number;
    lmts: number;
    rs: number;
    ref: number;
    epsilonP: number;
  };
  reactance: {
    dm: number;
    lmt: number;
    lc: number;
    xp: number;
    epsilonX: number;
    epsilonZ: number;
  };
  regulation: {
    regulationPercent: number;
  };
  losses: {
    li2r: number;
    pi2r: number;
    weightLimbs: number;
    coreLossLimbs: number;
    weightYokes: number;
    coreLossYokes: number;
    totalCoreLossPi: number;
    totalLossLt: number;
  };
  efficiency: {
    fullLoadEfficiency: number;
    maxEfficiencyLoadingX: number;
  };
  noLoadCurrent: {
    mmmf: number;
    ato: number;
    im: number;
    il: number;
    io: number;
    ioPercent: number;
    ioValid: boolean;
  };
  modules: Record<string, ModuleCalculationResult>;
}
