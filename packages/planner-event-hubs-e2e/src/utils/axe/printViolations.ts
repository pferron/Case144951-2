import logger from '@wdio/logger';
import type { AxeResults } from 'axe-core';
import { addGlobalViolations } from './addGlobalViolations';

type WdioAxeResult = {
  getViolationCount: () => number;
  getAllResults: () => AxeResults;
};

/**
 * Logs axe violations (if present)
 */
const printViolations = async (
  axeResult: WdioAxeResult,
  marker = 'axe violations',
  expectedViolationIds: string[] = addGlobalViolations()
): Promise<void> => {
  const allResults = await axeResult.getAllResults();
  const violations = allResults.violations.filter(violation => {
    return !expectedViolationIds.includes(violation.id);
  });
  if (violations.length > 0) {
    const LOG = logger(marker);
    LOG.error(`AXE Violations for URL ${allResults.url}`, violations);
  }
};

export default printViolations;
