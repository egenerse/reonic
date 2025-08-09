import { Resolver, Query, Mutation, Arg, Ctx, Int, ID } from "type-graphql";
import { SimulationInput, SimulationOutput } from "../types/SimulationTypes";
import {
  CreateSimulationInputDto,
  UpdateSimulationInputDto,
} from "../types/SimulationInputs";
import { Context } from "../index";

@Resolver()
export class SimulationResolver {
  // CRUD Operations for SimulationInput

  @Query(() => [SimulationInput])
  async simulationInputs(
    @Ctx() { prisma }: Context
  ): Promise<SimulationInput[]> {
    return await prisma.simulationInput.findMany({
      include: {
        simulationOutputs: {
          include: {
            input: true,
          },
        },
      },
    });
  }

  @Query(() => SimulationInput, { nullable: true })
  async simulationInput(
    @Arg("id", () => ID) id: number,
    @Ctx() { prisma }: Context
  ): Promise<SimulationInput | null> {
    return await prisma.simulationInput.findUnique({
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

  @Mutation(() => SimulationInput)
  async createSimulationInput(
    @Arg("data") data: CreateSimulationInputDto,
    @Ctx() { prisma }: Context
  ): Promise<SimulationInput> {
    return await prisma.simulationInput.create({
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

  @Mutation(() => SimulationInput, { nullable: true })
  async updateSimulationInput(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateSimulationInputDto,
    @Ctx() { prisma }: Context
  ): Promise<SimulationInput | null> {
    return await prisma.simulationInput.update({
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

  @Mutation(() => Boolean)
  async deleteSimulationInput(
    @Arg("id", () => ID) id: number,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    try {
      await prisma.simulationInput.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // CRUD Operations for SimulationOutput

  @Query(() => [SimulationOutput])
  async simulationOutputs(
    @Ctx() { prisma }: Context
  ): Promise<SimulationOutput[]> {
    return await prisma.simulationOutput.findMany({
      include: {
        input: true,
      },
    });
  }

  @Query(() => SimulationOutput, { nullable: true })
  async simulationOutput(
    @Arg("id", () => ID) id: number,
    @Ctx() { prisma }: Context
  ): Promise<SimulationOutput | null> {
    return await prisma.simulationOutput.findUnique({
      where: { id },
      include: {
        input: true,
      },
    });
  }

  @Query(() => [SimulationOutput])
  async simulationOutputsByInputId(
    @Arg("inputId", () => ID) inputId: number,
    @Ctx() { prisma }: Context
  ): Promise<SimulationOutput[]> {
    return await prisma.simulationOutput.findMany({
      where: { inputId },
      include: {
        input: true,
      },
    });
  }

  @Mutation(() => Boolean)
  async deleteSimulationOutput(
    @Arg("id", () => ID) id: number,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    try {
      await prisma.simulationOutput.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
