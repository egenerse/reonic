import { calculateNumberOfChargers } from "./charger";
import type { SimulationOptions } from "./types";

export const validateSimulationOptions = (options: SimulationOptions) => {
  const errors: string[] = [];

  if (
    !options.chargerConfigurations ||
    options.chargerConfigurations.length === 0
  ) {
    errors.push("At least one charger configuration is required.");
  }

  if (options.numberOfSimulationDays <= 0) {
    errors.push("Number of simulation days must be positive.");
  }

  if (options.carNeedskWhPer100kms <= 0) {
    errors.push("Car needs kWh per 100kms must be positive.");
  }

  if (options.carArrivalProbabilityMultiplier <= 0) {
    errors.push("Car arrival probability multiplier must be positive.");
  }

  if (options.chargerConfigurations.some((config) => config.quantity <= 0)) {
    errors.push("Charger quantity must be positive.");
  }
  if (options.chargerConfigurations.some((config) => config.powerInkW <= 0)) {
    errors.push("Charger power must be positive.");
  }

  if (options.numberOfSimulationDays > 365) {
    errors.push("Number of simulation days must not exceed 365.");
  }

  const totalChargers = calculateNumberOfChargers(
    options.chargerConfigurations
  );

  if (totalChargers > 30) {
    errors.push("Total number of chargers must not exceed 30.");
  }

  return errors;
};
