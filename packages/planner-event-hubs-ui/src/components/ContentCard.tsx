import React, { useState, useContext } from 'react';
import { ThemeContext } from '@cvent/carina/components/ThemeProvider/ThemeContext';
import ChevronDownIcon from '@cvent/carina/components/Icon/ChevronDown';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useTranslate } from 'nucleus-text';
import { CSSObject } from '@emotion/react';

function ContentCard({
  id = 'key_accordion',
  header,
  children,
  collapsible = false,
  BodyComponent,
  containerStyle: containerStyleOverride,
  bodyContainerStyle: bodyContainerStyleOverride,
  accordionContainerStyle: accordionContainerStyleOverride,
  headerContainerStyle: headerContainerStyleOverride,
  backgroundImageUrl,
  cardName,
  contentName = '',
  ariaLabel
}: ContentCardProps): JSX.Element {
  const [isCollapsed, toggleCollapse] = useState(false);

  const sectionName = cardName ? `${cardName}-` : '';
  const {
    container: containerStyle,
    header: headerStyle,
    bodyWithHeader: bodyWithHeaderStyle,
    bodyContainer: bodyContainerStyle,
    collapseButton: collapseButtonStyle
  } = generateStyles(useContext(ThemeContext));

  const withBackgroundImage = {
    paddingLeft: 116,
    backgroundPosition: '0 center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundImage: backgroundImageUrl,
    minHeight: 90
  };

  const { translate } = useTranslate();

  return (
    <div css={[containerStyle.base, containerStyleOverride]} {...injectTestId(`${sectionName}section`)}>
      {header && (
        <div css={[headerStyle.base, isCollapsed && headerStyle.collapsed, headerContainerStyleOverride]}>
          <div css={{ width: '100%' }}>{header}</div>
          {collapsible && (
            <button
              aria-label={
                isCollapsed
                  ? translate('Content-Card-Expand-Button-Label', {
                      contentName
                    })
                  : translate('Content-Card-Collapse-Button-Label', {
                      contentName
                    })
              }
              id={`accordion_${id}`}
              aria-controls={`container-body_${id}`}
              type="button"
              aria-expanded={!isCollapsed}
              tabIndex={0}
              css={[collapseButtonStyle.base, isCollapsed && collapseButtonStyle.collapsed]}
              onClick={() => toggleCollapse(!isCollapsed)}
              {...injectTestId(`${sectionName}toggle-card-collapse`)}
            >
              <ChevronDownIcon size="m" color={headerStyle.caret.color} />
            </button>
          )}
        </div>
      )}
      <div
        role="region"
        {...(!header && { 'aria-label': `${ariaLabel || ''}` })}
        {...(header && collapsible && { 'aria-labelledby': `accordion_${id}` })}
        id={`container-body_${id}`}
        css={[bodyContainerStyle.base, isCollapsed && bodyContainerStyle.collapsed, accordionContainerStyleOverride]}
      >
        {isCollapsed ? null : (
          <div css={[header && bodyWithHeaderStyle.base, bodyContainerStyleOverride]}>
            {BodyComponent && <div css={backgroundImageUrl && withBackgroundImage}>{BodyComponent}</div>}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

interface ContentCardProps {
  id?: string;
  header?: React.ReactNode;
  BodyComponent?: React.ReactNode;
  backgroundImageUrl?: string;
  collapsible?: boolean;
  containerStyle?: CSSObject;
  bodyContainerStyle?: Record<string, CSSObject>;
  accordionContainerStyle?: Record<string, CSSObject>;
  headerContainerStyle?: Record<string, CSSObject>;
  children?: React.ReactNode;
  cardName?: string;
  contentName?: string;
  ariaLabel?: string;
}

function generateStyles(theme) {
  return {
    container: {
      base: {
        padding: 24,
        margin: 0,
        borderRadius: theme.size.border.radius.twoX,
        backgroundColor: theme.backgroundColor.base
      }
    },
    header: {
      base: {
        fontFamily: theme.font.base.family,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        paddingBottom: 24,
        h3: {
          ...theme.h3,
          marginBottom: 20
        },
        p: {
          ...theme.p,
          fontFamily: theme.font.base.family
        }
      },
      collapsed: {
        paddingBottom: 0
      },
      caret: {
        color: theme.font.color.base
      }
    },
    bodyContainer: {
      base: {
        maxHeight: 3000,
        transition: 'max-height .3s ease-in-out',
        boxSizing: 'border-box',
        h3: {
          ...theme.h3,
          fontFamily: theme.font.base.family,
          marginBottom: 16
        },
        h5: {
          ...theme.h5,
          fontFamily: theme.font.base.family,
          textTransform: 'uppercase',
          flexBasis: '100%',
          marginBottom: 16
        },
        p: {
          ...theme.p,
          marginBottom: 16,
          fontSize: theme.font.base.size.s
        },
        a: {
          textDecoration: 'none',
          color: '#006ae1'
        }
      },
      collapsed: {
        maxHeight: 0
      }
    },
    bodyWithHeader: {
      base: {
        borderTop: 0,
        paddingTop: 0
      }
    },
    collapseButton: {
      base: {
        background: 'transparent',
        border: 'none',
        transform: 'rotate(-180deg)',
        padding: 0,
        transition: 'transform .3s ease-in-out'
      },
      collapsed: {
        transform: 'rotate(0deg)'
      }
    }
  };
}

export default ContentCard;
