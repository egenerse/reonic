import React from "react";

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
