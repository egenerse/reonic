import { PrismaClient } from "@prisma/client";
import { runSimulation } from "../utils/simulation";
import type { ChargerConfiguration } from "../utils/simulationTypes";

export class SimulationService {
  constructor(private prisma: PrismaClient) {}

  async getSimulationByParameters(params: {
    chargePoints: number;
    arrivalMultiplier: number;
    carConsumptionKwh: number;
    chargingPowerKw: number;
  }) {
    // First, try to find existing simulation with these exact parameters
    const existingSimulation = await this.prisma.simulationInput.findFirst({
      where: {
        chargePoints: params.chargePoints,
        arrivalMultiplier: params.arrivalMultiplier,
        carConsumptionKwh: params.carConsumptionKwh,
        chargingPowerKw: params.chargingPowerKw,
      },
      include: {
        simulationOutputs: {
          include: {
            input: true,
          },
        },
      },
    });

    // If simulation exists and has outputs, return it
    if (existingSimulation && existingSimulation.simulationOutputs.length > 0) {
      return existingSimulation;
    }

    // If no simulation exists or no outputs, create and run new simulation
    return await this.createAndRunSimulation(params);
  }

  async createAndRunSimulation(data: {
    chargePoints: number;
    arrivalMultiplier: number;
    carConsumptionKwh: number;
    chargingPowerKw: number;
  }) {
    // Create the simulation input first
    const simulationInput = await this.prisma.simulationInput.create({
      data,
    });

    // Run the simulation using the clean simulation logic
    const simulationData = this.runSimulationLogic(data);

    // Create the simulation output
    const outputData = {
      inputId: simulationInput.id,
      ...simulationData,
    };

    await this.prisma.simulationOutput.create({
      data: outputData,
    });

    // Return the input with its output
    return await this.prisma.simulationInput.findUnique({
      where: { id: simulationInput.id },
      include: {
        simulationOutputs: {
          include: {
            input: true,
          },
        },
      },
    });
  }

  private runSimulationLogic(input: {
    chargePoints: number;
    arrivalMultiplier: number;
    carConsumptionKwh: number;
    chargingPowerKw: number;
  }) {
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

  async getAllSimulations() {
    return await this.prisma.simulationInput.findMany({
      include: {
        simulationOutputs: {
          include: {
            input: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getSimulationById(id: number) {
    return await this.prisma.simulationInput.findUnique({
      where: { id },
      include: {
        simulationOutputs: {
          include: {
            input: true,
          },
        },
      },
    });
  }

  async updateSimulation(
    id: number,
    data: {
      chargePoints?: number;
      arrivalMultiplier?: number;
      carConsumptionKwh?: number;
      chargingPowerKw?: number;
    }
  ) {
    return await this.prisma.simulationInput.update({
      where: { id },
      data,
      include: {
        simulationOutputs: {
          include: {
            input: true,
          },
        },
      },
    });
  }

  async deleteSimulation(id: number) {
    // Delete related outputs first (if not using cascade)
    await this.prisma.simulationOutput.deleteMany({
      where: { inputId: id },
    });

    return await this.prisma.simulationInput.delete({
      where: { id },
    });
  }
}
