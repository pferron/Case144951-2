import { Col } from '@cvent/carina/components/Col';
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
import { HelpInfoPopper } from '@components/hubOverview/HelpInfoPopper';

interface Props {
  isLoading?: boolean;
  title: string;
  body: string;
  footer: number;
  testId: string;
  error?: boolean;
  tryAgain?: () => void;
  helpText: string;
  showDivider?: boolean;
  paddingTop?: number;
}

export function TopMetricsCard({
  isLoading = false,
  title,
  body,
  footer,
  testId,
  error,
  tryAgain,
  helpText,
  showDivider = false,
  paddingTop = 0
}: Props): JSX.Element {
  const styles = useStyle(HubOverviewStyle);
  const { isMobileOrTablet } = useBreakpoints();
  const { font } = useTheme();
  const { translate } = useTranslate();

  const TopMetricsErrorCard: JSX.Element = useMemo(
    () => (
      <div css={styles.errorCardContainer} {...injectTestId(`${testId}-error-container`)}>
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
      <div css={{ width: '100%' }}>
        {error ? (
          TopMetricsErrorCard
        ) : (
          <div css={styles.topMetricsCardsContainer}>
            <div>
              <HelpInfoPopper
                testID={testId}
                helpText={helpText}
                accessibilityLabel={helpText}
                hoverElement={<p css={styles.topMetricsCardHeadingStyle}>{title}</p>}
                placement="top-start"
                style={{ height: 'fit-content', cursor: 'pointer' }}
              />
              <div css={styles.summaryTileBodyStyle}>{body}</div>
              <div css={[styles.summaryTileFooterStyle]}>
                {footer > 0 && (
                  <>
                    <div>+{footer}%</div>
                    <div css={{ marginTop: '-0.125rem' }}>
                      <ArrowCarrotUpIcon color={font.color.success.base} size="l" />
                    </div>
                  </>
                )}
                {footer < 0 && (
                  <>
                    <div css={{ color: font.color.danger.base }}>{footer}%</div>
                    <div css={{ marginTop: '-0.125rem' }}>
                      <ArrowCarrotDownIcon color={font.color.danger.base} size="l" />
                    </div>
                  </>
                )}
                {footer === 0 && <div css={{ color: font.color.base, width: '1.8rem', height: '1.5rem' }}>--</div>}
              </div>
            </div>
            {showDivider && (
              <div css={{ width: '0.063rem', backgroundColor: '#D9DCDE' }} {...injectTestId(`${testId}-divider`)} />
            )}
          </div>
        )}
      </div>
    ),
    [TopMetricsErrorCard, body, error, font, footer, styles, title, helpText, showDivider, testId]
  );
  return (
    <Col
      {...injectTestId(`${testId}`)}
      width={isMobileOrTablet ? 1 / 2 : 1 / 3}
      flex={{ display: 'flex' }}
      padding={{ paddingLeft: 16, paddingRight: 16, paddingTop }}
    >
      {isLoading ? (
        <div css={styles.loadingSpinnerStyle}>
          <LoadingIcon size="m" />
          <div css={{ fontSize: font.base.size.h4 }}>{translate('hub_overview_loading_text')}</div>
        </div>
      ) : (
        displayContent
      )}
    </Col>
  );
}
