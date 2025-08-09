import React from "react";
import type { ChargerConfiguration } from "../utils/types";
import { SelectInput, InputField } from "./inputs";

interface Props {
  chargerConfigurations: ChargerConfiguration[];
  onChargerConfigurationsChange: (
    configurations: ChargerConfiguration[]
  ) => void;
}

const POWER_OPTIONS = [
  { value: 2.75, label: "2.75 kW" },
  { value: 5.5, label: "5.5 kW" },
  { value: 11, label: "11 kW" },
  { value: 18, label: "18 kW" },
  { value: 25, label: "25 kW" },
  { value: 50, label: "50 kW" },
  { value: 100, label: "100 kW" },
];

export const ChargerConfigurationForm: React.FC<Props> = ({
  chargerConfigurations,
  onChargerConfigurationsChange,
}) => {
  const addChargerConfiguration = () => {
    const missingPowerInKw = POWER_OPTIONS.find(
      (option) =>
        !chargerConfigurations.some(
          (config) => config.powerInkW === option.value
        )
    );
    const newPowerInKw = missingPowerInKw ? missingPowerInKw.value : 11;
    const newConfig: ChargerConfiguration = {
      id: `charger-${Date.now()}`,
      powerInkW: newPowerInKw,
      quantity: 1,
      name: `${newPowerInKw} kW Chargers`,
    };
    onChargerConfigurationsChange([...chargerConfigurations, newConfig]);
  };

  const removeChargerConfiguration = (id: string) => {
    onChargerConfigurationsChange(
      chargerConfigurations.filter((config) => config.id !== id)
    );
  };

  const updateChargerConfiguration = (
    id: string,
    field: keyof ChargerConfiguration,
    value: string | number
  ) => {
    const updatedConfigurations = chargerConfigurations.map((config) => {
      if (config.id === id) {
        const updatedConfig = { ...config, [field]: value };

        // Auto-update name when power changes
        if (field === "powerInkW") {
          updatedConfig.name = `${value} kW Chargers`;
        }

        return updatedConfig;
      }
      return config;
    });
    onChargerConfigurationsChange(updatedConfigurations);
  };

  const getTotalChargers = () => {
    return chargerConfigurations.reduce(
      (total, config) => total + config.quantity,
      0
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h3 className="text-lg font-medium text-gray-800">
            Charger Configurations
          </h3>
          <h2>({getTotalChargers()} total chargers)</h2>
        </div>
        <button
          disabled={chargerConfigurations.length >= POWER_OPTIONS.length}
          type="button"
          onClick={addChargerConfiguration}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Charger Type
        </button>
      </div>

      {chargerConfigurations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No charger configurations added yet. Click "Add Charger Type" to get
          started.
        </div>
      )}

      <div className="space-y-4">
        {chargerConfigurations.map((config) => (
          <div
            key={config.id}
            className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectInput
                id={`power-${config.id}`}
                label="Charger Power (kW)"
                name={`power-${config.id}`}
                value={config.powerInkW}
                options={POWER_OPTIONS}
                onChange={(e) =>
                  updateChargerConfiguration(
                    config.id,
                    "powerInkW",
                    Number(e.target.value)
                  )
                }
              />

              <SelectInput
                id="numberOfChargers"
                label="Number of Chargers"
                name="numberOfChargers"
                value={config.quantity}
                options={Array.from({ length: 30 }, (_, i) => ({
                  value: i + 1,
                  label: `${i + 1} Charger${i + 1 === 1 ? "" : "s"}`,
                }))}
                onChange={(e) =>
                  updateChargerConfiguration(
                    config.id,
                    "quantity",
                    Number(e.target.value)
                  )
                }
              />

              <button
                type="button"
                onClick={() => removeChargerConfiguration(config.id)}
                className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-md md:col-start-2"
                aria-label="Remove charger configuration"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
