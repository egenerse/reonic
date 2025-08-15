import { useState } from "react"
import type { SimulationOptions, SimulationResult } from "../utils/types"
import { SingleSimulationForm } from "./SingleSimulationForm"
import { runSimulation } from "../utils/simulation"
import { SingleResult } from "./SingleResult"
import { defaultSimulationOptions } from "../utils/constants"
import { validateSimulationOptions } from "../utils/formValidation"
import { Button } from "./buttons/Button"

export const SingleSimulationFormBased = () => {
  const [simulationOptions, setSimulationOptions] = useState<SimulationOptions>(
    defaultSimulationOptions
  )
  const [errors, setErrors] = useState<string[]>([])
  const [simulationResult, setSimulationResult] = useState<SimulationResult>()
  const [resultSimulationOptions, setResultSimulationOptions] =
    useState<SimulationOptions>(defaultSimulationOptions)

  const onRunSimulation = () => {
    const errors = validateSimulationOptions(simulationOptions)
    if (errors.length > 0) {
      setErrors(errors)
      return
    }
    setErrors([])
    setSimulationResult(runSimulation(simulationOptions))
    setResultSimulationOptions(simulationOptions)
  }

  const onResetOptions = () => {
    setErrors([])
    setSimulationOptions(defaultSimulationOptions)
  }

  return (
    <div className="mb-5 flex flex-col items-center justify-center">
      {errors.length > 0 && (
        <div className="mb-4">
          <h3 className="text-red-500">Form Errors:</h3>
          <ul className="list-inside list-disc">
            {errors.map((error, index) => (
              <li key={index} className="text-red-500">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      <SingleSimulationForm
        simulationOptions={simulationOptions}
        setSimulationOptions={setSimulationOptions}
      />
      <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
        <Button onClick={onRunSimulation}>Run Simulation</Button>

        <Button variant="danger" onClick={onResetOptions}>
          Reset Options
        </Button>
      </div>

      {simulationResult && (
        <div className="my-4">
          <SingleResult
            result={simulationResult}
            simulationOptions={resultSimulationOptions}
          />
        </div>
      )}
    </div>
  )
}
