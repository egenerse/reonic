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

export const numberOfCharger = 20;
export const chargingData = generateChargingData();
export const powerCategoryColors = {
  "2.75kW": "#ff6b6b",
  "5.5kW": "#ffa500",
  "11kW": "#4ecdc4",
  "18kW": "#45b7d1",
  "25kW": "#96ceb4",
};
