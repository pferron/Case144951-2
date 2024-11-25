import React from 'react';
import Page from '@components/Page';
import {
  CHANNELS_URL,
  VIDEO_HUB_NAV_ID,
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUB_PATH_PARAM,
  CHANNEL_PATH_PARAM,
  TOP_NAVIGATION_Z_INDEX
} from '@utils/constants';
import useQueryParams from '@hooks/useQueryParam';
import ChannelContent from '@components/channels/Channel';
import { createNavMetadata } from '@utils/navigationHelper';
import { PageServerSideProps, pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useCenterInfo } from '@hooks/useCenterInfo';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageServerSideProps>> => pageServerSidePropsInjector(ctx);

function Channel(): JSX.Element {
  const { centerTitle } = useCenterInfo();
  const query = useQueryParams();
  const videoHubId = query[VIDEO_HUB_PATH_PARAM] as string;
  const channelId = query[CHANNEL_PATH_PARAM] as string;

  const navMetadata = createNavMetadata(VIDEO_HUB_NAV_ID, [{ key: VIDEO_HUB_PATH_PARAM, value: videoHubId }]);

  return (
    <Page
      navMetadata={navMetadata}
      pageSubTitle={centerTitle}
      overrideSideNavSelection={CHANNELS_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoHubId)}
      zIndex={TOP_NAVIGATION_Z_INDEX}
      pageTitle={centerTitle}
    >
      <ChannelContent videoHubId={videoHubId} channelId={channelId} hubTitle={centerTitle} />
    </Page>
  );
}

export default Channel;
