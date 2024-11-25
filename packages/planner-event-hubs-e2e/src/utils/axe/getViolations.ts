import printViolations from './printViolations';

/**
 * Returns array of ids of AXE violations for current page.
 * @param {string} marker (optional) name for logger
 * @param {array} knownViolations (optional) these violations will not be logged as they are expected for this test run
 */
export const getAxeViolationIds = async (marker: string | null = null, knownViolations: string[] | null = null) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const axeResult = await (browser as any).runAxe();
  // @ts-expect-error TS(2345) FIXME: Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
  await printViolations(axeResult, marker, knownViolations);
  return Promise.all((await axeResult.getAllResults()).violations.map(async violation => violation.id));
};
