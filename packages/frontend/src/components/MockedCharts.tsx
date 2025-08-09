import { useState } from "react";
import {
  ChargerPowerDistribution,
  ChargingEvents,
  DaySummary,
  EnergyConsumption,
} from "./charts";

export const MockedCharts = () => {
  const [shownCharts, setShownCharts] = useState({
    chargingEvents: false,
    chargerPowerDistribution: false,
    daySummary: false,
    energyConsumption: false,
  });

  const handleButtonToggle = (chartKey: keyof typeof shownCharts) => {
    setShownCharts((prev) => ({
      ...prev,
      [chartKey]: !prev[chartKey],
    }));
  };

  return (
    <div className="min-h-screen flex flex-1 flex-col items-center my-8 gap-2">
      <h1 className="text-4xl font-bold text-gray-900  ">Mocked Charts</h1>
      <h3 className="text-2xl font-semibold text-gray-500 ">
        Toggled charts are added to the end of other charts.
      </h3>
      <div className="flex flex-1 flex-col items-center gap-10 mt-8 w-full">
        {/* Toggle Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => handleButtonToggle("chargingEvents")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 border-2 ${
              shownCharts.chargingEvents
                ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            Charging Events
          </button>

          <button
            onClick={() => handleButtonToggle("chargerPowerDistribution")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 border-2 ${
              shownCharts.chargerPowerDistribution
                ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            Charger Power Distribution
          </button>

          <button
            onClick={() => handleButtonToggle("daySummary")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 border-2 ${
              shownCharts.daySummary
                ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            Day Summary
          </button>

          <button
            onClick={() => handleButtonToggle("energyConsumption")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 border-2 ${
              shownCharts.energyConsumption
                ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            Energy Consumption
          </button>
        </div>

        {shownCharts.chargingEvents && <ChargingEvents />}

        {shownCharts.chargerPowerDistribution && <ChargerPowerDistribution />}

        {shownCharts.daySummary && <DaySummary />}

        {shownCharts.energyConsumption && <EnergyConsumption />}
      </div>
    </div>
  );
};
