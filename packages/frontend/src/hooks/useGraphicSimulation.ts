import { useState, useRef, useCallback, useMemo, useEffect } from "react"
import {
  simulationOptionsSchema,
  type SimulationOptions,
  type SimulationResult,
  type ParkingData,
} from "../utils/types"
import { runSimulation } from "../utils/simulation"
import { getChargerConfigurationFromParkingData } from "../utils/charger"
import type { ZodError } from "zod"

interface UseGraphicSimulationProps {
  initialOptions: SimulationOptions
  initialParkingData: ParkingData[]
}

export const useGraphicSimulation = ({
  initialOptions,
  initialParkingData,
}: UseGraphicSimulationProps) => {
  const resultRef = useRef<HTMLDivElement>(null)
  const [simulationOptions, setSimulationOptions] =
    useState<SimulationOptions>(initialOptions)
  const [resultSimulationOptions, setResultSimulationOptions] =
    useState<SimulationOptions>(initialOptions)
  const [error, setError] = useState<ZodError<SimulationOptions>>()
  const [simulationResult, setSimulationResult] = useState<SimulationResult>()
  const [isLoading, setIsLoading] = useState(false)
  const [parkingData, setParkingData] =
    useState<ParkingData[]>(initialParkingData)
  const [selectedChargerPower, setSelectedChargerPower] = useState<
    number | undefined
  >()

  const chargerConfigurations = useMemo(
    () => getChargerConfigurationFromParkingData(parkingData),
    [parkingData]
  )

  useEffect(() => {
    const activeChargerConfigurations = chargerConfigurations.filter(
      (config) => config.quantity > 0
    )
    setSimulationOptions((prev) => ({
      ...prev,
      chargerConfigurations: activeChargerConfigurations,
    }))
  }, [chargerConfigurations])

  const handleRunSimulation = async () => {
    setIsLoading(true)

    // UI update for loading state
    await new Promise((resolve) => setTimeout(resolve, 10))

    const { data, error, success } =
      simulationOptionsSchema.safeParse(simulationOptions)

    setError(error)

    if (success) {
      const result = runSimulation(data)
      setSimulationResult(result)
      setResultSimulationOptions(data)
      resultRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    setIsLoading(false)
  }

  const resetOptions = useCallback(() => {
    setError(undefined)
    setSimulationOptions(initialOptions)
  }, [initialOptions])

  const updateSimulationOption = useCallback((name: string, value: unknown) => {
    setSimulationOptions((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

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

  return {
    resultRef,
    simulationOptions,
    chargerConfigurations,
    selectedChargerPower,
    simulationResult,
    resultSimulationOptions,
    error,
    isLoading,
    parkingData,
    setSimulationOptions,
    runSimulation: handleRunSimulation,
    resetOptions,
    updateSimulationOption,
    setParkingData,
    setSelectedChargerPower,
    updateParkingLotCount,
    setParkingLotPower,
    removeParkingLotPower,
  }
}
