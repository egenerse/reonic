import { useState } from "react";
import { runSimulation } from "../utils/simulation";
import type {
  ChargerConfiguration,
  SimulationOptions,
  SimulationResult,
} from "../utils/types";
import { ResultsTable } from "./ResultsTable";
import { InputField } from "./inputs";
import { RangeInput } from "./inputs";
import { defaultSimulationOptions } from "../utils/contants";
import { ChargerConfigurationForm } from "./ChargerConfiguration";

export const MultipleSimulation = () => {
  const [simulationOptions, setSimulationOptions] = useState<SimulationOptions>(
    defaultSimulationOptions
  );
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [resultSimulationOptions, setResultSimulationOptions] =
    useState<SimulationOptions>(defaultSimulationOptions);

  const handleOptionsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSimulationOptions({
      ...simulationOptions,
      [name]: Number(value),
    });
  };

  const [isRunning, setIsRunning] = useState(false);

  const runAllSimulations = async () => {
    setIsRunning(true);
    setResults([]);
    setResultSimulationOptions(defaultSimulationOptions);

    const allResults: SimulationResult[] = [];

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
      };

      const result = runSimulation(options);
      allResults.push(result);

      setResults([...allResults]);

      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    setIsRunning(false);
  };
  const handleChargerConfigurationsChange = (
    configurations: ChargerConfiguration[]
  ) => {
    setSimulationOptions({
      ...simulationOptions,
      chargerConfigurations: configurations,
    });
  };

  return (
    <div className=" p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Run Multiple Simulations
        </h1>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Simulation Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="col-span-3 col-start-2 col-end-5">
              <ChargerConfigurationForm
                chargerConfigurations={simulationOptions.chargerConfigurations}
                onChargerConfigurationsChange={
                  handleChargerConfigurationsChange
                }
              />
            </div>
            <InputField
              className="row-start-2 col-start-2"
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
              className="row-start-2 col-start-3"
              id="numberOfSimulationDays"
              name="numberOfSimulationDays"
              label="Simulation Days"
              type="number"
              min={1}
              value={simulationOptions.numberOfSimulationDays}
              onChange={handleOptionsChange}
            />

            <RangeInput
              className="row-start-2 col-start-4"
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

            <div className="flex items-end lg:col-start-2 lg:col-span-3">
              <button
                onClick={runAllSimulations}
                disabled={isRunning}
                className={`w-full px-6 py-3 text-white font-semibold rounded-md transition-colors duration-200 ${
                  isRunning
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
          <div className="mt-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
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
  );
};
