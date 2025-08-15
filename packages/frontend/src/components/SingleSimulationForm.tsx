import React from "react"
import type { SimulationOptions, ChargerConfiguration } from "../utils/types"
import { InputField, RangeInput } from "./inputs"
import { ChargerConfigurationForm } from "./ChargerConfiguration"
import type { ZodError } from "zod"
import { ErrorMessage } from "./ErrorMessage"

interface Props {
  simulationOptions: SimulationOptions
  setSimulationOptions: (simulationOptions: SimulationOptions) => void
  error?: ZodError<SimulationOptions>
}

export const SingleSimulationForm: React.FC<Props> = ({
  simulationOptions,
  setSimulationOptions,
  error,
}) => {
  const handleOptionsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setSimulationOptions({
      ...simulationOptions,
      [name]: Number(value),
    })
  }

  const handleChargerConfigurationsChange = (
    configurations: ChargerConfiguration[]
  ) => {
    setSimulationOptions({
      ...simulationOptions,
      chargerConfigurations: configurations,
    })
  }

  const numberOfSimulationDaysError = error?.issues.find(
    (issue) => issue.path[0] === "numberOfSimulationDays"
  )
  const carNeedsError = error?.issues.find(
    (issue) => issue.path[0] === "carNeedskWhPer100kms"
  )
  const carArrivalProbabilityMultiplierError = error?.issues.find(
    (issue) => issue.path[0] === "carArrivalProbabilityMultiplier"
  )

  return (
    <div className="mb-4 max-w-4xl min-w-2/5 rounded-2xl bg-blue-300 p-6">
      <ChargerConfigurationForm
        chargerConfigurations={simulationOptions.chargerConfigurations}
        onChargerConfigurationsChange={handleChargerConfigurationsChange}
        error={error}
      />

      <div className="grid grid-cols-1 gap-4 border-blue-400 pt-4 md:grid-cols-2">
        <div>
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
          {numberOfSimulationDaysError && (
            <ErrorMessage message={numberOfSimulationDaysError.message} />
          )}
        </div>
        <div>
          <InputField
            id="carNeedskWhPer100kms"
            label="Car Needs (kWh/100km)"
            name="carNeedskWhPer100kms"
            onChange={handleOptionsChange}
            value={simulationOptions.carNeedskWhPer100kms}
          />
          {carNeedsError && <ErrorMessage message={carNeedsError.message} />}
        </div>
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
          {carArrivalProbabilityMultiplierError && (
            <ErrorMessage
              message={carArrivalProbabilityMultiplierError.message}
            />
          )}
        </div>
      </div>
    </div>
  )
}
