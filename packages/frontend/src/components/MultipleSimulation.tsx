import { useState } from "react"
import { runSimulation } from "../utils/simulation"
import type {
  ChargerConfiguration,
  SimulationOptions,
  SimulationResult,
} from "../utils/types"
import { ResultsTable } from "./ResultsTable"
import { InputField } from "./inputs"
import { RangeInput } from "./inputs"
import { defaultSimulationOptions } from "../utils/constants"
import { ChargerConfigurationForm } from "./ChargerConfiguration"
import { Button } from "./buttons/Button"

export const MultipleSimulation = () => {
  const [simulationOptions, setSimulationOptions] = useState<SimulationOptions>(
    defaultSimulationOptions
  )
  const [results, setResults] = useState<SimulationResult[]>([])
  const [resultSimulationOptions, setResultSimulationOptions] =
    useState<SimulationOptions>(defaultSimulationOptions)

  const handleOptionsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setSimulationOptions({
      ...simulationOptions,
      [name]: Number(value),
    })
  }

  const [isRunning, setIsRunning] = useState(false)

  const runAllSimulations = async () => {
    setIsRunning(true)
    setResults([])
    setResultSimulationOptions(defaultSimulationOptions)

    const allResults: SimulationResult[] = []

    // Run simulations for 1 to 30 charging points
    for (let i = 1; i <= 30; i++) {
      const options: SimulationOptions = {
        ...simulationOptions,
        chargerConfigurations: simulationOptions.chargerConfigurations.map(
          (config) => ({
            ...config,
            quantity: i,
          })
        ),
      }

      const result = runSimulation(options)
      allResults.push(result)

      setResults([...allResults])

      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    setIsRunning(false)
  }
  const handleChargerConfigurationsChange = (
    configurations: ChargerConfiguration[]
  ) => {
    setSimulationOptions({
      ...simulationOptions,
      chargerConfigurations: configurations,
    })
  }

  return (
    <div className="p-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
          Run Multiple Simulations
        </h1>

        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
            Simulation Parameters
          </h2>

          <div className="flex flex-1 flex-col gap-3 px-10 md:px-20 lg:px-40">
            <ChargerConfigurationForm
              chargerConfigurations={simulationOptions.chargerConfigurations}
              onChargerConfigurationsChange={handleChargerConfigurationsChange}
            />
            <div className="flex flex-wrap justify-between gap-3">
              <InputField
                id="carNeedskWhPer100kms"
                name="carNeedskWhPer100kms"
                label="Car Efficiency (kWh/100km)"
                type="number"
                min={1}
                step={0.1}
                value={simulationOptions.carNeedskWhPer100kms}
                onChange={handleOptionsChange}
              />

              <InputField
                id="numberOfSimulationDays"
                name="numberOfSimulationDays"
                label="Simulation Days"
                type="number"
                min={1}
                value={simulationOptions.numberOfSimulationDays}
                onChange={handleOptionsChange}
              />

              <RangeInput
                id="carArrivalProbabilityMultiplier"
                name="carArrivalProbabilityMultiplier"
                label="Car Arrival Probability Multiplier"
                min={20}
                max={220}
                step={10}
                value={simulationOptions.carArrivalProbabilityMultiplier}
                onChange={handleOptionsChange}
                percentage
              />
            </div>

            <Button onClick={runAllSimulations} disabled={isRunning}>
              {isRunning
                ? `Running... (${results.length}/30)`
                : "Run Simulations (1-30 Chargers)"}
            </Button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="mx-auto mt-8 max-w-7xl">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Charging Station Analysis
            </h2>
            <ResultsTable
              simulationResults={results}
              simulationOptions={resultSimulationOptions}
            />
          </div>
        )}
      </div>
    </div>
  )
}
