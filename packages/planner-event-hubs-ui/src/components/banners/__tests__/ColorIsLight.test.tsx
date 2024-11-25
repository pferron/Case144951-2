import colorIsLight from '../utils/colorIsLight';

describe('Color contrast checking function', () => {
  const sampleLightColors = ['#ffffff', 'rgb(18, 227, 81)', 'bbc4c9'];
  const sampleDarkColors = ['#000000', 'rgb(38, 91, 120)', '805020'];

  it('Identifies light colors', () => {
    const hasError = sampleLightColors.filter(color => {
      return !colorIsLight(color);
    });
    expect(hasError.length).toEqual(0);
  });

  it('Identifies dark colors', () => {
    const hasError = sampleDarkColors.filter(color => {
      return colorIsLight(color);
    });
    expect(hasError.length).toEqual(0);
  });
});
