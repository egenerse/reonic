import React from "react"
import { InputField, RangeInput } from "./inputs"
import {
  type ChargerConfiguration,
  type SimulationOptions,
} from "../utils/types"
import { Button } from "./buttons/Button"
import { ChargerSummary } from "./ChargerSummary"
import type {
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form"

interface Props {
  chargerConfigurations: ChargerConfiguration[]
  isLoading?: boolean
  register: UseFormRegister<SimulationOptions>
  watch: UseFormWatch<SimulationOptions>
  errors: FieldErrors<SimulationOptions>
  onFormSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
}

export const GraphicSimulationForm: React.FC<Props> = ({
  chargerConfigurations,
  isLoading,
  register,
  watch,
  errors,
  onFormSubmit,
}) => {
  const rangeInputValue = watch("carArrivalProbabilityMultiplier") as number

  return (
    <form
      onSubmit={onFormSubmit}
      className="flex h-full flex-1 flex-col gap-4 rounded-xl bg-blue-200/50 p-4"
    >
      <h2 className="text-semibold text-2xl">Simulation Options</h2>

      <ChargerSummary chargerConfigurations={chargerConfigurations} />

      <div>
        <InputField
          {...register("numberOfSimulationDays", {
            valueAsNumber: true,
          })}
          max={365}
          min={1}
          label="Number of Simulation Days"
          error={errors.numberOfSimulationDays?.message}
        />
      </div>

      <div>
        <InputField
          {...register("carNeedskWhPer100kms", {
            valueAsNumber: true,
          })}
          label="Car Needs (kWh/100km)"
          error={errors.carNeedskWhPer100kms?.message}
        />
      </div>

      <div>
        <RangeInput
          {...register("carArrivalProbabilityMultiplier", {
            valueAsNumber: true,
          })}
          label="Car Arrival Probability Multiplier"
          min={20}
          max={220}
          step={10}
          value={rangeInputValue}
          showPercentage
          error={errors.carArrivalProbabilityMultiplier?.message}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Running..." : "Run"}
      </Button>
    </form>
  )
}
