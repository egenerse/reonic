export type RunSimulationResult = {
  chargingValues: {
    totalChargers: number;
    averagePowerDemand: number;
    utilizationRatio: number;
    theoreticalMaxPower: number;
  };
  exemplaryDay: any;
  totalEnergyChargedKwh: number;
  chargingEventsYear: number;
  chargingEventsMonth: number;
  chargingEventsWeek: number;
  chargingEventsDay: number;
};
