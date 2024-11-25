import Page from '@components/Page';
import { useCenterInfo } from '@hooks/useCenterInfo';
import useQueryParams from '@hooks/useQueryParam';
import { PageServerSideProps, pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import { VIDEO_HUB_NAV_ID, VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { createNavMetadata } from '@utils/navigationHelper';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import VideoHighlights from '@components/videoEngagement/VideoHighlights';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageServerSideProps>> => pageServerSidePropsInjector(ctx, { checkAuth: true });

function VideoHighlightsPage(): JSX.Element {
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
      <VideoHighlights hubId={centerId} hubTitle={centerTitle} />
    </Page>
  );
}

export default VideoHighlightsPage;
