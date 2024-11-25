export const isProductionEnv = (environment: string | undefined): boolean => {
  return environment === 'pr50' || environment === 'pr53' || environment === 'ct50';
};

export const verifyElementPresent = async (element: WebdriverIO.Element): Promise<void> => {
  expect(element).toBeDisplayed();
};

type Describe = (description: string, specDefinitions: () => void) => void;

export const skipDescribeIfProdEnvironment = (): Describe => {
  return isProductionEnv(process.env.ENV) ? xdescribe : describe;
};

type It = (
  expectation: string,
  assertion?: jasmine.ImplementationCallback | undefined,
  timeout?: number | undefined
) => void;

export const skipItIfProdEnvironment = (): It => {
  return isProductionEnv(process.env.ENV) ? xit : it;
};
