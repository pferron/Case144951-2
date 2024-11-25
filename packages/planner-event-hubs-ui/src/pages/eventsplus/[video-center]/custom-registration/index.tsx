import React, { useEffect, useState } from 'react';
import Page from '@components/Page';
import useQueryParams from '@hooks/useQueryParam';
import { VIDEO_HUB_NAV_ID, VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { createNavMetadata } from '@utils/navigationHelper';
import { PageServerSideProps, pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useCenterInfo } from '@hooks/useCenterInfo';
import FormEditorCard from '@components/customRegistration/FormEditorCard';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageServerSideProps>> => pageServerSidePropsInjector(ctx, { checkAuth: true });

function CustomRegistrationPage(): JSX.Element {
  const centerInfo = useCenterInfo();
  const hubTitle = centerInfo?.centerTitle;
  const query = useQueryParams();
  const hubId = query[VIDEO_HUB_PATH_PARAM] as string;

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
      <FormEditorCard hubId={hubId} hubTitle={centerTitle} />
    </Page>
  );
}

export default CustomRegistrationPage;
