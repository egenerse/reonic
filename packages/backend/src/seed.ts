import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create some sample simulation inputs
  const simulation1 = await prisma.simulationInput.create({
    data: {
      chargePoints: 4,
      arrivalMultiplier: 1.0,
      carConsumptionKwh: 18.0,
      chargingPowerKw: 11.0,
    },
  });

  const simulation2 = await prisma.simulationInput.create({
    data: {
      chargePoints: 8,
      arrivalMultiplier: 1.5,
      carConsumptionKwh: 20.0,
      chargingPowerKw: 22.0,
    },
  });

  const simulation3 = await prisma.simulationInput.create({
    data: {
      chargePoints: 6,
      arrivalMultiplier: 0.8,
      carConsumptionKwh: 16.0,
      chargingPowerKw: 7.5,
    },
  });

  console.log("✅ Created simulation inputs:", {
    simulation1: simulation1.id,
    simulation2: simulation2.id,
    simulation3: simulation3.id,
  });

  // Create some sample simulation outputs
  const output1 = await prisma.simulationOutput.create({
    data: {
      inputId: simulation1.id,
      chargingValues: {
        chargepoint1: 150,
        chargepoint2: 200,
        chargepoint3: 180,
        chargepoint4: 220,
      },
      exemplaryDay: {
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          power: Math.sin((i * Math.PI) / 12) * 50 + 50, // Sine wave pattern
        })),
      },
      totalEnergyChargedKwh: 750.5,
      chargingEventsYear: 8760,
      chargingEventsMonth: 730,
      chargingEventsWeek: 168,
      chargingEventsDay: 24,
    },
  });

  const output2 = await prisma.simulationOutput.create({
    data: {
      inputId: simulation2.id,
      chargingValues: {
        chargepoint1: 300,
        chargepoint2: 280,
        chargepoint3: 320,
        chargepoint4: 290,
        chargepoint5: 310,
        chargepoint6: 270,
        chargepoint7: 330,
        chargepoint8: 295,
      },
      exemplaryDay: {
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          power: Math.cos((i * Math.PI) / 8) * 80 + 100, // Cosine wave pattern
        })),
      },
      totalEnergyChargedKwh: 1450.8,
      chargingEventsYear: 17520,
      chargingEventsMonth: 1460,
      chargingEventsWeek: 336,
      chargingEventsDay: 48,
    },
  });

  console.log("✅ Created simulation outputs:", {
    output1: output1.id,
    output2: output2.id,
  });

  console.log("🌱 Database seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Error during database seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
