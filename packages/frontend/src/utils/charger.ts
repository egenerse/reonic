import { AVAILABLE_CHARGER_POWER_OPTIONS } from "./constants"
import type { ChargerConfiguration, ParkingData } from "./types"

export const calculateNumberOfChargers = (
  chargerConfigurations: ChargerConfiguration[]
) => {
  return chargerConfigurations.reduce(
    (total, config) => total + config.quantity,
    0
  )
}

export const calculateTotalPowerDemand = (
  chargerConfigurations: ChargerConfiguration[]
) => {
  return chargerConfigurations.reduce(
    (total, config) => total + config.powerInkW * config.quantity,
    0
  )
}

export const getChargerConfigurationFromParkingData = (
  parkingData: ParkingData[]
): ChargerConfiguration[] => {
  const powerCounts = new Map<number, number>(
    AVAILABLE_CHARGER_POWER_OPTIONS.map((option) => [option.value, 0])
  )

  parkingData.forEach((lot) => {
    if (lot.chargerPowerInKw === undefined) return
    if (powerCounts.has(lot.chargerPowerInKw)) {
      powerCounts.set(
        lot.chargerPowerInKw,
        powerCounts.get(lot.chargerPowerInKw)! + 1
      )
    }
  })

  return AVAILABLE_CHARGER_POWER_OPTIONS.map((option, index) => ({
    id: index.toString(),
    name: option.label,
    quantity: powerCounts.get(option.value) || 0,
    powerInkW: option.value,
  }))
}
