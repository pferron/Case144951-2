import { Button } from '@cvent/carina/components/Button';
import { CheckIcon, EditPencilIcon, XIcon } from '@cvent/carina/components/Icon';
import { injectTestId } from '@cvent/nucleus-test-automation';
import React, { ReactNode } from 'react';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { RegistrationCardContainerStyle } from '@components/visitor-permissions/style';
import { Tooltip } from '@cvent/carina/components/Tooltip';

function Card({ backgroundColor, disabled, isEdit, tooltipText, children }: CardProps) {
  const styles = useStyle(RegistrationCardContainerStyle, { color: backgroundColor });

  return disabled && tooltipText ? (
    <Tooltip
      portal
      text={tooltipText}
      arrowLabel={tooltipText}
      // MAUVE
      /* eslint-disable */
      trigger={(handleOpen, handleClose) => (
        <div
          onMouseOver={handleOpen}
          onMouseLeave={handleClose}
          onFocus={handleOpen}
          onBlur={handleClose}
          tabIndex={0}
          css={[isEdit ? styles.editCard : styles.card, disabled && styles.disabledCard]}
        >
          {children}
        </div>
      )}
    />
  ) : (
    <div css={[isEdit ? styles.editCard : styles.card, disabled && styles.disabledCard]}>{children}</div>
  );
}

function CardContainer({
  children,
  onEdit,
  onSave,
  onCancel,
  testID,
  disabled,
  isEdit,
  backgroundColor,
  tooltipText
}: Props): JSX.Element {
  const styles = useStyle(RegistrationCardContainerStyle, { color: backgroundColor });
  const { translate } = useTranslate();
  return (
    <Card backgroundColor={backgroundColor} disabled={disabled} isEdit={isEdit} tooltipText={tooltipText}>
      <div css={styles.bodyContainer} {...injectTestId(testID)}>
        <div css={styles.childrenContainer}>{children}</div>
        {onEdit && (
          <div css={styles.buttonContainer}>
            <Button
              appearance="ghost"
              aria-label={translate('registration_settings_edit_button_label')}
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
              aria-label={translate('registration_settings_save_button_label')}
              appearance="ghost"
              icon={CheckIcon}
              onClick={onSave}
              testID={`${testID}-save-button`}
            />
            <div css={styles.spacer} />
            <Button
              appearance="ghost"
              aria-label={translate('registration_settings_cancel_button_label')}
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
  isEdit?: boolean;
  backgroundColor?: string;
  tooltipText?: string;
}

interface CardProps {
  children: ReactNode;
  disabled?: boolean;
  isEdit?: boolean;
  backgroundColor?: string;
  tooltipText?: string;
}

export default CardContainer;
