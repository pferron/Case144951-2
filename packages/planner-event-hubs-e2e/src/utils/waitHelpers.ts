/**
 * This can be used where we want to check for some elements exist/displayed after a user action like button click.
 * @param element
 * @param timeout
 * @param timeoutMsg
 * @param reverse
 * @param interval
 * @param isComponent
 */
export const waitForDisplayed = async ({
  element,
  timeout = 30000,
  timeoutMsg = undefined,
  reverse = false,
  interval = 1000,
  isComponent = false
}): Promise<void> => {
  const component = isComponent ? element : await element;
  await component.waitForDisplayed({
    timeout,
    reverse,
    timeoutMsg:
      timeoutMsg ??
      `Timeout while waiting for element to be ${reverse ? 'not' : ''} displayed :: ${component?.selector}`,
    interval
  });
};

/**
 * This can be used when we want to check weather a button is exists and is clickable.
 * @param element
 * @param timeout
 * @param timeoutMsg
 * @param reverse
 * @param interval
 * @param isComponent
 */
export const waitForClickable = async ({
  element,
  timeout = 30000,
  timeoutMsg = undefined,
  reverse = false,
  interval = 1000,
  isComponent = false
}): Promise<void> => {
  const component = isComponent ? element : await element;
  await component.waitForClickable({
    timeout,
    reverse,
    timeoutMsg:
      timeoutMsg ??
      `Timeout while waiting for element to be ${reverse ? 'non' : ''} clickable :: ${component?.selector}`,
    interval
  });
};

/**
 * This can be used when we want to click a button after checking button exist and ready to be clicked
 * @param element
 * @param timeout
 * @param timeoutMsg
 * @param reverse
 * @param interval
 * @param isComponent
 */
export const waitForClickableAndClick = async ({
  element,
  timeout = 30000,
  timeoutMsg = undefined,
  reverse = false,
  interval = 1000,
  isComponent = false
}): Promise<void> => {
  const component = isComponent ? element : await element;
  await waitForClickable({ element: component, timeout, timeoutMsg, reverse, interval, isComponent: true });
  await component.click();
};
