import React from "react";
import ParkingIcon from "./icons/ParkingIcon";
import ChargerIcon from "./icons/ChargerIcon";

interface Props {
  id: number;
  chargerPowerInKw?: number;
  showEdit: boolean;
  removeParkingLotPower: (id: number) => void;
  setParkingLotPower: (id: number) => void;
}

export const ParkingLot: React.FC<Props> = ({
  id,
  chargerPowerInKw,
  showEdit,
  setParkingLotPower,
  removeParkingLotPower,
}) => {
  return (
    <div
      className={`h-40 w-28 bg-gray-100 flex flex-col items-center border-2 rounded-lg p-4 gap-1 relative ${
        !showEdit ? "justify-center" : " "
      }
      ${chargerPowerInKw ? "border-green-600" : ""}
      `}
    >
      {/* Parking SVG Background */}
      {chargerPowerInKw ? (
        <ChargerIcon className="absolute inset-0 w-full h-full opacity-40 z-0 text-green-900" />
      ) : (
        <ParkingIcon className="absolute inset-0 w-full h-full opacity-40 z-0" />
      )}

      <div
        className={`flex flex-col items-center gap-2 relative z-10 ${
          showEdit ? "opacity-50" : ""
        }`}
      >
        {chargerPowerInKw && (
          <div className="font-extrabold text-green-700 bg-white/70 rounded-lg px-1 ">
            {chargerPowerInKw} kW
          </div>
        )}
      </div>

      {showEdit && (
        <div
          onClick={() => setParkingLotPower(id)}
          className="cursor-pointer flex flex-col gap-2 items-center justify-center absolute top-0 right-0 left-0 bottom-0 h-full w-full text-white z-20"
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
          className="bg-red-400 rounded-full w-8 h-8 flex justify-center items-center opacity-100 shadow-md text-lg font-bold z-20 relative"
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
