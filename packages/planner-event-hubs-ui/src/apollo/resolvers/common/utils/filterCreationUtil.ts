export const spliceIntoChunks = (arr: Array<string>, chunkSize: number): Array<Array<string>> => {
  const res = [];
  while (arr.length > 0) {
    const chunk = arr.splice(0, chunkSize);
    res.push(chunk);
  }
  return res;
};

export const createFilterQuery = (fieldName: string, ids: Array<string>): string => {
  const fieldNameQuery = `' or ${fieldName} eq '`;
  const idsWithFieldNameQuery = `${ids.join(fieldNameQuery)}`;
  return `${fieldName} eq '${idsWithFieldNameQuery}'`;
};
