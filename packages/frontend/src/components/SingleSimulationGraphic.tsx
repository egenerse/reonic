import React, { useEffect, useRef, useState } from "react"
import {
  simulationOptionsSchema,
  type ChargerConfiguration,
  type ParkingData,
  type SimulationOptions,
  type SimulationResult,
} from "../utils/types"
import {
  defaultGraphicSimulationOptions,
  initialParkingData_GRAPHIC_SIMULATION,
  AVAILABLE_CHARGER_POWER_OPTIONS,
} from "../utils/constants"
import { runSimulation } from "../utils/simulation"
import { SingleResult } from "./SingleResult"
import { calculateChargerConfigurationsFromParkingData } from "../utils/charger"
import { GraphicSimulationForm } from "./GraphicSimulationForm"
import { ChargerPowerSelector } from "./ChargerPowerSelector"
import { ParkingLotGrid } from "./ParkingLotGrid"
import type { ZodError } from "zod"

export const SingleSimulationGraphic = () => {
  const simulationResultWrapperRef = useRef<HTMLDivElement>(null)
  const [parkingData, setParkingData] = React.useState<ParkingData[]>(
    initialParkingData_GRAPHIC_SIMULATION
  )
  const [chargerConfigurations, setChargerConfigurations] = useState<
    ChargerConfiguration[]
  >(calculateChargerConfigurationsFromParkingData(parkingData))

  const [simulationOptions, setSimulationOptions] = useState<SimulationOptions>(
    defaultGraphicSimulationOptions
  )
  const [resultSimulationOptions, setResultSimulationOptions] =
    useState<SimulationOptions>(defaultGraphicSimulationOptions)

  const [error, setError] = useState<ZodError<SimulationOptions>>()
  const [simulationResult, setSimulationResult] = useState<SimulationResult>()
  const [selectedChargerPower, setSelectedChargerPower] = React.useState<
    number | undefined
  >(undefined)

  useEffect(() => {
    const chargingPowers: ChargerConfiguration[] =
      AVAILABLE_CHARGER_POWER_OPTIONS.map((option, index) => ({
        id: index.toString(),
        name: option.label,
        quantity: 0,
        powerInkW: option.value,
      }))
    parkingData.forEach((lot) => {
      const powerOption = chargingPowers.find(
        (option) => option.powerInkW === lot.chargerPowerInKw
      )
      if (powerOption) {
        powerOption.quantity += 1
      }
    })

    setChargerConfigurations(chargingPowers)
  }, [parkingData])

  useEffect(() => {
    setSimulationOptions((prevOptions) => ({
      ...prevOptions,
      chargerConfigurations: chargerConfigurations.filter(
        (config) => config.quantity > 0
      ),
    }))
  }, [chargerConfigurations])

  const setParkingLotPower = (id: number) => {
    if (!selectedChargerPower) return
    setParkingData((prevData) =>
      prevData.map((lot) =>
        lot.id === id ? { ...lot, chargerPowerInKw: selectedChargerPower } : lot
      )
    )
  }

  const removeParkingLotPower = (id: number) => {
    setParkingData((prevData) =>
      prevData.map((lot) =>
        lot.id === id ? { ...lot, chargerPowerInKw: undefined } : lot
      )
    )
  }

  const handleUpdateParkingLots = (value: number) => {
    const updatedParkingData: ParkingData[] = Array.from(
      { length: value },
      (_, i) => ({
        id: i,
        chargerPowerInKw: parkingData[i]?.chargerPowerInKw,
      })
    )
    setParkingData(updatedParkingData)
  }

  const onRunSimulation = () => {
    const { data, error, success } =
      simulationOptionsSchema.safeParse(simulationOptions)
    console.log("DEBUG simulationOptions:", data)

    setError(error)
    if (success) {
      setSimulationResult(runSimulation(data))
      setResultSimulationOptions(data)
      simulationResultWrapperRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleOptionsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    const newValue = Number(value)
    if (isNaN(newValue)) return

    setSimulationOptions({
      ...simulationOptions,
      [name]: newValue,
    })
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="flex flex-col gap-4 p-5 md:p-8 lg:p-10">
        <ChargerPowerSelector
          selectedChargerPower={selectedChargerPower}
          onSelectChargerPower={setSelectedChargerPower}
          error={error}
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <ParkingLotGrid
            parkingData={parkingData}
            removeParkingLotPower={removeParkingLotPower}
            setParkingLotPower={setParkingLotPower}
            showEdit={!!selectedChargerPower}
          />

          <GraphicSimulationForm
            initialParkingLotCount={
              initialParkingData_GRAPHIC_SIMULATION.length
            }
            simulationOptions={simulationOptions}
            chargerConfigurations={chargerConfigurations}
            error={error}
            onOptionsChange={handleOptionsChange}
            handleUpdateParkingLots={handleUpdateParkingLots}
            onRunSimulation={onRunSimulation}
          />
        </div>

        <div ref={simulationResultWrapperRef}>
          {simulationResult && (
            <SingleResult
              result={simulationResult}
              simulationOptions={resultSimulationOptions}
            />
          )}
        </div>
      </div>
    </div>
  )
}
