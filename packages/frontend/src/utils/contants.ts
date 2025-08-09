import type { SimulationOptions } from "./types";

export const defaultSimulationOptions: SimulationOptions = {
  chargerConfigurations: [
    {
      id: "default-charger-1",
      powerInkW: 11,
      quantity: 20,
      name: "11 kW Chargers",
    },
  ],
  numberOfSimulationDays: 365,
  carNeedskWhPer100kms: 18,
  carArrivalProbabilityMultiplier: 100,
};
