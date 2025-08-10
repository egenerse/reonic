import { calculateNumberOfChargers } from "../utils/charger";
import type { SimulationOptions, SimulationResult } from "../utils/types";

interface Props {
  result: SimulationResult;
  simulationOptions: SimulationOptions;
}

export const SimulationRow: React.FC<Props> = ({
  result,
  simulationOptions,
}) => {
  const numberOfChargers = calculateNumberOfChargers(
    simulationOptions.chargerConfigurations
  );
  return (
    <div className="grid grid-cols-6 gap-2 py-2 px-3 hover:bg-gray-50 rounded-md transition-colors duration-150 text-sm">
      <div className="font-semibold text-gray-900 text-center">
        {numberOfChargers}
      </div>
      <div className="text-gray-700 text-center">
        {result.actualMaximumPowerDemandInkW.toFixed(1)}
      </div>
      <div className="text-gray-700 text-center">
        {result.ratioOfActualToMaximumPowerDemand.toFixed(3)}
      </div>
      <div className="text-gray-700 text-center">
        {result.theoreticalMaxPowerDemand.toFixed(1)}
      </div>
      <div className="text-gray-700 text-center">
        {result.totalChargingEvents.toLocaleString()}
      </div>
      <div className="text-gray-700 text-center">
        {result.totalEnergyConsumedInkWh.toFixed(2)}
      </div>
    </div>
  );
};
