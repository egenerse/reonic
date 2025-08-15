import React from "react"
import type { ChargerConfiguration } from "../utils/types"
import { SelectInput } from "./inputs"
import { calculateNumberOfChargers } from "../utils/charger"
import { AVAILABLE_CHARGER_POWER_OPTIONS } from "../utils/constants"
import { Button } from "./buttons/Button"

interface Props {
  chargerConfigurations: ChargerConfiguration[]
  onChargerConfigurationsChange: (
    configurations: ChargerConfiguration[]
  ) => void
}

export const ChargerConfigurationForm: React.FC<Props> = ({
  chargerConfigurations,
  onChargerConfigurationsChange,
}) => {
  const addChargerConfiguration = () => {
    const missingPowerInKw = AVAILABLE_CHARGER_POWER_OPTIONS.find(
      (option) =>
        !chargerConfigurations.some(
          (config) => config.powerInkW === option.value
        )
    )
    const newPowerInKw = missingPowerInKw ? missingPowerInKw.value : 11
    const newConfig: ChargerConfiguration = {
      id: `charger-${Date.now()}`,
      powerInkW: newPowerInKw,
      quantity: 1,
      name: `${newPowerInKw} kW Chargers`,
    }
    onChargerConfigurationsChange([...chargerConfigurations, newConfig])
  }

  const removeChargerConfiguration = (id: string) => {
    onChargerConfigurationsChange(
      chargerConfigurations.filter((config) => config.id !== id)
    )
  }

  const updateChargerConfiguration = (
    id: string,
    field: keyof ChargerConfiguration,
    value: string | number
  ) => {
    const updatedConfigurations = chargerConfigurations.map((config) => {
      if (config.id === id) {
        const updatedConfig = { ...config, [field]: value }

        // Auto-update name when power changes
        if (field === "powerInkW") {
          updatedConfig.name = `${value} kW Chargers`
        }

        return updatedConfig
      }
      return config
    })
    onChargerConfigurationsChange(updatedConfigurations)
  }

  const totalChargers = calculateNumberOfChargers(chargerConfigurations)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div>
          <h3 className="text-lg font-medium text-gray-800">
            Charger Configurations
          </h3>
          <h2 className="font-semibold">( {totalChargers} total chargers)</h2>
        </div>
        <Button
          onClick={addChargerConfiguration}
          disabled={
            chargerConfigurations.length >=
            AVAILABLE_CHARGER_POWER_OPTIONS.length
          }
        >
          Add Charger Type
        </Button>
      </div>

      {chargerConfigurations.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          No charger configurations added yet. Click "Add Charger Type" to get
          started.
        </div>
      )}

      <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
        {chargerConfigurations.map((config) => (
          <div
            key={config.id}
            className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectInput
                id={`power-${config.id}`}
                label="Charger Power (kW)"
                name={`power-${config.id}`}
                value={config.powerInkW}
                options={AVAILABLE_CHARGER_POWER_OPTIONS}
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

              <Button
                variant="danger"
                onClick={() => removeChargerConfiguration(config.id)}
                className="col-start-2"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
