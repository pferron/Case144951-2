/**
 * Asynchronous friendly version of find. Ref: https://stackoverflow.com/a/55601090/2167090
 *
 * @param arr Array to find element
 * @param asyncCallback Function to execute on each value in the array
 * @returns Promise to first matching element in the array; otherwise, undefined
 */
export default async function findAsync<Type>(
  arr: Type[],
  asyncCallback: (elem: Type) => Promise<boolean>
): Promise<Type> {
  const promises = arr.map(asyncCallback);
  const results = await Promise.all(promises);
  const index = results.findIndex(result => result);
  return arr[index];
}
