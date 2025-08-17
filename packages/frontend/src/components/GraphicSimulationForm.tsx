import React from "react"
import { InputField, RangeInput } from "./inputs"
import {
  type ChargerConfiguration,
  type SimulationOptions,
} from "../utils/types"
import { Button } from "./buttons/Button"
import { type ZodError } from "zod"
import { ErrorMessage } from "./ErrorMessage"
import { ParkingLotForm } from "./ParkingLotForm"
import { ChargerSummary } from "./ChargerSummary"

interface Props {
  simulationOptions: SimulationOptions
  chargerConfigurations: ChargerConfiguration[]
  error?: ZodError<SimulationOptions>
  onOptionsChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  handleUpdateParkingLots: (value: number) => void
  onRunSimulation: () => void
  initialParkingLotCount: number
  isLoading?: boolean
}

export const GraphicSimulationForm: React.FC<Props> = ({
  simulationOptions,
  chargerConfigurations,
  error,
  handleUpdateParkingLots,
  onOptionsChange,
  onRunSimulation,
  initialParkingLotCount,
  isLoading,
}) => {
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
    <div className="flex h-full max-w-[320px] flex-1 flex-col gap-4 rounded-xl bg-amber-200 p-4">
      <div className="text-semibold text-2xl">Simulation Options</div>

      <ParkingLotForm
        initialParkingLotCount={initialParkingLotCount}
        handleUpdateParkingLots={handleUpdateParkingLots}
      />

      <ChargerSummary chargerConfigurations={chargerConfigurations} />

      <div>
        <InputField
          max={365}
          min={1}
          id="numberOfSimulationDays"
          label="Number of Simulation Days"
          name="numberOfSimulationDays"
          onChange={onOptionsChange}
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
          onChange={onOptionsChange}
          value={simulationOptions.carNeedskWhPer100kms}
        />
        {carNeedsError?.message && (
          <ErrorMessage message={carNeedsError.message} />
        )}
      </div>

      <div>
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

        {carArrivalProbabilityMultiplierError && (
          <ErrorMessage
            message={carArrivalProbabilityMultiplierError.message}
          />
        )}
      </div>

      <Button onClick={onRunSimulation} isLoading={isLoading}>
        Run
      </Button>
    </div>
  )
}
