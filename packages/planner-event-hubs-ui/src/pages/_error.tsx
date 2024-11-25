import React, { useRef } from 'react';
import { NextPage } from 'next/types';
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
import Router, { useRouter } from 'next/router';
import { useTranslate } from 'nucleus-text';

interface Props {
  statusCode?: number;
  httplogrequestid?: string;
}

function Error(): NextPage<Props> {
  const { translate } = useTranslate();
  const router = useRouter();
  const { httpLogRequestId, httpLogPageLoadId, date } = router.query;
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
                heading={translate('error_heading')}
                dateHeading={translate('error_date_heading')}
                instanceID={(httpLogRequestId || httpLogPageLoadId) as string}
                date={date as string}
                testID="error-info-requestId-value"
              />
            </IllustrationNotice>
          </ContentArea>
        </Body>
      </Main>
    </Page>
  ) as unknown as NextPage;
}

export default Error;
