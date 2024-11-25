import { injectTestId } from '@cvent/nucleus-test-automation';
import React, { ReactNode } from 'react';
import { useStyle } from '@hooks/useStyle';
import { CustomRegistrationEditableCardContainerStyle } from '@components/customRegistration/style';

function Card({ backgroundColor, disabled, children }: CardProps) {
  const styles = useStyle(CustomRegistrationEditableCardContainerStyle, { color: backgroundColor });
  return <div css={[styles.card, disabled ? styles.disabledCard : null]}>{children}</div>;
}

function CardContainerEditEnabled({ children, testID, disabled, backgroundColor = '#FFFFFF' }: Props): JSX.Element {
  const styles = useStyle(CustomRegistrationEditableCardContainerStyle, { color: backgroundColor });
  return (
    <Card backgroundColor={backgroundColor} disabled={disabled}>
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
  backgroundColor?: string;
}

interface CardProps {
  children: ReactNode;
  disabled?: boolean;
  backgroundColor?: string;
}

export default CardContainerEditEnabled;
