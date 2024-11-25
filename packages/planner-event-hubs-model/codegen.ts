import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: [
    'src/schema/!(index).{ts,js,graphql}',
    '../../node_modules/@cvent/apollo-server/dist/esm/graphql/schema/validations.js'
  ],
  documents: ['src/operations/!(index).{ts,js,graphql}', '!src/operations/profilePhotoUpload.ts'],
  generates: {
    'src/types/index.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        useTypeImports: true,
        declarationKind: {
          interface: 'interface'
        }
      }
    },
    'src/operations/index.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node']
    }
  }
};

export default config;
