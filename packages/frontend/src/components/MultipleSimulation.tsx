import { useState } from "react";
import { runSimulation } from "../utils/simulation";
import type { SimulationOptions, SimulationResult } from "../utils/types";
import { ResultsTable } from "./ResultsTable";
import { InputField, SelectInput } from "./inputs";
import { RangeInput } from "./inputs";
import { defaultSimulationOptions } from "../utils/contants";

export const MultipleSimulation = () => {
  const [simulationOptions, setSimulationOptions] = useState<SimulationOptions>(
    defaultSimulationOptions
  );

  const [results, setResults] = useState<SimulationResult[]>([]);

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

    const allResults: SimulationResult[] = [];

    // Run simulations for 1 to 30 charging points
    for (let i = 1; i <= 30; i++) {
      const options: SimulationOptions = {
        ...simulationOptions,
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
    <div className=" p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Run Multiple Simulations
        </h1>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Simulation Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <SelectInput
              id="numberOfChargers"
              label="Number of Chargers"
              name="numberOfChargers"
              value={simulationOptions.numberOfChargers}
              options={Array.from({ length: 30 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1} Charger${i + 1 === 1 ? "" : "s"}`,
              }))}
              onChange={handleOptionsChange}
            />

            <SelectInput
              id="chargerPowerInkW"
              label="Charger Power (kW)"
              name="chargerPowerInkW"
              value={simulationOptions.chargerPowerInkW}
              options={[
                { value: 2.75, label: "2.75 kW" },
                { value: 5.5, label: "5.5 kW" },
                { value: 11, label: "11 kW" },
                { value: 18, label: "18 kW" },
                { value: 25, label: "25 kW" },
                { value: 50, label: "50 kW" },
                { value: 100, label: "100 kW" },
              ]}
              onChange={handleOptionsChange}
            />

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
            <ResultsTable simulationResults={results} />
          </div>
        )}
      </div>
    </div>
  );
};
