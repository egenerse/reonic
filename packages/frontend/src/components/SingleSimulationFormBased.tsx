import { useRef, useState } from "react"
import {
  simulationOptionsSchema,
  type SimulationOptions,
  type SimulationResult,
} from "../utils/types"
import { SingleSimulationForm } from "./SingleSimulationForm"
import { runSimulation } from "../utils/simulation"
import { SingleResult } from "./SingleResult"
import { defaultSimulationOptions } from "../utils/constants"
import { Button } from "./buttons/Button"
import type { ZodError } from "zod"

export const SingleSimulationFormBased = () => {
  const simulationResultWrapperRef = useRef<HTMLDivElement>(null)
  const [simulationOptions, setSimulationOptions] = useState<SimulationOptions>(
    defaultSimulationOptions
  )
  const [error, setError] = useState<ZodError<SimulationOptions>>()
  const [simulationResult, setSimulationResult] = useState<SimulationResult>()
  const [resultSimulationOptions, setResultSimulationOptions] =
    useState<SimulationOptions>(defaultSimulationOptions)

  const onRunSimulation = () => {
    const { data, error, success } =
      simulationOptionsSchema.safeParse(simulationOptions)

    setError(error)

    if (success) {
      setSimulationResult(runSimulation(data))
      setResultSimulationOptions(data)
      simulationResultWrapperRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const onResetOptions = () => {
    setError(undefined)
    setSimulationOptions(defaultSimulationOptions)
  }

  return (
    <div className="mb-5 flex flex-col items-center justify-center">
      <SingleSimulationForm
        error={error}
        simulationOptions={simulationOptions}
        setSimulationOptions={setSimulationOptions}
      />
      <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
        <Button onClick={onRunSimulation}>Run Simulation</Button>

        <Button variant="danger" onClick={onResetOptions}>
          Reset Options
        </Button>
      </div>

      <div className="my-4" ref={simulationResultWrapperRef}>
        {simulationResult && (
          <SingleResult
            result={simulationResult}
            simulationOptions={resultSimulationOptions}
          />
        )}
      </div>
    </div>
  )
}
