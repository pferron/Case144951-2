import HelpCircleIcon from '@cvent/carina/components/Icon/HelpCircle';
import { Popover } from '@cvent/carina/components/Popover';
import React from 'react';
import { useStyle } from '@hooks/useStyle';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { TextContainerStyle } from '@components/privacy/style';
import { injectTestId } from '@cvent/nucleus-test-automation';

function TextContainer({ question, answer, flyoutText, testID }: Props): JSX.Element {
  const styles = useStyle(TextContainerStyle);
  const theme = useTheme();
  return (
    <div>
      <div css={styles.questionContainer}>
        <div css={styles.question} {...injectTestId(`${testID}-question`)}>
          {question}
        </div>
        {flyoutText && (
          <div css={styles.flyout}>
            <Popover
              // MAUVE
              /* eslint-disable */
              trigger={({ toggleOpen, isOpen, closePopover }) => (
                <div onMouseOver={isOpen ? null : toggleOpen} onMouseLeave={isOpen ? closePopover : null}>
                  <HelpCircleIcon size="s" color={theme.font.color.soft} />
                </div>
              )}
            >
              <div css={{ width: '14rem' }}>{flyoutText}</div>
            </Popover>
          </div>
        )}
      </div>
      <div css={styles.answer} {...injectTestId(`${testID}-answer`)}>
        {answer}
      </div>
    </div>
  );
}

export default TextContainer;

interface Props {
  question: string;
  answer: string;
  flyoutText?: string;
  testID: string;
}
