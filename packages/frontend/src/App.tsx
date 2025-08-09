import { MockedCharts } from "./components/MockedCharts";
import { MultipleSimulation } from "./components/MultipleSimulation";
import { SingleSimulation } from "./components/SingleSimulation";

function App() {
  return (
    <div className="min-h-screen  bg-blue-50  ">
      <div className="max-w-7xl mx-auto mt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Charging Station Simulator
        </h1>
      </div>
      <SingleSimulation />
      <MultipleSimulation />
      <hr />
      <MockedCharts />
      <hr />
    </div>
  );
}

export default App;
