import { z } from "zod"

const chargerConfigurationSchema = z.object({
  id: z.string(),
  powerInkW: z.number().min(0).max(100),
  quantity: z
    .number()
    .min(0)
    .max(30, "Number of charger must be less than or equal to 30"),
  name: z.string().min(2).max(100),
})

export const simulationOptionsSchema = z.object({
  chargerConfigurations: z.array(chargerConfigurationSchema).refine(
    (chargerConfigs) => {
      const totalQuantity = chargerConfigs.reduce(
        (sum, config) => sum + config.quantity,
        0
      )

      return totalQuantity <= 30
    },
    {
      error: "Total number of chargers must not exceed 30",
    }
  ),
  numberOfSimulationDays: z
    .number()
    .min(1, "Number of simulation days must be at least 1")
    .max(365, "Number of simulation days must be between 1 and 365"),
  carNeedskWhPer100kms: z.number().min(0),
  carArrivalProbabilityMultiplier: z.number().min(20).max(220),
})

export const parkingLotCountSchema = z
  .number()
  .min(0, "Number of parking lots must be greater than or equal to 0")
  .max(200, "Number of parking lots must be less than or equal to 200")

export type ChargerConfiguration = z.infer<typeof chargerConfigurationSchema>
export type SimulationOptions = z.infer<typeof simulationOptionsSchema>

export type ChargingStationState = {
  chargerId: number
  occupiedNumberOfTicks: number
  powerInkW: number
  lockedToChargeTotalkWh: number
  sessionRemainingChargeInkWh: number
  sessionAlreadyChargedInkWh: number
}

export type SimulationResult = {
  totalEnergyConsumedInkWh: number
  theoreticalMaxPowerDemand: number
  actualMaximumPowerDemandInkW: number
  ratioOfActualToMaximumPowerDemand: number
  totalChargingEvents: number
}

export type ChargingEvent = {
  tick: number
  energyUsedFromTheGridInkWh: number
  chargingStationData: ChargingStationState
}

export type ParkingData = {
  chargerPowerInKw?: number
  id: number
}

export type ChargingStation = {
  id: number
  occupiedNumberOfTicks: number
  powerInkW: number
  lockedToChargeTotalkWh: number
  sessionRemainingChargeInkWh: number
  sessionAlreadyChargedInkWh: number
}
