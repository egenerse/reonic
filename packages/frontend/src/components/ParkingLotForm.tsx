import React, { useState } from "react"
import { parkingLotCountSchema } from "../utils/types"
import type { ZodError } from "zod"
import { InputField } from "./inputs"
import { ErrorMessage } from "./ErrorMessage"
import { Button } from "./buttons/Button"

interface Props {
  initialParkingLotCount: number
  handleUpdateParkingLots: (value: number) => void
}

export const ParkingLotForm: React.FC<Props> = ({
  initialParkingLotCount,
  handleUpdateParkingLots,
}) => {
  const [parkingDataInputError, setParkingDataInputError] =
    useState<ZodError<number>>()

  const [parkingLotCount, setParkingLotCount] = useState(initialParkingLotCount)

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
    <form className="flex flex-col gap-2" onSubmit={submitNewParkingLotNumber}>
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
      <div className="text-sm text-gray-400">Maximum Parkinglot: 200</div>
      <Button type="submit">Set Max Lots</Button>
    </form>
  )
}
