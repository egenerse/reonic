import e from "express";
import { RunSimulationDto } from "../types/SimulationDtos";
import { runSimulation } from "../utils/simulation";
import { ChargerConfiguration } from "../utils/simulationTypes";

console.log("DEBUG sub process is created,", process.pid);

process.on("message", (input: RunSimulationDto) => {
  console.log("DEBUG sub process received input", input);
  const result = runSimulationLogic(input);

  if (process && typeof process.send === "function") {
    process.send(result);
  }

  setTimeout(process.exit, 1000);
});

function runSimulationLogic(input: RunSimulationDto) {
  // Create charger configuration based on input
  const chargerConfigurations: ChargerConfiguration[] = [
    {
      id: "default",
      name: "Default Charger",
      powerInkW: input.chargingPowerKw,
      quantity: input.chargePoints,
    },
  ];

  // Run the actual simulation
  const simulationResult = runSimulation({
    chargerConfigurations,
    numberOfSimulationDays: 365, // Simulate a full year
    carNeedskWhPer100kms: input.carConsumptionKwh,
    carArrivalProbabilityMultiplier: input.arrivalMultiplier,
  });

  // Calculate events for different time periods
  const totalEvents = simulationResult.totalChargingEvents;
  const eventsPerYear = totalEvents;
  const eventsPerMonth = Math.floor(totalEvents / 12);
  const eventsPerWeek = Math.floor(totalEvents / 52);
  const eventsPerDay = Math.floor(totalEvents / 365);

  // Create charging values summary
  const chargingValues = {
    totalChargers: input.chargePoints,
    averagePowerDemand: simulationResult.actualMaximumPowerDemandInkW,
    utilizationRatio: simulationResult.ratioOfActualToMaximumPowerDemand,
    theoreticalMaxPower: simulationResult.theoreticalMaxPowerDemand,
  };

  return {
    chargingValues,
    exemplaryDay: simulationResult.exemplaryDay,
    totalEnergyChargedKwh: simulationResult.totalEnergyConsumedInkWh,
    chargingEventsYear: eventsPerYear,
    chargingEventsMonth: eventsPerMonth,
    chargingEventsWeek: eventsPerWeek,
    chargingEventsDay: eventsPerDay,
  };
}
