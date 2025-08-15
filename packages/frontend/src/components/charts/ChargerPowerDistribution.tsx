import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { chargerConfig, powerCategoryColors } from "./mockedData"

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

interface PieTooltipPayload {
  payload: {
    name: string
    value: number
    percentage: string
    color: string
  }
}

interface CustomPieTooltipProps {
  active?: boolean
  payload?: PieTooltipPayload[]
}

export const ChargerPowerDistribution = () => {
  // Aggregate charger data by power capacity
  const powerDistribution = chargerConfig.reduce(
    (acc, charger) => {
      const powerKey = `${charger.power}kW`
      if (!acc[powerKey]) {
        acc[powerKey] = {
          power: charger.power,
          powerLabel: powerKey,
          count: 0,
          totalCapacity: 0,
          chargerIds: [],
        }
      }
      acc[powerKey].count += 1
      acc[powerKey].totalCapacity += charger.power
      acc[powerKey].chargerIds.push(charger.id)
      return acc
    },
    {} as Record<
      string,
      {
        power: number
        powerLabel: string
        count: number
        totalCapacity: number
        chargerIds: number[]
      }
    >
  )

  // Convert to array format for charts
  const distributionData = Object.values(powerDistribution).sort(
    (a, b) => a.power - b.power
  )

  // Prepare data for pie chart (percentage distribution)
  const pieData = distributionData.map((item) => ({
    name: item.powerLabel,
    value: item.count,
    percentage: ((item.count / chargerConfig.length) * 100).toFixed(1),
    color:
      powerCategoryColors[item.powerLabel as keyof typeof powerCategoryColors],
  }))

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = distributionData.find((d) => d.powerLabel === label)
      if (data) {
        return (
          <div className="max-w-xs rounded border border-gray-300 bg-white p-3 shadow-lg">
            <p className="font-semibold">{`${label} Chargers`}</p>
            <p className="font-medium text-blue-600">{`Count: ${data.count} chargers`}</p>
            <p className="text-green-600">{`Total Capacity: ${data.totalCapacity}kW`}</p>
            <p className="text-sm text-gray-600">{`${(
              (data.count / chargerConfig.length) *
              100
            ).toFixed(1)}% of all chargers`}</p>
            <div className="mt-2 text-xs text-gray-500">
              <p>Charger IDs: {data.chargerIds.join(", ")}</p>
            </div>
          </div>
        )
      }
    }
    return null
  }

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: CustomPieTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded border border-gray-300 bg-white p-3 shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">{`${data.value} chargers`}</p>
          <p className="text-gray-600">{`${data.percentage}% of total`}</p>
        </div>
      )
    }
    return null
  }

  // Calculate summary statistics
  const totalChargers = chargerConfig.length
  const totalCapacity = chargerConfig.reduce(
    (sum, charger) => sum + charger.power,
    0
  )
  const powerRange = {
    min: Math.min(...chargerConfig.map((c) => c.power)),
    max: Math.max(...chargerConfig.map((c) => c.power)),
  }

  return (
    <div className="w-full rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4 flex justify-center">
        <h2 className="text-3xl font-semibold">
          Charging Station Power Configuration Distribution
        </h2>
      </div>
      <div className="mb-6 text-center text-sm text-gray-600">
        Analysis of {totalChargers} charging stations by power capacity
      </div>

      {/* Charts Container */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar Chart - Count by Power Category */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="text-md mb-4 text-center font-medium">
            Charger Count by Power Rating
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={distributionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="powerLabel" tick={{ fontSize: 12 }} />
                <YAxis
                  label={{
                    value: "Number of Chargers",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        powerCategoryColors[
                          entry.powerLabel as keyof typeof powerCategoryColors
                        ]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Percentage Distribution */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="text-md mb-4 text-center font-medium">
            Power Distribution Percentage
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Summary Table */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <h3 className="text-md mb-4 font-medium">
          Detailed Power Distribution
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-3 py-2 text-left">Power Rating</th>
                <th className="px-3 py-2 text-right">Charger Count</th>
                <th className="px-3 py-2 text-right">Total Capacity (kW)</th>
                <th className="px-3 py-2 text-right">Percentage</th>
                <th className="px-3 py-2 text-left">Charger IDs</th>
              </tr>
            </thead>
            <tbody>
              {distributionData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="px-3 py-2">
                    <div className="flex items-center">
                      <div
                        className="mr-2 h-3 w-3 rounded"
                        style={{
                          backgroundColor:
                            powerCategoryColors[
                              item.powerLabel as keyof typeof powerCategoryColors
                            ],
                        }}
                      ></div>
                      {item.powerLabel}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {item.count}
                  </td>
                  <td className="px-3 py-2 text-right">{item.totalCapacity}</td>
                  <td className="px-3 py-2 text-right">
                    {((item.count / totalChargers) * 100).toFixed(1)}%
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600">
                    {item.chargerIds.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 gap-4 text-center lg:grid-cols-3">
        <div className="rounded bg-blue-50 p-3">
          <div className="text-2xl font-bold text-blue-600">
            {totalChargers}
          </div>
          <div className="text-sm text-gray-600">Total Chargers</div>
        </div>

        <div className="rounded bg-green-50 p-3">
          <div className="text-2xl font-bold text-green-600">
            {totalCapacity}
          </div>
          <div className="text-sm text-gray-600">Total Capacity (kW)</div>
        </div>

        <div className="rounded bg-orange-50 p-3">
          <div className="text-2xl font-bold text-orange-600">
            {powerRange.min} - {powerRange.max}
          </div>
          <div className="text-sm text-gray-600">Power Range (kW)</div>
        </div>
      </div>
    </div>
  )
}
