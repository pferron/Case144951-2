export const formatLocation = (elements: string[]): string => {
  const separator = ' | ';
  return elements
    ?.filter(element => element != null && typeof element !== 'object' && element.trim() !== '')
    .join(separator);
};
