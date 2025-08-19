import { useRef, useState } from "react"
import { SingleSimulationResult } from "./SingleSimulationResult"
import { Button } from "./buttons/Button"
import {
  simulationOptionsSchema,
  type SimulationOptions,
  type SimulationResult,
} from "../utils/types"
import { ChargerConfigurationForm } from "./ChargerConfiguration"
import { ChargerSummary } from "./ChargerSummary"
import { InputField, RangeInput } from "./inputs"
import { useForm } from "react-hook-form"
import { runSimulation } from "../utils/simulation"
import { defaultSimulationOptions } from "../utils/constants"
import { zodResolver } from "@hookform/resolvers/zod"

export const FormBasedSimulation = () => {
  const resultRef = useRef<HTMLDivElement>(null)
  const [simulationResult, setSimulationResult] = useState<SimulationResult>()
  const [resultSimulationOptions, setResultSimulationOptions] =
    useState<SimulationOptions>()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(simulationOptionsSchema),
    defaultValues: defaultSimulationOptions,
  })

  const chargerConfigurations = watch("chargerConfigurations") ?? []

  const onFormSubmit = handleSubmit((data) => {
    const result = runSimulation(data)
    setResultSimulationOptions(data)
    setSimulationResult(result)
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" })
    }
  })

  const rangeInputValue = watch("carArrivalProbabilityMultiplier") as number

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mb-5 flex flex-col items-center justify-center">
        <form
          className="mb-4 rounded-2xl bg-blue-300 p-6"
          onSubmit={onFormSubmit}
        >
          <ChargerConfigurationForm
            chargerConfigurations={chargerConfigurations}
            onChargerConfigurationsChange={(configurations) => {
              setValue("chargerConfigurations", configurations)
            }}
            error={errors.chargerConfigurations?.message}
          />

          <ChargerSummary
            chargerConfigurations={chargerConfigurations}
            className="mt-2"
          />

          <div className="grid grid-cols-1 gap-4 border-blue-400 pt-4 md:grid-cols-2">
            <div>
              <InputField
                {...register("numberOfSimulationDays", { valueAsNumber: true })}
                label="Number of Simulation Days"
                error={errors.numberOfSimulationDays?.message}
              />
            </div>
            <div>
              <InputField
                {...register("carNeedskWhPer100kms")}
                label="Car Needs (kWh/100km)"
                error={errors.carNeedskWhPer100kms?.message}
              />
            </div>
            <div className="md:col-span-2">
              <RangeInput
                {...register("carArrivalProbabilityMultiplier", {
                  valueAsNumber: true,
                })}
                label="Car Arrival Probability Multiplier"
                min={20}
                max={220}
                step={5}
                showPercentage
                value={rangeInputValue}
                error={errors.carArrivalProbabilityMultiplier?.message}
              />
            </div>
          </div>

          <ActionButtons isLoading={isSubmitting} resetOptions={reset} />
        </form>
      </div>

      <div ref={resultRef}>
        {simulationResult && resultSimulationOptions && (
          <SingleSimulationResult
            result={simulationResult}
            simulationOptions={resultSimulationOptions}
          />
        )}
      </div>
    </div>
  )
}

interface ActionButtonsProps {
  isLoading: boolean
  resetOptions: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isLoading,
  resetOptions,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Running..." : "Run Simulation"}
      </Button>

      <Button variant="danger" onClick={resetOptions} disabled={isLoading}>
        Reset Options
      </Button>
    </div>
  )
}
