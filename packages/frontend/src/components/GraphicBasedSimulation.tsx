import { initialParkingData_GRAPHIC_SIMULATION } from "../utils/constants"
import { GraphicSimulationForm } from "./GraphicSimulationForm"
import { ParkingLotGrid } from "./ParkingLotGrid"
import { ParkingLotForm } from "./ParkingLotForm"
import { SingleSimulationResult } from "./SingleSimulationResult"
import { useGraphicFormSimulation } from "../hooks/useGraphicFormSimulation"
import { ErrorMessage } from "./ErrorMessage"

export const GraphicBasedSimulation = () => {
  const {
    resultRef,
    simulationResult,
    resultSimulationOptions,
    parkingData,
    chargerConfigurations,
    isLoading,
    errors,
    register,
    watch,
    onFormSubmit,
    updateParkingLotCount,
    setParkingLotPower,
  } = useGraphicFormSimulation()

  return (
    <div className="min-h-screen">
      <ErrorMessage
        message={errors.chargerConfigurations?.message}
        className="flex justify-center"
      />
      <div className="flex flex-col items-center gap-2 p-5 sm:flex-row md:items-start md:p-8 lg:p-10">
        <ParkingLotGrid
          parkingData={parkingData}
          setParkingLotPower={setParkingLotPower}
        />

        <div className="mx-4 flex w-full flex-col gap-4 md:w-80">
          <ParkingLotForm
            initialParkingLotCount={
              initialParkingData_GRAPHIC_SIMULATION.length
            }
            handleUpdateParkingLots={updateParkingLotCount}
          />
          <GraphicSimulationForm
            chargerConfigurations={chargerConfigurations}
            isLoading={isLoading}
            register={register}
            watch={watch}
            errors={errors}
            onFormSubmit={onFormSubmit}
          />
        </div>
      </div>

      <div ref={resultRef}>
        {simulationResult && resultSimulationOptions && (
          <SingleSimulationResult
            result={simulationResult}
            simulationOptions={resultSimulationOptions}
          />
        )}
      </div>
    </div>
  )
}
