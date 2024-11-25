import React from 'react';
import { useStyle } from '@hooks/useStyle';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { RegistrationTextContainerStyle } from '@components/visitor-permissions/style';

function RegistrationTextContainer({ question, answer, testID }: Props): JSX.Element {
  const styles = useStyle(RegistrationTextContainerStyle);
  return (
    <div>
      <div css={styles.questionContainer}>
        <div css={styles.question} {...injectTestId(`${testID}-question`)}>
          {question}
        </div>
      </div>
      <div css={styles.answer} {...injectTestId(`${testID}-answer`)}>
        {answer}
      </div>
    </div>
  );
}

export default RegistrationTextContainer;

interface Props {
  question: string;
  answer: string | JSX.Element[];
  testID: string;
}
