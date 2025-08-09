import React from "react";
import type { SimulationOptions } from "../utils/types";
import InputField from "./InputField";

interface Props {
  simulationOptions: SimulationOptions;
  setSimulationOptions: (simulationOptions: SimulationOptions) => void;
}

export const SingleSimulationForm: React.FC<Props> = ({
  simulationOptions,
  setSimulationOptions,
}) => {
  const handleSimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        onChange={handleSimChange}
        value={simulationOptions.numberOfChargers}
      />
      <InputField
        id="numberOfSimulationDays"
        label="Number of Simulation Days"
        name="numberOfSimulationDays"
        onChange={handleSimChange}
        value={simulationOptions.numberOfSimulationDays}
      />
      <InputField
        id="chargerPowerInkW"
        label="Charger Power (kW)"
        name="chargerPowerInkW"
        onChange={handleSimChange}
        value={simulationOptions.chargerPowerInkW}
      />
      <InputField
        id="carNeedskWhPer100kms"
        label="Car Needs (kWh/100km)"
        name="carNeedskWhPer100kms"
        onChange={handleSimChange}
        value={simulationOptions.carNeedskWhPer100kms}
      />
    </div>
  );
};
