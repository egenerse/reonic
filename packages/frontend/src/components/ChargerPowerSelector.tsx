import React from "react";
import { AVAILABLE_CHARGER_POWER_OPTIONS } from "../utils/constants";

interface ChargerPowerSelectorProps {
  selectedChargerPower: number | undefined;
  onSelectChargerPower: (power: number) => void;
  onClearSelection: () => void;
}

export const ChargerPowerSelector: React.FC<ChargerPowerSelectorProps> = ({
  selectedChargerPower,
  onSelectChargerPower,
  onClearSelection,
}) => {
  return (
    <div className="flex items-center flex-col gap-2">
      <div>Please select a Charging Power to place in Parking lot</div>
      <div className="flex justify-center gap-2 flex-wrap">
        {AVAILABLE_CHARGER_POWER_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`bg-gray-500 text-white p-2 rounded min-w-20 ${
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
          className="bg-red-500 text-white p-2 rounded min-w-20"
        >
          Remove Charge Selection
        </button>
      )}
    </div>
  );
};
