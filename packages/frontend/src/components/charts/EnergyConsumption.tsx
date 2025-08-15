import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
  Cell,
} from "recharts"
import {
  energyConsumptionData,
  dailyEnergyTrend,
  powerCategoryColors,
} from "./mockedData"
import { useState } from "react"
import { ButtonGroup } from "../buttons/ButtonGroup"

interface TooltipPayload {
  value: number
  dataKey: string
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

export const EnergyConsumption = () => {
  const [selectedTimeFrameIndex, setSelectedTimeFrameIndex] = useState(0) // Index for energyConsumptionData
  const currentData = energyConsumptionData[selectedTimeFrameIndex]

  // Prepare data for the energy by category bar chart
  const categoryBarData = Object.entries(currentData.energyByCategory)
    .map(([category, data]) => ({
      category,
      totalEnergy: data.totalEnergy,
      chargerCount: data.chargerCount,
      avgEnergyPerCharger:
        Math.round((data.totalEnergy / data.chargerCount) * 100) / 100,
      totalHours: data.totalHours,
    }))
    .sort((a, b) => parseFloat(a.category) - parseFloat(b.category))

  // Custom tooltip for category bar chart
  const CategoryTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = categoryBarData.find((d) => d.category === label)
      if (data) {
        return (
          <div className="max-w-xs rounded border border-gray-300 bg-white p-3 shadow-lg">
            <p className="font-semibold">{`${label} Chargers`}</p>
            <p className="font-medium text-green-600">{`Total Energy: ${data.totalEnergy.toFixed(
              2
            )} kWh`}</p>
            <p className="text-blue-600">{`${data.chargerCount} chargers`}</p>
            <p className="text-sm text-gray-600">{`Avg per charger: ${data.avgEnergyPerCharger.toFixed(
              2
            )} kWh`}</p>
            <p className="text-sm text-gray-600">{`Total operating hours: ${data.totalHours.toFixed(
              2
            )}h`}</p>
          </div>
        )
      }
    }
    return null
  }

  // Custom tooltip for daily trend
  const DailyTrendTooltip = ({
    active,
    payload,
    label,
  }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const dayData = dailyEnergyTrend.find((d) => d.date === label)
      if (dayData) {
        const sortedCategories = payload
          .filter((p) => p.dataKey !== "totalEnergy" && p.value > 0)
          .sort((a, b) => b.value - a.value)

        return (
          <div className="max-w-xs rounded border border-gray-300 bg-white p-3 shadow-lg">
            <p className="font-semibold">{`${label} (${dayData.dayOfWeek})`}</p>
            <p className="font-medium text-green-600">{`Total: ${dayData.totalEnergy} kWh`}</p>
            <p className="mb-2 text-sm text-gray-600">
              {dayData.isWeekend ? "Weekend" : "Weekday"}
            </p>

            <div className="space-y-1">
              <p className="mb-1 text-xs font-medium text-gray-700">
                Energy by Category:
              </p>
              {sortedCategories.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs"
                >
                  <span
                    style={{
                      color:
                        powerCategoryColors[
                          entry.dataKey as keyof typeof powerCategoryColors
                        ],
                    }}
                    className="font-medium"
                  >
                    {entry.dataKey}
                  </span>
                  <span className="text-gray-700">{entry.value} kWh</span>
                </div>
              ))}
            </div>
          </div>
        )
      }
    }
    return null
  }

  // Calculate summary statistics
  const totalSystemEnergy = currentData.totalEnergy
  const avgDailyEnergy = currentData.avgDailyEnergy
  const mostEfficientCategory = categoryBarData.reduce((prev, current) =>
    prev.avgEnergyPerCharger > current.avgEnergyPerCharger ? prev : current
  )
  const totalOperatingHours = Object.values(
    currentData.energyByCategory
  ).reduce((sum, cat) => sum + cat.totalHours, 0)

  const buttons = energyConsumptionData.map((data, index) => ({
    id: index.toString(),
    label: data.timeFrame,
    onClick: () => setSelectedTimeFrameIndex(index),
  }))

  return (
    <div className="w-full rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4 flex justify-center">
        <h2 className="text-3xl font-semibold">
          Total Energy Consumption Analysis
        </h2>
      </div>

      <ButtonGroup
        buttons={buttons}
        selectedId={selectedTimeFrameIndex.toString()}
        className="mb-10"
      />

      {/* {energyConsumptionData.map((data, index) => (
            <button
              key={index}
              onClick={() => setSelectedTimeFrame(index)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                selectedTimeFrame === index
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {data.timeFrame}
            </button>
          ))} */}

      {/* Summary Statistics */}
      <div className="mb-6 grid grid-cols-2 gap-4 text-center lg:grid-cols-4">
        <div className="rounded bg-green-50 p-3">
          <div className="text-2xl font-bold text-green-600">
            {totalSystemEnergy}
          </div>
          <div className="text-sm text-gray-600">Total Energy (kWh)</div>
          <div className="text-xs text-gray-500">{currentData.timeFrame}</div>
        </div>

        <div className="rounded bg-blue-50 p-3">
          <div className="text-2xl font-bold text-blue-600">
            {avgDailyEnergy}
          </div>
          <div className="text-sm text-gray-600">Avg Daily (kWh)</div>
          <div className="text-xs text-gray-500">Per day average</div>
        </div>

        <div className="rounded bg-purple-50 p-3">
          <div className="text-2xl font-bold text-purple-600">
            {mostEfficientCategory.category}
          </div>
          <div className="text-sm text-gray-600">Most Efficient</div>
          <div className="text-xs text-gray-500">
            {mostEfficientCategory.avgEnergyPerCharger} kWh per charger
          </div>
        </div>

        <div className="rounded bg-orange-50 p-3">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(totalOperatingHours)}
          </div>
          <div className="text-sm text-gray-600">Total Hours</div>
          <div className="text-xs text-gray-500">All chargers combined</div>
        </div>
      </div>

      {/* Charts Container */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Energy by Category Bar Chart */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="text-md mb-4 text-center font-medium">
            Energy Consumption by Charger Category
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryBarData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis
                  label={{
                    value: "Energy (kWh)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={<CategoryTooltip />} />
                <Bar dataKey="totalEnergy" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {categoryBarData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        powerCategoryColors[
                          entry.category as keyof typeof powerCategoryColors
                        ]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Energy Trend (Last 30 Days) */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="text-md mb-4 text-center font-medium">
            Daily Energy Trend (Last 30 Days)
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dailyEnergyTrend}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={2} // Show every 3rd date
                />
                <YAxis
                  label={{
                    value: "Energy (kWh)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={<DailyTrendTooltip />} />
                <Legend />

                {/* Stack areas for each power category */}
                {Object.entries(powerCategoryColors).map(
                  ([powerCategory, color]) => (
                    <Area
                      key={powerCategory}
                      type="monotone"
                      dataKey={powerCategory}
                      stackId="1"
                      stroke={color}
                      fill={color}
                      fillOpacity={0.7}
                    />
                  )
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Energy Table */}
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="text-md mb-4 font-medium">
          Detailed Energy Breakdown - {currentData.timeFrame}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-3 py-2 text-left">Power Category</th>
                <th className="px-3 py-2 text-right">Chargers</th>
                <th className="px-3 py-2 text-right">Total Energy (kWh)</th>
                <th className="px-3 py-2 text-right">Avg per Charger (kWh)</th>
                <th className="px-3 py-2 text-right">Total Hours</th>
                <th className="px-3 py-2 text-right">% of Total Energy</th>
              </tr>
            </thead>
            <tbody>
              {categoryBarData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="px-3 py-2">
                    <div className="flex items-center">
                      <div
                        className="mr-2 h-3 w-3 rounded"
                        style={{
                          backgroundColor:
                            powerCategoryColors[
                              item.category as keyof typeof powerCategoryColors
                            ],
                        }}
                      ></div>
                      {item.category}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {item.chargerCount}
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {item.totalEnergy.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {item.avgEnergyPerCharger}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {Math.round(item.totalHours)}
                  </td>

                  <td className="px-3 py-2 text-right">
                    {((item.totalEnergy / totalSystemEnergy) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
