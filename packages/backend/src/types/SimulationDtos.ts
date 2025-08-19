import { InputType, Field, Int, Float } from "type-graphql";
import { Min, Max, IsNumber, IsPositive } from "class-validator";

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

@InputType()
export class RunSimulationDto {
  @Field(() => Int, { description: "Number of charge points (1-30)" })
  @IsNumber({}, { message: "Charge points must be a number" })
  @Min(1, { message: "Minimum 1 charge point required" })
  @Max(30, { message: "Maximum 30 charge points allowed" })
  chargePoints!: number;

  @Field(() => Float, {
    defaultValue: 1.0,
    description: "Arrival rate multiplier (0.2-2.0)",
  })
  @IsNumber({}, { message: "Arrival multiplier must be a number" })
  @IsPositive({ message: "Arrival multiplier must be positive" })
  @Min(0.2, { message: "Minimum arrival multiplier is 0.2" })
  @Max(2.0, { message: "Maximum arrival multiplier is 2.0" })
  arrivalMultiplier!: number;

  @Field(() => Float, { defaultValue: 18.0 })
  @IsNumber({}, { message: "Car consumption must be a number" })
  @IsPositive({ message: "Car consumption must be positive" })
  @Min(0.000001, { message: "Minimum car consumption is 0.000001 kWh" })
  carConsumptionKwh!: number;

  @Field(() => Float, { defaultValue: 11.0 })
  @IsNumber({}, { message: "Charging power must be a number" })
  @IsPositive({ message: "Charging power must be positive" })
  chargingPowerKw!: number;
}
