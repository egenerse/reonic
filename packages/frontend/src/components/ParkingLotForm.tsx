import React from "react"
import { parkingLotCountSchema } from "../utils/types"
import { InputField } from "./inputs"
import { Button } from "./buttons/Button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

interface Props {
  initialParkingLotCount: number
  handleUpdateParkingLots: (value: number) => void
}

export const ParkingLotForm: React.FC<Props> = ({
  initialParkingLotCount,
  handleUpdateParkingLots,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(parkingLotCountSchema),
    defaultValues: { numberOfParkingLot: initialParkingLotCount },
  })

  const submitNewParkingLotNumber = handleSubmit((data) => {
    handleUpdateParkingLots(data.numberOfParkingLot)
  })

  return (
    <form
      className="flex flex-col gap-2 rounded-xl bg-blue-200/50 p-4"
      onSubmit={submitNewParkingLotNumber}
    >
      <h2 className="text-semibold text-2xl">Set Maximum Parking Lots</h2>
      <InputField
        {...register("numberOfParkingLot", { valueAsNumber: true })}
        label="Number of Parking Lots"
        error={errors.numberOfParkingLot?.message}
      />

      <div className="text-sm text-gray-400">Maximum Parkinglot: 200</div>
      <Button type="submit">Set Max Lots</Button>
    </form>
  )
}
