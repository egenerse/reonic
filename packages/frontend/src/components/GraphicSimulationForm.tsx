import React, { useState } from "react"
import { InputField, RangeInput } from "./inputs"
import {
  parkingLotCountSchema,
  type ChargerConfiguration,
  type SimulationOptions,
} from "../utils/types"
import { calculateNumberOfChargers } from "../utils/charger"
import { Button } from "./buttons/Button"
import { type ZodError } from "zod"
import { ErrorMessage } from "./ErrorMessage"

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
}

export const GraphicSimulationForm: React.FC<Props> = ({
  simulationOptions,
  chargerConfigurations,
  error,
  handleUpdateParkingLots,
  onOptionsChange,
  onRunSimulation,
  initialParkingLotCount,
}) => {
  const [parkingDataInputError, setParkingDataInputError] =
    useState<ZodError<number>>()

  const [parkingLotCount, setParkingLotCount] = useState(initialParkingLotCount)
  const totalChargers = calculateNumberOfChargers(chargerConfigurations)

  const theoreticalMaxPowerDemand = chargerConfigurations.reduce(
    (previous, current) => previous + current.powerInkW * current.quantity,
    0
  )

  const numberOfSimulationDaysError = error?.issues.find(
    (issue) => issue.path[0] === "numberOfSimulationDays"
  )
  const carNeedsError = error?.issues.find(
    (issue) => issue.path[0] === "carNeedskWhPer100kms"
  )
  const carArrivalProbabilityMultiplierError = error?.issues.find(
    (issue) => issue.path[0] === "carArrivalProbabilityMultiplier"
  )

  const submitNewParkingLotNumber = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { data, error, success } =
      parkingLotCountSchema.safeParse(parkingLotCount)
    setParkingDataInputError(error)

    if (success) {
      handleUpdateParkingLots(data)
    }
  }

  return (
    <div className="flex h-full max-w-[320px] flex-col gap-4 rounded-xl bg-amber-200 p-4">
      <div className="text-semibold text-2xl">Simulation Options</div>

      <form
        className="flex flex-col gap-2"
        onSubmit={submitNewParkingLotNumber}
      >
        <InputField
          name="numberOfParkingLot"
          id="numberOfParkingLot"
          label="Number of Parking Lots"
          value={parkingLotCount}
          onChange={(e) => {
            const newValue = Number(e.target.value)
            if (!isNaN(newValue)) {
              setParkingLotCount(newValue)
            }
          }}
        />
        {parkingDataInputError?.message && (
          <ErrorMessage message={parkingDataInputError.issues[0].message} />
        )}
        <div className="text-sm text-gray-400">Maximum Parkinglot: 300</div>
        <Button type="submit">Set Max Lots</Button>
      </form>

      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold">Parking Lots:</label>
        {totalChargers > 0 && (
          <div className="font-bold">
            {totalChargers} total chargers available
          </div>
        )}
        <div>
          {chargerConfigurations
            .filter((chargerConfig) => chargerConfig.quantity > 0)
            .map((config) => (
              <div key={config.id}>
                {config.name} x {config.quantity} ={" "}
                {config.powerInkW * config.quantity} kW
              </div>
            ))}
        </div>
        {theoreticalMaxPowerDemand > 0 ? (
          <div>
            Theoretical Max Power Demand:{" "}
            <span className="font-bold">{theoreticalMaxPowerDemand} kW</span>
          </div>
        ) : (
          <div className="text-gray-500">No chargers available</div>
        )}
      </div>

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

      <Button onClick={onRunSimulation}>Run</Button>
    </div>
  )
}
