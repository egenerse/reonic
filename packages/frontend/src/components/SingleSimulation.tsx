import { useState } from "react";
import { SingleSimulationGraphic } from "./SingleSimulationGraphic";
import { SingleSimulationFormBased } from "./SingleSimulationFormBased";

type SimulationType = "form" | "graphic";

export const SingleSimulation = () => {
  const [selectedSimulation, setSelectedSimulation] =
    useState<SimulationType>("graphic");

  return (
    <div id="single-simulation" className="min-h-screen ">
      {/* Simulation Type Toggle Buttons */}
      <div className=" max-w-7xl mx-auto pt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Charging Station Simulator
        </h1>
      </div>
      <div className="max-w-7xl mx-auto mb-8 ">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setSelectedSimulation("form")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedSimulation === "form"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-blue-200 text-blue-800 hover:bg-blue-300"
            }`}
          >
            Form-Based Simulation
          </button>
          <button
            onClick={() => setSelectedSimulation("graphic")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedSimulation === "graphic"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-blue-200 text-blue-800 hover:bg-blue-300"
            }`}
          >
            Graphic Simulation
          </button>
        </div>
      </div>

      {/* Render Selected Simulation */}
      {selectedSimulation === "form" && <SingleSimulationFormBased />}
      {selectedSimulation === "graphic" && <SingleSimulationGraphic />}
    </div>
  );
};
