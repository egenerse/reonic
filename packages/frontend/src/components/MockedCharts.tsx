import { useMemo, useState } from "react"
import {
  ChargerPowerDistribution,
  ChargingEvents,
  DaySummary,
  EnergyConsumption,
} from "./charts"
import { ButtonGroup, type ButtonInGroup } from "./buttons/ButtonGroup"

export const MockedCharts = () => {
  const [shownChart, setShownChart] = useState("chargingEvents")

  const buttons: ButtonInGroup[] = useMemo(
    () => [
      {
        label: "Charging Events",
        onClick: () => setShownChart("chargingEvents"),
        id: "chargingEvents",
      },
      {
        label: "Charger Power Distribution",
        onClick: () => setShownChart("chargerPowerDistribution"),
        id: "chargerPowerDistribution",
      },
      {
        label: "Day Summary",
        onClick: () => setShownChart("daySummary"),
        id: "daySummary",
      },
      {
        label: "Energy Consumption",
        onClick: () => setShownChart("energyConsumption"),
        id: "energyConsumption",
      },
    ],
    [setShownChart]
  )

  return (
    <section className="my-8 flex min-h-screen flex-1 flex-col items-center gap-2">
      <h1 className="text-4xl font-bold text-gray-900">Mocked Charts</h1>
      <h3 className="text-2xl font-semibold text-gray-500">
        Select charts to display.
      </h3>
      <div className="mt-8 flex w-full flex-1 flex-col items-center gap-10">
        <ButtonGroup buttons={buttons} selectedId={shownChart} />

        {shownChart === "chargingEvents" && <ChargingEvents />}
        {shownChart === "chargerPowerDistribution" && (
          <ChargerPowerDistribution />
        )}
        {shownChart === "daySummary" && <DaySummary />}
        {shownChart === "energyConsumption" && <EnergyConsumption />}
      </div>
    </section>
  )
}
