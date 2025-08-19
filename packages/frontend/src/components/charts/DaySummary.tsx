import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  chargerConfig,
  chargingData,
  numberOfCharger,
  powerCategoryColors,
} from "./mockedData"
import { toDecimal } from "../../utils/text"

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

export const DaySummary = () => {
  // Custom tooltip to show charging details
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const powerCategoryData = payload.filter(
        (p: TooltipPayload) => p.dataKey.endsWith("kW") && p.value > 0
      )

      const totalPower = powerCategoryData.reduce(
        (sum: number, p: TooltipPayload) => sum + p.value,
        0
      )

      // Calculate active chargers by counting how many chargers would be needed
      // for each power category's total power
      let activeChargersCount = 0
      powerCategoryData.forEach((category) => {
        const powerValue = parseFloat(category.dataKey.replace("kW", ""))
        const chargersInCategory = Math.round(category.value / powerValue)
        activeChargersCount += chargersInCategory
      })

      return (
        <div
          className="pointer-events-auto max-w-xs rounded border border-gray-300 bg-white p-3 shadow-lg"
          onMouseMove={(e) => e.stopPropagation()}
        >
          <p className="font-semibold">{`Time: ${label}`}</p>
          <p className="font-medium text-blue-600">{`Total Power: ${toDecimal(
            totalPower
          )} kW`}</p>
          <p className="mb-2 text-sm text-gray-600">{`Active: ${activeChargersCount}/${numberOfCharger} ${
            activeChargersCount > 1 ? "chargers" : "charger"
          }`}</p>
          <p className="mb-2 text-xs text-gray-500">15-minute interval data</p>

          <div className="space-y-1">
            <p className="mb-1 text-xs font-medium text-gray-700">
              Power by Category:
            </p>
            {powerCategoryData
              .sort((a, b) => b.value - a.value)
              .map((entry, index) => {
                const powerValue = parseFloat(entry.dataKey.replace("kW", ""))
                const chargersInCategory = Math.round(entry.value / powerValue)
                return (
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
                      {entry.dataKey} ({chargersInCategory}{" "}
                      {chargersInCategory > 1 ? "chargers" : "charger"})
                    </span>
                    <span className="text-gray-700">
                      {toDecimal(entry.value)} kW
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      )
    }
    return null
  }

  const getIntervalTotal = (interval: Record<string, number | string>) => {
    return Number(interval.totalPower) || 0
  }

  return (
    <div className="w-full rounded-lg bg-white p-4 shadow-md">
      <div className="flex justify-center">
        <h2 className="my-2 text-3xl font-semibold">
          Daily Charging Power Profile by Station Category - {numberOfCharger}{" "}
          Charge Points (15-min intervals)
        </h2>
      </div>
      <div className="mb-4 text-center text-sm text-gray-600">
        Power consumption grouped by charging station capacity (2.75kW - 25kW) •
        96 intervals per day
      </div>

      <div className="h-[600px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={600}
            data={chargingData}
            margin={{ top: 20, right: 30, left: 80, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={7} // Show every 8th interval (every 2 hours)
              tick={{ fontSize: 10 }}
            />
            <YAxis
              label={{
                value: "Power (kW)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              allowEscapeViewBox={{ x: false, y: false }}
              offset={-2}
            />
            <Legend
              content={() => (
                <div className="mt-2 space-y-2 text-center text-sm text-gray-600">
                  <div>Power consumption by charging station category</div>
                  <div className="flex justify-center space-x-4 text-xs">
                    {Object.entries(powerCategoryColors).map(
                      ([category, color]) => (
                        <div
                          key={category}
                          className="flex items-center space-x-1"
                        >
                          <div
                            className="h-3 w-3 rounded"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span>{category}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            />

            {/* Generate Area components for each power category */}
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
            <Brush
              dataKey="time"
              height={30}
              stroke="#8884d8"
              travellerWidth={10}
              gap={5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced Summary Statistics */}
      <div className="mt-4 grid grid-cols-2 gap-4 space-y-4 text-center">
        {/* Main Stats */}

        <div className="rounded bg-blue-50 p-3">
          <div className="text-2xl font-bold text-blue-600">
            {chargerConfig.reduce(
              (total, charger) => total + Number(charger.power),
              0
            )}
          </div>
          <div className="text-sm text-gray-600">
            Theoretical Max Power (kW)
          </div>
          <div className="text-xs text-gray-500">
            All chargers at full capacity
          </div>
        </div>

        <div className="rounded bg-green-50 p-3">
          <div className="text-2xl font-bold text-green-600">
            {toDecimal(
              chargingData.reduce((max, interval) => {
                const intervalTotal = getIntervalTotal(interval)
                return Math.max(max, intervalTotal)
              }, 0)
            )}
          </div>
          <div className="text-sm text-gray-600">Peak Actual Power (kW)</div>
          <div className="text-xs text-gray-500">
            Maximum observed consumption
          </div>
        </div>

        <div className="rounded bg-purple-50 p-3">
          <div className="text-2xl font-bold text-purple-600">
            {toDecimal(
              chargingData.reduce((total, interval) => {
                return total + getIntervalTotal(interval)
              }, 0) * 0.25
            )}
          </div>
          <div className="text-sm text-gray-600">Total Energy (kWh)</div>
          <div className="text-xs text-gray-500">24-hour consumption</div>
        </div>
        <div className="gap-4 text-center">
          <div className="rounded bg-orange-50 p-3">
            <div className="text-2xl font-bold text-orange-600">
              {toDecimal(
                (chargingData.reduce((max, interval) => {
                  const intervalTotal = getIntervalTotal(interval)
                  return Math.max(max, intervalTotal)
                }, 0) /
                  chargerConfig.reduce(
                    (total, charger) => total + charger.power,
                    0
                  )) *
                  100
              )}
              %
            </div>
            <div className="text-sm text-gray-600">Concurrency Factor</div>
          </div>
        </div>
      </div>
    </div>
  )
}
