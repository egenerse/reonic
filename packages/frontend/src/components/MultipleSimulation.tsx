import { useState } from "react";
import { runSimulation } from "../utils/simulation";
import type { SimulationOptions, SimulationResult } from "../utils/types";
import { ResultsTable } from "./ResultsTable";

export const MultipleSimulation = () => {
  const [simulatorOptions, setSimulatorOptions] = useState<SimulationOptions>({
    chargerPowerInkW: 11,
    numberOfChargers: 20,
    numberOfSimulationDays: 365,
    carNeedskWhPer100kms: 18,
  });

  const [results, setResults] = useState<SimulationResult[]>([]);

  const [isRunning, setIsRunning] = useState(false);

  const runAllSimulations = async () => {
    setIsRunning(true);
    setResults([]);

    const allResults: SimulationResult[] = [];

    // Run simulations for 1 to 30 charging points
    for (let i = 1; i <= 30; i++) {
      const options: SimulationOptions = {
        ...simulatorOptions,
        numberOfChargers: i,
      };

      const result = runSimulation(options);
      allResults.push(result);

      setResults([...allResults]);

      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Run Multiple Simulations
        </h1>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Simulation Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Charger Power (kW)
              </label>
              <input
                name="chargerPowerInkW"
                type="number"
                min={1}
                step={0.1}
                value={simulatorOptions.chargerPowerInkW}
                onChange={(e) =>
                  setSimulatorOptions((old) => ({
                    ...old,
                    chargerPowerInkW: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Simulation Days
              </label>
              <input
                name="numberOfSimulationDays"
                type="number"
                min={1}
                value={simulatorOptions.numberOfSimulationDays}
                onChange={(e) =>
                  setSimulatorOptions((old) => ({
                    ...old,
                    numberOfSimulationDays: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Car Efficiency (kWh/100km)
              </label>
              <input
                name="carNeedskWhPer100kms"
                type="number"
                min={1}
                step={0.1}
                value={simulatorOptions.carNeedskWhPer100kms}
                onChange={(e) =>
                  setSimulatorOptions((old) => ({
                    ...old,
                    carNeedskWhPer100kms: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-end">
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
            <ResultsTable simulationResults={results} />
          </div>
        )}
      </div>
    </div>
  );
};
