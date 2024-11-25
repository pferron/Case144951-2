import { gql } from '@apollo/client';

export const S3_GENERATE_PRESIGNED_URL = gql`
  query generatePreSignedUrl($input: PreSignedInput!) {
    generatePreSignedUrl(input: $input) {
      uploadUrl
      fileId
      fullFilePath
    }
  }
`;

export const S3_SCAN_STATUS = gql`
  query checkScanStatus($input: ScanStatusInput!) {
    checkScanStatus(input: $input) {
      status
      location
      fileId
      fullFilePath
      failureReason
    }
  }
`;
