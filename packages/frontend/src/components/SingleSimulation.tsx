import { useState } from "react"
import { SingleSimulationGraphic } from "./SingleSimulationGraphic"
import { SingleSimulationFormBased } from "./SingleSimulationFormBased"
import { ButtonGroup, type ButtonInGroup } from "./buttons/ButtonGroup"

export const SingleSimulation = () => {
  const [selectedSimulationId, setSelectedSimulationId] = useState("graphic")

  const buttons: ButtonInGroup[] = [
    {
      id: "form",
      label: "Form-Based Simulation",
      onClick: () => setSelectedSimulationId("form"),
    },
    {
      id: "graphic",
      label: "Graphic Simulation",
      onClick: () => setSelectedSimulationId("graphic"),
    },
  ]

  return (
    <div id="single-simulation" className="min-h-screen">
      <ButtonGroup
        buttons={buttons}
        selectedId={selectedSimulationId}
        className="py-10"
      />

      {/* Render Selected Simulation */}
      {selectedSimulationId === "form" && <SingleSimulationFormBased />}
      {selectedSimulationId === "graphic" && <SingleSimulationGraphic />}
    </div>
  )
}
