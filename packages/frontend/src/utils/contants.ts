import type { SimulationOptions } from "./types";

export const defaultSimulationOptions: SimulationOptions = {
  chargerPowerInkW: 11,
  numberOfChargers: 20,
  numberOfSimulationDays: 365,
  carNeedskWhPer100kms: 18,
  carArrivalProbabilityMultiplier: 100,
};
