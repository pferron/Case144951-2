// Copied over from attendee-experience-data

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapValues(object, iteratee): any {
  const objectNew = Object(object);
  const result = {};

  Object.keys(objectNew).forEach(key => {
    result[key] = iteratee(objectNew[key], key, objectNew);
  });
  return result;
}

// This removes the __typename attribute from the object. Useful for mutation inputs and state comparisons.
// eslint-disable-next-line
function removeTypename(val: any[] | any): any {
  if (Array.isArray(val)) {
    return val.map(v => removeTypename(v));
  }
  if (val instanceof Object) {
    const { __typename, ...rest } = val;

    return mapValues(rest, valueForKey => {
      return removeTypename(valueForKey);
    });
  }

  return val;
}

export default removeTypename;
