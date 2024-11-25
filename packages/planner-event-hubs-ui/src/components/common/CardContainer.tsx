import React, { ReactNode } from 'react';
import { Button } from '@cvent/carina/components/Button';
import { Card } from '@cvent/carina/components/Card';
import { CardContainerStyles } from '@components/common/style';
import { CheckIcon, EditPencilIcon, XIcon } from '@cvent/carina/components/Icon';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';

interface CardProps {
  children: ReactNode;
  enabled?: boolean;
  disabled?: boolean;
  hideEdit?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onSubmit?: () => void;
  testID: string;
  editAccessibilityLabel?: string;
  saveAccessibilitylabel?: string;
  cancelAccessibilitylabel?: string;
}
function CardContainer({
  children,
  enabled,
  disabled,
  onEdit,
  onCancel,
  onSubmit,
  testID,
  hideEdit = false,
  saveAccessibilitylabel = '',
  editAccessibilityLabel = '',
  cancelAccessibilitylabel = ''
}: CardProps): JSX.Element {
  const { translate } = useTranslate();
  const { cardWrapper, enabledCard, disabledCard, bodyContainer, buttonContainer, spacer, childrenContainer } =
    useStyle(CardContainerStyles);

  const cardContainerBodyContent: JSX.Element = (
    <div css={!enabled ? bodyContainer : { ...bodyContainer, flexDirection: 'column-reverse' }}>
      {!hideEdit && onEdit && !enabled && (
        <div css={buttonContainer}>
          <Button
            appearance="ghost"
            aria-label={editAccessibilityLabel || translate('card_edit_accessibility_button_label')}
            icon={EditPencilIcon}
            size="s"
            onClick={onEdit}
            disabled={disabled}
            testID={`${testID}-edit-button`}
          />
        </div>
      )}
      <div css={!hideEdit && onEdit ? childrenContainer : null}>{children}</div>
      {onEdit && enabled && (
        <div css={buttonContainer}>
          <Button
            type="submit"
            aria-label={saveAccessibilitylabel || translate('card_edit_save_accessibility_button_label')}
            appearance="ghost"
            icon={CheckIcon}
            size="s"
            onClick={onSubmit}
            testID={`${testID}-edit-save-button`}
          />
          <div css={spacer} />
          <Button
            appearance="ghost"
            aria-label={cancelAccessibilitylabel || translate('card_edit_cancel_accessibility_button_label')}
            icon={XIcon}
            size="s"
            onClick={onCancel}
            variant="neutral"
            testID={`${testID}-edit-cancel-button`}
          />
        </div>
      )}
    </div>
  );

  return (
    <div css={[enabled ? enabledCard : cardWrapper, disabled ? disabledCard : null]} {...injectTestId(`${testID}`)}>
      <Card orientation="vertical" bodyContent={cardContainerBodyContent} />
    </div>
  );
}

export default CardContainer;
