import React, { useMemo } from 'react';
import { Button } from '@cvent/carina/components/Button';
import useCopyToClipboard from '@hooks/useCopyToClipboard';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';

// TODO - Move Styles
import { CSSObject } from '@emotion/react';
import { Theme } from '@cvent/carina/components/ThemeProvider';
import { injectTestId } from '@cvent/nucleus-test-automation';

export const CommonStyles = (theme: Theme): Record<string, CSSObject> =>
  useMemo(
    () => ({
      fieldContainer: {
        maxWidth: 590
      },
      sectionTitle: {
        marginTop: 0,
        maxWidth: '80%'
      },
      buttonContainer: {
        display: 'flex',
        button: {
          height: 40,
          marginLeft: 16
        }
      },
      urlLabel: {
        fontSize: theme.font.base.size.xs,
        color: theme.font.color.soft,
        margin: '0 0 0.5rem'
      },
      urlContainer: {
        flex: 1,
        lineHeight: '2.5rem',
        height: '2.5rem',
        paddingRight: 16,
        paddingLeft: 16,
        border: `1px solid ${theme.borderColor.soft}`,
        textOverflow: 'ellipsis',
        fontSize: theme.font.base.size.s,
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }
    }),
    [theme]
  );

interface Props {
  url: string;
}

function Weblink({ url }: Props): JSX.Element {
  const { translate } = useTranslate();
  const { fieldContainer, sectionTitle, buttonContainer, urlLabel, urlContainer } = useStyle(CommonStyles);
  const { copy } = useCopyToClipboard(url);

  return (
    <div css={fieldContainer}>
      <h3 css={sectionTitle}>{translate('video_hub_copy_weblink_header')}</h3>
      <div css={urlLabel}>{translate('video_hub_copy_weblink_label')}</div>
      <div css={buttonContainer}>
        <div css={urlContainer} {...injectTestId('weblink')}>
          {url}
        </div>
        <Button
          appearance="lined"
          size="s"
          testID="center-url-copy-button"
          text={translate('video_hub_copy_weblink_button_text')}
          onClick={copy}
          accessibilityLabel={translate('video_hub_copy_weblink_button_accessibility_label')}
        />
      </div>
    </div>
  );
}

export default Weblink;
