import React from "react";
import type { SimulationOptions, ChargerConfiguration } from "../utils/types";
import { InputField, RangeInput } from "./inputs";
import { ChargerConfigurationForm } from "./ChargerConfiguration";

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

  const handleChargerConfigurationsChange = (
    configurations: ChargerConfiguration[]
  ) => {
    setSimulationOptions({
      ...simulationOptions,
      chargerConfigurations: configurations,
    });
  };

  return (
    <div className="max-w-4xl p-6 bg-blue-300 mb-4 rounded-2xl min-w-2/5">
      <ChargerConfigurationForm
        chargerConfigurations={simulationOptions.chargerConfigurations}
        onChargerConfigurationsChange={handleChargerConfigurationsChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4  border-blue-400">
        <InputField
          type="number"
          max={365}
          min={1}
          id="numberOfSimulationDays"
          label="Number of Simulation Days"
          name="numberOfSimulationDays"
          onChange={handleOptionsChange}
          value={simulationOptions.numberOfSimulationDays}
        />
        <InputField
          id="carNeedskWhPer100kms"
          label="Car Needs (kWh/100km)"
          name="carNeedskWhPer100kms"
          onChange={handleOptionsChange}
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
            onChange={handleOptionsChange}
            percentage
          />
        </div>
      </div>
    </div>
  );
};
