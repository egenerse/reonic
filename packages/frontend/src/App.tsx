import { MultipleSimulation } from "./components/MultipleSimulation";
import { SingleSimulation } from "./components/SingleSimulation";
import {
  DaySummary,
  ChargerPowerDistribution,
  EnergyConsumption,
  ChargingEvents,
} from "./components/charts";

function App() {
  return (
    <div className="min-h-screen  bg-blue-50  ">
      <div className="max-w-7xl mx-auto mt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Charging Station Simulator
        </h1>
      </div>
      <SingleSimulation />
      <hr />
      <div className="flex flex-col items-center my-8 gap-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          Mocked Charts
        </h1>
        <ChargingEvents />
        <hr className="w-full" />
        <ChargerPowerDistribution />
        <hr className="w-full" />

        <DaySummary />
        <hr className="w-full" />

        <EnergyConsumption />
      </div>
      <hr />
      <MultipleSimulation />
    </div>
  );
}

export default App;
