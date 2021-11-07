export class StoreProfile {
  constructor(red, green, blue, brightness, id) {
    this.red = Number(red);
    this.green = Number(green);
    this.blue = Number(blue);
    this.brightness = Number(brightness);
    this.id = id;
  }
}
