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
    <div className="min-h-screen">
      <WelcomeScreen onGetStarted={goToSingleSimulation} />
      <SingleSimulation containerRef={singleSimulationRef} />
      <MultipleSimulation />
      <MockedCharts />
    </div>
  )
}

export default App
