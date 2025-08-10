// import { MockedCharts } from "./components/MockedCharts";
// import { MultipleSimulation } from "./components/MultipleSimulation";
import { SingleSimulation } from "./components/SingleSimulation";
import { WelcomeScreen } from "./components/WelcomeScreen";

function App() {
  return (
    <div className="min-h-screen  bg-blue-50  ">
      <WelcomeScreen />

      <SingleSimulation />
      {/* 
      <MultipleSimulation />
      <hr />
      <MockedCharts />
      <hr /> */}
    </div>
  );
}

export default App;
