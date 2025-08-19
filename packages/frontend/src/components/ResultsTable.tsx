import { energyPricePerHourInEuro } from "../utils/constants"
import type { SimulationOptions, SimulationResult } from "../utils/types"
import { SimulationRow } from "./SimulationRow"

interface Props {
  simulationResults: SimulationResult[]
  simulationOptions: SimulationOptions[]
}

export const ResultsTable: React.FC<Props> = ({
  simulationResults,
  simulationOptions,
}) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
      <div className="bg-blue-500 bg-gradient-to-r p-4 text-white">
        <h3 className="mb-3 text-xl font-semibold">
          Simulation Results (1-30 Charging Points)
        </h3>
        <div className="grid grid-cols-7 gap-2 text-xs font-medium md:text-sm">
          <div className="text-center">Chargers</div>
          <div className="text-center">Max Power (kW)</div>
          <div className="text-center">Theoretical Max (kW)</div>
          <div className="text-center">Power Ratio</div>
          <div className="text-center">Charging Events</div>
          <div className="text-center">Energy (kWh)</div>

          <div className="text-center">
            Predicted Cost (€)
            <div className="text-[10px] text-gray-200">
              Based on {energyPricePerHourInEuro} €/kWh
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-h-[500px] overflow-y-auto">
        <div className="p-2">
          {simulationResults.map((result, index) => (
            <SimulationRow
              key={index}
              result={result}
              simulationOptions={simulationOptions[index]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
