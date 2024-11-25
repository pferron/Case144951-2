import React, { useRef } from 'react';
import {
  Page,
  Main,
  Body,
  ContentArea,
  IllustrationNotice,
  getIllustrationFromType,
  IllustrationHeader,
  IllustrationContent,
  IllustrationErrorTypes as ErrorTypes,
  TemplateActions as Actions,
  IllustrationErrorDetails
} from '@cvent/carina/components/Templates';
import Router, { useRouter } from 'next/router';
import { useTranslate } from 'nucleus-text';
import { NextPage } from 'next/types';

export function ErrorPage(): NextPage {
  const router = useRouter();
  const { translate } = useTranslate();
  const { httpLogPageLoadId, requestId, date } = router.query;
  const errorDate = new Date(parseInt(date as string, 10) || Date.now());
  const returnUrl: React.MutableRefObject<string> = useRef(null);

  return (
    <Page>
      <Main>
        <Body>
          <ContentArea>
            <IllustrationNotice illustration={getIllustrationFromType(ErrorTypes.FATAL_ERROR)}>
              <IllustrationHeader>{translate('error_title')}</IllustrationHeader>
              <IllustrationContent>{translate('error_content')}</IllustrationContent>
              <Actions
                actions={[
                  {
                    value: translate('error_go_back'),
                    onClick: (): void => {
                      if (returnUrl.current) {
                        Router.push(returnUrl.current);
                      } else {
                        Router.back();
                      }
                    }
                  }
                ]}
                position="center"
              />
              <IllustrationErrorDetails
                heading={(requestId || httpLogPageLoadId) && translate('error_heading')}
                dateHeading={translate('error_date_heading')}
                instanceID={(requestId || httpLogPageLoadId) as string}
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

export default ErrorPage;
