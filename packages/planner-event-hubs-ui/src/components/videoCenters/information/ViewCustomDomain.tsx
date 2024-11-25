import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import React, { useMemo } from 'react';
import useCopyToClipboard from '@hooks/useCopyToClipboard';
import { Button } from '@cvent/carina/components/Button';
import { CopyIcon } from '@cvent/carina/components/Icon';
import { Theme } from '@cvent/carina/components/ThemeProvider';
import { CSSObject } from '@emotion/react';
import { injectTestId } from '@cvent/nucleus-test-automation';

const ViewCustomDomainStyles = (theme: Theme): Record<string, CSSObject> =>
  useMemo(
    () => ({
      fieldContainer: {
        maxWidth: 590
      },
      sectionTitle: {
        marginTop: 0,
        maxWidth: '80%',
        marginBottom: theme.spacing['5']
      },
      urlLabel: {
        fontSize: theme.font.base.size.xs,
        color: theme.font.color.soft,
        margin: '0'
      },
      url: {
        fontSize: theme.font.base.size.s,
        marginTop: 8
      }
    }),
    [theme]
  );

interface CustomDomainProps {
  hubUrl: string;
}

function CustomDomainWeblinkView({ hubUrl }: CustomDomainProps): JSX.Element {
  const { translate } = useTranslate();
  const { fieldContainer, sectionTitle, urlLabel, url } = useStyle(ViewCustomDomainStyles);
  const { copy } = useCopyToClipboard(hubUrl);

  return (
    <div css={fieldContainer} {...injectTestId('view-custom-domain')}>
      <h2 css={sectionTitle}>{translate('video_hub_copy_weblink_header')}</h2>
      <div css={urlLabel}>{translate('events_plus_homepage')}</div>
      <div style={{ display: 'flex', width: 'fit-content' }}>
        <p css={url} {...injectTestId('custom-domain')}>
          {hubUrl}
        </p>
        <Button
          testID="custom-domain-url-copy-button"
          icon={CopyIcon}
          aria-label={translate('video_hub_copy_weblink_button_accessibility_label')}
          appearance="ghost"
          onClick={copy}
        />
      </div>
    </div>
  );
}

export default CustomDomainWeblinkView;
