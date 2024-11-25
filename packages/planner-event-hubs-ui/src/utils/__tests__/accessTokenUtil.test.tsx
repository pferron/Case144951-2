import { SHA256 } from 'crypto-js';
import { generateProofCode, generateState } from '../accessTokenUtil';

describe('generate proof codes and state for OAuth code exchange', () => {
  it('generates a code verifier and a code challenge', () => {
    const { codeVerifier, codeChallenge } = generateProofCode();
    expect(codeVerifier).toHaveLength(64);
    expect(codeChallenge).toEqual(expect.any(String));
  });

  it('code challenge is base64 encoded', () => {
    const { codeChallenge } = generateProofCode();
    expect(window.btoa(window.atob(codeChallenge)) === codeChallenge).toBeTruthy();
  });

  it('code verifier hashes to code challenge', () => {
    const { codeVerifier, codeChallenge } = generateProofCode();
    const hash = SHA256(codeVerifier).toString();
    expect(Buffer.from(hash).toString('base64')).toBe(codeChallenge);
  });

  it('generates a state', () => {
    const state = generateState();
    expect(state).toHaveLength(16);
  });
});
