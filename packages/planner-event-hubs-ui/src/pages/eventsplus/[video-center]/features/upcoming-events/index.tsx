import React from 'react';
import useQueryParams from '@hooks/useQueryParam';
import Page from '@components/Page';
import { VIDEO_HUB_NAV_ID, VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { createNavMetadata } from '@utils/navigationHelper';
import { PageServerSideProps, pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import UpcomingEventsSettings from '@components/upcoming-events/UpcomingEventsSettings';
import { useQuery } from '@apollo/client';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { GET_VIDEO_HUB } from '@cvent/planner-event-hubs-model/operations/hub';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageServerSideProps>> => pageServerSidePropsInjector(ctx);

function UpcomingEventsPage(): JSX.Element {
  const { centerTitle } = useCenterInfo();
  const query = useQueryParams();
  const videoCenterId = query[VIDEO_HUB_PATH_PARAM] as string;
  const navMetadata = createNavMetadata(VIDEO_HUB_NAV_ID, [
    {
      key: VIDEO_HUB_PATH_PARAM,
      value: videoCenterId
    }
  ]);

  const { data: videoCenterData } = useQuery(GET_VIDEO_HUB, {
    variables: { hubID: { id: videoCenterId } }
  });
  return (
    <Page navMetadata={navMetadata} pageSubTitle={centerTitle} pageTitle={centerTitle}>
      <UpcomingEventsSettings
        videoCenterId={videoCenterId}
        videoCenterTitle={centerTitle}
        calendarId={videoCenterData?.hub?.calendar?.id}
      />
    </Page>
  );
}

export default UpcomingEventsPage;
