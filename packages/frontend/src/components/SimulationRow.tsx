import { calculateNumberOfChargers } from "../utils/charger"
import type { SimulationOptions, SimulationResult } from "../utils/types"

interface Props {
  result: SimulationResult
  simulationOptions: SimulationOptions
}

export const SimulationRow: React.FC<Props> = ({
  result,
  simulationOptions,
}) => {
  const numberOfChargers = calculateNumberOfChargers(
    simulationOptions.chargerConfigurations
  )
  return (
    <div className="grid grid-cols-6 gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-150 hover:bg-gray-50">
      <div className="text-center font-semibold text-gray-900">
        {numberOfChargers}
      </div>
      <div className="text-center text-gray-700">
        {result.actualMaximumPowerDemandInkW.toFixed(1)}
      </div>
      <div className="text-center text-gray-700">
        {result.ratioOfActualToMaximumPowerDemand.toFixed(3)}
      </div>
      <div className="text-center text-gray-700">
        {result.theoreticalMaxPowerDemand.toFixed(1)}
      </div>
      <div className="text-center text-gray-700">
        {result.totalChargingEvents.toLocaleString()}
      </div>
      <div className="text-center text-gray-700">
        {result.totalEnergyConsumedInkWh.toFixed(2)}
      </div>
    </div>
  )
}
