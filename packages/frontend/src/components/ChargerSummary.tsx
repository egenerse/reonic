import React from "react"
import { type ChargerConfiguration } from "../utils/types"
import {
  calculateNumberOfChargers,
  calculateTotalPowerDemand,
} from "../utils/charger"

interface Props {
  chargerConfigurations: ChargerConfiguration[]
  className?: string
}

export const ChargerSummary: React.FC<Props> = ({
  chargerConfigurations,
  className,
}) => {
  const totalChargers = calculateNumberOfChargers(chargerConfigurations)

  const theoreticalMaxPowerDemand = calculateTotalPowerDemand(
    chargerConfigurations
  )

  const headerText = `${totalChargers} total ${totalChargers === 1 ? "charger" : "chargers"} available`

  if (totalChargers === 0) {
    return (
      <div className={`text-gray-500 ${className}`}>No chargers configured</div>
    )
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="font-bold">{headerText}</div>

      <div>
        Theoretical Max Power Demand:{" "}
        <span className="font-bold">{theoreticalMaxPowerDemand} kW</span>
      </div>

      <div>
        {chargerConfigurations
          .filter((config) => config.quantity > 0)
          .map((config) => (
            <div key={config.id} className="pl-4">
              - {config.name} x {config.quantity} ={" "}
              {config.powerInkW * config.quantity} kW
            </div>
          ))}
      </div>
    </div>
  )
}
