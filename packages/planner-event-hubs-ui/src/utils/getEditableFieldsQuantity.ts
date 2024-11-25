export enum EditQuantity {
  ALL,
  SOME,
  NONE
}

export const getEditableFieldsQuantity = (fields: Map<boolean, boolean>): EditQuantity => {
  const editableFields = [];
  fields?.forEach((value, key) => {
    if (value) {
      editableFields.push(key);
    }
  });
  if (editableFields.every(field => !field)) return EditQuantity.NONE;
  if (editableFields.some(field => !field)) return EditQuantity.SOME;
  return EditQuantity.ALL;
};
