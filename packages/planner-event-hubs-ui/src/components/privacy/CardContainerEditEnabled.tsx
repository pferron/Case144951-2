import { injectTestId } from '@cvent/nucleus-test-automation';
import React, { ReactNode } from 'react';
import { CardContainerStyle } from '@components/privacy/style';
import { useStyle } from '@hooks/useStyle';
import { RegistrationCardContainerStyle } from '@components/visitor-permissions/style';
import { Tooltip } from '@cvent/carina/components/Tooltip';
import { TOOLTIP_MAX_LENGTH } from '@components/constants';

function Card({ backgroundColor, disabled, tooltipText, children }: CardProps) {
  const styles = useStyle(RegistrationCardContainerStyle, { color: backgroundColor });
  const triggerCard = (handleOpen, handleClose) => (
    <div
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onBlur={handleClose}
      css={[styles.editCard, disabled && styles.disabledCard]}
    >
      {children}
    </div>
  );

  return disabled && tooltipText ? (
    <Tooltip portal maxWidth={TOOLTIP_MAX_LENGTH} text={tooltipText} arrowLabel={tooltipText} trigger={triggerCard} />
  ) : (
    <div css={[styles.editCard, disabled && styles.disabledCard]}>{children}</div>
  );
}

function CardContainerEditEnabled({
  children,
  testID,
  disabled,
  tooltipText,
  backgroundColor = '#FFFFFF'
}: Props): JSX.Element {
  const styles = useStyle(CardContainerStyle, { color: backgroundColor });
  return (
    <Card backgroundColor={backgroundColor} disabled={disabled} tooltipText={tooltipText}>
      <div css={styles.bodyContainer} {...injectTestId(testID)}>
        <div css={styles.childrenContainer}>{children}</div>
        <div css={styles.buttonContainer} />
      </div>
    </Card>
  );
}

interface Props {
  children: ReactNode;
  testID: string;
  disabled?: boolean;
  tooltipText?: string;
  backgroundColor?: string;
}

interface CardProps {
  children: ReactNode;
  disabled?: boolean;
  tooltipText?: string;
  backgroundColor?: string;
}

export default CardContainerEditEnabled;
