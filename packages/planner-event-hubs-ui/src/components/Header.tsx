import React, { useMemo } from 'react';
import {
  HeroHeader,
  HeroHeaderContent as HeaderContent,
  HeroHeaderActions as HeaderActions,
  HeroHeaderContentWrapper as HeaderContentWrapper,
  HeroHeaderTitle as HeaderTitle,
  TemplateActions as Actions
} from '@cvent/carina/components/Templates';
import { useTranslate } from 'nucleus-text';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import useBreakpoints from '@hooks/useBreakpoints';

const Header = ({
  title,
  actions,
  tabs,
  breadCrumbs,
  statusLabel,
  testID = 'header',
  headerDescription,
  moreActionsText
}: Props): JSX.Element => {
  const { isMobileOrTablet } = useBreakpoints();
  const { translate } = useTranslate();

  return useMemo(
    () => (
      <div css={{ position: 'relative' }}>
        <HeroHeader>
          {breadCrumbs && <nav>{breadCrumbs}</nav>}
          <header>
            <HeaderContentWrapper>
              <HeaderContent>
                <section
                  css={{
                    display: 'flex',
                    flexDirection: 'column',
                    wordBreak: 'break-all'
                  }}
                >
                  <HeaderTitle testID={`${testID}-title`}>{title}</HeaderTitle>
                  {headerDescription && (
                    <p
                      css={{
                        margin: '0px',
                        marginTop: '6px'
                      }}
                    >
                      {headerDescription}
                    </p>
                  )}
                  {statusLabel && <div css={{ paddingTop: '1rem' }}>{statusLabel}</div>}
                </section>
              </HeaderContent>
            </HeaderContentWrapper>
            {actions && (
              <HeaderActions>
                <Actions
                  actions={actions}
                  testID="header-actions"
                  accessibilityLabel="Actions"
                  moreActionsText={moreActionsText || translate('show_more_button_text')}
                  isCompact={isMobileOrTablet}
                />
              </HeaderActions>
            )}
          </header>
          {tabs}
        </HeroHeader>
      </div>
    ),
    [
      breadCrumbs,
      testID,
      title,
      headerDescription,
      statusLabel,
      actions,
      translate,
      isMobileOrTablet,
      tabs,
      moreActionsText
    ]
  );
};

interface Props {
  title: string;
  actions?: ActionType[];
  tabs?: JSX.Element;
  breadCrumbs?: JSX.Element;
  statusLabel?: JSX.Element;
  testID?: string;
  headerDescription?: string;
  moreActionsText?: string;
}

export default Header;
