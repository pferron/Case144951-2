import React from 'react';
import ProfilePreview from '@components/member-profile/ProfilePreview';
import { NavMetadata } from '@cvent/planner-navigation/types';
import { createNavMetadata } from '@utils/navigationHelper';
import Page from '@components/Page';
import { VIDEO_HUB_NAV_ID, VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { PageServerSideProps, pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import useQueryParams from '@hooks/useQueryParam';
import { useCenterInfo } from '@hooks/useCenterInfo';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageServerSideProps>> => pageServerSidePropsInjector(ctx, { checkAuth: true });

interface Props {
  accountId: string;
}

function MemberProfilePreview({ accountId }: Props): JSX.Element {
  const query = useQueryParams();
  const { centerTitle } = useCenterInfo();
  const videoCenterId = query[VIDEO_HUB_PATH_PARAM] as string;
  const navMetadata: NavMetadata = createNavMetadata(VIDEO_HUB_NAV_ID, [
    { key: VIDEO_HUB_PATH_PARAM, value: videoCenterId }
  ]);
  return (
    <Page
      navMetadata={navMetadata}
      displayHeader={false}
      pageTitle={centerTitle}
      showSideNav={false}
      showFooter={false}
    >
      <ProfilePreview accountId={accountId} />
    </Page>
  );
}

export default MemberProfilePreview;
