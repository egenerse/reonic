import type { SimulationResult } from "../utils/types";
import { SimulationRow } from "./SimulationRow";

interface Props {
  simulationResults: SimulationResult[];
}

export const ResultsTable: React.FC<Props> = ({ simulationResults }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <h3 className="text-xl font-semibold mb-3">
          Simulation Results (1-30 Charging Points)
        </h3>
        <div className="grid grid-cols-6 gap-2 font-medium  text-xs md:text-sm">
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
            <SimulationRow key={index} result={result} />
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
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
              ).toFixed(1)}{" "}
              -{" "}
              {Math.max(
                ...simulationResults.map((r) => r.actualMaximumPowerDemandInkW)
              ).toFixed(1)}{" "}
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
  );
};
