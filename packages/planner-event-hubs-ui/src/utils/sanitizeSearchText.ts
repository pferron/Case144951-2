export const removeUnsupportedCharactersForSearch = (value: string): string => {
  return value.replaceAll(/[\\'"]/g, '');
};
