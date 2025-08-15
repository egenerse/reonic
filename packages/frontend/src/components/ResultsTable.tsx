import type { SimulationOptions, SimulationResult } from "../utils/types"
import { SimulationRow } from "./SimulationRow"

interface Props {
  simulationResults: SimulationResult[]
  simulationOptions: SimulationOptions
}

export const ResultsTable: React.FC<Props> = ({
  simulationResults,
  simulationOptions,
}) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
        <h3 className="mb-3 text-xl font-semibold">
          Simulation Results (1-30 Charging Points)
        </h3>
        <div className="grid grid-cols-6 gap-2 text-xs font-medium md:text-sm">
          <div className="text-center">Chargers</div>
          <div className="text-center">Max Power (kW)</div>
          <div className="text-center">Power Ratio</div>
          <div className="text-center">Theoretical Max (kW)</div>
          <div className="text-center">Charging Events</div>
          <div className="text-center">Energy (kWh)</div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-h-96 overflow-y-auto">
        <div className="p-2">
          {simulationResults.map((result, index) => (
            <SimulationRow
              key={index}
              result={result}
              simulationOptions={simulationOptions}
            />
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-600">Total Simulations</p>
            <p className="text-xl font-bold text-gray-900">
              {simulationResults.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Max Power Range</p>
            <p className="text-lg font-semibold text-gray-900">
              {Math.min(
                ...simulationResults.map((r) => r.actualMaximumPowerDemandInkW)
              ).toFixed(2)}{" "}
              -{" "}
              {Math.max(
                ...simulationResults.map((r) => r.actualMaximumPowerDemandInkW)
              ).toFixed(2)}{" "}
              kW
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Best Efficiency</p>
            <p className="text-lg font-semibold text-gray-900">
              {Math.min(
                ...simulationResults.map(
                  (r) => r.ratioOfActualToMaximumPowerDemand
                )
              ).toFixed(3)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
