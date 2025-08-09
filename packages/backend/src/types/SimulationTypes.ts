import { ObjectType, Field, Int, Float, ID } from "type-graphql";
import { GraphQLJSONObject } from "graphql-scalars";

@ObjectType()
export class SimulationInput {
  @Field(() => ID)
  id!: number;

  @Field(() => Int)
  chargePoints!: number;

  @Field(() => Float)
  arrivalMultiplier!: number;

  @Field(() => Float)
  carConsumptionKwh!: number;

  @Field(() => Float)
  chargingPowerKw!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => [SimulationOutput], { nullable: true })
  simulationOutputs?: SimulationOutput[];
}

@ObjectType()
export class SimulationOutput {
  @Field(() => ID)
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

  @Field()
  createdAt!: Date;

  @Field(() => SimulationInput)
  input!: SimulationInput;
}
