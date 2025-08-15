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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            <div className="col-span-3 col-start-2 col-end-5">
              <ChargerConfigurationForm
                chargerConfigurations={simulationOptions.chargerConfigurations}
                onChargerConfigurationsChange={
                  handleChargerConfigurationsChange
                }
              />
            </div>
            <InputField
              className="col-start-2 row-start-2"
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
              className="col-start-3 row-start-2"
              id="numberOfSimulationDays"
              name="numberOfSimulationDays"
              label="Simulation Days"
              type="number"
              min={1}
              value={simulationOptions.numberOfSimulationDays}
              onChange={handleOptionsChange}
            />

            <RangeInput
              className="col-start-4 row-start-2"
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

            <div className="flex items-end lg:col-span-3 lg:col-start-2">
              <button
                onClick={runAllSimulations}
                disabled={isRunning}
                className={`w-full rounded-md px-6 py-3 font-semibold text-white transition-colors duration-200 ${
                  isRunning
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                }`}
              >
                {isRunning
                  ? `Running... (${results.length}/30)`
                  : "Run Simulations (1-30 Chargers)"}
              </button>
            </div>
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
