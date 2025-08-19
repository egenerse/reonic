import { energyPricePerHourInEuro } from "../utils/constants"
import { toDecimal } from "../utils/text"
import type { SimulationOptions, SimulationResult } from "../utils/types"
import { RatioPieChart } from "./charts/RatioPieChart"

interface Props {
  result: SimulationResult
  simulationOptions: SimulationOptions
}

export const SingleSimulationResult: React.FC<Props> = ({
  result,
  // simulationOptions,
}) => {
  const {
    totalEnergyConsumedInkWh,
    theoreticalMaxPowerDemand,
    actualMaximumPowerDemandInkW,
    ratioOfActualToMaximumPowerDemand,
    totalChargingEvents,
  } = result

  return (
    <div className="mt-10 mb-20 flex flex-col items-center justify-center gap-4 md:gap-10">
      <h1 className="text-bold mb-4 text-4xl">Simulation Results</h1>

      {/* PieChart */}
      <div className="flex flex-col items-center gap-3 rounded-lg border-1 border-gray-200 p-4 shadow-lg md:flex-row">
        <div className="flex flex-col">
          <Card
            name="Max Actual Power"
            value={`${toDecimal(actualMaximumPowerDemandInkW)} kW`}
          />
          <Card
            name="Max Theoric Power"
            value={`${toDecimal(theoreticalMaxPowerDemand)} kW`}
          />
        </div>

        <div className="flex flex-col items-center gap-4 p-2">
          <div className="max-w-60 text-center">Demanded Power Ratio</div>
          <div>{`${toDecimal(ratioOfActualToMaximumPowerDemand * 100)}%`}</div>
          <RatioPieChart percentage={ratioOfActualToMaximumPowerDemand * 100} />
        </div>
      </div>
      <div className="flex flex-col flex-wrap gap-3 rounded-2xl border-[0.5px] border-gray-50 p-2 px-4 shadow-2xl md:flex-row">
        <Card
          name="Total Consumed Energy"
          value={`${toDecimal(totalEnergyConsumedInkWh)} kWh`}
        />

        <Card name="Total Charging Events" value={`${totalChargingEvents}`} />
        <Card
          name="Predicted Electricity Cost"
          value={`${toDecimal(totalEnergyConsumedInkWh * energyPricePerHourInEuro)}€`}
          description={`Based on current energy prices ${energyPricePerHourInEuro}€/kWh`}
        />
      </div>
    </div>
  )
}

interface CardProps {
  name: string
  value: string
  description?: string
}
const Card: React.FC<CardProps> = ({ name, value, description }) => {
  return (
    <div className="b flex h-fit flex-col items-center gap-2 rounded-2xl p-2 text-center">
      <div className="max-w-60">{name}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {description && (
        <div className="text-sm text-gray-500">{description}</div>
      )}
    </div>
  )
}
