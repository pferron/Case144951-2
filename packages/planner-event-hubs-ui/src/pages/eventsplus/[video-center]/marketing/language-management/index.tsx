import Page from '@components/Page';
import LanguageManagement from '@components/languageManagement/LanguageManagement';
import { useCenterInfo } from '@hooks/useCenterInfo';
import useQueryParams from '@hooks/useQueryParam';
import { PageServerSideProps, pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import { VIDEO_HUB_NAV_ID, VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { createNavMetadata } from '@utils/navigationHelper';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useEffect, useState } from 'react';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageServerSideProps>> => pageServerSidePropsInjector(ctx, { checkAuth: true });

function LanguageManagementPage(): JSX.Element {
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
      <LanguageManagement centerId={centerId} centerTitle={centerTitle} />
    </Page>
  );
}

export default LanguageManagementPage;
