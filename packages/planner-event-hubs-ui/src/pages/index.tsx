import React from 'react';
import Page from '@components/Page';
import VideoCenterListing from '@components/videoCenters/VideoCenterListing';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ApolloCacheProps } from '@cvent/apollo-client';
import { pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import { createNavMetadata } from '@utils/navigationHelper';
import { DefaultLanguageProvider } from '@hooks/DefaultLanguageProvider';
import { useTranslate } from 'nucleus-text';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ApolloCacheProps>> => pageServerSidePropsInjector(ctx);

function VideoHubs(): JSX.Element {
  const { translate } = useTranslate();
  return (
    <DefaultLanguageProvider>
      <Page
        navMetadata={createNavMetadata(null, null, translate('video_hub_top_nav'))}
        pageTitle={translate('video_hub_top_nav')}
      >
        <VideoCenterListing />
      </Page>
    </DefaultLanguageProvider>
  );
}

export default VideoHubs;
