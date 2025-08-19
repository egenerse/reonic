import { PrismaClient } from "@prisma/client";
import {
  CreateSimulationInputDto,
  UpdateSimulationInputDto,
  RunSimulationDto,
} from "../types/SimulationDtos";
import { fork } from "child_process";
import path from "path";
import { RunSimulationResult } from "../types/SimulationResult";
import { SimulationOutput } from "../types/SimulationTypes";

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
      // Handle event based communication in a separate thread
      const simulationResult = await new Promise<RunSimulationResult>(
        (resolve, reject) => {
          const subProcess = fork(
            path.resolve(__dirname, "../heavyWork", "runSimulation.ts")
          );

          const timeout = setTimeout(() => {
            subProcess.kill();
            reject(new Error("Subprocess timed out after 30 seconds"));
          }, 30000);

          subProcess.send(input);

          subProcess.once("message", (result: RunSimulationResult) => {
            clearTimeout(timeout);
            resolve(result);
          });

          subProcess.once("error", (error) => {
            clearTimeout(timeout);
            subProcess.kill();
            reject(new Error(`Subprocess error: ${error.message}`));
          });

          subProcess.once("exit", (code) => {
            clearTimeout(timeout);
            if (code !== 0) {
              reject(new Error(`Subprocess exited with code ${code}`));
            }
          });
        }
      );

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
}
