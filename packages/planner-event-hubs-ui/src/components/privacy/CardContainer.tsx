import { Button } from '@cvent/carina/components/Button';
import { CheckIcon, EditPencilIcon, XIcon } from '@cvent/carina/components/Icon';
import { injectTestId } from '@cvent/nucleus-test-automation';
import React, { ReactNode } from 'react';
import { useTranslate } from 'nucleus-text';
import { CardContainerStyle } from '@components/privacy/style';
import { useStyle } from '@hooks/useStyle';

function Card({ backgroundColor, disabled, children }: CardProps) {
  const styles = useStyle(CardContainerStyle, { color: backgroundColor });
  return <div css={[styles.card, disabled ? styles.disabledCard : null]}>{children}</div>;
}

function CardContainer({
  children,
  onEdit,
  onSave,
  onCancel,
  testID,
  disabled,
  backgroundColor = '#FFFFFF'
}: Props): JSX.Element {
  const styles = useStyle(CardContainerStyle, { color: backgroundColor });
  const { translate } = useTranslate();
  return (
    <Card backgroundColor={backgroundColor} disabled={disabled}>
      <div css={styles.bodyContainer} {...injectTestId(testID)}>
        <div css={styles.childrenContainer}>{children}</div>
        {onEdit && (
          <div css={styles.buttonContainer}>
            <Button
              appearance="ghost"
              accessibilityLabel={translate('privacy_settings_edit_button_label')}
              icon={EditPencilIcon}
              onClick={onEdit}
              testID={`${testID}-edit-button`}
              disabled={disabled}
            />
          </div>
        )}
        {onSave && onCancel && (
          <div css={styles.buttonContainer}>
            <Button
              accessibilityLabel={translate('privacy_settings_save_button_label')}
              appearance="ghost"
              icon={CheckIcon}
              onClick={onSave}
              testID={`${testID}-save-button`}
            />
            <div css={styles.spacer} />
            <Button
              appearance="ghost"
              accessibilityLabel={translate('privacy_settings_cancel_button_label')}
              icon={XIcon}
              onClick={onCancel}
              variant="neutral"
              testID={`${testID}-cancel-button`}
            />
          </div>
        )}
      </div>
    </Card>
  );
}

interface Props {
  children: ReactNode;
  onEdit?: (boolean) => void;
  onSave?: (boolean) => void;
  onCancel?: (boolean) => void;
  testID: string;
  disabled?: boolean;
  backgroundColor?: string;
}

interface CardProps {
  children: ReactNode;
  disabled?: boolean;
  backgroundColor?: string;
}

export default CardContainer;
