import React from "react";
import type { SimulationOptions } from "../utils/types";
import { InputField, RangeInput, SelectInput } from "./inputs";

interface Props {
  simulationOptions: SimulationOptions;
  setSimulationOptions: (simulationOptions: SimulationOptions) => void;
}

export const SingleSimulationForm: React.FC<Props> = ({
  simulationOptions,
  setSimulationOptions,
}) => {
  const handleOptionsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSimulationOptions({
      ...simulationOptions,
      [name]: Number(value),
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3/5  p-4 bg-blue-300  mb-2 rounded-2xl">
      <SelectInput
        id="numberOfChargers"
        label="Number of Chargers"
        name="numberOfChargers"
        value={simulationOptions.numberOfChargers}
        options={Array.from({ length: 30 }, (_, i) => ({
          value: i + 1,
          label: `${i + 1} Charger${i + 1 === 1 ? "" : "s"}`,
        }))}
        onChange={handleOptionsChange}
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
      <SelectInput
        id="chargerPowerInkW"
        label="Charger Power (kW)"
        name="chargerPowerInkW"
        value={simulationOptions.chargerPowerInkW}
        options={[
          { value: 2.75, label: "2.75 kW" },
          { value: 5.5, label: "5.5 kW" },
          { value: 11, label: "11 kW" },
          { value: 18, label: "18 kW" },
          { value: 25, label: "25 kW" },
          { value: 50, label: "50 kW" },
          { value: 100, label: "100 kW" },
        ]}
        onChange={handleOptionsChange}
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
