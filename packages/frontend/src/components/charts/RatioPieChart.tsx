import { Cell, Pie, PieChart, Tooltip } from "recharts"

interface CustomTooltipProps {
  active?: boolean
  payload?: PieTooltipPayload[]
  label?: string
}

interface PieTooltipPayload {
  name: string
  value: number
}

type Coordinate = {
  x: number
  y: number
}

type PieSectorData = {
  percent?: number
  name?: string | number
  midAngle?: number
  middleRadius?: number
  tooltipPosition?: Coordinate
  value?: number
  paddingAngle?: number
  dataKey?: string
  payload?: unknown
  tooltipPayload?: ReadonlyArray<PieTooltipPayload>
}

type GeometrySector = {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
}

type PieLabelProps = PieSectorData &
  GeometrySector & {
    tooltipPayload?: unknown
  }

const RADIAN = Math.PI / 180
const COLORS = ["#00C49F", "#FFBB28"]

interface Props {
  percentage: number
}

export const RatioPieChart: React.FC<Props> = ({ percentage }) => {
  console.log("Rendering RatioPieChart with percentage:", percentage)
  const dataSet = [
    { name: "Max chargers used", value: percentage },
    { name: "Not used", value: 100 - percentage },
  ]

  const CustomBarTooltip = (props: CustomTooltipProps) => {
    const { active, payload } = props

    if (active && payload && payload.length) {
      const data = payload[0]

      if (data) {
        return (
          <div className="max-w-xs rounded border border-gray-300 bg-white p-3 shadow-lg">
            <div>
              <p className="text-sm font-medium text-gray-800">{data.name}</p>
              <p className="text-lg font-bold text-blue-600">
                {data.value.toFixed(2)}%
              </p>
            </div>
          </div>
        )
      }
    }
    return null
  }

  return (
    <PieChart width={160} height={160}>
      <Pie
        data={dataSet}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={80}
      >
        {dataSet.map((entry, index) => (
          <Cell
            key={`cell-${entry.name}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
      <Tooltip content={<CustomBarTooltip />} />
    </PieChart>
  )
}
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  let x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN)
  let y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN)

  if (percent === undefined) {
    return
  }
  if (percent === 0) {
    return null
  }

  if (percent === 1) {
    x = cx
    y = cy
  }

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  )
}
