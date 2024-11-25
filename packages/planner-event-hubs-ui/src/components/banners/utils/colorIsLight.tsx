const colorIsLight = (color: string): boolean => {
  let r;
  let g;
  let b;
  if (color.substring(0, 4) === 'rgb(') {
    const startTrimmed = color.substring(4);
    const endTrimmed = startTrimmed.substring(0, startTrimmed.length - 1);
    const colorArr = endTrimmed.split(',');
    const rgbValues = colorArr.map(rgbPiece => rgbPiece.replace(/\s/g, ''));
    const [redValue, greenValue, blueValue] = rgbValues;
    r = redValue;
    g = greenValue;
    b = blueValue;
  } else {
    const colorHex = color.charAt(0) === '#' ? color.substring(1, 7) : color;
    r = parseInt(colorHex.substring(0, 2), 16); // hexToR
    g = parseInt(colorHex.substring(2, 4), 16); // hexToG
    b = parseInt(colorHex.substring(4, 6), 16); // hexToB
  }
  const uicolors = [r / 255, g / 255, b / 255];
  const c = uicolors.map(col => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return ((col + 0.055) / 1.055) ** 2.4;
  });
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return L > 0.179;
};

export default colorIsLight;
