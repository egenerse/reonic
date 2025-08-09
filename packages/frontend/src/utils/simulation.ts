import { ChargingStation } from "./chargingStation";
import { arrayOfProbabilities } from "./constants";
import type {
  SimulationOptions,
  SimulationResult,
  ChargingEvent,
} from "./types";

const getNeededKmForCar = (percentage: number) => {
  if (percentage < 34.31) return 0;
  if (percentage < 34.31 + 4.9) return 5;
  if (percentage < 34.31 + 4.9 + 9.8) return 10;
  if (percentage < 34.31 + 4.9 + 9.8 + 11.76) return 20;
  if (percentage < 34.31 + 4.9 + 9.8 + 11.76 + 8.82) return 30;
  if (percentage < 34.31 + 4.9 + 9.8 + 11.76 + 8.82 + 11.76) return 50;
  if (percentage < 34.31 + 4.9 + 9.8 + 11.76 + 8.82 + 11.76 + 10.78) return 100;
  if (percentage < 34.31 + 4.9 + 9.8 + 11.76 + 8.82 + 11.76 + 10.78 + 4.9)
    return 200;

  return 300;
};

export const runSimulation = ({
  numberOfChargers,
  chargerPowerInkW,
  numberOfSimulationDays,
  carNeedskWhPer100kms,
}: SimulationOptions): SimulationResult => {
  // divide the days into 24 hours and calculate 15 mins intervals/ticks
  const totalTicks = numberOfSimulationDays * 24 * 4;

  const chargingStations: ChargingStation[] = Array.from(
    { length: numberOfChargers },
    () =>
      new ChargingStation({
        powerInkW: chargerPowerInkW,
        occupiedNumberOfTicks: 0,
        lockedToChargeTotalkWh: 0,
        sessionRemainingChargeInkWh: 0,
        sessionAlreadyChargedInkWh: 0,
      })
  );

  const chargingEvents: ChargingEvent[] = [];

  let totalEnergyConsumedInkWh = 0;
  let actualMaximumPowerDemandInkW = 0;

  const oneDayTickNumber = 24 * 4;

  for (let tick = 0; tick < totalTicks; tick++) {
    // Try to place a car in a charging station

    const timeSlot = Math.floor((tick % oneDayTickNumber) / 4);
    const probablityOfGettingCarInCharging = arrayOfProbabilities[timeSlot];

    for (const chargingStation of chargingStations) {
      // Charhing station is in use
      if (chargingStation.occupiedNumberOfTicks > 0) {
        continue;
      }

      const randomPercentageForCarArrive = Math.random() * 100;
      const carArrived =
        randomPercentageForCarArrive < probablityOfGettingCarInCharging;

      if (carArrived) {
        const randomPercentageForKM = Math.random() * 100;

        const kmChargeNeeded = getNeededKmForCar(randomPercentageForKM);

        if (kmChargeNeeded > 0) {
          const energyNeedInkWH = (kmChargeNeeded / 100) * carNeedskWhPer100kms;
          const chargingStationPowerForTick = chargingStation.powerInkW / 4;

          const occupiedNumberOfTicks = Math.ceil(
            energyNeedInkWH / chargingStationPowerForTick
          );

          chargingStation.lockedToChargeTotalkWh = energyNeedInkWH;
          chargingStation.sessionRemainingChargeInkWh = energyNeedInkWH;
          chargingStation.sessionAlreadyChargedInkWh = 0;
          chargingStation.occupiedNumberOfTicks = occupiedNumberOfTicks;
        }
      }
    }

    // create charging event in the timeSlot
    let energyDemandForTheThick = 0;
    for (const chargingStation of chargingStations) {
      if (chargingStation.occupiedNumberOfTicks === 0) {
        continue;
      }

      const chargerCanChargeInTickInkWh = chargingStation.powerInkW / 4;
      energyDemandForTheThick += chargingStation.powerInkW;

      const chargingStationWillUseInkWh = Math.min(
        chargingStation.sessionRemainingChargeInkWh,
        chargerCanChargeInTickInkWh
      );

      totalEnergyConsumedInkWh += chargingStationWillUseInkWh;

      chargingStation.sessionAlreadyChargedInkWh += chargingStationWillUseInkWh;
      chargingStation.sessionRemainingChargeInkWh -=
        chargingStationWillUseInkWh;
      chargingStation.occupiedNumberOfTicks -= 1;

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
      });

      // cleanup
      if (chargingStation.occupiedNumberOfTicks === 0) {
        chargingStation.lockedToChargeTotalkWh = 0;
        chargingStation.sessionAlreadyChargedInkWh = 0;
        chargingStation.sessionRemainingChargeInkWh = 0;
      }
    }

    if (actualMaximumPowerDemandInkW < energyDemandForTheThick) {
      actualMaximumPowerDemandInkW = energyDemandForTheThick;
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
  );

  const ratioOfActualToMaximumPowerDemand =
    actualMaximumPowerDemandInkW / theoreticalMaxPowerDemand;

  const totalChargingEvents = chargingEvents.length;

  return {
    numberOfChargers,
    totalEnergyConsumedInkWh,
    theoreticalMaxPowerDemand,
    actualMaximumPowerDemandInkW,
    ratioOfActualToMaximumPowerDemand,
    totalChargingEvents,
  };
};
