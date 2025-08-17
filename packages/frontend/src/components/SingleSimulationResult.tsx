import { Fragment } from "react/jsx-runtime"
import type { SimulationOptions, SimulationResult } from "../utils/types"
import { calculateNumberOfChargers } from "../utils/charger"

interface Props {
  result: SimulationResult
  simulationOptions: SimulationOptions
}

export const SingleSimulationResult: React.FC<Props> = ({
  result,
  simulationOptions,
}) => {
  const totalChargers = calculateNumberOfChargers(
    simulationOptions.chargerConfigurations
  )

  return (
    <div className="mx-auto my-30 max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Simulation Result
      </h2>

      <div className="grid grid-cols-1 overflow-hidden rounded-xl bg-gray-50 sm:grid-cols-[2fr_1fr]">
        <div className="bg-slate-800 px-4 py-3 font-medium text-white">
          Total Charger
        </div>
        <div className="bg-blue-600 px-4 py-3 text-center text-white">
          {totalChargers}{" "}
          <span className="text-sm">
            {totalChargers === 1 ? "Charger" : "Chargers"}
          </span>
        </div>

        {simulationOptions.chargerConfigurations.map((config) => (
          <Fragment key={config.id}>
            <div className="bg-slate-800 px-4 py-3 font-medium text-white">
              Number of {config.name}
            </div>
            <div className="bg-blue-600 px-4 py-3 text-center text-white">
              {config.quantity}{" "}
              <span className="text-sm">
                {config.quantity === 1 ? "Charger" : "Chargers"}
              </span>
            </div>
          </Fragment>
        ))}

        <div className="bg-slate-800 px-4 py-3 font-medium text-white">
          Total Energy Consumed
        </div>
        <div className="bg-blue-600 px-4 py-3 text-center text-white">
          {result.totalEnergyConsumedInkWh.toFixed(1)} kWh
        </div>

        <div className="bg-slate-800 px-4 py-3 font-medium text-white">
          Theoretical Max Power Demand
        </div>
        <div className="bg-blue-600 px-4 py-3 text-center text-white">
          {result.theoreticalMaxPowerDemand.toFixed(2)} kW
        </div>

        <div className="bg-slate-800 px-4 py-3 font-medium text-white">
          Actual Maximum Power Demand
        </div>
        <div className="bg-blue-600 px-4 py-3 text-center text-white">
          {result.actualMaximumPowerDemandInkW.toFixed(2)} kW
        </div>

        <div className="bg-slate-800 px-4 py-3 font-medium text-white">
          Ratio of Actual to Max Power Demand
        </div>
        <div className="bg-blue-600 px-4 py-3 text-center text-white">
          {result.ratioOfActualToMaximumPowerDemand.toFixed(3)}
        </div>

        <div className="bg-slate-800 px-4 py-3 font-medium text-white">
          Total Charging Events
        </div>
        <div className="bg-blue-600 px-4 py-3 text-center text-white">
          {result.totalChargingEvents.toLocaleString()}
        </div>
      </div>
    </div>
  )
}
