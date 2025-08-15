import React from "react"
import { AVAILABLE_CHARGER_POWER_OPTIONS } from "../utils/constants"

interface ChargerPowerSelectorProps {
  selectedChargerPower: number | undefined
  onSelectChargerPower: (power: number) => void
  onClearSelection: () => void
}

export const ChargerPowerSelector: React.FC<ChargerPowerSelectorProps> = ({
  selectedChargerPower,
  onSelectChargerPower,
  onClearSelection,
}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div>Please select a Charging Power to place in Parking lot</div>
      <div className="flex flex-wrap justify-center gap-2">
        {AVAILABLE_CHARGER_POWER_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`min-w-20 rounded bg-gray-500 p-2 text-white ${
              selectedChargerPower === option.value ? "bg-gray-800" : ""
            }`}
            onClick={() => onSelectChargerPower(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {selectedChargerPower && (
        <button
          onClick={onClearSelection}
          className="min-w-20 rounded bg-red-500 p-2 text-white"
        >
          Remove Charge Selection
        </button>
      )}
    </div>
  )
}
