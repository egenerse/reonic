import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create some sample simulation results using findFirst + create pattern to avoid duplicates
  
  let simulation1 = await prisma.simulationInput.findFirst({
    where: {
      chargePoints: 4,
      arrivalMultiplier: 1.0,
      carConsumptionKwh: 18.0,
      chargingPowerKw: 11.0,
    },
  });

  if (!simulation1) {
    simulation1 = await prisma.simulationInput.create({
      data: {
        chargePoints: 4,
        arrivalMultiplier: 1.0,
        carConsumptionKwh: 18.0,
        chargingPowerKw: 11.0,
      },
    });
    console.log("Created new simulation1");
  } else {
    console.log("Found existing simulation1");
  }

  let simulation2 = await prisma.simulationInput.findFirst({
    where: {
      chargePoints: 8,
      arrivalMultiplier: 1.5,
      carConsumptionKwh: 20.0,
      chargingPowerKw: 22.0,
    },
  });

  if (!simulation2) {
    simulation2 = await prisma.simulationInput.create({
      data: {
        chargePoints: 8,
        arrivalMultiplier: 1.5,
        carConsumptionKwh: 20.0,
        chargingPowerKw: 22.0,
      },
    });
    console.log("Created new simulation2");
  } else {
    console.log("Found existing simulation2");
  }

  let simulation3 = await prisma.simulationInput.findFirst({
    where: {
      chargePoints: 6,
      arrivalMultiplier: 0.8,
      carConsumptionKwh: 16.0,
      chargingPowerKw: 7.5,
    },
  });

  if (!simulation3) {
    simulation3 = await prisma.simulationInput.create({
      data: {
        chargePoints: 6,
        arrivalMultiplier: 0.8,
        carConsumptionKwh: 16.0,
        chargingPowerKw: 7.5,
      },
    });
    console.log("Created new simulation3");
  } else {
    console.log("Found existing simulation3");
  }

  console.log("✅ Simulation results:", {
    simulation1: simulation1.id,
    simulation2: simulation2.id,
    simulation3: simulation3.id,
  });

  // Create some sample simulation outputs, avoiding duplicates
  let output1 = await prisma.simulationOutput.findFirst({
    where: {
      inputId: simulation1.id,
      totalEnergyChargedKwh: 750.5,
    },
  });

  if (!output1) {
    output1 = await prisma.simulationOutput.create({
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
    console.log("Created new output1");
  } else {
    console.log("Found existing output1");
  }

  let output2 = await prisma.simulationOutput.findFirst({
    where: {
      inputId: simulation2.id,
      totalEnergyChargedKwh: 1450.8,
    },
  });

  if (!output2) {
    output2 = await prisma.simulationOutput.create({
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
    console.log("Created new output2");
  } else {
    console.log("Found existing output2");
  }

  console.log("✅ Simulation outputs:", {
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
