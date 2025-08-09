import { useState } from "react";
import type { SimulationOptions, SimulationResult } from "../utils/types";
import { SingleSimulationForm } from "./SingleSimulationForm";
import { runSimulation } from "../utils/simulation";
import { SingleResult } from "./SingleResult";
import { defaultSimulationOptions } from "../utils/contants";
import { validateSimulationOptions } from "../utils/formValidation";

export const SingleSimulation = () => {
  const [simulationOptions, setSimulationOptions] = useState<SimulationOptions>(
    defaultSimulationOptions
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult>();

  const onRunSimulation = () => {
    const errors = validateSimulationOptions(simulationOptions);
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }
    setErrors([]);
    setSimulationResult(runSimulation(simulationOptions));
  };

  const onResetOptions = () => {
    setErrors([]);
    setSimulationOptions(defaultSimulationOptions);
  };

  return (
    <div className="flex flex-col justify-center items-center mb-5">
      {errors.length > 0 && (
        <div className="mb-4">
          <h3 className="text-red-500">Form Errors:</h3>
          <ul className="list-disc list-inside">
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
      <div className="flex gap-2 flex-col items-center justify-center md:flex-row">
        <button
          className=" px-6 py-3 text-white font-semibold rounded-md bg-blue-400"
          onClick={onRunSimulation}
        >
          Run Simulation
        </button>
        <button
          className=" px-6 py-3 text-white font-semibold rounded-md bg-red-400"
          onClick={onResetOptions}
        >
          Reset Options
        </button>
      </div>

      {simulationResult && (
        <div className="my-4">
          <SingleResult result={simulationResult} />
        </div>
      )}
    </div>
  );
};
