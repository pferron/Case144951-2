import { createFilterQuery, spliceIntoChunks } from '@resolvers/common/utils/filterCreationUtil';

describe('Test filterCreationUtil', () => {
  it('createFilterQuery test with single ids', () => {
    expect(createFilterQuery('id', ['testId'])).toBe("id eq 'testId'");
  });

  it('createFilterQuery test with multiple ids', () => {
    expect(createFilterQuery('id', ['testId1', 'testId2'])).toBe("id eq 'testId1' or id eq 'testId2'");
  });

  it('should splice array in chunks of given number', () => {
    const fruits: string[] = ['Apple', 'Orange', 'Banana'];
    const fruitChunks = spliceIntoChunks(fruits, 1);
    expect(fruitChunks.length).toBe(3);
  });
});
