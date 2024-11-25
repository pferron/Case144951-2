import React, { useRef } from 'react';
import {
  Page,
  ContentArea,
  Main,
  Body,
  IllustrationHeader,
  IllustrationNotice,
  IllustrationErrorDetails,
  IllustrationContent,
  getIllustrationFromType,
  IllustrationErrorTypes as ErrorTypes,
  TemplateActions as Actions
} from '@cvent/carina/components/Templates';
import { NextPage } from 'next/types';
import { NextRouter, useRouter } from 'next/router';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import { useTranslate } from 'nucleus-text';

// TODO: fix once typing is fixed in nucleus-text
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const actions = (returnUrl: React.MutableRefObject<string>, translate: any, router: NextRouter): ActionType[] => [
  {
    value: translate('error_go_back'),
    onClick: (): void => {
      if (returnUrl.current) {
        router.push(returnUrl.current);
      } else {
        router.back();
      }
    }
  }
];

export function InternalServerErrorPage(): NextPage {
  const { translate } = useTranslate();
  const router = useRouter();
  const { requestId, pageLoadId, date } = router.query;
  const errorDate = new Date(parseInt(date as string, 10) || Date.now());
  const returnUrl: React.MutableRefObject<string> = useRef(null);
  return (
    <Page>
      <Main>
        <Body>
          <ContentArea>
            <IllustrationNotice illustration={getIllustrationFromType(ErrorTypes.FATAL_ERROR)}>
              <IllustrationHeader>{translate('error_title')}</IllustrationHeader>
              <IllustrationContent>{translate('500_error_content')}</IllustrationContent>
              <Actions actions={actions(returnUrl, translate, router)} position="center" />
              <IllustrationErrorDetails
                heading={translate('error_heading')}
                dateHeading={translate('error_date_heading')}
                instanceID={(requestId || pageLoadId) as string}
                date={errorDate.toString()}
                testID="error-info-requestId-value"
              />
            </IllustrationNotice>
          </ContentArea>
        </Body>
      </Main>
    </Page>
  ) as unknown as NextPage;
}

export default InternalServerErrorPage;
