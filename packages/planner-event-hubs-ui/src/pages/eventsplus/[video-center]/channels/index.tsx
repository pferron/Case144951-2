import React from 'react';
import Page from '@components/Page';
import useQueryParams from '@hooks/useQueryParam';
import ChannelListing from '@components/channels/ChannelListing';
import { VIDEO_HUB_NAV_ID, VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { createNavMetadata } from '@utils/navigationHelper';
import { PageServerSideProps, pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useCenterInfo } from '@hooks/useCenterInfo';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageServerSideProps>> => pageServerSidePropsInjector(ctx);

function Channels(): JSX.Element {
  const { centerTitle } = useCenterInfo();
  const query = useQueryParams();
  const videoHubId = query[VIDEO_HUB_PATH_PARAM] as string;

  const navMetadata = createNavMetadata(VIDEO_HUB_NAV_ID, [{ key: VIDEO_HUB_PATH_PARAM, value: videoHubId }]);

  return (
    <Page navMetadata={navMetadata} pageSubTitle={centerTitle} pageTitle={centerTitle}>
      <ChannelListing videoHubId={videoHubId} hubTitle={centerTitle} />
    </Page>
  );
}

export default Channels;
