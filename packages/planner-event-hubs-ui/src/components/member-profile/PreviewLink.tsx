import { EyeIcon } from '@cvent/carina/components/Icon';
import { TextLink } from '@cvent/carina/components/TextLink';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslate } from 'nucleus-text';
import { useTheme } from '@cvent/carina/components/ThemeProvider';

function PreviewLink({ setIsPreviewProfile }: Props): JSX.Element {
  const { translate } = useTranslate();
  const theme = useTheme();
  return (
    <div css={{ display: 'flex', marginTop: '2.4rem', justifyContent: 'center' }}>
      <div css={{ marginTop: '0.2rem' }}>
        <EyeIcon size="s" color={theme.colors.interactive['45']} />
      </div>
      <div css={{ marginLeft: '0.625rem' }}>
        <TextLink
          css={{ fontWeight: '400', fontSize: '1rem' }}
          onKeyPress={(event): void => {
            if (event.code === 'Enter') {
              setIsPreviewProfile(true);
            }
          }}
          aria-label={translate('profile_preview_text_link')}
          onClick={(): void => {
            setIsPreviewProfile(true);
          }}
        >
          {translate('profile_card_preview')}
        </TextLink>
      </div>
    </div>
  );
}

interface Props {
  setIsPreviewProfile: Dispatch<SetStateAction<boolean>>;
}

export default PreviewLink;
