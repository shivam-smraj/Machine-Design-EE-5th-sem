export interface StripConductorEntry {
  standardDimension: string;
  widthBareMm: number;
  thicknessBareMm: number;
  areaMm2: number;
  paperCoveredWidthMm: number;
  paperCoveredThicknessMm: number;
}

export interface RoundWireEntry {
  swg: string;
  bareDiameterMm: number;
  insulatedDiameterMm: number;
  areaMm2: number;
}

export interface CoreSectionConstant {
  type: string;
  steps: number;
  ctFactor: number;
  formula: string;
  widthRatios: string;
}

// Table 23.1: Standard Rectangular Copper Strip Conductors (IS:1897-1962 / Sawhney)
export const STRIP_CONDUCTOR_TABLE: StripConductorEntry[] = [
  { standardDimension: '15.0 x 7.8', widthBareMm: 15.0, thicknessBareMm: 7.8, areaMm2: 117.0, paperCoveredWidthMm: 15.5, paperCoveredThicknessMm: 8.3 },
  { standardDimension: '12.0 x 6.0', widthBareMm: 12.0, thicknessBareMm: 6.0, areaMm2: 72.0, paperCoveredWidthMm: 12.5, paperCoveredThicknessMm: 6.5 },
  { standardDimension: '10.0 x 5.0', widthBareMm: 10.0, thicknessBareMm: 5.0, areaMm2: 50.0, paperCoveredWidthMm: 10.5, paperCoveredThicknessMm: 5.5 },
  { standardDimension: '8.0 x 4.0', widthBareMm: 8.0, thicknessBareMm: 4.0, areaMm2: 32.0, paperCoveredWidthMm: 8.5, paperCoveredThicknessMm: 4.5 },
  { standardDimension: '7.7 x 2.2', widthBareMm: 7.7, thicknessBareMm: 2.2, areaMm2: 16.94, paperCoveredWidthMm: 8.2, paperCoveredThicknessMm: 2.7 },
  { standardDimension: '6.0 x 3.0', widthBareMm: 6.0, thicknessBareMm: 3.0, areaMm2: 18.0, paperCoveredWidthMm: 6.5, paperCoveredThicknessMm: 3.5 },
  { standardDimension: '5.0 x 2.5', widthBareMm: 5.0, thicknessBareMm: 2.5, areaMm2: 12.5, paperCoveredWidthMm: 5.5, paperCoveredThicknessMm: 3.0 },
];

// Table 23.7: Standard Round Wires (Sawhney)
export const ROUND_WIRE_TABLE: RoundWireEntry[] = [
  { swg: '19 SWG', bareDiameterMm: 1.016, insulatedDiameterMm: 1.130, areaMm2: 0.811 },
  { swg: '19.5 SWG', bareDiameterMm: 1.060, insulatedDiameterMm: 1.180, areaMm2: 0.882 },
  { swg: '18 SWG', bareDiameterMm: 1.220, insulatedDiameterMm: 1.340, areaMm2: 1.169 },
  { swg: '17 SWG', bareDiameterMm: 1.420, insulatedDiameterMm: 1.550, areaMm2: 1.584 },
  { swg: '16 SWG', bareDiameterMm: 1.630, insulatedDiameterMm: 1.760, areaMm2: 2.087 },
  { swg: '14 SWG', bareDiameterMm: 2.030, insulatedDiameterMm: 2.180, areaMm2: 3.237 },
  { swg: '12 SWG', bareDiameterMm: 2.640, insulatedDiameterMm: 2.800, areaMm2: 5.474 },
];

// Core Stepping Constants (A.K. Sawhney Table 5.2)
export const CORE_STEPPING_TABLE: CoreSectionConstant[] = [
  { type: 'Square Core', steps: 1, ctFactor: 0.45, formula: 'Ai = 0.45 * d^2', widthRatios: 'p = 0.707 * d' },
  { type: 'Cruciform Core', steps: 2, ctFactor: 0.56, formula: 'Ai = 0.56 * d^2', widthRatios: 'p = 0.85 * d, q = 0.53 * d' },
  { type: '3-Stepped Core', steps: 3, ctFactor: 0.60, formula: 'Ai = 0.60 * d^2', widthRatios: 'p = 0.90 * d, q = 0.70 * d, r = 0.42 * d' },
  { type: '4-Stepped Core', steps: 4, ctFactor: 0.62, formula: 'Ai = 0.62 * d^2', widthRatios: 's = 0.92 * d, r = 0.78 * d, q = 0.36 * d, p = 0.36 * d' },
];

// Guidance Ranges for Current Density and Flux Density
export const ENGINEERING_GUIDANCE_RANGES = {
  fluxDensityDistribution: { min: 1.0, max: 1.4, default: 1.0, unit: 'Wb/m^2' },
  fluxDensityPower: { min: 1.25, max: 1.45, default: 1.35, unit: 'Wb/m^2' },
  currentDensitySelfOilCooling: { min: 2.2, max: 3.2, default: 2.3, unit: 'A/mm^2' },
  currentDensityForcedOilCooling: { min: 5.4, max: 6.2, default: 5.8, unit: 'A/mm^2' },
  kFactorDistribution: { min: 0.45, max: 0.50, default: 0.45 },
  kFactorPower: { min: 0.60, max: 0.70, default: 0.65 },
  stackingFactor: { min: 0.88, max: 0.92, default: 0.90 },
};
