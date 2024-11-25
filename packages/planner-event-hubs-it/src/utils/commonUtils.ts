// Check prod env
export const isProductionEnv = (environment: string | undefined): boolean => {
  return environment === 'pr50' || environment === 'pr53' || environment === 'ct50';
};

export const skipDescribeIfProdEnvironment = (): jest.Describe => {
  return isProductionEnv(process.env.ENV) ? xdescribe : describe;
};

export const skipItIfProdEnvironment = (): jest.It => {
  return isProductionEnv(process.env.ENV) ? xit : it;
};
