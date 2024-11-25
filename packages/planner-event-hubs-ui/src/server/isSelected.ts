/**
 * Checks if an entity was requested.
 * @param info - info from GraphQL request
 * @param path - path to the entity
 * @returns {boolean} Whether an entity was requested
 */
import { GraphQLResolveInfo } from 'graphql';

// This method loops around the info parameter in a nested manner and checks for path variable
export default function isSelected(info: GraphQLResolveInfo, path: string): boolean {
  return info.fieldNodes.some(element =>
    element.selectionSet.selections.some(selection => {
      if ('name' in selection && selection.name.value === path) {
        return true;
      }
      return false;
    })
  );
}
