import { arrayOfProbabilities } from "../../utils/constants"
import seedrandom from "seedrandom"

const seededRandom = seedrandom("charging-data")

export const numberOfCharger = 20
// Mock charging station configuration - each charger has a specific power capacity
const generateChargingStationConfig = () => {
  return Array.from({ length: numberOfCharger }, (_, i) => {
    const powers = [2.75, 5.5, 11, 18, 25]

    const randomIntBetween0and5 = Math.floor(seededRandom() * 5)
    return { id: i + 1, power: powers[randomIntBetween0and5] }
  })
}

export const chargerConfig = generateChargingStationConfig()

// Mock charging data generator - simulates realistic charging patterns with 15-min intervals
const generateChargingData = (): Record<string, number | string>[] => {
  const intervalsPer24Hours = 24 * 4

  return Array.from({ length: intervalsPer24Hours }, (_, interval) => {
    // Convert interval to time
    const totalMinutes = interval * 15
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const timeLabel = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`

    const dataPoint: Record<string, number | string> = {
      time: timeLabel,
      interval,
      hour: hours,
      minute: minutes,
    }

    const adjustedMultiplier = 2 * arrayOfProbabilities[hours]

    // Initialize power category totals
    const powerCategories = {
      "2.75kW": 0,
      "5.5kW": 0,
      "11kW": 0,
      "18kW": 0,
      "25kW": 0,
    }

    // Track active chargers for statistics
    let activeChargers = 0

    // Generate power values for each charging point and group by power category
    chargerConfig.forEach((charger) => {
      const isActive = seededRandom() * 100 < adjustedMultiplier

      if (isActive) {
        const powerKey = `${charger.power}kW` as keyof typeof powerCategories
        powerCategories[powerKey] += charger.power
        activeChargers++
      }
    })

    // Add power category totals to dataPoint (this is what the chart uses)
    Object.entries(powerCategories).forEach(([category, total]) => {
      dataPoint[category] = total
    })

    // Add summary data for statistics
    dataPoint.totalPower = Object.values(powerCategories).reduce(
      (sum, power) => sum + power,
      0
    )
    dataPoint.activeChargers = activeChargers

    return dataPoint
  })
}

export const chargingData = generateChargingData()
export const powerCategoryColors = {
  "2.75kW": "#ff6b6b",
  "5.5kW": "#ffa500",
  "11kW": "#4ecdc4",
  "18kW": "#45b7d1",
  "25kW": "#96ceb4",
}

// Mock energy consumption data generator - simulates cumulative energy charged over time
const generateEnergyData = () => {
  const timeFrames = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 90 Days", days: 90 },
    { label: "Last 6 Months", days: 180 },
    { label: "Last Year", days: 365 },
  ]

  return timeFrames.map((timeFrame) => {
    const energyByCharger = chargerConfig.map((charger) => {
      // Simulate realistic charging patterns with seasonal and usage variations
      const baseUsageHoursPerDay = 4 + seededRandom() * 6 // 4-10 hours per day average
      const seasonalMultiplier = 0.8 + seededRandom() * 0.4 // 0.8-1.2x seasonal variation
      const chargerEfficiency = 0.85 + seededRandom() * 0.1 // 85-95% charging efficiency

      // Higher power chargers tend to be used more intensively but for shorter durations
      const powerFactor = charger.power <= 11 ? 1.2 : 0.8 // Lower power = more frequent use

      const totalHours =
        baseUsageHoursPerDay * timeFrame.days * seasonalMultiplier * powerFactor
      const energyCharged = totalHours * charger.power * chargerEfficiency

      return {
        chargerId: charger.id,
        power: charger.power,
        powerCategory: `${charger.power}kW`,
        energyCharged: Math.round(energyCharged * 100) / 100, // Round to 2 decimal places
        totalHours: Math.round(totalHours * 100) / 100,
        avgDailyUsage: Math.round((totalHours / timeFrame.days) * 100) / 100,
      }
    })

    // Aggregate by power category
    const energyByCategory = energyByCharger.reduce(
      (acc, charger) => {
        const category = charger.powerCategory
        if (!acc[category]) {
          acc[category] = {
            totalEnergy: 0,
            chargerCount: 0,
            totalHours: 0,
            chargerIds: [],
          }
        }
        acc[category].totalEnergy += charger.energyCharged
        acc[category].chargerCount += 1
        acc[category].totalHours += charger.totalHours
        acc[category].chargerIds.push(charger.chargerId)
        return acc
      },
      {} as Record<
        string,
        {
          totalEnergy: number
          chargerCount: number
          totalHours: number
          chargerIds: number[]
        }
      >
    )

    const totalEnergy = Object.values(energyByCategory).reduce(
      (sum, cat) => sum + cat.totalEnergy,
      0
    )

    return {
      timeFrame: timeFrame.label,
      days: timeFrame.days,
      energyByCharger,
      energyByCategory,
      totalEnergy: Math.round(totalEnergy * 100) / 100,
      avgDailyEnergy: Math.round((totalEnergy / timeFrame.days) * 100) / 100,
    }
  })
}

// Generate daily energy data for trend analysis (last 30 days)
const generateDailyEnergyTrend = () => {
  return Array.from({ length: 30 }, (_, dayIndex) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - dayIndex)) // Last 30 days

    const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // Weekend usage typically lower, but with some variation
    const weekendMultiplier = isWeekend
      ? 0.6 + seededRandom() * 0.3
      : 0.9 + seededRandom() * 0.2

    // Seasonal day-to-day variation
    const randomDailyVariation = 0.8 + seededRandom() * 0.4

    const energyByCategory = Object.keys(powerCategoryColors).reduce(
      (acc, powerKey) => {
        const chargersInCategory = chargerConfig.filter(
          (c) => `${c.power}kW` === powerKey
        )
        const categoryEnergy = chargersInCategory.reduce((sum, charger) => {
          const baseDaily =
            charger.power * 5 * weekendMultiplier * randomDailyVariation // ~5 hours base usage
          return sum + baseDaily
        }, 0)

        acc[powerKey] = Math.round(categoryEnergy * 100) / 100
        return acc
      },
      {} as Record<string, number>
    )

    const totalDailyEnergy = Object.values(energyByCategory).reduce(
      (sum, energy) => sum + energy,
      0
    )

    return {
      date: date.toISOString().split("T")[0], // YYYY-MM-DD format
      dayOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek],
      isWeekend,
      totalEnergy: Math.round(totalDailyEnergy * 100) / 100,
      ...energyByCategory,
    }
  })
}

export const energyConsumptionData = generateEnergyData()
export const dailyEnergyTrend = generateDailyEnergyTrend()

// Mock charging events data generator - simulates realistic charging session patterns
const generateChargingEvents = () => {
  // Generate hourly charging events for the last 30 days
  const hoursData = Array.from({ length: 30 * 24 }, (_, hourIndex) => {
    const date = new Date()
    date.setHours(date.getHours() - (30 * 24 - hourIndex))

    const hour = date.getHours()
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // Peak hours: 7-9 AM and 5-8 PM on weekdays, more spread out on weekends
    let baseMultiplier = 0.3 // Base activity level
    if (!isWeekend) {
      if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20)) {
        baseMultiplier = 1.0 // Peak hours
      } else if ((hour >= 10 && hour <= 16) || (hour >= 21 && hour <= 23)) {
        baseMultiplier = 0.6 // Moderate hours
      }
    } else {
      if (hour >= 10 && hour <= 18) {
        baseMultiplier = 0.7 // Weekend activity
      }
    }

    // Add some randomness
    const randomVariation = 0.7 + seededRandom() * 0.6
    const finalMultiplier = baseMultiplier * randomVariation

    // Generate events for each charger category
    const eventsByCategory = Object.keys(powerCategoryColors).reduce(
      (acc, powerKey) => {
        const chargersInCategory = chargerConfig.filter(
          (c) => `${c.power}kW` === powerKey
        )
        const power = parseFloat(powerKey.replace("kW", ""))

        // Higher power chargers tend to have fewer but longer sessions
        const sessionFrequency = power <= 11 ? 1.2 : 0.8
        const categoryEvents = Math.round(
          chargersInCategory.length *
            finalMultiplier *
            sessionFrequency *
            (0.5 + seededRandom() * 0.5)
        )

        acc[powerKey] = Math.max(0, categoryEvents)
        return acc
      },
      {} as Record<string, number>
    )

    const totalEvents = Object.values(eventsByCategory).reduce(
      (sum, events) => sum + events,
      0
    )

    return {
      timestamp: date.toISOString(),
      date: date.toISOString().split("T")[0],
      hour,
      dayOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek],
      isWeekend,
      totalEvents,
      ...eventsByCategory,
    }
  })

  // Aggregate by different time periods
  interface DailyEventData {
    date: string
    dayOfWeek: string
    isWeekend: boolean
    totalEvents: number
    [key: string]: string | boolean | number
  }

  const dailyData: Record<string, DailyEventData> = {}

  hoursData.forEach((hourData) => {
    const date = hourData.date
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        dayOfWeek: hourData.dayOfWeek,
        isWeekend: hourData.isWeekend,
        totalEvents: 0,
      }
      Object.keys(powerCategoryColors).forEach((key) => {
        dailyData[date][key] = 0
      })
    }

    dailyData[date].totalEvents += hourData.totalEvents
    Object.keys(powerCategoryColors).forEach((key) => {
      const currentValue = (dailyData[date][key] as number) || 0
      const hourValue =
        (hourData as unknown as Record<string, number>)[key] || 0
      dailyData[date][key] = currentValue + hourValue
    })
  })

  interface WeeklyEventData {
    weekStart: string
    totalEvents: number
    [key: string]: string | number
  }

  const weeklyData: Record<string, WeeklyEventData> = {}

  Object.values(dailyData).forEach((dayData) => {
    const date = new Date(dayData.date as string)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay()) // Start of week (Sunday)
    const weekKey = weekStart.toISOString().split("T")[0]

    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = {
        weekStart: weekKey,
        totalEvents: 0,
      }
      Object.keys(powerCategoryColors).forEach((key) => {
        weeklyData[weekKey][key] = 0
      })
    }

    weeklyData[weekKey].totalEvents += dayData.totalEvents as number
    Object.keys(powerCategoryColors).forEach((key) => {
      const currentValue = (weeklyData[weekKey][key] as number) || 0
      const dayValue = (dayData[key] as number) || 0
      weeklyData[weekKey][key] = currentValue + dayValue
    })
  })

  // Generate monthly aggregation for the last 12 months
  const monthlyData = Array.from({ length: 12 }, (_, monthIndex) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - monthIndex))
    date.setDate(1) // First day of month

    const monthName = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    })
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate()

    // Estimate monthly events based on daily averages with seasonal variation
    const seasonalMultiplier = 0.8 + seededRandom() * 0.4 // Seasonal variation
    const baseEventsPerDay = 15 // Average events per day per charger type

    const eventsByCategory = Object.keys(powerCategoryColors).reduce(
      (acc, powerKey) => {
        const chargersInCategory = chargerConfig.filter(
          (c) => `${c.power}kW` === powerKey
        )
        const power = parseFloat(powerKey.replace("kW", ""))
        const sessionFrequency = power <= 11 ? 1.2 : 0.8

        const monthlyEvents = Math.round(
          chargersInCategory.length *
            baseEventsPerDay *
            daysInMonth *
            seasonalMultiplier *
            sessionFrequency
        )

        acc[powerKey] = monthlyEvents
        return acc
      },
      {} as Record<string, number>
    )

    const totalEvents = Object.values(eventsByCategory).reduce(
      (sum, events) => sum + events,
      0
    )

    return {
      month: monthName,
      year: date.getFullYear(),
      monthIndex: date.getMonth(),
      daysInMonth,
      totalEvents,
      avgEventsPerDay: Math.round(totalEvents / daysInMonth),
      ...eventsByCategory,
    }
  })

  // Generate heatmap data (hour vs day of week)
  const heatmapData = Array.from({ length: 7 }, (_, dayIndex) => {
    const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex]
    const isWeekend = dayIndex === 0 || dayIndex === 6

    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      // Calculate average events for this hour-day combination
      const relevantHours = hoursData.filter(
        (h) => h.dayOfWeek === dayName && h.hour === hour
      )

      const avgEvents =
        relevantHours.length > 0
          ? relevantHours.reduce((sum, h) => sum + h.totalEvents, 0) /
            relevantHours.length
          : 0

      return {
        day: dayName,
        hour,
        events: Math.round(avgEvents * 10) / 10, // Round to 1 decimal
        isWeekend,
      }
    })

    return {
      day: dayName,
      isWeekend,
      hours: hourlyData,
    }
  })

  return {
    hourly: hoursData,
    daily: Object.values(dailyData).sort((a, b) =>
      (a.date as string).localeCompare(b.date as string)
    ),
    weekly: Object.values(weeklyData).sort((a, b) =>
      a.weekStart.localeCompare(b.weekStart)
    ),
    monthly: monthlyData,
    heatmap: heatmapData,
  }
}

export const chargingEventsData = generateChargingEvents()
