import { useState } from "react"
import { GraphicBasedSimulation } from "./GraphicBasedSimulation"
import { FormBasedSimulation } from "./FormBasedSimulation"
import { ButtonGroup, type ButtonInGroup } from "./buttons/ButtonGroup"

export const SingleSimulation = () => {
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
    <div id="single-simulation" className="min-h-screen">
      <ButtonGroup
        buttons={buttons}
        selectedId={selectedSimulationId}
        className="py-10"
      />

      <div className={selectedSimulationId === "graphic" ? "block" : "hidden"}>
        <GraphicBasedSimulation />
      </div>
      <div className={selectedSimulationId === "form" ? "block" : "hidden"}>
        <FormBasedSimulation />
      </div>
    </div>
  )
}
