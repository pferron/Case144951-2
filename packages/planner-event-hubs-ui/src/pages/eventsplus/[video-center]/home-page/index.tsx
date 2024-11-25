import React, { useEffect, useState } from 'react';
import Page from '@components/Page';
import useQueryParams from '@hooks/useQueryParam';
import { VIDEO_HUB_NAV_ID, VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { createNavMetadata } from '@utils/navigationHelper';
import { PageServerSideProps, pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useCenterInfo } from '@hooks/useCenterInfo';
import HomepageCustomization from '@components/homepage-customization/HomepageCustomization';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageServerSideProps>> => pageServerSidePropsInjector(ctx, { checkAuth: true });

function Homepage(): JSX.Element {
  const centerInfo = useCenterInfo();
  const hubTitle = centerInfo?.centerTitle;
  const query = useQueryParams();
  const centerId = query[VIDEO_HUB_PATH_PARAM] as string;

  const [centerTitle, setCenterTitle] = useState(hubTitle);

  useEffect(() => {
    setCenterTitle(hubTitle);
  }, [hubTitle]);

  const navMetadata = createNavMetadata(VIDEO_HUB_NAV_ID, [
    {
      key: VIDEO_HUB_PATH_PARAM,
      value: centerId
    }
  ]);

  return (
    <Page navMetadata={navMetadata} pageSubTitle={centerTitle} pageTitle={centerTitle}>
      <HomepageCustomization centerId={centerId} centerTitle={centerTitle} />
    </Page>
  );
}

export default Homepage;