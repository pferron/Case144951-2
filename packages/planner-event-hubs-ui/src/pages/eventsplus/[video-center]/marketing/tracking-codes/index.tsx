import React from 'react';
import useQueryParams from '@hooks/useQueryParam';
import Page from '@components/Page';
import { VIDEO_HUB_NAV_ID, VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { createNavMetadata } from '@utils/navigationHelper';
import { PageServerSideProps, pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { TrackingCodes } from '@components/tracking-codes/TrackingCodes';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageServerSideProps>> => pageServerSidePropsInjector(ctx, { checkAuth: true });

function TrackingCodesPage(): JSX.Element {
  const { centerTitle } = useCenterInfo();
  const query = useQueryParams();
  const centerId = query[VIDEO_HUB_PATH_PARAM] as string;

  const navMetadata = createNavMetadata(VIDEO_HUB_NAV_ID, [
    {
      key: VIDEO_HUB_PATH_PARAM,
      value: centerId
    }
  ]);

  return (
    <Page navMetadata={navMetadata} pageSubTitle={centerTitle} pageTitle={centerTitle}>
      <TrackingCodes videoCenterId={centerId} videoCenterTitle={centerTitle} />
    </Page>
  );
}

export default TrackingCodesPage;
