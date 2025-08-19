import { Resolver, Query, Mutation, Arg, Int, Ctx } from "type-graphql";
import { SimulationInput, SimulationOutput } from "../types/SimulationTypes";
import {
  CreateSimulationInputDto,
  UpdateSimulationInputDto,
  RunSimulationDto,
} from "../types/SimulationDtos";
import { Context } from "../index";

@Resolver()
export class SimulationResolver {
  @Query(() => [SimulationInput])
  async getAllSimulationInputs(
    @Ctx() ctx: Context
  ): Promise<SimulationInput[]> {
    return await ctx.simulationService.getAllSimulationInputs();
  }

  @Query(() => SimulationInput, { nullable: true })
  async getSimulationInputById(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: Context
  ): Promise<SimulationInput | null> {
    return await ctx.simulationService.getSimulationInputById(id);
  }

  @Mutation(() => SimulationInput)
  async createSimulationInput(
    @Arg("data", () => CreateSimulationInputDto)
    data: CreateSimulationInputDto,
    @Ctx() ctx: Context
  ): Promise<SimulationInput> {
    return await ctx.simulationService.createSimulationInput(data);
  }

  @Mutation(() => SimulationInput)
  async updateSimulationInput(
    @Arg("id", () => Int) id: number,
    @Arg("data", () => UpdateSimulationInputDto)
    data: UpdateSimulationInputDto,
    @Ctx() ctx: Context
  ): Promise<SimulationInput> {
    const exists = await ctx.simulationService.simulationInputExists(id);
    if (!exists) {
      throw new Error(`Simulation input with ID ${id} not found`);
    }
    return await ctx.simulationService.updateSimulationInput(id, data);
  }

  @Mutation(() => Boolean)
  async deleteSimulationInput(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    const exists = await ctx.simulationService.simulationInputExists(id);
    if (!exists) {
      throw new Error(`Simulation input with ID ${id} not found`);
    }
    await ctx.simulationService.deleteSimulationInput(id);
    return true;
  }

  @Query(() => [SimulationOutput])
  async getSimulationOutputById(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: Context
  ): Promise<SimulationOutput[] | null> {
    return await ctx.simulationService.getSimulationOutputByInputId(id);
  }

  @Query(() => [SimulationOutput])
  async getSimulationOutputBySimulationInputs(
    @Arg("query", () => RunSimulationDto)
    query: RunSimulationDto,
    @Ctx() ctx: Context
  ): Promise<SimulationOutput[] | null> {
    return await ctx.simulationService.getSimulationOutputBySimulationInputs(
      query
    );
  }

  @Mutation(() => SimulationOutput)
  async runSimulation(
    @Arg("query", () => RunSimulationDto)
    query: RunSimulationDto,
    @Ctx() ctx: Context
  ): Promise<SimulationOutput> {
    return await ctx.simulationService.runSimulation(query);
  }
}
