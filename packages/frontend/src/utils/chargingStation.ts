let id = 0;

function getId() {
  id += 1;
  return id;
}

export class ChargingStation {
  public id: number;
  public occupiedNumberOfTicks: number;
  public powerInkW: number;
  public lockedToChargeTotalkWh: number;
  public sessionRemainingChargeInkWh: number;
  public sessionAlreadyChargedInkWh: number;

  public constructor({
    occupiedNumberOfTicks,
    lockedToChargeTotalkWh,
    powerInkW,
    sessionAlreadyChargedInkWh,
    sessionRemainingChargeInkWh,
  }: {
    occupiedNumberOfTicks: number;
    powerInkW: number;
    lockedToChargeTotalkWh: number;
    sessionRemainingChargeInkWh: number;
    sessionAlreadyChargedInkWh: number;
  }) {
    const id = getId();
    this.occupiedNumberOfTicks = occupiedNumberOfTicks;
    this.lockedToChargeTotalkWh = lockedToChargeTotalkWh;
    this.powerInkW = powerInkW;
    this.sessionAlreadyChargedInkWh = sessionAlreadyChargedInkWh;
    this.sessionRemainingChargeInkWh = sessionRemainingChargeInkWh;
    this.id = id;
  }
}
