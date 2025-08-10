export type ChargingStationState = {
  chargerId: number;
  occupiedNumberOfTicks: number;
  powerInkW: number;
  lockedToChargeTotalkWh: number;
  sessionRemainingChargeInkWh: number;
  sessionAlreadyChargedInkWh: number;
};

export type ChargerConfiguration = {
  id: string;
  powerInkW: number;
  quantity: number;
  name: string;
};

export type SimulationOptions = {
  chargerConfigurations: ChargerConfiguration[];
  numberOfSimulationDays: number;
  carNeedskWhPer100kms: number;
  carArrivalProbabilityMultiplier: number;
};

export type SimulationResult = {
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

export type ParkingData = {
  chargerPowerInKw?: number;
  id: number;
};
