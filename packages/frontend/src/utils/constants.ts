import type { ParkingData, SimulationOptions } from "./types"

export const arrivalProbabilitiesTableT1 = {
  0: 0.94,
  1: 0.94,
  2: 0.94,
  3: 0.94,
  4: 0.94,
  5: 0.94,
  6: 0.94,
  7: 0.94,
  8: 2.83,
  9: 2.83,
  10: 5.66,
  11: 5.66,
  12: 5.66,
  13: 7.55,
  14: 7.55,
  15: 7.55,
  16: 10.38,
  17: 10.38,
  18: 10.38,
  19: 4.72,
  20: 4.72,
  21: 4.72,
  22: 0.94,
  23: 0.94,
}

export const arrayOfProbabilities = Object.values(arrivalProbabilitiesTableT1)

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
}
export const defaultGraphicSimulationOptions: SimulationOptions = {
  chargerConfigurations: [
    {
      id: "default-charger-1",
      powerInkW: 11,
      quantity: 1,
      name: "11 kW Chargers",
    },
  ],
  numberOfSimulationDays: 365,
  carNeedskWhPer100kms: 18,
  carArrivalProbabilityMultiplier: 100,
}

export const multipleSimulationsInitialState: SimulationOptions = {
  chargerConfigurations: [
    {
      id: "default-charger-1",
      powerInkW: 11,
      quantity: 1,
      name: "11 kW Chargers",
    },
  ],
  numberOfSimulationDays: 365,
  carNeedskWhPer100kms: 18,
  carArrivalProbabilityMultiplier: 100,
}

export const AVAILABLE_CHARGER_POWER_OPTIONS = [
  { value: 2.75, label: "2.75 kW" },
  { value: 5.5, label: "5.5 kW" },
  { value: 11, label: "11 kW" },
  { value: 18, label: "18 kW" },
  { value: 25, label: "25 kW" },
]

const initialNumberOfParkingLot_GRAPHIC_SIMULATION = 20
export const initialParkingData_GRAPHIC_SIMULATION: ParkingData[] = Array.from(
  { length: initialNumberOfParkingLot_GRAPHIC_SIMULATION },
  (_, i) => ({
    id: i,
    chargerPowerInKw: i === 0 ? 11 : undefined,
  })
)

export const energyPricePerHourInEuro = 0.25
