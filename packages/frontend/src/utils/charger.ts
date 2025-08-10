import { AVAILABLE_CHARGER_POWER_OPTIONS } from "./constants";
import type { ChargerConfiguration, ParkingData } from "./types";

export const calculateNumberOfChargers = (
  chargerConfigurations: ChargerConfiguration[]
) => {
  return chargerConfigurations.reduce(
    (total, config) => total + config.quantity,
    0
  );
};

export const calculateChargerConfigurationsFromParkingData = (
  parkingData: ParkingData[]
) => {
  const chargingPowers: ChargerConfiguration[] =
    AVAILABLE_CHARGER_POWER_OPTIONS.map((option, index) => ({
      id: index.toString(),
      name: option.label,
      quantity: 0,
      powerInkW: option.value,
    }));

  parkingData.forEach((lot) => {
    const powerOption = chargingPowers.find(
      (option) => option.powerInkW === lot.chargerPowerInKw
    );
    if (powerOption) {
      powerOption.quantity += 1;
    }
  });

  return chargingPowers;
};
