import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { arrayOfProbabilities } from "../../utils/constants";

// Mock charging station configuration - each charger has a specific power capacity
const generateChargingStationConfig = () => {
  return Array.from({ length: 20 }, (_, i) => {
    // Realistic distribution using your power options
    const powers = [2.75, 5.5, 11, 18, 25];

    const randomIntBetween0and5 = Math.floor(Math.random() * 5);
    return { id: i + 1, power: powers[randomIntBetween0and5] };
  });
};

const chargerConfig = generateChargingStationConfig();
console.log("Charger Configuration:", chargerConfig);
// Mock charging data generator - simulates realistic charging patterns with 15-min intervals
const generateChargingData = (): Record<string, number | string>[] => {
  const intervalsPer24Hours = 24 * 4;

  return Array.from({ length: intervalsPer24Hours }, (_, interval) => {
    // Convert interval to time
    const totalMinutes = interval * 15;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const timeLabel = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    const dataPoint: Record<string, number | string> = {
      time: timeLabel,
      interval,
      hour: hours,
      minute: minutes,
    };

    const adjustedMultiplier = 2 * arrayOfProbabilities[hours];

    // Initialize power category totals
    const powerCategories = {
      "2.75kW": 0,
      "5.5kW": 0,
      "11kW": 0,
      "18kW": 0,
      "25kW": 0,
    };

    // Track active chargers for statistics
    let activeChargers = 0;

    // Generate power values for each charging point and group by power category
    chargerConfig.forEach((charger) => {
      const isActive = Math.random() * 100 < adjustedMultiplier;

      if (isActive) {
        const powerKey = `${charger.power}kW` as keyof typeof powerCategories;
        powerCategories[powerKey] += charger.power;
        activeChargers++;
      }
    });

    // Add power category totals to dataPoint (this is what the chart uses)
    Object.entries(powerCategories).forEach(([category, total]) => {
      dataPoint[category] = total;
    });

    // Add summary data for statistics
    dataPoint.totalPower = Object.values(powerCategories).reduce(
      (sum, power) => sum + power,
      0
    );
    dataPoint.activeChargers = activeChargers;

    return dataPoint;
  });
};

const numberOfCharger = 20;
const chargingData = generateChargingData();
const powerCategoryColors = {
  "2.75kW": "#ff6b6b",
  "5.5kW": "#ffa500",
  "11kW": "#4ecdc4",
  "18kW": "#45b7d1",
  "25kW": "#96ceb4",
};

// Calculate some statistics for verification
const maxActualPower = Math.max(
  ...chargingData.map((interval) => Number(interval.totalPower))
);
const avgActualPower =
  chargingData.reduce((sum, interval) => sum + Number(interval.totalPower), 0) /
  chargingData.length;
console.log("Max actual power:", maxActualPower);
console.log("Average actual power:", avgActualPower);

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

export const DaySummary = () => {
  // Custom tooltip to show charging details
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const powerCategoryData = payload.filter(
        (p: TooltipPayload) => p.dataKey.endsWith("kW") && p.value > 0
      );

      const totalPower = powerCategoryData.reduce(
        (sum: number, p: TooltipPayload) => sum + p.value,
        0
      );

      // Calculate active chargers by counting how many chargers would be needed
      // for each power category's total power
      let activeChargersCount = 0;
      powerCategoryData.forEach((category) => {
        const powerValue = parseFloat(category.dataKey.replace("kW", ""));
        const chargersInCategory = Math.round(category.value / powerValue);
        activeChargersCount += chargersInCategory;
      });

      return (
        <div
          className="bg-white p-3 border border-gray-300 rounded shadow-lg max-w-xs pointer-events-auto"
          onMouseMove={(e) => e.stopPropagation()}
        >
          <p className="font-semibold">{`Time: ${label}`}</p>
          <p className="text-blue-600 font-medium">{`Total Power: ${totalPower.toFixed(
            2
          )} kW`}</p>
          <p className="text-gray-600 text-sm mb-2">{`Active: ${activeChargersCount}/${numberOfCharger} ${
            activeChargersCount > 1 ? "chargers" : "charger"
          }`}</p>
          <p className="text-xs text-gray-500 mb-2">15-minute interval data</p>

          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-700 mb-1">
              Power by Category:
            </p>
            {powerCategoryData
              .sort((a, b) => b.value - a.value)
              .map((entry, index) => {
                const powerValue = parseFloat(entry.dataKey.replace("kW", ""));
                const chargersInCategory = Math.round(entry.value / powerValue);
                return (
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
                      {entry.dataKey} ({chargersInCategory}{" "}
                      {chargersInCategory > 1 ? "chargers" : "charger"})
                    </span>
                    <span className="text-gray-700">
                      {entry.value.toFixed(2)} kW
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      );
    }
    return null;
  };

  const getIntervalTotal = (interval: Record<string, number | string>) => {
    // Use the pre-calculated totalPower for accuracy
    return Number(interval.totalPower) || 0;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 mt-10">
      <div className="flex justify-center">
        <h2 className="text-lg font-semibold my-2">
          Daily Charging Power Profile by Station Category - {numberOfCharger}{" "}
          Charge Points (15-min intervals)
        </h2>
      </div>
      <div className="text-center text-sm text-gray-600 mb-4">
        Power consumption grouped by charging station capacity (2.75kW - 25kW) •
        96 intervals per day
      </div>

      <div className="w-full h-[600px]">
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
                <div className="text-center text-sm text-gray-600 mt-2 space-y-2">
                  <div>Power consumption by charging station category</div>
                  <div className="flex justify-center space-x-4 text-xs">
                    {Object.entries(powerCategoryColors).map(
                      ([category, color]) => (
                        <div
                          key={category}
                          className="flex items-center space-x-1"
                        >
                          <div
                            className="w-3 h-3 rounded"
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
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced Summary Statistics */}
      <div className="mt-4 space-y-4 grid grid-cols-2 gap-4 text-center">
        {/* Main Stats */}

        <div className="bg-blue-50 p-3 rounded">
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

        <div className="bg-green-50 p-3 rounded">
          <div className="text-2xl font-bold text-green-600">
            {chargingData
              .reduce((max, interval) => {
                const intervalTotal = getIntervalTotal(interval);
                return Math.max(max, intervalTotal);
              }, 0)
              .toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Peak Actual Power (kW)</div>
          <div className="text-xs text-gray-500">
            Maximum observed consumption
          </div>
        </div>

        <div className="bg-purple-50 p-3 rounded">
          <div className="text-2xl font-bold text-purple-600">
            {(
              chargingData.reduce((total, interval) => {
                return total + getIntervalTotal(interval);
              }, 0) * 0.25
            ) // Convert 15-min intervals to hours (15/60 = 0.25)
              .toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Total Energy (kWh)</div>
          <div className="text-xs text-gray-500">24-hour consumption</div>
        </div>
        <div className=" gap-4 text-center">
          <div className="bg-orange-50 p-3 rounded">
            <div className="text-2xl font-bold text-orange-600">
              {(
                (chargingData.reduce((max, interval) => {
                  const intervalTotal = getIntervalTotal(interval);
                  return Math.max(max, intervalTotal);
                }, 0) /
                  chargerConfig.reduce(
                    (total, charger) => total + charger.power,
                    0
                  )) *
                100
              ).toFixed(1)}
              %
            </div>
            <div className="text-sm text-gray-600">Concurrency Factor</div>
          </div>
        </div>
      </div>
    </div>
  );
};
