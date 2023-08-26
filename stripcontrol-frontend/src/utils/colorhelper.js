export default {
  hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (_m, r, g, b) {
      return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },
  rgbToHex(colorProfile) {
    if (typeof colorProfile.red === "undefined") {
      colorProfile.red = 0;
    }
    if (typeof colorProfile.green === "undefined") {
      colorProfile.green = 0;
    }
    if (typeof colorProfile.blue === "undefined") {
      colorProfile.blue = 0;
    }
    let rgb =
      colorProfile.blue | (colorProfile.green << 8) | (colorProfile.red << 16);
    return "#" + (0x1000000 + rgb).toString(16).slice(1);
  },
};
