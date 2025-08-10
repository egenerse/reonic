import React from "react";
import { InputField, RangeInput } from "./inputs";
import { ErrorBox } from "./ErrorBox";
import type { ChargerConfiguration, SimulationOptions } from "../utils/types";
import { calculateNumberOfChargers } from "../utils/charger";

interface Props {
  simulationOptions: SimulationOptions;
  chargerConfigurations: ChargerConfiguration[];
  errors: string[];
  onOptionsChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleUpdateParkingLots: (value: number) => void;
  onRunSimulation: () => void;
  initialParkingLotCount: number;
}

export const GraphicSimulationForm: React.FC<Props> = ({
  simulationOptions,
  chargerConfigurations,
  errors,
  handleUpdateParkingLots,
  onOptionsChange,
  onRunSimulation,
  initialParkingLotCount,
}) => {
  const [parkingLotCount, setParkingLotCount] = React.useState(
    initialParkingLotCount
  );
  const totalChargers = calculateNumberOfChargers(chargerConfigurations);

  const theoreticalMaxPowerDemand = chargerConfigurations.reduce(
    (previous, current) => previous + current.powerInkW * current.quantity,
    0
  );

  return (
    <div className="flex-1 bg-amber-200 h-full p-4 flex flex-col gap-4 rounded-xl">
      <div className="text-semibold text-2xl">Simulation Options</div>

      <ErrorBox errors={errors} />

      <InputField
        name="numberOfParkingLot"
        id="numberOfParkingLot"
        label="Number of Parking Lots"
        value={parkingLotCount}
        onChange={(e) => {
          const newValue = Number(e.target.value);
          if (newValue >= 0 && newValue <= 300) {
            setParkingLotCount(newValue);
          }
        }}
      />
      <div className="text-sm text-gray-400 -mt-3">Maximum Parkinglot: 300</div>
      <button
        onClick={() => handleUpdateParkingLots(parkingLotCount)}
        className="bg-blue-300 text-white p-2 rounded min-w-20"
      >
        Update Max Parking Lots
      </button>

      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold">Parking Lots:</label>
        {totalChargers > 0 && (
          <div className="font-bold">
            {totalChargers} total chargers available
          </div>
        )}
        <div>
          {chargerConfigurations
            .filter((chargerConfig) => chargerConfig.quantity > 0)
            .map((config) => (
              <div key={config.id}>
                {config.name} x {config.quantity} ={" "}
                {config.powerInkW * config.quantity} kW
              </div>
            ))}
        </div>
        {theoreticalMaxPowerDemand > 0 ? (
          <div>
            Theoretical Max Power Demand:{" "}
            <span className="font-bold">{theoreticalMaxPowerDemand} kW</span>
          </div>
        ) : (
          <div className="text-gray-500">No chargers available</div>
        )}
      </div>

      <InputField
        type="number"
        max={365}
        min={1}
        id="numberOfSimulationDays"
        label="Number of Simulation Days"
        name="numberOfSimulationDays"
        onChange={onOptionsChange}
        value={simulationOptions.numberOfSimulationDays}
      />

      <InputField
        id="carNeedskWhPer100kms"
        label="Car Needs (kWh/100km)"
        name="carNeedskWhPer100kms"
        onChange={onOptionsChange}
        value={simulationOptions.carNeedskWhPer100kms}
      />

      <div className="md:col-span-2">
        <RangeInput
          id="carArrivalProbabilityMultiplier"
          label="Car Arrival Probability Multiplier"
          name="carArrivalProbabilityMultiplier"
          min={20}
          max={220}
          step={10}
          value={simulationOptions.carArrivalProbabilityMultiplier}
          onChange={onOptionsChange}
          percentage
        />
      </div>

      <button
        onClick={onRunSimulation}
        className="bg-blue-300 text-white p-2 rounded w-full"
      >
        Run
      </button>
    </div>
  );
};
