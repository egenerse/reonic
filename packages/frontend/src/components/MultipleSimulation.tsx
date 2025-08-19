import { useRef, useState } from "react"
import { runSimulation } from "../utils/simulation"
import {
  simulationOptionsSchema,
  type SimulationOptions,
  type SimulationResult,
} from "../utils/types"
import { ResultsTable } from "./ResultsTable"
import { InputField } from "./inputs"
import { RangeInput } from "./inputs"
import { multipleSimulationsInitialState } from "../utils/constants"
import { Button } from "./buttons/Button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export const MultipleSimulation = () => {
  const resultTableRef = useRef<HTMLDivElement>(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(simulationOptionsSchema),
    defaultValues: multipleSimulationsInitialState,
  })

  const [resultSimulationOptions, setResultSimulationOptions] = useState<
    SimulationOptions[]
  >([])
  const [results, setResults] = useState<SimulationResult[]>([])

  const onSubmit = handleSubmit(async (data) => {
    for (let i = 1; i <= 30; i++) {
      const options: SimulationOptions = {
        ...data,
        chargerConfigurations: data.chargerConfigurations.map((config) => ({
          ...config,
          quantity: i,
        })),
      }

      const result = runSimulation(options)
      setResults((old) => [...old, result])
      setResultSimulationOptions((old) => [...old, options])
      resultTableRef.current?.scrollIntoView({ behavior: "smooth" })

      await new Promise((resolve) => setTimeout(resolve, 10))
    }
  })

  const rangeInputValue = watch("carArrivalProbabilityMultiplier") as number

  return (
    <section className="flex flex-col items-center bg-blue-100 p-4">
      <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
        Run Multiple Simulations
      </h1>

      <div className="mb-8 rounded-lg border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Simulation Parameters
        </h2>

        <form
          className="flex flex-1 flex-col gap-3 px-10 md:px-20 lg:px-40"
          onSubmit={onSubmit}
        >
          <div className="flex flex-wrap justify-between gap-3">
            <InputField
              {...register("carNeedskWhPer100kms", { valueAsNumber: true })}
              label="Car Efficiency (kWh/100km)"
              error={errors.carNeedskWhPer100kms?.message}
            />

            <InputField
              {...register("numberOfSimulationDays", { valueAsNumber: true })}
              label="Simulation Days"
              error={errors.numberOfSimulationDays?.message}
            />

            <RangeInput
              {...register("carArrivalProbabilityMultiplier", {
                valueAsNumber: true,
              })}
              label="Car Arrival Probability Multiplier"
              min={20}
              max={220}
              step={10}
              showPercentage
              value={rangeInputValue}
              error={errors.carArrivalProbabilityMultiplier?.message}
            />
          </div>

          <Button disabled={isSubmitting} type="submit">
            {isSubmitting
              ? `Running... (${results.length}/30)`
              : "Run Simulations (1-30 Chargers)"}
          </Button>
        </form>
      </div>

      <div
        ref={resultTableRef}
        className="my-10 flex flex-col items-center md:mx-20"
      >
        {results.length > 0 && (
          <>
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Charging Station Analysis
            </h2>
            <ResultsTable
              simulationResults={results}
              simulationOptions={resultSimulationOptions}
            />
          </>
        )}
      </div>
    </section>
  )
}
