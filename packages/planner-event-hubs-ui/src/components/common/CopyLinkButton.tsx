import useCopyToClipboard from '@hooks/useCopyToClipboard';
import { useTranslate } from 'nucleus-text';
import Button from '@cvent/carina/components/Button';
import { CopyIcon } from '@cvent/carina/components/Icon';
import React, { useMemo } from 'react';
import ToolTipWrapper from '@components/shared/TooltipWrapper';

interface CopyLinkButtonProps {
  url: string;
  title: string;
  testID: string;
}

function CopyLinkButton(props: CopyLinkButtonProps) {
  const { url, title, testID } = props;
  const { copy } = useCopyToClipboard(url);
  const { translate } = useTranslate();

  const CopyButton = useMemo(
    () => (
      <Button
        testID={`${testID}-link-copy-button`}
        icon={CopyIcon}
        aria-label={translate('custom_navigation_copy_link', { url, title })}
        appearance="ghost"
        onClick={copy}
      />
    ),
    [copy, testID, title, translate, url]
  );

  return (
    <ToolTipWrapper
      button={CopyButton}
      text={translate('tooltip_text_on_hover_copy_button')}
      copiedText={translate('tooltip_text_on_click_copy_button')}
    />
  );
}

export default CopyLinkButton;
