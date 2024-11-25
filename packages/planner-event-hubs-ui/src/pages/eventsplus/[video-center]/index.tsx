import React from 'react';
import Page from '@components/Page';
import { VIDEO_HUB_NAV_ID, VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { createNavMetadata } from '@utils/navigationHelper';
import { NavMetadata } from '@cvent/planner-navigation/types';
import { pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ApolloCacheProps } from '@cvent/apollo-client';
import { HeroBuild } from '@cvent/carina/components/Illustrations';
import { IllustrationNotice } from '@cvent/carina/components/Templates/IllustrationNotice';
import { useCenterInfo } from '@hooks/useCenterInfo';
import useQueryParams from '../../../hooks/useQueryParam';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ApolloCacheProps>> => pageServerSidePropsInjector(ctx, { checkAuth: true });

function Centers(): JSX.Element {
  const centerInfo = useCenterInfo();
  const hubTitle = centerInfo?.centerTitle;
  const query = useQueryParams();
  const videoHubId = query[VIDEO_HUB_PATH_PARAM] as string;

  const navMetadata: NavMetadata = createNavMetadata(VIDEO_HUB_NAV_ID, [
    { key: VIDEO_HUB_PATH_PARAM, value: videoHubId }
  ]);

  return (
    <Page navMetadata={navMetadata} pageSubTitle={hubTitle}>
      <div style={{ height: '100%' }}>
        <IllustrationNotice testID="video-hub-empty-page-container" illustration={HeroBuild} />
      </div>
    </Page>
  );
}

export default Centers;
