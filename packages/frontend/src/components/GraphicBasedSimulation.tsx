import React from "react"
import {
  defaultGraphicSimulationOptions,
  initialParkingData_GRAPHIC_SIMULATION,
} from "../utils/constants"
import { GraphicSimulationForm } from "./GraphicSimulationForm"
import { ParkingLotGrid } from "./ParkingLotGrid"
import { useGraphicSimulation } from "../hooks/useGraphicSimulation"
import { SingleSimulationResult } from "./SingleSimulationResult"

export const GraphicBasedSimulation = () => {
  const {
    simulationOptions,
    setSimulationOptions,
    simulationResult,
    resultSimulationOptions,
    error,
    resultRef,
    parkingData,
    chargerConfigurations,
    isLoading,
    runSimulation,
    updateParkingLotCount,
    setParkingLotPower,
  } = useGraphicSimulation({
    initialOptions: defaultGraphicSimulationOptions,
    initialParkingData: initialParkingData_GRAPHIC_SIMULATION,
  })

  const handleOptionsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    const newValue = Number(value)
    if (isNaN(newValue)) return

    setSimulationOptions((prev) => ({
      ...prev,
      [name]: newValue,
    }))
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-2 p-5 sm:flex-row md:p-8 lg:p-10">
        <ParkingLotGrid
          parkingData={parkingData}
          setParkingLotPower={setParkingLotPower}
        />

        <GraphicSimulationForm
          initialParkingLotCount={initialParkingData_GRAPHIC_SIMULATION.length}
          simulationOptions={simulationOptions}
          chargerConfigurations={chargerConfigurations}
          error={error}
          onOptionsChange={handleOptionsChange}
          handleUpdateParkingLots={updateParkingLotCount}
          onRunSimulation={runSimulation}
          isLoading={isLoading}
        />
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
