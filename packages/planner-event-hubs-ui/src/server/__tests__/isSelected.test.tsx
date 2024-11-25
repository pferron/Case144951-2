import { GraphQLResolveInfo } from 'graphql';
import isSelected from '@server/isSelected';

const info: GraphQLResolveInfo = {
  fieldName: null,
  returnType: null,
  parentType: null,
  path: null,
  schema: null,
  fragments: null,
  rootValue: null,
  operation: null,
  variableValues: null,
  cacheControl: null,
  fieldNodes: [
    {
      kind: 'Field',
      name: null,
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: {
              kind: 'Name',
              value: 'termsAccepted'
            }
          }
        ]
      }
    }
  ]
};

describe('isSelected', () => {
  it('returns true for path which is present in the info', () => {
    expect(isSelected(info, 'termsAccepted')).toBeTruthy();
  });
  it('returns false for path which is not present in info', () => {
    expect(isSelected(info, 'memberProfile')).toBeFalsy();
  });
});
