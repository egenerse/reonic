import React from "react"
import { AVAILABLE_CHARGER_POWER_OPTIONS } from "../utils/constants"
import { ButtonGroup, type ButtonInGroup } from "./buttons/ButtonGroup"
import { Button } from "./buttons/Button"

interface ChargerPowerSelectorProps {
  selectedChargerPower: number | undefined
  onSelectChargerPower: (power: number | undefined) => void
}

export const ChargerPowerSelector: React.FC<ChargerPowerSelectorProps> = ({
  selectedChargerPower,
  onSelectChargerPower,
}) => {
  const buttons: ButtonInGroup[] = AVAILABLE_CHARGER_POWER_OPTIONS.map(
    (option) => ({
      id: option.value.toString(),
      label: option.label,
      onClick: () => onSelectChargerPower(option.value),
    })
  )

  return (
    <div className="flex flex-col items-center gap-2">
      <div>Please select a Charging Power to place in Parking lot</div>
      <div className="flex flex-wrap justify-center gap-2">
        <ButtonGroup
          buttons={buttons}
          selectedId={selectedChargerPower?.toString()}
        />
      </div>
      {selectedChargerPower && (
        <Button
          variant="danger"
          onClick={() => onSelectChargerPower(undefined)}
        >
          Remove Charge Selection
        </Button>
      )}
    </div>
  )
}
