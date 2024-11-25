import React from 'react';
import useQueryParams from '@hooks/useQueryParam';
import { VIDEO_HUB_NAV_ID, VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { PageServerSideProps, pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import Page from '@components/Page';
import { createNavMetadata } from '@utils/navigationHelper';
import MemberDetails from '@components/memberList/MemberDetails';
import { MembersDataProvider } from '@hooks/MembersDataProvider';
import { useCenterInfo } from '@hooks/useCenterInfo';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageServerSideProps>> => pageServerSidePropsInjector(ctx);

function MemberListPage(): JSX.Element {
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
    <MembersDataProvider>
      <Page navMetadata={navMetadata} pageSubTitle={centerTitle} pageTitle={centerTitle}>
        <MemberDetails centerId={centerId} />
      </Page>
    </MembersDataProvider>
  );
}

export default MemberListPage;
