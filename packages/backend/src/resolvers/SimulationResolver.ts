import { Resolver, Query, Mutation, Arg, Ctx, Int, ID } from "type-graphql";
import { SimulationResult, SimulationOutput } from "../types/SimulationTypes";
import {
  CreateSimulationResultDto,
  UpdateSimulationResultDto,
} from "../types/SimulationResults";
import { Context } from "../index";

@Resolver()
export class SimulationResolver {
  // Main query - gets simulation by parameters, creates if doesn't exist
  @Query(() => SimulationResult)
  async getSimulation(
    @Arg("params", () => CreateSimulationResultDto)
    params: CreateSimulationResultDto,
    @Ctx() { simulationService }: Context
  ): Promise<SimulationResult> {
    return (await simulationService.getSimulationByParameters(
      params
    )) as SimulationResult;
  }

  @Query(() => [SimulationResult])
  async simulationResults(
    @Ctx() { simulationService }: Context
  ): Promise<SimulationResult[]> {
    return (await simulationService.getAllSimulations()) as SimulationResult[];
  }

  @Query(() => SimulationResult, { nullable: true })
  async simulationResult(
    @Arg("id", () => Int) id: number,
    @Ctx() { simulationService }: Context
  ): Promise<SimulationResult | null> {
    return (await simulationService.getSimulationById(
      id
    )) as SimulationResult | null;
  }

  @Mutation(() => SimulationResult)
  async createSimulation(
    @Arg("data", () => CreateSimulationResultDto)
    data: CreateSimulationResultDto,
    @Ctx() { simulationService }: Context
  ): Promise<SimulationResult> {
    return (await simulationService.createAndRunSimulation(
      data
    )) as SimulationResult;
  }

  @Mutation(() => SimulationResult, { nullable: true })
  async updateSimulation(
    @Arg("id", () => Int) id: number,
    @Arg("data", () => UpdateSimulationResultDto)
    data: UpdateSimulationResultDto,
    @Ctx() { simulationService }: Context
  ): Promise<SimulationResult | null> {
    return (await simulationService.updateSimulation(
      id,
      data
    )) as SimulationResult | null;
  }

  @Mutation(() => Boolean)
  async deleteSimulation(
    @Arg("id", () => Int) id: number,
    @Ctx() { simulationService }: Context
  ): Promise<boolean> {
    try {
      await simulationService.deleteSimulation(id);
      return true;
    } catch (error) {
      return false;
    }
  }
}
