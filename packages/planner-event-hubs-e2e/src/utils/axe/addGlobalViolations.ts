import { globalDesktopViolations } from './globalKnownViolations';

/**
 * Prepends global desktop violations onto given local desktop violations, according to what type of event is running.
 * @param {Array} localDesktopViolations expected AXE violations for current page at desktop sizing
 */
function compileAllDesktopViolations(localDesktopViolations): string[] {
  return globalDesktopViolations.concat(localDesktopViolations);
}

/**
 * Returns sorted array of ids of all known AXE violations for current page and screensize.
 * @param {array} desktopViolations known violations for desktop specific to current page
 */
export const addGlobalViolations = (desktopViolations: string[] = []): Array<string> => {
  const knownViolations: Array<string> = compileAllDesktopViolations(desktopViolations);
  const uniqueKnownViolations = knownViolations.filter((value, index, array) => array.indexOf(value) === index);
  return uniqueKnownViolations.sort();
};
