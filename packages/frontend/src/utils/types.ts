import { z } from "zod"

export const chargerConfigurationSchema = z.object({
  id: z.string(),
  powerInkW: z.number().min(0).max(100),
  quantity: z
    .number()
    .min(0)
    .max(30, "Number of charger must be less than or equal to 30"),
  name: z.string().min(2).max(100),
})

export const simulationOptionsSchema = z.object({
  chargerConfigurations: z
    .array(chargerConfigurationSchema)
    .min(
      1,
      "There should be at least one charger configuration for the simulation"
    )
    .refine(
      (chargerConfigs) => {
        const totalQuantity = chargerConfigs.reduce(
          (sum, config) => sum + config.quantity,
          0
        )

        return totalQuantity > 0 && totalQuantity < 31
      },
      {
        error: "Total number of chargers must be between min 1 and max 30",
      }
    ),
  numberOfSimulationDays: z
    .number("Number of simulation days must be a number")
    .min(1, "Number of simulation days must be at least 1")
    .max(365, "Number of simulation days must be less than or equal to 365"),
  carNeedskWhPer100kms: z
    .number("Car needs must be a number")
    .min(0.00001, "Car needs must be greater than 0"),
  carArrivalProbabilityMultiplier: z
    .number("Car arrival probability multiplier must be a number")
    .min(20)
    .max(220),
})

export const parkingLotCountSchema = z.object({
  numberOfParkingLot: z
    .number("Number of parking lots must be a number")
    .min(0, "Number of parking lots must be greater than or equal to 1")
    .max(200, "Number of parking lots must be less than or equal to 200"),
})

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
