import { WelcomeScreen } from "./components/WelcomeScreen"
import { SingleSimulation } from "./components/SingleSimulation"
import { MockedCharts } from "./components/MockedCharts"
import { MultipleSimulation } from "./components/MultipleSimulation"
import { useRef } from "react"

function App() {
  const singleSimulationRef = useRef<HTMLDivElement>(null)

  const goToSingleSimulation = () => {
    singleSimulationRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <WelcomeScreen onGetStarted={goToSingleSimulation} />

      <div ref={singleSimulationRef}>
        <SingleSimulation />
      </div>

      <MultipleSimulation />
      <hr />
      <MockedCharts />
      <hr />
    </div>
  )
}

export default App
