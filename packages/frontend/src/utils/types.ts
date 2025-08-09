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
  carArrivalProbabilityMultiplier: number;
};

export type SimulationResult = {
  numberOfChargers: number;
  totalEnergyConsumedInkWh: number;
  theoreticalMaxPowerDemand: number;
  actualMaximumPowerDemandInkW: number;
  ratioOfActualToMaximumPowerDemand: number;
  totalChargingEvents: number;
  carArrivalProbabilityMultiplier: number;
  chargerPowerInkW: number;
};

export type ChargingEvent = {
  tick: number;
  energyUsedFromTheGridInkWh: number;
  chargingStationData: ChargingStationState;
};
