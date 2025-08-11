-- CreateTable
CREATE TABLE "public"."SimulationOutput" (
    "id" SERIAL NOT NULL,
    "inputId" INTEGER NOT NULL,
    "chargingValues" JSONB NOT NULL,
    "exemplaryDay" JSONB NOT NULL,
    "totalEnergyChargedKwh" DOUBLE PRECISION NOT NULL,
    "chargingEventsYear" INTEGER NOT NULL,
    "chargingEventsMonth" INTEGER NOT NULL,
    "chargingEventsWeek" INTEGER NOT NULL,
    "chargingEventsDay" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationOutput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SimulationInput" (
    "id" SERIAL NOT NULL,
    "chargePoints" INTEGER NOT NULL,
    "arrivalMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "carConsumptionKwh" DOUBLE PRECISION NOT NULL DEFAULT 18.0,
    "chargingPowerKw" DOUBLE PRECISION NOT NULL DEFAULT 11.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulationInput_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."SimulationOutput" ADD CONSTRAINT "SimulationOutput_inputId_fkey" FOREIGN KEY ("inputId") REFERENCES "public"."SimulationInput"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
