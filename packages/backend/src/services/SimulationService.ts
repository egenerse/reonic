import { PrismaClient } from "@prisma/client";

export class SimulationService {
  constructor(private prisma: PrismaClient) {}

  async createSimulation(data: {
    chargePoints: number;
    arrivalMultiplier: number;
    carConsumptionKwh: number;
    chargingPowerKw: number;
  }) {
    return await this.prisma.simulationInput.create({
      data,
      include: {
        simulationOutputs: true,
      },
    });
  }

  async runSimulation(inputId: number) {
    const input = await this.prisma.simulationInput.findUnique({
      where: { id: inputId },
    });

    if (!input) {
      throw new Error("Simulation input not found");
    }

    // TODO: Implement the simulation logic from frontend/src/utils/simulation.ts
    // This is where you'll later move the runSimulation function

    // For now, create a mock output
    const mockOutput = {
      inputId,
      chargingValues: {
        chargepoint1: 100,
        chargepoint2: 150,
      },
      exemplaryDay: {
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          power: Math.random() * 100,
        })),
      },
      totalEnergyChargedKwh: Math.random() * 1000,
      chargingEventsYear: Math.floor(Math.random() * 10000),
      chargingEventsMonth: Math.floor(Math.random() * 1000),
      chargingEventsWeek: Math.floor(Math.random() * 250),
      chargingEventsDay: Math.floor(Math.random() * 50),
    };

    return await this.prisma.simulationOutput.create({
      data: mockOutput,
      include: {
        input: true,
      },
    });
  }

  async getAllSimulations() {
    return await this.prisma.simulationInput.findMany({
      include: {
        simulationOutputs: true,
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
        simulationOutputs: true,
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
        simulationOutputs: true,
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
