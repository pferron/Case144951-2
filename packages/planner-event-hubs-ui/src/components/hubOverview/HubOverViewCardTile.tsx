import { Col } from '@cvent/carina/components/Col';
import { CardBody, CardContainer } from '@cvent/carina/components/Card';
import React, { useMemo } from 'react';
import useBreakpoints from '@hooks/useBreakpoints';
import { useStyle } from '@hooks/useStyle';
import { HubOverviewStyle } from '@components/hubOverview/style';
import { ArrowCarrotDownIcon, ArrowCarrotUpIcon } from '@cvent/carina-icon';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { LoadingIcon } from '@cvent/carina/components/LoadingIcon';
import { useTranslate } from 'nucleus-text';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import Button from '@cvent/carina/components/Button';

interface Props {
  isLoading?: boolean;
  title: string;
  body: string;
  footer: number;
  testId: string;
  error?: boolean;
  tryAgain?: () => void;
  helpText: string;
}

export function HubOverViewCardTile({
  isLoading = false,
  title,
  body,
  footer,
  testId,
  error,
  tryAgain,
  helpText
}: Props): JSX.Element {
  const styles = useStyle(HubOverviewStyle);
  const { isMobileOrTablet } = useBreakpoints();
  const { font } = useTheme();
  const { translate } = useTranslate();

  const HubOverviewErrorCard: JSX.Element = useMemo(
    () => (
      <div css={styles.errorCardContainer} {...injectTestId(testId)}>
        <FormElement.Label label={translate('hub_overview_card_error_text')} labelFor="error" />
        <Button
          appearance="ghost"
          onClick={tryAgain}
          aria-label={translate('hub_overview_card_try_again_button')}
          text={translate('hub_overview_card_try_again_button')}
          testID={`${testId}-try-again-button`}
        />
      </div>
    ),
    [styles, tryAgain, translate, testId]
  );

  const displayContent = useMemo(
    () => (
      <CardContainer responsive height="95%" css={{ marginBottom: '1.125rem' }}>
        <CardBody>
          {error ? (
            HubOverviewErrorCard
          ) : (
            <div css={styles.summaryTileCardBody}>
              <p css={styles.summaryTileTitleStyle}>{title}</p>
              <strong css={styles.summaryTileBodyStyle}>{body}</strong>
              <div css={[styles.summaryTileFooterStyle]}>
                {footer > 0 && (
                  <>
                    <div>+{footer}%</div>
                    <div css={{ marginTop: '-0.125rem' }}>
                      <ArrowCarrotUpIcon
                        color={font.color.success.base}
                        size="l"
                        title={translate('hub_overview_analytics_card_arrow_up_icon_title')}
                      />
                    </div>
                  </>
                )}
                {footer < 0 && (
                  <>
                    <div css={{ color: font.color.danger.base }}>{footer}%</div>
                    <div css={{ marginTop: '-0.125rem' }}>
                      <ArrowCarrotDownIcon
                        color={font.color.danger.base}
                        size="l"
                        title={translate('hub_overview_analytics_card_arrow_down_icon_title')}
                      />
                    </div>
                  </>
                )}
                {footer === 0 && <div css={{ color: font.color.base, width: '1.8rem', height: '1.5rem' }}>--%</div>}
              </div>
              <div css={{ color: font.color.soft }}>{helpText}</div>
            </div>
          )}
        </CardBody>
      </CardContainer>
    ),
    [HubOverviewErrorCard, translate, body, error, font, footer, styles, title, helpText]
  );
  return (
    <Col
      {...injectTestId(`${testId}`)}
      width={isMobileOrTablet ? 1 / 2 : 1 / 3}
      flex={{ display: 'flex' }}
      padding={{ paddingBottom: 8 }}
    >
      {isLoading ? (
        <div css={styles.loadingSpinnerStyle}>
          <LoadingIcon size="m" aria-label={translate('hub_overview_loading_text')} id={`${testId}-loading-icon`} />
          <div css={{ fontSize: font.base.size.h4 }}>{translate('hub_overview_loading_text')}</div>
        </div>
      ) : (
        displayContent
      )}
    </Col>
  );
}
