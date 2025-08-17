import React from "react"
import { ParkingLot } from "./ParkingLot"
import type { ParkingData } from "../utils/types"

interface Props {
  parkingData: ParkingData[]
  setParkingLotPower: (id: number, powerInkW?: number) => void
}

export const ParkingLotGrid: React.FC<Props> = ({
  parkingData,
  setParkingLotPower,
}) => {
  return (
    <div className="flex-1">
      <div className="flex flex-wrap gap-4">
        {parkingData.map((lot) => (
          <ParkingLot
            key={lot.id}
            {...lot}
            setParkingLotPower={setParkingLotPower}
          />
        ))}
        {parkingData.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            No Parking Lots Available
          </div>
        )}
      </div>
    </div>
  )
}
