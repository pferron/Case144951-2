import { useQuery } from '@apollo/client';
import { VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { GET_VIDEO_HUB } from '@cvent/planner-event-hubs-model/operations/hub';
import useQueryParams from './useQueryParam';

// RED
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const useCenterInfo = (): any => {
  const query = useQueryParams();
  const videoCenterId = query[VIDEO_HUB_PATH_PARAM] as string;

  const { data: videoCenterData } = useQuery(GET_VIDEO_HUB, {
    variables: { hubID: { id: videoCenterId } }
  });

  const centerTitle = videoCenterData?.hub?.config?.title || '';
  const hubUrl = videoCenterData?.hub?.config?.url || '';
  const theme = videoCenterData?.hub?.theme;
  const config = videoCenterData?.hub?.config;
  const hubStatus = videoCenterData?.hub?.status || '';
  const hubData = videoCenterData?.hub;
  const calendarId = videoCenterData?.hub?.calendar?.id;
  return { centerTitle, hubUrl, hubStatus, theme, hubData, calendarId, config, videoCenterData };
};
