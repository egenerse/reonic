import React, { useEffect, useState } from "react";
import { InputField, RangeInput } from "./inputs";
import type {
  ChargerConfiguration,
  ParkingData,
  SimulationOptions,
  SimulationResult,
} from "../utils/types";
import {
  AVAILABLE_CHARGER_POWER_OPTIONS,
  defaultSimulationOptions,
  initialParkingData_GRAPHIC_SIMULATION,
} from "../utils/constants";
import { validateSimulationOptions } from "../utils/formValidation";
import { runSimulation } from "../utils/simulation";
import { SingleResult } from "./SingleResult";
import { ErrorBox } from "./ErrorBox";
import {
  calculateChargerConfigurationsFromParkingData,
  calculateNumberOfChargers,
} from "../utils/charger";

interface ParkingLotProps {
  id: number;
  chargerPowerInKw?: number;
  showEdit: boolean;
  removeParkingLotPower: (id: number) => void;
  setParkingLotPower: (id: number) => void;
}

export const SingleSimulationGraphic = () => {
  const [numberOfParkingLot, setNumberOfParkingLot] = React.useState(
    initialParkingData_GRAPHIC_SIMULATION.length
  );
  const [parkingData, setParkingData] = React.useState<ParkingData[]>(
    initialParkingData_GRAPHIC_SIMULATION
  );

  const [chargerConfigurations, setChargerConfigurations] = useState<
    ChargerConfiguration[]
  >(calculateChargerConfigurationsFromParkingData(parkingData));
  const [simulationOptions, setSimulationOptions] = useState<SimulationOptions>(
    defaultSimulationOptions
  );
  const [resultSimulationOptions, setResultSimulationOptions] =
    useState<SimulationOptions>(defaultSimulationOptions);

  const [errors, setErrors] = useState<string[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult>();

  useEffect(() => {
    const chargingPowers: ChargerConfiguration[] =
      AVAILABLE_CHARGER_POWER_OPTIONS.map((option, index) => ({
        id: index.toString(),
        name: option.label,
        quantity: 0,
        powerInkW: option.value,
      }));
    parkingData.forEach((lot) => {
      const powerOption = chargingPowers.find(
        (option) => option.powerInkW === lot.chargerPowerInKw
      );
      if (powerOption) {
        powerOption.quantity += 1;
      }
    });

    setChargerConfigurations(chargingPowers);
  }, [parkingData]);

  useEffect(() => {
    setSimulationOptions((prevOptions) => ({
      ...prevOptions,
      chargerConfigurations: chargerConfigurations.filter(
        (config) => config.quantity > 0
      ),
    }));
  }, [chargerConfigurations]);

  const [selectedChargerPower, setSelectedChargerPower] = React.useState<
    number | undefined
  >(undefined);

  const handleSelectChargerPower = (power: number) => {
    if (selectedChargerPower === power) setSelectedChargerPower(undefined);
    else setSelectedChargerPower(power);
  };

  const setParkingLotPower = (id: number) => {
    if (!selectedChargerPower) return;
    setParkingData((prevData) =>
      prevData.map((lot) =>
        lot.id === id ? { ...lot, chargerPowerInKw: selectedChargerPower } : lot
      )
    );
  };
  const removeParkingLotPower = (id: number) => {
    setParkingData((prevData) =>
      prevData.map((lot) =>
        lot.id === id ? { ...lot, chargerPowerInKw: undefined } : lot
      )
    );
  };

  const handleUpdateParkingLots = () => {
    const updatedParkingData: ParkingData[] = Array.from(
      { length: numberOfParkingLot },
      (_, i) => ({
        id: i,
        chargerPowerInKw: parkingData[i]?.chargerPowerInKw,
      })
    );
    setParkingData(updatedParkingData);
  };

  const onRunSimulation = () => {
    console.log("Running simulation with options:", simulationOptions);
    const errors = validateSimulationOptions(simulationOptions);
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    console.log("Running simulation with options:", simulationOptions);
    setErrors([]);
    setSimulationResult(runSimulation(simulationOptions));
    setResultSimulationOptions(simulationOptions);

    setTimeout(() => {
      document
        ?.getElementById("simulation-result")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };
  const handleOptionsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSimulationOptions({
      ...simulationOptions,
      [name]: Number(value),
    });
  };
  const totalChargers = calculateNumberOfChargers(chargerConfigurations);

  const theoreticalMaxPowerDemand = chargerConfigurations.reduce(
    (previous, current) => previous + current.powerInkW * current.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="flex flex-col p-5 md:p-8 lg:p-10 gap-4">
        <div className="flex items-center flex-col gap-2">
          <div>Please select a Charging Power to place in Parking lot</div>
          <div className="flex  justify-center gap-2 flex-wrap">
            {AVAILABLE_CHARGER_POWER_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`bg-gray-500 text-white p-2 rounded min-w-20 ${
                  selectedChargerPower === option.value ? "bg-gray-800" : ""
                }`}
                onClick={() => handleSelectChargerPower(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          {selectedChargerPower && (
            <button
              onClick={() => setSelectedChargerPower(undefined)}
              className="bg-red-500 text-white p-2 rounded min-w-20"
            >
              Remove Charge Selection
            </button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-5 flex flex-wrap gap-4">
            {parkingData.map((lot) => (
              <ParkingLot
                key={lot.id}
                {...lot}
                removeParkingLotPower={removeParkingLotPower}
                setParkingLotPower={setParkingLotPower}
                showEdit={!!selectedChargerPower}
              />
            ))}
            {parkingData.length === 0 && (
              <div className="text-gray-500 flex-1 flex justify-center items-center">
                No Parking Lots Available
              </div>
            )}
          </div>

          <div className="flex-1  bg-amber-200 h-full p-4 flex flex-col gap-4 rounded-xl">
            <div className="text-semibold text-2xl">Simulation Options</div>

            <ErrorBox errors={errors} />
            <InputField
              name="numberOfParkingLot"
              id="numberOfParkingLot"
              label="Number of Parking Lots"
              value={numberOfParkingLot}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                if (newValue >= 0 && newValue <= 300) {
                  setNumberOfParkingLot(newValue);
                }
              }}
            />
            <div className="text-sm text-gray-400 -mt-3">
              Maximum Parkinglot: 300
            </div>
            <button
              onClick={handleUpdateParkingLots}
              className={`bg-blue-300 text-white p-2 rounded min-w-20`}
            >
              Update Max Parking Lots
            </button>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold">Parking Lots:</label>
              {totalChargers > 0 && (
                <div className="font-bold">
                  {totalChargers} total chargers available
                </div>
              )}
              <div>
                {chargerConfigurations
                  .filter((chargerConfig) => chargerConfig.quantity > 0)
                  .map((config) => (
                    <div key={config.id}>
                      {config.name} x {config.quantity} ={" "}
                      {config.powerInkW * config.quantity} kW
                    </div>
                  ))}
              </div>
              {theoreticalMaxPowerDemand > 0 ? (
                <div>
                  Theoretical Max Power Demand:{" "}
                  <span className="font-bold">
                    {theoreticalMaxPowerDemand} kW
                  </span>
                </div>
              ) : (
                <div className="text-gray-500">No chargers available</div>
              )}
            </div>

            <InputField
              type="number"
              max={365}
              min={1}
              id="numberOfSimulationDays"
              label="Number of Simulation Days"
              name="numberOfSimulationDays"
              onChange={handleOptionsChange}
              value={simulationOptions.numberOfSimulationDays}
            />
            <InputField
              id="carNeedskWhPer100kms"
              label="Car Needs (kWh/100km)"
              name="carNeedskWhPer100kms"
              onChange={handleOptionsChange}
              value={simulationOptions.carNeedskWhPer100kms}
            />

            <div className="md:col-span-2">
              <RangeInput
                id="carArrivalProbabilityMultiplier"
                label="Car Arrival Probability Multiplier"
                name="carArrivalProbabilityMultiplier"
                min={20}
                max={220}
                step={10}
                value={simulationOptions.carArrivalProbabilityMultiplier}
                onChange={handleOptionsChange}
                percentage
              />
            </div>

            <button
              onClick={onRunSimulation}
              className={`bg-blue-300 text-white p-2 rounded  w-full`}
            >
              Run
            </button>
          </div>
        </div>
        {simulationResult && (
          <div className="pt-30" id="simulation-result">
            <SingleResult
              result={simulationResult}
              simulationOptions={resultSimulationOptions}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ParkingLot: React.FC<ParkingLotProps> = ({
  id,
  chargerPowerInKw,
  showEdit,
  setParkingLotPower,
  removeParkingLotPower,
}) => {
  return (
    <div
      className={`h-40 w-28 bg-gray-400/60 flex flex-col items-center border rounded-lg p-4 gap-1 relative  ${
        !showEdit ? "justify-center" : " "
      }`}
    >
      <div
        className={`flex flex-col items-center gap-2 ${
          showEdit ? "opacity-50" : ""
        }`}
      >
        {chargerPowerInKw && (
          <>
            <p>Power</p>
            <p>{chargerPowerInKw} kW</p>
          </>
        )}
      </div>

      {showEdit && (
        <div
          onClick={() => setParkingLotPower(id)}
          className="cursor-pointer flex flex-col gap-2 items-center justify-center absolute top-0 right-0 left-0 bottom-0 h-full w-full text-white"
        >
          <div className="bg-green-600 rounded-full w-8 h-8 flex justify-center items-center opacity-100 shadow-md text-lg font-bold">
            +
          </div>
          {chargerPowerInKw && (
            <div
              className="bg-red-800 rounded-full w-8 h-8 flex justify-center items-center opacity-100 shadow-md text-lg font-bold"
              onClick={(e) => {
                e.stopPropagation();
                removeParkingLotPower(id);
              }}
            >
              -
            </div>
          )}
        </div>
      )}
      {chargerPowerInKw && !showEdit && (
        <div
          className="bg-red-400 rounded-full w-8 h-8 flex justify-center items-center opacity-100 shadow-md text-lg font-bold"
          onClick={(e) => {
            e.stopPropagation();
            removeParkingLotPower(id);
          }}
        >
          -
        </div>
      )}
    </div>
  );
};
