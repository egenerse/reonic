import { WelcomeScreen } from "./components/WelcomeScreen";
import { SingleSimulation } from "./components/SingleSimulation";
import { MockedCharts } from "./components/MockedCharts";
import { MultipleSimulation } from "./components/MultipleSimulation";

function App() {
  return (
    <div className="min-h-screen  bg-blue-50  ">
      <WelcomeScreen />
      <SingleSimulation />
      <MultipleSimulation />
      <hr />
      <MockedCharts />
      <hr />
    </div>
  );
}

export default App;
