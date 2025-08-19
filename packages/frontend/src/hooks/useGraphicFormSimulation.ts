import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  type SimulationOptions,
  type SimulationResult,
  type ParkingData,
  simulationOptionsSchema,
} from "../utils/types"
import { runSimulation } from "../utils/simulation"
import { getChargerConfigurationFromParkingData } from "../utils/charger"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  defaultGraphicSimulationOptions,
  initialParkingData_GRAPHIC_SIMULATION,
} from "../utils/constants"

export const useGraphicFormSimulation = () => {
  const resultRef = useRef<HTMLDivElement>(null)
  const [simulationResult, setSimulationResult] = useState<SimulationResult>()
  const [resultSimulationOptions, setResultSimulationOptions] =
    useState<SimulationOptions>()
  const [parkingData, setParkingData] = useState<ParkingData[]>(
    initialParkingData_GRAPHIC_SIMULATION
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(simulationOptionsSchema),
    defaultValues: defaultGraphicSimulationOptions,
  })

  useEffect(() => {
    const chargerConfigurations =
      getChargerConfigurationFromParkingData(parkingData)

    setValue("chargerConfigurations", chargerConfigurations, {
      shouldValidate: true,
    })
  }, [parkingData, setError, setValue])

  const updateParkingLotCount = (count: number) => {
    const updatedParkingData: ParkingData[] = Array.from(
      { length: count },
      (_, i) => ({
        id: i,
        chargerPowerInKw: parkingData[i]?.chargerPowerInKw,
      })
    )
    setParkingData(updatedParkingData)
  }

  const setParkingLotPower = (id: number, powerInkW?: number) => {
    setParkingData((prevData) =>
      prevData.map((lot) =>
        lot.id === id ? { ...lot, chargerPowerInKw: powerInkW } : lot
      )
    )
  }

  const onFormSubmit = handleSubmit(async (data) => {
    const result = runSimulation(data)
    setResultSimulationOptions(data)
    setSimulationResult(result)
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" })
    }
  })

  const chargerConfigurations = watch("chargerConfigurations")

  return {
    resultRef,
    simulationResult,
    resultSimulationOptions,
    parkingData,
    chargerConfigurations,
    isLoading: isSubmitting,
    register,
    watch,
    errors,
    onFormSubmit,
    updateParkingLotCount,
    setParkingLotPower,
  }
}
