import React from 'react';
import Page from '@components/Page';
import {
  VIDEO_HUB_NAV_ID,
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUB_PATH_PARAM,
  BANNERS_PATH_PARAM,
  BANNERS_URL
} from '@utils/constants';
import useQueryParams from '@hooks/useQueryParam';
import { createNavMetadata } from '@utils/navigationHelper';
import { PageServerSideProps, pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import EditBanner from '@components/banners/EditBanner';
import { useCenterInfo } from '@hooks/useCenterInfo';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageServerSideProps>> => pageServerSidePropsInjector(ctx);

function Banner(): JSX.Element {
  const { centerTitle } = useCenterInfo();
  const query = useQueryParams();
  const centerId = query[VIDEO_HUB_PATH_PARAM] as string;
  const bannerId = query[BANNERS_PATH_PARAM] as string;

  const navMetadata = createNavMetadata(VIDEO_HUB_NAV_ID, [{ key: VIDEO_HUB_PATH_PARAM, value: centerId }]);

  return (
    <Page
      navMetadata={navMetadata}
      pageSubTitle={centerTitle}
      overrideSideNavSelection={BANNERS_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)}
      zIndex={2}
      pageTitle={centerTitle}
    >
      <EditBanner videoCenterId={centerId} bannerId={bannerId} videoCenterTitle={centerTitle} />
    </Page>
  );
}

export default Banner;
