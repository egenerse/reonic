import { arrayOfProbabilities } from "../../utils/constants";

export const numberOfCharger = 20;
// Mock charging station configuration - each charger has a specific power capacity
const generateChargingStationConfig = () => {
  return Array.from({ length: numberOfCharger }, (_, i) => {
    const powers = [2.75, 5.5, 11, 18, 25];

    const randomIntBetween0and5 = Math.floor(Math.random() * 5);
    return { id: i + 1, power: powers[randomIntBetween0and5] };
  });
};

export const chargerConfig = generateChargingStationConfig();

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

export const chargingData = generateChargingData();
export const powerCategoryColors = {
  "2.75kW": "#ff6b6b",
  "5.5kW": "#ffa500",
  "11kW": "#4ecdc4",
  "18kW": "#45b7d1",
  "25kW": "#96ceb4",
};

// Mock energy consumption data generator - simulates cumulative energy charged over time
const generateEnergyData = () => {
  const timeFrames = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 90 Days", days: 90 },
    { label: "Last 6 Months", days: 180 },
    { label: "Last Year", days: 365 },
  ];

  return timeFrames.map((timeFrame) => {
    const energyByCharger = chargerConfig.map((charger) => {
      // Simulate realistic charging patterns with seasonal and usage variations
      const baseUsageHoursPerDay = 4 + Math.random() * 6; // 4-10 hours per day average
      const seasonalMultiplier = 0.8 + Math.random() * 0.4; // 0.8-1.2x seasonal variation
      const chargerEfficiency = 0.85 + Math.random() * 0.1; // 85-95% charging efficiency

      // Higher power chargers tend to be used more intensively but for shorter durations
      const powerFactor = charger.power <= 11 ? 1.2 : 0.8; // Lower power = more frequent use

      const totalHours =
        baseUsageHoursPerDay *
        timeFrame.days *
        seasonalMultiplier *
        powerFactor;
      const energyCharged = totalHours * charger.power * chargerEfficiency;

      return {
        chargerId: charger.id,
        power: charger.power,
        powerCategory: `${charger.power}kW`,
        energyCharged: Math.round(energyCharged * 100) / 100, // Round to 2 decimal places
        totalHours: Math.round(totalHours * 100) / 100,
        avgDailyUsage: Math.round((totalHours / timeFrame.days) * 100) / 100,
      };
    });

    // Aggregate by power category
    const energyByCategory = energyByCharger.reduce(
      (acc, charger) => {
        const category = charger.powerCategory;
        if (!acc[category]) {
          acc[category] = {
            totalEnergy: 0,
            chargerCount: 0,
            totalHours: 0,
            chargerIds: [],
          };
        }
        acc[category].totalEnergy += charger.energyCharged;
        acc[category].chargerCount += 1;
        acc[category].totalHours += charger.totalHours;
        acc[category].chargerIds.push(charger.chargerId);
        return acc;
      },
      {} as Record<
        string,
        {
          totalEnergy: number;
          chargerCount: number;
          totalHours: number;
          chargerIds: number[];
        }
      >
    );

    const totalEnergy = Object.values(energyByCategory).reduce(
      (sum, cat) => sum + cat.totalEnergy,
      0
    );

    return {
      timeFrame: timeFrame.label,
      days: timeFrame.days,
      energyByCharger,
      energyByCategory,
      totalEnergy: Math.round(totalEnergy * 100) / 100,
      avgDailyEnergy: Math.round((totalEnergy / timeFrame.days) * 100) / 100,
    };
  });
};

// Generate daily energy data for trend analysis (last 30 days)
const generateDailyEnergyTrend = () => {
  return Array.from({ length: 30 }, (_, dayIndex) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - dayIndex)); // Last 30 days

    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Weekend usage typically lower, but with some variation
    const weekendMultiplier = isWeekend
      ? 0.6 + Math.random() * 0.3
      : 0.9 + Math.random() * 0.2;

    // Seasonal day-to-day variation
    const randomDailyVariation = 0.8 + Math.random() * 0.4;

    const energyByCategory = Object.keys(powerCategoryColors).reduce(
      (acc, powerKey) => {
        const chargersInCategory = chargerConfig.filter(
          (c) => `${c.power}kW` === powerKey
        );
        const categoryEnergy = chargersInCategory.reduce((sum, charger) => {
          const baseDaily =
            charger.power * 5 * weekendMultiplier * randomDailyVariation; // ~5 hours base usage
          return sum + baseDaily;
        }, 0);

        acc[powerKey] = Math.round(categoryEnergy * 100) / 100;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalDailyEnergy = Object.values(energyByCategory).reduce(
      (sum, energy) => sum + energy,
      0
    );

    return {
      date: date.toISOString().split("T")[0], // YYYY-MM-DD format
      dayOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek],
      isWeekend,
      totalEnergy: Math.round(totalDailyEnergy * 100) / 100,
      ...energyByCategory,
    };
  });
};

export const energyConsumptionData = generateEnergyData();
export const dailyEnergyTrend = generateDailyEnergyTrend();
