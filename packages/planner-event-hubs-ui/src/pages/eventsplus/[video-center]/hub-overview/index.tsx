import React, { useEffect, useState } from 'react';
import Page from '@components/Page';
import useQueryParams from '@hooks/useQueryParam';
import { VIDEO_HUB_NAV_ID, VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { createNavMetadata } from '@utils/navigationHelper';
import { PageServerSideProps, pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useCenterInfo } from '@hooks/useCenterInfo';
import HubOverview from '@components/hubOverview/HubOverview';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import NewHubOverview from '@components/hubOverview/NewHubOverview';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageServerSideProps>> => pageServerSidePropsInjector(ctx, { checkAuth: true });

function OverView(): JSX.Element {
  const centerInfo = useCenterInfo();
  const hubTitle = centerInfo?.centerTitle;
  const query = useQueryParams();
  const hubId = query[VIDEO_HUB_PATH_PARAM] as string;
  const { hubStatus } = centerInfo;
  const { renovateHubOverviewFeature } = useAppFeatures();

  const [centerTitle, setCenterTitle] = useState(hubTitle);

  useEffect(() => {
    setCenterTitle(hubTitle);
  }, [hubTitle]);

  const navMetadata = createNavMetadata(VIDEO_HUB_NAV_ID, [
    {
      key: VIDEO_HUB_PATH_PARAM,
      value: hubId
    }
  ]);

  return (
    <Page navMetadata={navMetadata} pageSubTitle={centerTitle} pageTitle={centerTitle}>
      {renovateHubOverviewFeature ? (
        <NewHubOverview hubId={hubId} hubTitle={centerTitle} hubStatus={hubStatus} />
      ) : (
        <HubOverview hubId={hubId} hubTitle={centerTitle} hubStatus={hubStatus} />
      )}
    </Page>
  );
}

export default OverView;
