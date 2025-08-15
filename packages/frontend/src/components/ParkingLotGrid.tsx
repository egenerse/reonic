import React from "react"
import { ParkingLot } from "./ParkingLot"
import type { ParkingData } from "../utils/types"

interface Props {
  parkingData: ParkingData[]
  removeParkingLotPower: (id: number) => void
  setParkingLotPower: (id: number) => void
  showEdit: boolean
}

export const ParkingLotGrid: React.FC<Props> = ({
  parkingData,
  removeParkingLotPower,
  setParkingLotPower,
  showEdit,
}) => {
  return (
    <div className="flex flex-5 flex-wrap gap-4">
      {parkingData.map((lot) => (
        <ParkingLot
          key={lot.id}
          {...lot}
          removeParkingLotPower={removeParkingLotPower}
          setParkingLotPower={setParkingLotPower}
          showEdit={showEdit}
        />
      ))}
      {parkingData.length === 0 && (
        <div className="flex flex-1 items-center justify-center text-gray-500">
          No Parking Lots Available
        </div>
      )}
    </div>
  )
}
