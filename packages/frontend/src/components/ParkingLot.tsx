import React, { useState } from "react"
import ParkingIcon from "./icons/ParkingIcon"
import ChargerIcon from "./icons/ChargerIcon"
import { AVAILABLE_CHARGER_POWER_OPTIONS } from "../utils/constants"
import { cn } from "../utils/cn"

interface Props {
  id: number
  chargerPowerInKw?: number
  setParkingLotPower: (id: number, powerInKw?: number) => void
}

export const ParkingLot: React.FC<Props> = ({
  id,
  chargerPowerInKw,
  setParkingLotPower,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const showChargerSelector = !chargerPowerInKw && isHovered
  const showRemoveButton = chargerPowerInKw && isHovered

  return (
    <div
      className={cn(
        "relative flex h-40 w-28 flex-col items-center justify-center gap-1 rounded-lg border-1 transition-all duration-200",
        { "border-4 border-green-600 bg-green-50": chargerPowerInKw },
        { "border-blue-300 bg-blue-50": showChargerSelector }
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Icon */}
      {chargerPowerInKw ? (
        <ChargerIcon
          className={cn(
            "absolute inset-0 z-0 h-full w-full stroke-amber-100 opacity-40",
            { "text-blue-300": chargerPowerInKw === 2.75 },
            { "text-blue-500": chargerPowerInKw === 5.5 },
            { "text-orange-600": chargerPowerInKw === 11 },
            { "text-orange-700": chargerPowerInKw === 18 },
            { "text-fuchsia-800": chargerPowerInKw === 25 }
          )}
        />
      ) : (
        <ParkingIcon className="h-full w-full opacity-40" />
      )}

      {/* Power Display */}
      {chargerPowerInKw && (
        <div className="relative z-10 rounded-lg bg-white/70 px-1 font-extrabold text-green-700">
          {chargerPowerInKw} kW
        </div>
      )}

      {/* Charger Selector on Hover */}
      {showChargerSelector && (
        <div className="absolute top-2 right-1 bottom-0 left-1 z-20 h-full w-auto space-y-1">
          {AVAILABLE_CHARGER_POWER_OPTIONS.map((option) => (
            <div
              onClick={() => setParkingLotPower(id, option.value)}
              key={option.value}
              className="flex cursor-pointer justify-center rounded-lg border border-gray-300 bg-white px-1 py-0.5 text-xs font-bold hover:bg-green-400"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {/* Remove Button for Assigned Chargers */}
      {showRemoveButton && (
        <div
          className="relative z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white shadow-md hover:bg-red-600"
          onClick={(e) => {
            e.stopPropagation()
            setParkingLotPower(id, undefined)
          }}
        >
          ×
        </div>
      )}
    </div>
  )
}
