import { Resolver, Query, Mutation, Arg, Ctx, Int, ID } from "type-graphql";
import { SimulationInput, SimulationOutput } from "../types/SimulationTypes";
import {
  CreateSimulationInputDto,
  UpdateSimulationInputDto,
} from "../types/SimulationDtos";
import { Context } from "../index";

@Resolver()
@Resolver()
export class SimulationResolver {
  // Main query - gets simulation by parameters, creates if doesn't exist
  @Query(() => SimulationInput)
  async getSimulation(
    @Arg("params", () => CreateSimulationInputDto)
    params: CreateSimulationInputDto,
    @Ctx() { simulationService }: Context
  ): Promise<SimulationInput> {
    return (await simulationService.getSimulationByParameters(
      params
    )) as SimulationInput;
  }

  @Query(() => [SimulationInput])
  async simulationResults(
    @Ctx() { simulationService }: Context
  ): Promise<SimulationInput[]> {
    return (await simulationService.getAllSimulations()) as SimulationInput[];
  }

  @Query(() => SimulationInput, { nullable: true })
  async simulationResult(
    @Arg("id", () => Int) id: number,
    @Ctx() { simulationService }: Context
  ): Promise<SimulationInput | null> {
    return (await simulationService.getSimulationById(
      id
    )) as SimulationInput | null;
  }

  @Mutation(() => SimulationInput)
  async createSimulation(
    @Arg("data", () => CreateSimulationInputDto)
    data: CreateSimulationInputDto,
    @Ctx() { simulationService }: Context
  ): Promise<SimulationInput> {
    return (await simulationService.createAndRunSimulation(
      data
    )) as SimulationInput;
  }

  @Mutation(() => SimulationInput, { nullable: true })
  async updateSimulation(
    @Arg("id", () => Int) id: number,
    @Arg("data", () => UpdateSimulationInputDto)
    data: UpdateSimulationInputDto,
    @Ctx() { simulationService }: Context
  ): Promise<SimulationInput | null> {
    return (await simulationService.updateSimulation(
      id,
      data
    )) as SimulationInput | null;
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
