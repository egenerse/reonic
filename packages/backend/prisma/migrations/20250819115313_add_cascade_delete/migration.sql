-- DropForeignKey
ALTER TABLE "public"."SimulationOutput" DROP CONSTRAINT "SimulationOutput_inputId_fkey";

-- AddForeignKey
ALTER TABLE "public"."SimulationOutput" ADD CONSTRAINT "SimulationOutput_inputId_fkey" FOREIGN KEY ("inputId") REFERENCES "public"."SimulationInput"("id") ON DELETE CASCADE ON UPDATE CASCADE;
