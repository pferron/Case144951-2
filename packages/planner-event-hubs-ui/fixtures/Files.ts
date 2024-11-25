/**
 * Returns a blob created from a given mimetype.
 * @returns
 */
const createFileBlob = (mimeType: string): Blob =>
  new Blob(['dummy data'], {
    type: mimeType
  });

/**
 * Crates a File with the givne mime type and filename.
 * @param mimeType
 * @param filename
 * @returns
 */
const createFile = (mimeType: string, filename: string): File => {
  return new File([createFileBlob(mimeType)], filename, { type: mimeType });
};

export { createFile };
