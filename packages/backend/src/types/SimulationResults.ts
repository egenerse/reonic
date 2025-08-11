import { InputType, Field, Int, Float } from "type-graphql";

@InputType()
export class CreateSimulationInputDto {
  @Field(() => Int)
  chargePoints!: number;

  @Field(() => Float, { defaultValue: 1.0 })
  arrivalMultiplier!: number;

  @Field(() => Float, { defaultValue: 18.0 })
  carConsumptionKwh!: number;

  @Field(() => Float, { defaultValue: 11.0 })
  chargingPowerKw!: number;
}

@InputType()
export class UpdateSimulationInputDto {
  @Field(() => Int, { nullable: true })
  chargePoints?: number;

  @Field(() => Float, { nullable: true })
  arrivalMultiplier?: number;

  @Field(() => Float, { nullable: true })
  carConsumptionKwh?: number;

  @Field(() => Float, { nullable: true })
  chargingPowerKw?: number;
}
