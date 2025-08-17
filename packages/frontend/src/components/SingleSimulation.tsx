import React, { useState } from "react"
import { GraphicBasedSimulation } from "./GraphicBasedSimulation"
import { FormBasedSimulation } from "./FormBasedSimulation"
import { ButtonGroup, type ButtonInGroup } from "./buttons/ButtonGroup"

interface Props {
  containerRef: React.RefObject<HTMLDivElement | null>
}

export const SingleSimulation: React.FC<Props> = ({ containerRef }) => {
  const [selectedSimulationId, setSelectedSimulationId] = useState("graphic")

  const buttons: ButtonInGroup[] = [
    {
      id: "graphic",
      label: "Graphic Simulation",
      onClick: () => setSelectedSimulationId("graphic"),
    },
    {
      id: "form",
      label: "Form-Based Simulation",
      onClick: () => setSelectedSimulationId("form"),
    },
  ]

  return (
    <div
      id="single-simulation"
      className="flex min-h-screen flex-col"
      ref={containerRef}
    >
      <ButtonGroup buttons={buttons} selectedId={selectedSimulationId} />

      <div className={selectedSimulationId === "graphic" ? "block" : "hidden"}>
        <GraphicBasedSimulation />
      </div>
      <div className={selectedSimulationId === "form" ? "block" : "hidden"}>
        <FormBasedSimulation />
      </div>
    </div>
  )
}
