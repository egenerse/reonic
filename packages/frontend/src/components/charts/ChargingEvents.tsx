import React, { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { chargingEventsData, powerCategoryColors } from "./mockedData"
import { ButtonGroup, type ButtonInGroup } from "../buttons/ButtonGroup"

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

export const ChargingEvents = () => {
  const [selectedView, setSelectedView] = useState<
    "daily" | "weekly" | "monthly" | "heatmap"
  >("daily")

  // Get the appropriate data based on selected view
  const getCurrentData = () => {
    switch (selectedView) {
      case "daily":
        return chargingEventsData.daily.slice(-30) // Last 30 days
      case "weekly":
        return chargingEventsData.weekly.slice(-12) // Last 12 weeks
      case "monthly":
        return chargingEventsData.monthly
      default:
        return chargingEventsData.daily.slice(-30)
    }
  }

  const currentData = getCurrentData()

  const buttons: ButtonInGroup[] = [
    {
      id: "daily",
      label: "Daily (30 days)",
      onClick: () => setSelectedView("daily"),
    },
    {
      id: "weekly",
      label: "Weekly (12 weeks)",
      onClick: () => setSelectedView("weekly"),
    },
    {
      id: "monthly",
      label: "Monthly (12 months)",
      onClick: () => setSelectedView("monthly"),
    },
    {
      id: "heatmap",
      label: "Hourly Heatmap",
      onClick: () => setSelectedView("heatmap"),
    },
  ]

  // Custom tooltip for line/bar charts
  const EventsTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const totalEvents =
        payload.find((p) => p.dataKey === "totalEvents")?.value || 0
      const categoryData = payload.filter(
        (p) => p.dataKey !== "totalEvents" && p.value > 0
      )

      return (
        <div className="max-w-xs rounded border border-gray-300 bg-white p-3 shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          <p className="font-medium text-blue-600">{`Total Events: ${totalEvents}`}</p>

          {categoryData.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="mb-1 text-xs font-medium text-gray-700">
                Events by Category:
              </p>
              {categoryData
                .sort((a, b) => b.value - a.value)
                .map((entry, index) => (
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
                    <span className="text-gray-700">{entry.value} events</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )
    }
    return null
  }

  // Calculate summary statistics
  const totalEvents = currentData.reduce(
    (sum: number, item: unknown) =>
      sum + ((item as Record<string, number>).totalEvents || 0),
    0
  )
  const avgEventsPerPeriod = Math.round(totalEvents / currentData.length)
  const maxEvents = Math.max(
    ...currentData.map(
      (item: unknown) => (item as Record<string, number>).totalEvents || 0
    )
  )

  // Get most active category
  const categoryTotals = Object.keys(powerCategoryColors).reduce(
    (acc, category) => {
      acc[category] = currentData.reduce(
        (sum: number, item: unknown) =>
          sum + ((item as Record<string, number>)[category] || 0),
        0
      )
      return acc
    },
    {} as Record<string, number>
  )

  const mostActiveCategory = Object.entries(categoryTotals).reduce(
    (prev, current) => (current[1] > prev[1] ? current : prev)
  )

  // Prepare heatmap data for display
  const heatmapCells = chargingEventsData.heatmap.flatMap((dayData) =>
    dayData.hours.map((hourData) => ({
      day: hourData.day,
      hour: hourData.hour,
      events: hourData.events,
      isWeekend: hourData.isWeekend,
    }))
  )

  // Get max events for heatmap color scaling
  const maxHeatmapEvents = Math.max(...heatmapCells.map((cell) => cell.events))

  const getHeatmapColor = (events: number) => {
    const intensity = events / maxHeatmapEvents
    const alpha = Math.max(0.1, intensity)
    return `rgba(59, 130, 246, ${alpha})` // Blue with varying opacity
  }

  return (
    <div className="w-full rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4 flex justify-center">
        <h2 className="text-3xl font-semibold">Charging Events Analysis</h2>
      </div>

      <ButtonGroup
        buttons={buttons}
        selectedId={selectedView}
        className="mb-10"
      />

      {/* Summary Statistics */}
      {selectedView !== "heatmap" && (
        <div className="mb-6 grid grid-cols-2 gap-4 text-center lg:grid-cols-4">
          <div className="rounded bg-blue-50 p-3">
            <div className="text-2xl font-bold text-blue-600">
              {totalEvents.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Events</div>
            <div className="text-xs text-gray-500">
              {selectedView === "daily"
                ? "Last 30 days"
                : selectedView === "weekly"
                  ? "Last 12 weeks"
                  : "Last 12 months"}
            </div>
          </div>

          <div className="rounded bg-green-50 p-3">
            <div className="text-2xl font-bold text-green-600">
              {avgEventsPerPeriod}
            </div>
            <div className="text-sm text-gray-600">
              Avg per{" "}
              {selectedView === "monthly"
                ? "month"
                : selectedView === "weekly"
                  ? "week"
                  : "day"}
            </div>
            <div className="text-xs text-gray-500">Average events</div>
          </div>

          <div className="rounded bg-purple-50 p-3">
            <div className="text-2xl font-bold text-purple-600">
              {mostActiveCategory[0]}
            </div>
            <div className="text-sm text-gray-600">Most Active</div>
            <div className="text-xs text-gray-500">
              {mostActiveCategory[1]} events
            </div>
          </div>

          <div className="rounded bg-orange-50 p-3">
            <div className="text-2xl font-bold text-orange-600">
              {maxEvents}
            </div>
            <div className="text-sm text-gray-600">Peak Events</div>
            <div className="text-xs text-gray-500">Single period maximum</div>
          </div>
        </div>
      )}

      {/* Chart Container */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        {selectedView === "heatmap" ? (
          <>
            <h3 className="text-md mb-4 text-center font-medium">
              Charging Events Heatmap - Hour vs Day of Week
            </h3>
            <div className="overflow-x-auto">
              <div className="grid min-w-[800px] grid-cols-25 gap-1">
                {/* Header row with hours */}
                <div className="p-1 text-center text-xs font-medium text-gray-600">
                  Day
                </div>
                {Array.from({ length: 24 }, (_, hour) => (
                  <div
                    key={hour}
                    className="p-1 text-center text-xs font-medium text-gray-600"
                  >
                    {hour.toString().padStart(2, "0")}
                  </div>
                ))}

                {/* Data rows */}
                {chargingEventsData.heatmap.map((dayData) => (
                  <React.Fragment key={dayData.day}>
                    <div className="rounded bg-gray-100 p-2 text-center text-xs font-medium text-gray-700">
                      {dayData.day}
                    </div>
                    {dayData.hours.map((hourData) => (
                      <div
                        key={`${dayData.day}-${hourData.hour}`}
                        className="cursor-pointer rounded border border-gray-200 p-2 text-center text-xs hover:border-gray-400"
                        style={{
                          backgroundColor: getHeatmapColor(hourData.events),
                        }}
                        title={`${dayData.day} ${hourData.hour}:00 - ${hourData.events} events`}
                      >
                        {hourData.events > 0 ? hourData.events.toFixed(1) : ""}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>
                Color intensity represents number of charging events. Hover for
                details.
              </p>
              <p>Peak activity: {maxHeatmapEvents.toFixed(1)} events</p>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-md mb-4 text-center font-medium">
              Charging Events Trend -{" "}
              {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)}{" "}
              View
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {selectedView === "daily" ? (
                  <LineChart
                    data={currentData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={Math.floor(currentData.length / 10)}
                    />
                    <YAxis
                      label={{
                        value: "Number of Events",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip content={<EventsTooltip />} />
                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="totalEvents"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ fill: "#2563eb", strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5 }}
                    />

                    {/* Category lines */}
                    {Object.entries(powerCategoryColors).map(
                      ([category, color]) => (
                        <Line
                          key={category}
                          type="monotone"
                          dataKey={category}
                          stroke={color}
                          strokeWidth={1}
                          dot={false}
                          opacity={0.7}
                        />
                      )
                    )}
                  </LineChart>
                ) : (
                  <BarChart
                    data={currentData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={
                        selectedView === "monthly" ? "month" : "weekStart"
                      }
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      label={{
                        value: "Number of Events",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip content={<EventsTooltip />} />
                    <Legend />

                    <Bar
                      dataKey="totalEvents"
                      fill="#2563eb"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      {/* Events breakdown table (not for heatmap) */}
      {selectedView !== "heatmap" && (
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="text-md mb-4 font-medium">
            Events Breakdown by Power Category
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-3 py-2 text-left">Power Category</th>
                  <th className="px-3 py-2 text-right">Total Events</th>
                  <th className="px-3 py-2 text-right">Avg per Period</th>
                  <th className="px-3 py-2 text-right">% of Total</th>
                  <th className="px-3 py-2 text-right">Peak Events</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categoryTotals)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, total], index) => {
                    const avgPerPeriod = Math.round(total / currentData.length)
                    const percentage = ((total / totalEvents) * 100).toFixed(1)
                    const peakEvents = Math.max(
                      ...currentData.map(
                        (item: unknown) =>
                          (item as Record<string, number>)[category] || 0
                      )
                    )

                    return (
                      <tr key={index} className="border-b hover:bg-gray-100">
                        <td className="px-3 py-2">
                          <div className="flex items-center">
                            <div
                              className="mr-2 h-3 w-3 rounded"
                              style={{
                                backgroundColor:
                                  powerCategoryColors[
                                    category as keyof typeof powerCategoryColors
                                  ],
                              }}
                            ></div>
                            {category}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right font-medium">
                          {total.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-right">{avgPerPeriod}</td>
                        <td className="px-3 py-2 text-right">{percentage}%</td>
                        <td className="px-3 py-2 text-right">{peakEvents}</td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
