import Page from '@components/Page';
import React from 'react';
import useQueryParams from '@hooks/useQueryParam';
import { PageServerSideProps, pageServerSidePropsInjector } from '@server/pageServerSidePropsInjector';
import AdditionalCalendarItemMedia from '@components/media/AdditionalCalendarItemMedia';
import { ADDITIONAL_CALENDAR_ID } from '@utils/constants';
import { createNavMetadata } from '@utils/navigationHelper';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useTranslate } from 'nucleus-text';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageServerSideProps>> => pageServerSidePropsInjector(ctx, { checkAuth: true });

function AdditionalCalendarItems(): React.JSX.Element {
  const { translate } = useTranslate();
  const query = useQueryParams();
  const additionalCalendarId = query[ADDITIONAL_CALENDAR_ID] as string;

  const navMetadata = createNavMetadata(null, [{ key: ADDITIONAL_CALENDAR_ID, value: additionalCalendarId }]);

  // TODO: Add Phrase key for "Media"
  return (
    <div>
      <Page
        pageTitle={translate('additional_calendar_item_media_page_title')}
        testID="additional-calendar-item-media"
        navMetadata={navMetadata}
      >
        <AdditionalCalendarItemMedia additionalCalendarId={additionalCalendarId} />
      </Page>
    </div>
  );
}

export default AdditionalCalendarItems;
