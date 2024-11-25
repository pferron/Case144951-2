import { execute, gql } from '@apollo/client';
import { ApolloLink } from '@apollo/client/link/core';
import { setItem } from '@cvent/nextjs/utils/storage';
import { createAuthLink } from '../AuthApolloLink';

const MockQuery = gql`
  query getHub {
    hub {
      id
      status
    }
  }
`;

async function executeRequest(link) {
  let finalResult;
  return new Promise<void>((resolve, reject) => {
    execute(link, { query: MockQuery }).subscribe(
      result => {
        finalResult = result;
        finalResult.toString();
      },
      error => {
        reject(error);
      },
      () => {
        resolve();
      }
    );
  });
}

describe('testing auth apollo link method', () => {
  it('testing headers returned by auth apollo link', async () => {
    setItem('csrfToken', 'randomCSRFToken');
    const lastLink = new ApolloLink(operation => {
      const { headers } = operation.getContext();
      expect(headers['X-Cvent-CSRF']).toEqual('randomCSRFToken');
      expect(headers.credentials).toEqual('include');

      return null;
    });

    const link = ApolloLink.from([createAuthLink('center-id', 'contact-id'), lastLink]);

    await executeRequest(link);
  });
});
