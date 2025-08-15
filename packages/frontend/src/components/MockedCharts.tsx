import { useState } from "react"
import {
  ChargerPowerDistribution,
  ChargingEvents,
  DaySummary,
  EnergyConsumption,
} from "./charts"

export const MockedCharts = () => {
  const [shownCharts, setShownCharts] = useState({
    chargingEvents: false,
    chargerPowerDistribution: false,
    daySummary: false,
    energyConsumption: false,
  })

  const handleButtonToggle = (chartKey: keyof typeof shownCharts) => {
    setShownCharts((prev) => ({
      ...prev,
      [chartKey]: !prev[chartKey],
    }))
  }

  return (
    <div className="my-8 flex min-h-screen flex-1 flex-col items-center gap-2">
      <h1 className="text-4xl font-bold text-gray-900">Mocked Charts</h1>
      <h3 className="text-2xl font-semibold text-gray-500">
        Select charts to display.
      </h3>
      <div className="mt-8 flex w-full flex-1 flex-col items-center gap-10">
        {/* Toggle Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => handleButtonToggle("chargingEvents")}
            className={`rounded-lg border-2 px-6 py-3 font-medium transition-all duration-200 ${
              shownCharts.chargingEvents
                ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Charging Events
          </button>

          <button
            onClick={() => handleButtonToggle("chargerPowerDistribution")}
            className={`rounded-lg border-2 px-6 py-3 font-medium transition-all duration-200 ${
              shownCharts.chargerPowerDistribution
                ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Charger Power Distribution
          </button>

          <button
            onClick={() => handleButtonToggle("daySummary")}
            className={`rounded-lg border-2 px-6 py-3 font-medium transition-all duration-200 ${
              shownCharts.daySummary
                ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Day Summary
          </button>

          <button
            onClick={() => handleButtonToggle("energyConsumption")}
            className={`rounded-lg border-2 px-6 py-3 font-medium transition-all duration-200 ${
              shownCharts.energyConsumption
                ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Energy Consumption
          </button>
        </div>

        {/* Render Selected Charts */}
        {shownCharts.chargingEvents && <ChargingEvents />}
        {shownCharts.chargerPowerDistribution && <ChargerPowerDistribution />}
        {shownCharts.daySummary && <DaySummary />}
        {shownCharts.energyConsumption && <EnergyConsumption />}
      </div>
    </div>
  )
}
