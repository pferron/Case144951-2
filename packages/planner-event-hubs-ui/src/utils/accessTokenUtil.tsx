import cryptoJs from 'crypto-js';
import { urlSafeRandomString } from '@utils/random';

interface ProofCode {
  codeChallenge: string;
  codeVerifier: string;
}

/**
 * Generate proof keys for code exchange (PCKE) values, for use during
 * OAuth 2.0 authentication process.
 * - `codeVerifier` - random 64 character string
 * - `codeChallenge` - SHA256 hash of the `codeVerifier`, Base-64 encoded
 *
 * https://auth0.com/docs/flows/authorization-code-flow-with-proof-key-for-code-exchange-pkce
 * @returns {ProofCode} object containing proof keys
 */
export function generateProofCode(): ProofCode {
  const codeVerifier = urlSafeRandomString(64);
  const hash = cryptoJs.SHA256(codeVerifier).toString();
  const codeChallenge = Buffer.from(hash).toString('base64');
  return {
    codeVerifier,
    codeChallenge
  };
}

/**
 * Generate 'state' string for authorize call
 * @returns state random string generated with length - 16
 */
export function generateState(): string {
  return urlSafeRandomString(16);
}
