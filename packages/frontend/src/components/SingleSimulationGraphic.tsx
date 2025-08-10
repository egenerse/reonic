import React, { useEffect, useState } from "react";
import type {
  ChargerConfiguration,
  ParkingData,
  SimulationOptions,
  SimulationResult,
} from "../utils/types";
import {
  defaultSimulationOptions,
  initialParkingData_GRAPHIC_SIMULATION,
  AVAILABLE_CHARGER_POWER_OPTIONS,
} from "../utils/constants";
import { validateSimulationOptions } from "../utils/formValidation";
import { runSimulation } from "../utils/simulation";
import { SingleResult } from "./SingleResult";
import { calculateChargerConfigurationsFromParkingData } from "../utils/charger";
import { GraphicSimulationForm } from "./GraphicSimulationForm";
import { ChargerPowerSelector } from "./ChargerPowerSelector";
import { ParkingLotGrid } from "./ParkingLotGrid";

export const SingleSimulationGraphic = () => {
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
  const [selectedChargerPower, setSelectedChargerPower] = React.useState<
    number | undefined
  >(undefined);

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

  const handleUpdateParkingLots = (value: number) => {
    const updatedParkingData: ParkingData[] = Array.from(
      { length: value },
      (_, i) => ({
        id: i,
        chargerPowerInKw: parkingData[i]?.chargerPowerInKw,
      })
    );
    setParkingData(updatedParkingData);
  };

  const onRunSimulation = () => {
    const errors = validateSimulationOptions(simulationOptions);
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    setErrors([]);
    setSimulationResult(runSimulation(simulationOptions));
    setResultSimulationOptions(simulationOptions);

    document
      ?.getElementById("simulation-result")
      ?.scrollIntoView({ behavior: "smooth" });
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

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="flex flex-col p-5 md:p-8 lg:p-10 gap-4">
        <ChargerPowerSelector
          selectedChargerPower={selectedChargerPower}
          onSelectChargerPower={handleSelectChargerPower}
          onClearSelection={() => setSelectedChargerPower(undefined)}
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <ParkingLotGrid
            parkingData={parkingData}
            removeParkingLotPower={removeParkingLotPower}
            setParkingLotPower={setParkingLotPower}
            showEdit={!!selectedChargerPower}
          />

          <GraphicSimulationForm
            initialParkingLotCount={
              initialParkingData_GRAPHIC_SIMULATION.length
            }
            simulationOptions={simulationOptions}
            chargerConfigurations={chargerConfigurations}
            errors={errors}
            onOptionsChange={handleOptionsChange}
            handleUpdateParkingLots={handleUpdateParkingLots}
            onRunSimulation={onRunSimulation}
          />
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
