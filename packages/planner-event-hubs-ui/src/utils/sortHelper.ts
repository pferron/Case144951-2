export const sortObject = <T extends Record<string, string>>(
  obj: T[] | ArrayLike<unknown>,
  property: keyof T
): unknown[] => {
  return Array.from(obj).sort((a: T, b: T) =>
    a[property] && b[property] ? a[property].localeCompare(b[property]) : 0
  );
};
