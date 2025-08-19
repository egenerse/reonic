import { PrismaClient } from "@prisma/client";
import {
  CreateSimulationInputDto,
  UpdateSimulationInputDto,
  RunSimulationDto,
} from "../types/SimulationDtos";
import { ChargerConfiguration } from "../utils/simulationTypes";
import { runSimulation } from "../utils/simulation";
import { SimulationInput } from "../types/SimulationTypes";

export class SimulationService {
  constructor(private prisma: PrismaClient) {}

  async createSimulationInput(data: CreateSimulationInputDto) {
    return await this.prisma.simulationInput.create({
      data: {
        chargePoints: data.chargePoints,
        arrivalMultiplier: data.arrivalMultiplier,
        carConsumptionKwh: data.carConsumptionKwh,
        chargingPowerKw: data.chargingPowerKw,
      },
    });
  }

  async getAllSimulationInputs() {
    return await this.prisma.simulationInput.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getSimulationInputById(id: number) {
    return await this.prisma.simulationInput.findUnique({
      where: { id },
    });
  }

  async updateSimulationInput(id: number, data: UpdateSimulationInputDto) {
    const updateData: Partial<{
      chargePoints: number;
      arrivalMultiplier: number;
      carConsumptionKwh: number;
      chargingPowerKw: number;
    }> = {};

    if (data.chargePoints !== undefined) {
      updateData.chargePoints = data.chargePoints;
    }
    if (data.arrivalMultiplier !== undefined) {
      updateData.arrivalMultiplier = data.arrivalMultiplier;
    }
    if (data.carConsumptionKwh !== undefined) {
      updateData.carConsumptionKwh = data.carConsumptionKwh;
    }
    if (data.chargingPowerKw !== undefined) {
      updateData.chargingPowerKw = data.chargingPowerKw;
    }

    return await this.prisma.simulationInput.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteSimulationInput(id: number) {
    return await this.prisma.simulationInput.delete({
      where: { id },
    });
  }

  async simulationInputExists(id: number): Promise<boolean> {
    const input = await this.prisma.simulationInput.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!input;
  }

  async getSimulationInputByParameters(
    query: RunSimulationDto | CreateSimulationInputDto
  ) {
    return await this.prisma.simulationInput.findFirst({
      where: {
        carConsumptionKwh: query.carConsumptionKwh,
        chargingPowerKw: query.chargingPowerKw,
        arrivalMultiplier: query.arrivalMultiplier,
        chargePoints: query.chargePoints,
      },
    });
  }

  async getSimulationOutputByInputId(id: number) {
    const result = await this.prisma.simulationInput.findUnique({
      where: { id },
      include: {
        simulationOutputs: true,
      },
    });
    return result?.simulationOutputs || null;
  }

  async getSimulationOutputBySimulationInputs(query: RunSimulationDto) {
    const result = await this.prisma.simulationInput.findFirst({
      where: {
        carConsumptionKwh: query.carConsumptionKwh,
        chargingPowerKw: query.chargingPowerKw,
        arrivalMultiplier: query.arrivalMultiplier,
        chargePoints: query.chargePoints,
      },
      include: {
        simulationOutputs: true,
      },
    });
    return result?.simulationOutputs || null;
  }

  async runSimulation(input: RunSimulationDto) {
    try {
      const simulationResult = this.runSimulationLogic(input);

      // Transaction to ensure data consistency
      const result = await this.prisma.$transaction(async (prisma) => {
        let simulationInput = await this.getSimulationInputByParameters(input);

        // If no matching SimulationInput, create a new one
        if (!simulationInput) {
          simulationInput = await prisma.simulationInput.create({
            data: {
              chargePoints: input.chargePoints,
              arrivalMultiplier: input.arrivalMultiplier,
              carConsumptionKwh: input.carConsumptionKwh,
              chargingPowerKw: input.chargingPowerKw,
            },
          });
        }

        // Create SimulationOutput linked to SimulationInput
        const simulationOutput = await prisma.simulationOutput.create({
          data: {
            inputId: simulationInput.id,
            chargingValues: simulationResult.chargingValues,
            exemplaryDay: simulationResult.exemplaryDay,
            totalEnergyChargedKwh: simulationResult.totalEnergyChargedKwh,
            chargingEventsYear: simulationResult.chargingEventsYear,
            chargingEventsMonth: simulationResult.chargingEventsMonth,
            chargingEventsWeek: simulationResult.chargingEventsWeek,
            chargingEventsDay: simulationResult.chargingEventsDay,
          },
        });

        return simulationOutput;
      });

      return result;
    } catch {
      throw new Error("Failed to run simulation");
    }
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
}
