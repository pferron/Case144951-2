import Crypto from 'crypto';

/**
 * Generate a url-safe random string with a given length
 * @param size the length of the string to generate
 * @returns {string} random string
 */
export function urlSafeRandomString(size = 16): string {
  if (size < 1) {
    throw new Error('Invalid random string size');
  }
  return Crypto.randomBytes(size).toString('hex').slice(0, size);
}
