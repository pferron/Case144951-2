export const millisecondsToHHMMSS = (ms: number): string => {
  const seconds = parseInt(String(ms / 1000), 10);
  return `${Math.floor(seconds / 3600)}:${`0${Math.floor(seconds / 60) % 60}`.slice(-2)}:${`0${seconds % 60}`.slice(
    -2
  )}`;
};
