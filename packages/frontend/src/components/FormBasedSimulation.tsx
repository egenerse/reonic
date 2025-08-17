import { defaultSimulationOptions } from "../utils/constants"
import { useFormSimulation } from "../hooks/useFormSimulation"
import { SingleSimulationResult } from "./SingleSimulationResult"
import { Button } from "./buttons/Button"
import type { ChargerConfiguration } from "../utils/types"
import { ChargerConfigurationForm } from "./ChargerConfiguration"
import { ChargerSummary } from "./ChargerSummary"
import { ErrorMessage } from "./ErrorMessage"
import { InputField, RangeInput } from "./inputs"

export const FormBasedSimulation = () => {
  const {
    simulationOptions,
    setSimulationOptions,
    simulationResult,
    resultSimulationOptions,
    error,
    isLoading,
    resultRef,
    runSimulation,
    resetOptions,
  } = useFormSimulation(defaultSimulationOptions)

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

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Form submitted,")
    e.preventDefault()
    runSimulation()
  }

  return (
    <div className="min-h-screen">
      <div className="mb-5 flex flex-col items-center justify-center">
        <form
          className="mb-4 max-w-4xl min-w-2/5 rounded-2xl bg-blue-300 p-6"
          onSubmit={onFormSubmit}
        >
          <ChargerConfigurationForm
            chargerConfigurations={simulationOptions.chargerConfigurations}
            onChargerConfigurationsChange={handleChargerConfigurationsChange}
            error={error}
          />

          <ChargerSummary
            chargerConfigurations={simulationOptions.chargerConfigurations}
            className="mt-2"
          />

          <div className="grid grid-cols-1 gap-4 border-blue-400 pt-4 md:grid-cols-2">
            <div>
              <InputField
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
              {carNeedsError && (
                <ErrorMessage message={carNeedsError.message} />
              )}
            </div>
            <div className="md:col-span-2">
              <RangeInput
                id="carArrivalProbabilityMultiplier"
                label="Car Arrival Probability Multiplier"
                name="carArrivalProbabilityMultiplier"
                min={20}
                max={220}
                step={5}
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

          <ActionButtons isLoading={isLoading} resetOptions={resetOptions} />
        </form>
      </div>

      <div ref={resultRef}>
        {simulationResult && resultSimulationOptions && (
          <SingleSimulationResult
            result={simulationResult}
            simulationOptions={resultSimulationOptions}
          />
        )}
      </div>
    </div>
  )
}

interface ActionButtonsProps {
  isLoading: boolean
  resetOptions: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isLoading,
  resetOptions,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Running..." : "Run Simulation"}
      </Button>

      <Button variant="danger" onClick={resetOptions} disabled={isLoading}>
        Reset Options
      </Button>
    </div>
  )
}
