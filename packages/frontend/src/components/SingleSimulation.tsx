import { useState } from "react"
import { SingleSimulationGraphic } from "./SingleSimulationGraphic"
import { SingleSimulationFormBased } from "./SingleSimulationFormBased"

type SimulationType = "form" | "graphic"

export const SingleSimulation = () => {
  const [selectedSimulation, setSelectedSimulation] =
    useState<SimulationType>("graphic")

  return (
    <div id="single-simulation" className="min-h-screen">
      <div className="mx-auto max-w-7xl pt-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
          Charging Station Simulator
        </h1>
      </div>
      <div className="mx-auto mb-8 max-w-7xl">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setSelectedSimulation("form")}
            className={`rounded-lg px-6 py-3 font-medium transition-colors ${
              selectedSimulation === "form"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-blue-200 text-blue-800 hover:bg-blue-300"
            }`}
          >
            Form-Based Simulation
          </button>
          <button
            onClick={() => setSelectedSimulation("graphic")}
            className={`rounded-lg px-6 py-3 font-medium transition-colors ${
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
  )
}
