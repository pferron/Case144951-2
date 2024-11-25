import React, { useMemo } from 'react';
import { Button } from '@cvent/carina/components/Button';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { CopyIcon } from '@cvent/carina/components/Icon';
import { MemberDetailsStyle } from '@components/memberList/style';
import ToolTipWrapper from '@components/shared/TooltipWrapper';

interface Props {
  url: string;
  generateLoginLink: () => void;
  expirationDateTime: string;
}

function LoginWebLink({ url, generateLoginLink, expirationDateTime }: Props): JSX.Element {
  const { translate } = useTranslate();
  const {
    linkContainer,
    buttonContainer,
    urlContainer,
    textBoxContainer,
    copyIconContainer,
    copyButtonStyle,
    linkNoteStyle
  } = useStyle(MemberDetailsStyle);

  // MAUVE
  /* eslint-disable */
  const CopyButton = useMemo(
    () => (
      <button
        aria-label={translate('member_details_login_link_copy_button_aria_label')}
        {...injectTestId('login-link-copy-button')}
        onKeyPress={(e): void => {
          if (e.key === 'Enter' || e.key === ' ') {
            navigator.clipboard.writeText(url);
          }
        }}
        css={copyButtonStyle}
        onClick={() => {
          navigator.clipboard.writeText(url);
        }}
      >
        <CopyIcon size="m" />
      </button>
    ),
    [copyButtonStyle, translate, url]
  );

  return (
    <>
      <div css={linkContainer}>
        <div css={textBoxContainer}>
          <div css={urlContainer} {...injectTestId('weblink')}>
            {url}
          </div>
          <div css={copyIconContainer}>
            <ToolTipWrapper
              button={CopyButton}
              text={translate('tooltip_text_on_hover_copy_button')}
              copiedText={translate('tooltip_text_on_click_copy_button')}
            />
          </div>
        </div>
        <div css={buttonContainer}>
          <Button
            appearance="lined"
            size="s"
            testID="regenerate_login_link_button"
            text={translate('member_details_regenerate_button_text')}
            onClick={() => {
              generateLoginLink();
            }}
            accessibilityLabel={translate('member_details_regenerate_button_text')}
          />
        </div>
      </div>
      <div css={linkNoteStyle}>
        {translate('member_details_login_generation_note_with_time', {
          expirationDateTime
        })}
      </div>
    </>
  );
}

export default LoginWebLink;
