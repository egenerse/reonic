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
  const chargerConfigurations: ChargerConfiguration[] = []
  const powerCounts = new Map<number, number>()

  parkingData.forEach((lot) => {
    if (lot.chargerPowerInKw === undefined) return

    const currentPowerCount = powerCounts.get(lot.chargerPowerInKw)
    if (currentPowerCount) {
      powerCounts.set(lot.chargerPowerInKw, currentPowerCount + 1)
    } else {
      powerCounts.set(lot.chargerPowerInKw, 1)
    }
  })

  powerCounts.forEach((value, key) => {
    const newChargingConfig: ChargerConfiguration = {
      id: chargerConfigurations.length.toString(),
      name: `Charger ${key} kW`,
      quantity: value,
      powerInkW: key,
    }
    chargerConfigurations.push(newChargingConfig)
  })

  return chargerConfigurations
}
