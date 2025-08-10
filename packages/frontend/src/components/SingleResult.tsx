import { Fragment } from "react/jsx-runtime";
import type { SimulationOptions, SimulationResult } from "../utils/types";
import { calculateNumberOfChargers } from "../utils/chargingMath";

interface Props {
  result: SimulationResult;
  simulationOptions: SimulationOptions;
}

export const SingleResult: React.FC<Props> = ({
  result,
  simulationOptions,
}) => {
  const totalChargers = calculateNumberOfChargers(
    simulationOptions.chargerConfigurations
  );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Simulation Result
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] bg-gray-50 rounded-xl overflow-hidden">
        <div className="bg-slate-800 text-white font-medium py-3 px-4">
          Total Charger
        </div>
        <div className="bg-blue-600 text-white text-center py-3 px-4">
          {totalChargers}{" "}
          <span className="text-sm">
            {totalChargers === 1 ? "Charger" : "Chargers"}
          </span>
        </div>

        {simulationOptions.chargerConfigurations.map((config) => (
          <Fragment key={config.id}>
            <div className="bg-slate-800 text-white font-medium py-3 px-4">
              Number of {config.name}
            </div>
            <div className="bg-blue-600 text-white text-center py-3 px-4">
              {config.quantity}{" "}
              <span className="text-sm">
                {config.quantity === 1 ? "Charger" : "Chargers"}
              </span>
            </div>
          </Fragment>
        ))}

        <div className="bg-slate-800 text-white font-medium py-3 px-4">
          Total Energy Consumed
        </div>
        <div className="bg-blue-600 text-white text-center py-3 px-4">
          {result.totalEnergyConsumedInkWh.toFixed(1)} kWh
        </div>

        <div className="bg-slate-800 text-white font-medium py-3 px-4">
          Theoretical Max Power Demand
        </div>
        <div className="bg-blue-600 text-white text-center py-3 px-4">
          {result.theoreticalMaxPowerDemand.toFixed(1)} kW
        </div>

        <div className="bg-slate-800 text-white font-medium py-3 px-4">
          Actual Maximum Power Demand
        </div>
        <div className="bg-blue-600 text-white text-center py-3 px-4">
          {result.actualMaximumPowerDemandInkW.toFixed(2)} kW
        </div>

        <div className="bg-slate-800 text-white font-medium py-3 px-4">
          Ratio of Actual to Max Power Demand
        </div>
        <div className="bg-blue-600 text-white text-center py-3 px-4">
          {result.ratioOfActualToMaximumPowerDemand.toFixed(3)}
        </div>

        <div className="bg-slate-800 text-white font-medium py-3 px-4">
          Total Charging Events
        </div>
        <div className="bg-blue-600 text-white text-center py-3 px-4">
          {result.totalChargingEvents.toLocaleString()}
        </div>
      </div>
    </div>
  );
};
