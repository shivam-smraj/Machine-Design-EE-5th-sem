import { TransformerInputs } from '@/types/transformer';

export const DEFAULT_TRANSFORMER_INPUTS: TransformerInputs = {
  // General
  transformerCategory: 1, // Distribution Transformer
  kva: 200,
  kFactor: 0.45,
  frequency: 50,
  phases: 3,

  // Core & Magnetic
  bm: 1.0, // Flux density (Wb/m^2)
  ki: 0.90, // Stacking factor
  coreType: 2, // Cruciform Core
  laminationP: 0.192, // m
  laminationQ: 0.120, // m

  // Window & Frame
  primaryKv: 33, // 33 kV
  kw: 0.160, // Window space factor
  deltaPrimary: 2.3, // Current density A/mm^2
  windowRatio: 2.5, // Hw / Ww ratio
  modifiedHw: 0.850, // m (Modified for 33kV clearance)
  modifiedWw: 0.340, // m

  // Yoke
  yokeAreaRatio: 1.20, // 20% area increase over limb
  modifiedDy: 0.192, // m
  modifiedHy: 0.200, // m

  // LV Winding
  secondaryVls: 433, // Secondary Line Voltage
  secondaryConnection: 'Star',
  secondaryTs: 39, // Turns per phase
  secondaryDelta: 2.3, // A/mm^2
  stripX: 15.0, // mm
  stripY: 7.8, // mm
  coveringZ: 0.5, // mm paper insulation
  lvLayers: 2,
  lvTs1: 20, // Turns along axial depth
  pressboardCly: 1.0, // mm
  coreInsulationLvi: 2.5, // mm

  // HV Winding
  primaryVlp: 33000, // Primary Line Voltage V
  primaryConnection: 'Delta',
  tappingChoice: 2, // Yes (Tappings included)
  tappingPercent: 5.0, // +5.0%
  voltagePerCoilVc: 1500, // V per coil
  totalCoilsNc: 22,
  normalCoilsNcn: 20,
  turnsPerNormalCoilNct: 246,
  hvLayersNcl: 10,
  turnsPerLayerTncl: 25,
  hvConductorType: 1, // Round conductor
  wireBareDp1: 1.06, // mm bare diameter
  wireInsulatedDp2: 1.18, // mm insulated diameter
  spacerDbc: 5.0, // mm spacer height
  layerInsulationTi: 0.3, // mm layer insulation

  // Electrical Coefficients & Loss Coefficients
  hvResistivityRop: 0.021, // ohm*mm^2/m
  lvResistivityRos: 0.021, // ohm*mm^2/m
  strayLossPercent: 10.0, // %
  steelDensity: 7600, // kg/m^3
  limbsCount: 3,
  specificCoreLossLimb: 1.5, // W/kg
  yokesCount: 2,
  specificCoreLossYoke: 1.5, // W/kg
  magnetizingAtc: 250, // A/m
  magnetizingAty: 200, // A/m
};
