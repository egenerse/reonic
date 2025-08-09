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
} from "recharts";
import { chargerConfig, powerCategoryColors } from "./mockedData";

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

interface PieTooltipPayload {
  payload: {
    name: string;
    value: number;
    percentage: string;
    color: string;
  };
}

interface CustomPieTooltipProps {
  active?: boolean;
  payload?: PieTooltipPayload[];
}

export const ChargerPowerDistribution = () => {
  // Aggregate charger data by power capacity
  const powerDistribution = chargerConfig.reduce(
    (acc, charger) => {
      const powerKey = `${charger.power}kW`;
      if (!acc[powerKey]) {
        acc[powerKey] = {
          power: charger.power,
          powerLabel: powerKey,
          count: 0,
          totalCapacity: 0,
          chargerIds: [],
        };
      }
      acc[powerKey].count += 1;
      acc[powerKey].totalCapacity += charger.power;
      acc[powerKey].chargerIds.push(charger.id);
      return acc;
    },
    {} as Record<
      string,
      {
        power: number;
        powerLabel: string;
        count: number;
        totalCapacity: number;
        chargerIds: number[];
      }
    >
  );

  // Convert to array format for charts
  const distributionData = Object.values(powerDistribution).sort(
    (a, b) => a.power - b.power
  );

  // Prepare data for pie chart (percentage distribution)
  const pieData = distributionData.map((item) => ({
    name: item.powerLabel,
    value: item.count,
    percentage: ((item.count / chargerConfig.length) * 100).toFixed(1),
    color:
      powerCategoryColors[item.powerLabel as keyof typeof powerCategoryColors],
  }));

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = distributionData.find((d) => d.powerLabel === label);
      if (data) {
        return (
          <div className="bg-white p-3 border border-gray-300 rounded shadow-lg max-w-xs">
            <p className="font-semibold">{`${label} Chargers`}</p>
            <p className="text-blue-600 font-medium">{`Count: ${data.count} chargers`}</p>
            <p className="text-green-600">{`Total Capacity: ${data.totalCapacity}kW`}</p>
            <p className="text-gray-600 text-sm">{`${(
              (data.count / chargerConfig.length) *
              100
            ).toFixed(1)}% of all chargers`}</p>
            <div className="mt-2 text-xs text-gray-500">
              <p>Charger IDs: {data.chargerIds.join(", ")}</p>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: CustomPieTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">{`${data.value} chargers`}</p>
          <p className="text-gray-600">{`${data.percentage}% of total`}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const totalChargers = chargerConfig.length;
  const totalCapacity = chargerConfig.reduce(
    (sum, charger) => sum + charger.power,
    0
  );
  const powerRange = {
    min: Math.min(...chargerConfig.map((c) => c.power)),
    max: Math.max(...chargerConfig.map((c) => c.power)),
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 mt-6">
      <div className="flex justify-center mb-4">
        <h2 className="text-lg font-semibold">
          Charging Station Power Configuration Distribution
        </h2>
      </div>
      <div className="text-center text-sm text-gray-600 mb-6">
        Analysis of {totalChargers} charging stations by power capacity
      </div>

      {/* Charts Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart - Count by Power Category */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-md font-medium text-center mb-4">
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
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-md font-medium text-center mb-4">
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
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-md font-medium mb-4">
          Detailed Power Distribution
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">Power Rating</th>
                <th className="text-right py-2 px-3">Charger Count</th>
                <th className="text-right py-2 px-3">Total Capacity (kW)</th>
                <th className="text-right py-2 px-3">Percentage</th>
                <th className="text-left py-2 px-3">Charger IDs</th>
              </tr>
            </thead>
            <tbody>
              {distributionData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-3">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded mr-2"
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
                  <td className="text-right py-2 px-3 font-medium">
                    {item.count}
                  </td>
                  <td className="text-right py-2 px-3">{item.totalCapacity}</td>
                  <td className="text-right py-2 px-3">
                    {((item.count / totalChargers) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 px-3 text-xs text-gray-600">
                    {item.chargerIds.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 p-3 rounded">
          <div className="text-2xl font-bold text-blue-600">
            {totalChargers}
          </div>
          <div className="text-sm text-gray-600">Total Chargers</div>
        </div>

        <div className="bg-green-50 p-3 rounded">
          <div className="text-2xl font-bold text-green-600">
            {totalCapacity}
          </div>
          <div className="text-sm text-gray-600">Total Capacity (kW)</div>
        </div>

        <div className="bg-orange-50 p-3 rounded">
          <div className="text-2xl font-bold text-orange-600">
            {powerRange.min} - {powerRange.max}
          </div>
          <div className="text-sm text-gray-600">Power Range (kW)</div>
        </div>
      </div>
    </div>
  );
};
