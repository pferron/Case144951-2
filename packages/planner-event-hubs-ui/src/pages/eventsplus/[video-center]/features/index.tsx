import { VIDEO_HUB_NAV_ID, VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { NavMetadata } from '@cvent/planner-navigation/types';
import { createNavMetadata } from '@utils/navigationHelper';
import Page from '@components/Page';
import React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { PageServerSideProps, pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import { Features } from '@components/features/Features';
import useQueryParams from '@hooks/useQueryParam';
import { useCenterInfo } from '@hooks/useCenterInfo';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageServerSideProps>> => pageServerSidePropsInjector(ctx);

function FeaturesPage(): JSX.Element {
  const { centerTitle } = useCenterInfo();
  const query = useQueryParams();
  const videoHubId = query[VIDEO_HUB_PATH_PARAM] as string;
  const navMetadata: NavMetadata = createNavMetadata(VIDEO_HUB_NAV_ID, [
    { key: VIDEO_HUB_PATH_PARAM, value: videoHubId }
  ]);

  return (
    <Page navMetadata={navMetadata} pageSubTitle={centerTitle} pageTitle={centerTitle}>
      <Features videoCenterId={videoHubId} videoCenterTitle={centerTitle} />
    </Page>
  );
}

export default FeaturesPage;
