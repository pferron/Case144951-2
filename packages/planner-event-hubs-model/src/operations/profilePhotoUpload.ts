import { gql } from '@apollo/client';

export const updateProfilePhotoMutation = gql`
  mutation updateProfilePhotoMutation($centerId: String, $contactId: String, $input: File!, $env: String) {
    updateProfilePhotoResponse(centerId: $centerId, contactId: $contactId, input: $input, env: $env)
      @rest(
        type: "File"
        path: "/api/photo-upload?centerId={args.centerId}&contactId={args.contactId}&env={args.env}"
        method: POST
        bodySerializer: "fileEncode"
      ) {
      noResponse
    }
  }
`;
