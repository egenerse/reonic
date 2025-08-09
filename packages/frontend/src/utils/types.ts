export type ChargingStationState = {
  chargerId: number;
  occupiedNumberOfTicks: number;
  powerInkW: number;
  lockedToChargeTotalkWh: number;
  sessionRemainingChargeInkWh: number;
  sessionAlreadyChargedInkWh: number;
};

export type SimulationOptions = {
  numberOfChargers: number;
  chargerPowerInkW: number;
  numberOfSimulationDays: number;
  carNeedskWhPer100kms: number;
};

export type SimulationResult = {
  numberOfChargers: number;
  totalEnergyConsumedInkWh: number;
  theoreticalMaxPowerDemand: number;
  actualMaximumPowerDemandInkW: number;
  ratioOfActualToMaximumPowerDemand: number;
  totalChargingEvents: number;
};

export type ChargingEvent = {
  tick: number;
  energyUsedFromTheGridInkWh: number;
  chargingStationData: ChargingStationState;
};
