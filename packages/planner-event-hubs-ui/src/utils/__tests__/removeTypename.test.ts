import removeTypename from '@utils/removeTypename';

describe('Tests removeTypename utility', () => {
  const input = {
    field1: 'demo',
    field2: false,
    field3: 213,
    __typename: 'Settings'
  };

  const expected = {
    field1: 'demo',
    field2: false,
    field3: 213
  };

  it('Removes __typename', async () => {
    const response = await removeTypename(input);
    expect(response).toEqual(expected);
  });

  it('Empty input', async () => {
    const response = await removeTypename({});
    expect(response).toEqual({});
  });

  it('Null input', async () => {
    const response = await removeTypename(null);
    expect(response).toEqual(null);
  });
});
