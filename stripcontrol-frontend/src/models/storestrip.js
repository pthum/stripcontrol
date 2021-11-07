export class StoreStrip {
  constructor(name, description, misoPin, sclkPin, numLeds, speedHz, id) {
    this.name = name;
    this.description = description;
    this.misoPin = Number(misoPin);
    this.sclkPin = Number(sclkPin);
    this.numLeds = Number(numLeds);
    this.speedHz = Number(speedHz);
    this.id = id;
  }
}
