import React from "react"
import type { ChargerConfiguration, SimulationOptions } from "../utils/types"
import { SelectInput } from "./inputs"
import { AVAILABLE_CHARGER_POWER_OPTIONS } from "../utils/constants"
import { Button } from "./buttons/Button"
import type { ZodError } from "zod"
import { ErrorMessage } from "./ErrorMessage"

interface Props {
  chargerConfigurations: ChargerConfiguration[]
  onChargerConfigurationsChange: (
    configurations: ChargerConfiguration[]
  ) => void
  error?: ZodError<SimulationOptions>
}

export const ChargerConfigurationForm: React.FC<Props> = ({
  chargerConfigurations,
  onChargerConfigurationsChange,
  error,
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

        if (field === "powerInkW") {
          updatedConfig.name = `${value} kW Chargers`
        }

        return updatedConfig
      }
      return config
    })
    onChargerConfigurationsChange(updatedConfigurations)
  }

  const chargerErrors = error?.issues.find(
    (issue) => issue.path[0] === "chargerConfigurations"
  )

  const showAddChargerButton =
    chargerConfigurations.length < AVAILABLE_CHARGER_POWER_OPTIONS.length

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium text-gray-800">
        Charger Configurations
      </div>

      {chargerErrors?.message && (
        <div className="mt-4">
          <ErrorMessage message={chargerErrors.message} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
        {chargerConfigurations.map((config) => (
          <ChargerConfigurationCard
            key={config.id}
            config={config}
            onUpdate={(field, value) =>
              updateChargerConfiguration(config.id, field, value)
            }
            onRemove={() => removeChargerConfiguration(config.id)}
          />
        ))}
        {showAddChargerButton && (
          <AddNewConfigurationCard onAdd={addChargerConfiguration} />
        )}
      </div>
    </div>
  )
}

interface ChargerConfigurationCardProps {
  config: ChargerConfiguration
  onUpdate: (field: keyof ChargerConfiguration, value: string | number) => void
  onRemove: () => void
}

const ChargerConfigurationCard: React.FC<ChargerConfigurationCardProps> = ({
  config,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectInput
          id={`power-${config.id}`}
          label="Charger Power (kW)"
          name={`power-${config.id}`}
          value={config.powerInkW}
          options={AVAILABLE_CHARGER_POWER_OPTIONS}
          onChange={(e) => onUpdate("powerInkW", Number(e.target.value))}
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
          onChange={(e) => onUpdate("quantity", Number(e.target.value))}
        />

        <Button
          variant="danger"
          onClick={onRemove}
          className="col-start-2 min-w-[0px]"
        >
          Remove
        </Button>
      </div>
    </div>
  )
}

interface AddNewConfigurationCardProps {
  onAdd: () => void
}

const AddNewConfigurationCard: React.FC<AddNewConfigurationCardProps> = ({
  onAdd,
}) => {
  return (
    <div className="flex h-[154px] items-center justify-center rounded-lg border-2 border-dashed bg-blue-50">
      <Button variant="secondary" onClick={onAdd}>
        + Add Charger Type
      </Button>
    </div>
  )
}
