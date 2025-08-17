import { arrayOfProbabilities } from "./constants"
import type {
  SimulationOptions,
  SimulationResult,
  ChargingEvent,
  ChargingStation,
} from "./types"

const KM_DISTRIBUTION = [
  { threshold: 34.31, km: 0 },
  { threshold: 4.9, km: 5 },
  { threshold: 9.8, km: 10 },
  { threshold: 11.76, km: 20 },
  { threshold: 8.82, km: 30 },
  { threshold: 11.76, km: 50 },
  { threshold: 10.78, km: 100 },
  { threshold: 4.9, km: 200 },
  { threshold: Infinity, km: 300 },
]

const generateLookupTableForKmDistribution = () => {
  const lookup = []
  let cumulativeThreshold = 0

  for (const { threshold, km } of KM_DISTRIBUTION) {
    cumulativeThreshold += threshold
    lookup.push({ maxPercentage: cumulativeThreshold, km })
  }

  return lookup
}

const KM_LOOKUP_TABLE_FOR_CAR_KM_NEEDS = generateLookupTableForKmDistribution()

export const getNeededKmForCar = () => {
  const randomPercentage = Math.random() * 100
  for (const { maxPercentage, km } of KM_LOOKUP_TABLE_FOR_CAR_KM_NEEDS) {
    if (randomPercentage < maxPercentage) {
      return km
    }
  }

  console.error("Unreachable: getNeededKmForCar should never reach here")
  return KM_DISTRIBUTION[KM_DISTRIBUTION.length - 1].km
}

export const runSimulation = ({
  chargerConfigurations,
  numberOfSimulationDays,
  carNeedskWhPer100kms,
  carArrivalProbabilityMultiplier,
}: SimulationOptions): SimulationResult => {
  // divide the days into 24 hours and calculate 15 mins intervals/ticks
  const adjustedCarArrivalProbability = arrayOfProbabilities.map(
    (p) => p * (carArrivalProbabilityMultiplier / 100)
  )

  const totalTicks = numberOfSimulationDays * 24 * 4

  // Create charging stations based on configurations
  const chargingStations: ChargingStation[] = []
  chargerConfigurations.forEach((config) => {
    for (let i = 0; i < config.quantity; i++) {
      chargingStations.push({
        id: i,
        powerInkW: config.powerInkW,
        occupiedNumberOfTicks: 0,
        lockedToChargeTotalkWh: 0,
        sessionRemainingChargeInkWh: 0,
        sessionAlreadyChargedInkWh: 0,
      })
    }
  })

  const chargingEvents: ChargingEvent[] = []

  let totalEnergyConsumedInkWh = 0
  let actualMaximumPowerDemandInkW = 0

  const oneDayTickNumber = 24 * 4

  for (let tick = 0; tick < totalTicks; tick++) {
    // Try to place a car in a charging station

    const timeSlot = Math.floor((tick % oneDayTickNumber) / 4)
    const probablityOfGettingCarInCharging =
      adjustedCarArrivalProbability[timeSlot]

    for (const chargingStation of chargingStations) {
      // Charhing station is in use
      if (chargingStation.occupiedNumberOfTicks > 0) {
        continue
      }

      const randomPercentageForCarArrive = Math.random() * 100
      const carArrived =
        randomPercentageForCarArrive < probablityOfGettingCarInCharging

      if (carArrived) {
        const kmChargeNeeded = getNeededKmForCar()

        if (kmChargeNeeded > 0) {
          const energyNeedInkWH = (kmChargeNeeded / 100) * carNeedskWhPer100kms
          const chargingStationPowerForTick = chargingStation.powerInkW / 4

          const occupiedNumberOfTicks = Math.ceil(
            energyNeedInkWH / chargingStationPowerForTick
          )

          chargingStation.lockedToChargeTotalkWh = energyNeedInkWH
          chargingStation.sessionRemainingChargeInkWh = energyNeedInkWH
          chargingStation.sessionAlreadyChargedInkWh = 0
          chargingStation.occupiedNumberOfTicks = occupiedNumberOfTicks
        }
      }
    }

    // create charging event in the timeSlot
    let energyDemandForTheThick = 0
    for (const chargingStation of chargingStations) {
      if (chargingStation.occupiedNumberOfTicks === 0) {
        continue
      }

      const chargerCanChargeInTickInkWh = chargingStation.powerInkW / 4
      energyDemandForTheThick += chargingStation.powerInkW

      const chargingStationWillUseInkWh = Math.min(
        chargingStation.sessionRemainingChargeInkWh,
        chargerCanChargeInTickInkWh
      )

      totalEnergyConsumedInkWh += chargingStationWillUseInkWh

      chargingStation.sessionAlreadyChargedInkWh += chargingStationWillUseInkWh
      chargingStation.sessionRemainingChargeInkWh -= chargingStationWillUseInkWh
      chargingStation.occupiedNumberOfTicks -= 1

      chargingEvents.push({
        tick: tick,
        energyUsedFromTheGridInkWh: chargingStationWillUseInkWh,
        chargingStationData: {
          chargerId: chargingStation.id,
          lockedToChargeTotalkWh: chargingStation.lockedToChargeTotalkWh,
          occupiedNumberOfTicks: chargingStation.occupiedNumberOfTicks,
          powerInkW: chargingStation.powerInkW,
          sessionAlreadyChargedInkWh:
            chargingStation.sessionAlreadyChargedInkWh,
          sessionRemainingChargeInkWh:
            chargingStation.sessionRemainingChargeInkWh,
        },
      })

      // cleanup
      if (chargingStation.occupiedNumberOfTicks === 0) {
        chargingStation.lockedToChargeTotalkWh = 0
        chargingStation.sessionAlreadyChargedInkWh = 0
        chargingStation.sessionRemainingChargeInkWh = 0
      }
    }

    if (actualMaximumPowerDemandInkW < energyDemandForTheThick) {
      actualMaximumPowerDemandInkW = energyDemandForTheThick
    }
  }

  // chargingEvents.forEach((event) => {
  //   console.log(
  //     "event tick",
  //     event.tick,
  //     "charging station",
  //     JSON.stringify(event.chargingStationData)
  //   );
  // });

  const theoreticalMaxPowerDemand = chargingStations.reduce(
    (previous, current) => previous + current.powerInkW,
    0
  )

  const ratioOfActualToMaximumPowerDemand =
    actualMaximumPowerDemandInkW / theoreticalMaxPowerDemand

  const totalChargingEvents = chargingEvents.length

  return {
    totalEnergyConsumedInkWh,
    theoreticalMaxPowerDemand,
    actualMaximumPowerDemandInkW,
    ratioOfActualToMaximumPowerDemand,
    totalChargingEvents,
  }
}
