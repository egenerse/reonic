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
} from "recharts";
import {
  energyConsumptionData,
  dailyEnergyTrend,
  powerCategoryColors,
} from "./mockedData";
import { useState } from "react";

interface TooltipPayload {
  value: number;
  dataKey: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export const EnergyConsumption = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(0); // Index for energyConsumptionData
  const currentData = energyConsumptionData[selectedTimeFrame];

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
    .sort((a, b) => parseFloat(a.category) - parseFloat(b.category));

  // Custom tooltip for category bar chart
  const CategoryTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = categoryBarData.find((d) => d.category === label);
      if (data) {
        return (
          <div className="bg-white p-3 border border-gray-300 rounded shadow-lg max-w-xs">
            <p className="font-semibold">{`${label} Chargers`}</p>
            <p className="text-green-600 font-medium">{`Total Energy: ${data.totalEnergy} kWh`}</p>
            <p className="text-blue-600">{`${data.chargerCount} chargers`}</p>
            <p className="text-gray-600 text-sm">{`Avg per charger: ${data.avgEnergyPerCharger} kWh`}</p>
            <p className="text-gray-600 text-sm">{`Total operating hours: ${data.totalHours}h`}</p>
          </div>
        );
      }
    }
    return null;
  };

  // Custom tooltip for daily trend
  const DailyTrendTooltip = ({
    active,
    payload,
    label,
  }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const dayData = dailyEnergyTrend.find((d) => d.date === label);
      if (dayData) {
        const sortedCategories = payload
          .filter((p) => p.dataKey !== "totalEnergy" && p.value > 0)
          .sort((a, b) => b.value - a.value);

        return (
          <div className="bg-white p-3 border border-gray-300 rounded shadow-lg max-w-xs">
            <p className="font-semibold">{`${label} (${dayData.dayOfWeek})`}</p>
            <p className="text-green-600 font-medium">{`Total: ${dayData.totalEnergy} kWh`}</p>
            <p className="text-gray-600 text-sm mb-2">
              {dayData.isWeekend ? "Weekend" : "Weekday"}
            </p>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700 mb-1">
                Energy by Category:
              </p>
              {sortedCategories.map((entry, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-xs"
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
        );
      }
    }
    return null;
  };

  // Calculate summary statistics
  const totalSystemEnergy = currentData.totalEnergy;
  const avgDailyEnergy = currentData.avgDailyEnergy;
  const mostEfficientCategory = categoryBarData.reduce((prev, current) =>
    prev.avgEnergyPerCharger > current.avgEnergyPerCharger ? prev : current
  );
  const totalOperatingHours = Object.values(
    currentData.energyByCategory
  ).reduce((sum, cat) => sum + cat.totalHours, 0);

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 mt-6">
      <div className="flex justify-center mb-4">
        <h2 className="text-lg font-semibold">
          Total Energy Consumption Analysis
        </h2>
      </div>

      {/* Time Frame Selector */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-wrap gap-2">
          {energyConsumptionData.map((data, index) => (
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
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-center">
        <div className="bg-green-50 p-3 rounded">
          <div className="text-2xl font-bold text-green-600">
            {totalSystemEnergy}
          </div>
          <div className="text-sm text-gray-600">Total Energy (kWh)</div>
          <div className="text-xs text-gray-500">{currentData.timeFrame}</div>
        </div>

        <div className="bg-blue-50 p-3 rounded">
          <div className="text-2xl font-bold text-blue-600">
            {avgDailyEnergy}
          </div>
          <div className="text-sm text-gray-600">Avg Daily (kWh)</div>
          <div className="text-xs text-gray-500">Per day average</div>
        </div>

        <div className="bg-purple-50 p-3 rounded">
          <div className="text-2xl font-bold text-purple-600">
            {mostEfficientCategory.category}
          </div>
          <div className="text-sm text-gray-600">Most Efficient</div>
          <div className="text-xs text-gray-500">
            {mostEfficientCategory.avgEnergyPerCharger} kWh per charger
          </div>
        </div>

        <div className="bg-orange-50 p-3 rounded">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(totalOperatingHours)}
          </div>
          <div className="text-sm text-gray-600">Total Hours</div>
          <div className="text-xs text-gray-500">All chargers combined</div>
        </div>
      </div>

      {/* Charts Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Energy by Category Bar Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-md font-medium text-center mb-4">
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
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-md font-medium text-center mb-4">
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
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-md font-medium mb-4">
          Detailed Energy Breakdown - {currentData.timeFrame}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">Power Category</th>
                <th className="text-right py-2 px-3">Chargers</th>
                <th className="text-right py-2 px-3">Total Energy (kWh)</th>
                <th className="text-right py-2 px-3">Avg per Charger (kWh)</th>
                <th className="text-right py-2 px-3">Total Hours</th>
                <th className="text-right py-2 px-3">% of Total Energy</th>
              </tr>
            </thead>
            <tbody>
              {categoryBarData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-3">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded mr-2"
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
                  <td className="text-right py-2 px-3 font-medium">
                    {item.chargerCount}
                  </td>
                  <td className="text-right py-2 px-3 font-medium">
                    {item.totalEnergy.toFixed(2)}
                  </td>
                  <td className="text-right py-2 px-3">
                    {item.avgEnergyPerCharger}
                  </td>
                  <td className="text-right py-2 px-3">
                    {Math.round(item.totalHours)}
                  </td>

                  <td className="text-right py-2 px-3">
                    {((item.totalEnergy / totalSystemEnergy) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
