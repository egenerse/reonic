import type { ChargerConfiguration } from "./types";

export const calculateNumberOfChargers = (
  chargerConfigurations: ChargerConfiguration[]
) => {
  return chargerConfigurations.reduce(
    (total, config) => total + config.quantity,
    0
  );
};
