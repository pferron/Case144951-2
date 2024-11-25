const measurementIdRegex = /^[A-Za-z0-9]*$/;

export const isValidMeasurementId = (measurementId: string): boolean => {
  if (measurementId != null) {
    return measurementIdRegex.test(measurementId);
  }
  return false;
};
