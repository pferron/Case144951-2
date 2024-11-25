// RED
/* eslint-disable */
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { NextApiRequest, NextApiResponse } from 'next';
import FormData from 'form-data';
import multer from 'multer';
import { v4 } from 'uuid';
import { fetchDataWithOptions, getRequestBuilder, getLogIds, extractFileExtension } from '@utils/apiUtils';
import { authMiddleware } from '@utils/authMiddleware';
import {
  ACCEPTED_FAVICON_FILE_FORMAT,
  ACCEPTED_FILE_FORMAT,
  FAVICON,
  IMAGE_MAXIMUM_SIZE_IN_MB,
  IMAGE_SIZE_UPPER_LIMIT
} from '@utils/constants';
import { isAcceptedFileFormat } from '@utils/commonComponentsUtils';

const LOG = LoggerFactory.create('UPLOAD-IMAGE');

const ACCOUNT_STUB_TEMPORARY_FILES = '00000000000000000000000000000000';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

// limit file upload size to 5.1MB
// Image size is limited to 5MB as per requirements
const upload = multer({ limits: { fileSize: IMAGE_SIZE_UPPER_LIMIT }, maxCount: 1 });

function initFileUploadMiddleware(middleware) {
  return (req: NextApiRequest, res: NextApiResponse): Promise<Response> =>
    new Promise((resolve, reject) => {
      middleware(req, res, result => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

// for parsing multipart/form-data
const multerAny = initFileUploadMiddleware(upload.any());

type NextApiRequestWithFormData = NextApiRequest & {
  files: any[];
};

const isValidFileFormat = (fileName: string, entityType: String): boolean => {
  if (entityType === FAVICON && !isAcceptedFileFormat(fileName, ACCEPTED_FAVICON_FILE_FORMAT)) {
    return false;
  }

  if (entityType !== FAVICON && !isAcceptedFileFormat(fileName, ACCEPTED_FILE_FORMAT)) {
    return false;
  }

  return true;
};

const handler = async (req: NextApiRequestWithFormData, res: NextApiResponse): Promise<void> => {
  if (req.method === 'POST') {
    // call the multer middleware
    try {
      await multerAny(req, res);
    } catch (_error) {
      return res.status(400).json({ error: `File size should not exceed ${IMAGE_MAXIMUM_SIZE_IN_MB}MB` });
    }

    const { entityId, entityType, environment } = req.query;
    const logIds = getLogIds(req.headers);
    // expects a single file upload
    if (!req.files?.length || req.files.length > 1) {
      res.status(400).json({ error: 'Endpoint expects a single file upload' });
      return;
    }

    if (!entityId) {
      res.status(400).json({ error: 'entityId query param is required' });
      return;
    }
    const uploadedFile = req.files[0];

    if (!isValidFileFormat(uploadedFile?.originalname, entityType + '')) {
      res.status(400).json({ error: 'Unsupported file type.' });
      return;
    }
    // create formData to be used in the POST call
    const randomFileName = v4();
    const fileExtension = extractFileExtension(uploadedFile.originalname);
    const formData = new FormData();
    formData.append('file', uploadedFile.buffer, {
      filename: `${randomFileName}.${fileExtension}`,
      contentType: uploadedFile.mimetype,
      knownLength: uploadedFile.size
    });

    // get url for the POST call
    const url = `${process.env.S3_PROXY_SERVICE_BASE_URL}/v1/upload/${ACCOUNT_STUB_TEMPORARY_FILES}`;

    const headers = {
      authorization: `API_KEY ${process.env.API_KEY}`
    };

    const queryMap = {
      filePath: `${ACCOUNT_STUB_TEMPORARY_FILES}/${entityId}/media/image`
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const request = getRequestBuilder(url, headers, environment, logIds, LOG, queryMap).post().body(formData).build();

    return fetchDataWithOptions(request)
      .then(response => {
        return res.status(201).json(response);
      })
      .catch(error => {
        LOG.error('Error while doing a post call to s3-proxy-service', url, error);
        return res.status(500).json({ message: 'Internal server error while uploading images' });
      });
  }
  res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
};

export default authMiddleware(handler);
