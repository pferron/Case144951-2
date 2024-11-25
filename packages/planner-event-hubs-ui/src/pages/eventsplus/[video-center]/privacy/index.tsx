import React from 'react';
import useQueryParams from '@hooks/useQueryParam';
import Page from '@components/Page';
import { VIDEO_HUB_NAV_ID, VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { createNavMetadata } from '@utils/navigationHelper';
import { PageServerSideProps, pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import PrivacySettings from '@components/privacy/PrivacySettings';
import { useCenterInfo } from '@hooks/useCenterInfo';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageServerSideProps>> => pageServerSidePropsInjector(ctx);

function Privacy(): JSX.Element {
  const { centerTitle } = useCenterInfo();
  const query = useQueryParams();
  const videoHubId = query[VIDEO_HUB_PATH_PARAM] as string;

  const navMetadata = createNavMetadata(VIDEO_HUB_NAV_ID, [
    {
      key: VIDEO_HUB_PATH_PARAM,
      value: videoHubId
    }
  ]);

  return (
    <Page navMetadata={navMetadata} pageSubTitle={centerTitle} pageTitle={centerTitle}>
      <PrivacySettings videoHubId={videoHubId} videoHubTitle={centerTitle} />
    </Page>
  );
}

export default Privacy;
