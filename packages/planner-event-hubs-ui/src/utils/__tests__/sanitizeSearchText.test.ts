import { removeUnsupportedCharactersForSearch } from '@utils/sanitizeSearchText';

describe('testing string replacement', () => {
  it('Backslash should be removed from input string', () => {
    expect(removeUnsupportedCharactersForSearch('ab\\c')).toBe('abc');
  });
  it('Single quote and double should be removed from input string', () => {
    expect(removeUnsupportedCharactersForSearch('hello\'"world')).toBe('helloworld');
  });
  it('Should return string as it is', () => {
    expect(removeUnsupportedCharactersForSearch('hello world')).toBe('hello world');
  });
});
