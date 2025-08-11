import { ObjectType, Field, Int, Float, ID } from "type-graphql";
import { GraphQLJSONObject } from "graphql-scalars";

@ObjectType()
export class SimulationInput {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  chargePoints!: number;

  @Field(() => Float)
  arrivalMultiplier!: number;

  @Field(() => Float)
  carConsumptionKwh!: number;

  @Field(() => Float)
  chargingPowerKw!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => [SimulationOutput], { nullable: false })
  simulationOutputs!: SimulationOutput[];
}

@ObjectType()
export class SimulationOutput {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  inputId!: number;

  @Field(() => GraphQLJSONObject)
  chargingValues!: any;

  @Field(() => GraphQLJSONObject)
  exemplaryDay!: any;

  @Field(() => Float)
  totalEnergyChargedKwh!: number;

  @Field(() => Int)
  chargingEventsYear!: number;

  @Field(() => Int)
  chargingEventsMonth!: number;

  @Field(() => Int)
  chargingEventsWeek!: number;

  @Field(() => Int)
  chargingEventsDay!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => SimulationInput)
  input!: SimulationInput;
}
