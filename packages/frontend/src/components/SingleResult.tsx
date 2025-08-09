import type { SimulationResult } from "../utils/types";

interface Props {
  result: SimulationResult;
}

export const SingleResult: React.FC<Props> = ({ result }) => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Simulation Result
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr]  bg-gray-50 rounded-xl overflow-hidden ">
        <div className="bg-slate-800 text-white font-medium py-3 px-4">
          Charging Points
        </div>
        <div className="bg-blue-600 text-white text-center py-3 px-4">
          {result.numberOfChargers}
        </div>

        <div className="bg-slate-800 text-white font-medium py-3 px-4">
          Total Energy Consumed (kWh)
        </div>
        <div className="bg-blue-600 text-white text-center py-3 px-4">
          {result.totalEnergyConsumedInkWh.toFixed(1)}
        </div>

        <div className="bg-slate-800 text-white font-medium py-3 px-4">
          Theoretical Max Power Demand (kW)
        </div>
        <div className="bg-blue-600 text-white text-center py-3 px-4">
          {result.theoreticalMaxPowerDemand.toFixed(1)}
        </div>

        <div className="bg-slate-800 text-white font-medium py-3 px-4">
          Actual Maximum Power Demand (kW)
        </div>
        <div className="bg-blue-600 text-white text-center py-3 px-4">
          {result.actualMaximumPowerDemandInkW.toFixed(1)}
        </div>

        <div className="bg-slate-800 text-white font-medium py-3 px-4">
          Ratio of Actual to Max Power Demand
        </div>
        <div className="bg-blue-600 text-white text-center py-3 px-4">
          {result.ratioOfActualToMaximumPowerDemand.toFixed(3)}
        </div>

        <div className="bg-slate-800 text-white font-medium py-3 px-4  ">
          Total Charging Events
        </div>
        <div className="bg-blue-600 text-white text-center py-3 px-4">
          {result.totalChargingEvents.toLocaleString()}
        </div>
      </div>
    </div>
  );
};
