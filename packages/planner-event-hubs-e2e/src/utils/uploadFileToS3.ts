import path from 'path';
import fs from 'fs';
import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { MULTI_PART_FORM_DATA, TEMPORARY_FILE_LOCATION } from './constants';
import { getConfigs } from '../../configs/testConfig';

const configs = getConfigs();

export const uploadFileToS3 = async (entityId): Promise<AxiosResponse> => {
  const lessThan5Mb = path.join(__dirname, '..', 'resources', 'images', 'channelImage.jpeg');
  const formData = new FormData();
  await formData.append('file', fs.readFileSync(lessThan5Mb), {
    filename: 'channelImage.jpeg'
  });
  const s3FilePath = `${TEMPORARY_FILE_LOCATION}/${entityId}/media/image`;
  const queryParam = {
    filePath: s3FilePath
  };
  return axios.post(configs?.s3ProxyUrl, formData, {
    headers: {
      'Content-Type': MULTI_PART_FORM_DATA,
      Authorization: `API_KEY ${configs.apiKeyValue}`
    },
    params: queryParam
  });
};
