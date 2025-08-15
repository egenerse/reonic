import React from "react"
import ParkingIcon from "./icons/ParkingIcon"
import ChargerIcon from "./icons/ChargerIcon"

interface Props {
  id: number
  chargerPowerInKw?: number
  showEdit: boolean
  removeParkingLotPower: (id: number) => void
  setParkingLotPower: (id: number) => void
}

export const ParkingLot: React.FC<Props> = ({
  id,
  chargerPowerInKw,
  showEdit,
  setParkingLotPower,
  removeParkingLotPower,
}) => {
  return (
    <div
      className={`relative flex h-40 w-28 flex-col items-center gap-1 rounded-lg border-2 bg-gray-100 p-4 ${
        !showEdit ? "justify-center" : " "
      } ${chargerPowerInKw ? "border-green-600" : ""} `}
    >
      {/* Parking SVG Background */}
      {chargerPowerInKw ? (
        <ChargerIcon className="absolute inset-0 z-0 h-full w-full text-green-900 opacity-40" />
      ) : (
        <ParkingIcon className="absolute inset-0 z-0 h-full w-full opacity-40" />
      )}

      <div
        className={`relative z-10 flex flex-col items-center gap-2 ${
          showEdit ? "opacity-50" : ""
        }`}
      >
        {chargerPowerInKw && (
          <div className="rounded-lg bg-white/70 px-1 font-extrabold text-green-700">
            {chargerPowerInKw} kW
          </div>
        )}
      </div>

      {showEdit && (
        <div
          onClick={() => setParkingLotPower(id)}
          className="absolute top-0 right-0 bottom-0 left-0 z-20 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-white"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-lg font-bold opacity-100 shadow-md">
            +
          </div>
          {chargerPowerInKw && (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-red-800 text-lg font-bold opacity-100 shadow-md"
              onClick={(e) => {
                e.stopPropagation()
                removeParkingLotPower(id)
              }}
            >
              -
            </div>
          )}
        </div>
      )}
      {chargerPowerInKw && !showEdit && (
        <div
          className="relative z-20 flex h-8 w-8 items-center justify-center rounded-full bg-red-400 text-lg font-bold opacity-100 shadow-md"
          onClick={(e) => {
            e.stopPropagation()
            removeParkingLotPower(id)
          }}
        >
          -
        </div>
      )}
    </div>
  )
}
