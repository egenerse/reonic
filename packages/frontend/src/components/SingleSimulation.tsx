import { useState } from "react";
import type { SimulationOptions, SimulationResult } from "../utils/types";
import { SingleSimulationForm } from "./SingleSimulationForm";
import { runSimulation } from "../utils/simulation";
import { SingleResult } from "./SingleResult";

export const SingleSimulation = () => {
  const [simulationOptions, setSimulationOptions] = useState<SimulationOptions>(
    {
      chargerPowerInkW: 11,
      numberOfChargers: 20,
      numberOfSimulationDays: 365,
      carNeedskWhPer100kms: 18,
    }
  );
  const [simulationResult, setSimulationResult] = useState<SimulationResult>();

  const onRunSimulation = () => {
    setSimulationResult(runSimulation(simulationOptions));
  };

  return (
    <div className="flex flex-col justify-center items-center mb-5">
      <SingleSimulationForm
        simulationOptions={simulationOptions}
        setSimulationOptions={setSimulationOptions}
      />
      <button
        className=" px-6 py-3 text-white font-semibold rounded-md bg-blue-400"
        onClick={onRunSimulation}
      >
        Run Simulation
      </button>

      {simulationResult && (
        <div className="my-4">
          <SingleResult result={simulationResult} />
        </div>
      )}
    </div>
  );
};
