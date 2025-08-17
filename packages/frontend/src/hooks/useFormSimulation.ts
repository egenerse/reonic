import { useState, useRef, useCallback } from "react"
import {
  simulationOptionsSchema,
  type SimulationOptions,
  type SimulationResult,
} from "../utils/types"
import { runSimulation } from "../utils/simulation"
import type { ZodError } from "zod"

export const useFormSimulation = (initialOptions: SimulationOptions) => {
  const resultRef = useRef<HTMLDivElement>(null)
  const [simulationOptions, setSimulationOptions] =
    useState<SimulationOptions>(initialOptions)
  const [resultSimulationOptions, setResultSimulationOptions] =
    useState<SimulationOptions>(initialOptions)
  const [error, setError] = useState<ZodError<SimulationOptions>>()
  const [simulationResult, setSimulationResult] = useState<SimulationResult>()
  const [isLoading, setIsLoading] = useState(false)

  const handleRunSimulation = () => {
    setIsLoading(true)
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

  return {
    simulationOptions,
    setSimulationOptions,
    simulationResult,
    resultSimulationOptions,
    error,
    isLoading,
    resultRef,
    runSimulation: handleRunSimulation,
    resetOptions,
    updateSimulationOption,
  }
}
