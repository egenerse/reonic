import { calculateNumberOfChargers } from "../utils/charger"
import { energyPricePerHourInEuro } from "../utils/constants"
import { toDecimal } from "../utils/text"
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
    <div className="grid grid-cols-7 gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-150 hover:bg-gray-50">
      <div className="text-center font-semibold text-gray-900">
        {numberOfChargers}
      </div>
      <div className="text-center text-gray-700">
        {toDecimal(result.actualMaximumPowerDemandInkW)}
      </div>
      <div className="text-center text-gray-700">
        {toDecimal(result.theoreticalMaxPowerDemand)}
      </div>
      <div className="text-center text-gray-700">
        {toDecimal(result.ratioOfActualToMaximumPowerDemand)}
      </div>

      <div className="text-center text-gray-700">
        {toDecimal(result.totalChargingEvents)}
      </div>
      <div className="text-center text-gray-700">
        {toDecimal(result.totalEnergyConsumedInkWh)}
      </div>
      <div className="text-center text-gray-700">
        {toDecimal(result.totalEnergyConsumedInkWh * energyPricePerHourInEuro)}€
      </div>
    </div>
  )
}
