import React from "react";
import type { SimulationOptions } from "../utils/types";
import InputField from "./InputField";
import RangeInput from "./RangeInput";

interface Props {
  simulationOptions: SimulationOptions;
  setSimulationOptions: (simulationOptions: SimulationOptions) => void;
}

export const SingleSimulationForm: React.FC<Props> = ({
  simulationOptions,
  setSimulationOptions,
}) => {
  const handleOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSimulationOptions({
      ...simulationOptions,
      [name]: Number(value),
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3/5  p-4 bg-blue-300  mb-2 rounded-2xl">
      <InputField
        id="numberOfChargers"
        label="Number of Chargers"
        name="numberOfChargers"
        onChange={handleOptionsChange}
        type="number"
        max={50}
        value={simulationOptions.numberOfChargers}
      />
      <InputField
        type="number"
        max={365}
        id="numberOfSimulationDays"
        label="Number of Simulation Days"
        name="numberOfSimulationDays"
        onChange={handleOptionsChange}
        value={simulationOptions.numberOfSimulationDays}
      />
      <InputField
        id="chargerPowerInkW"
        label="Charger Power (kW)"
        name="chargerPowerInkW"
        onChange={handleOptionsChange}
        value={simulationOptions.chargerPowerInkW}
      />
      <InputField
        id="carNeedskWhPer100kms"
        label="Car Needs (kWh/100km)"
        name="carNeedskWhPer100kms"
        onChange={handleOptionsChange}
        value={simulationOptions.carNeedskWhPer100kms}
      />

      <RangeInput
        id="carArrivalProbabilityMultiplier"
        label="Car Arrival Probability Multiplier"
        name="carArrivalProbabilityMultiplier"
        min={20}
        max={220}
        step={10}
        value={simulationOptions.carArrivalProbabilityMultiplier}
        onChange={handleOptionsChange}
        percentage
      />
    </div>
  );
};
