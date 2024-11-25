import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { Textarea } from '@cvent/carina/components/Textarea';
import { Form } from '@cvent/carina/components/Forms/Form';
import WritingAssistant from '../WritingAssistant';

const onAIGeneratedTextMock = jest.fn();
function querySelectorIframe(container) {
  return container.querySelector('iframe');
}

describe('Cvent Writing Assistant', () => {
  it('Should render writing assitant when showAIAssistant is true', async () => {
    const { container } = render(
      <TestWrapper>
        <Form>
          <WritingAssistant
            showAIAssistant
            saveWritingAssistantText={() => onAIGeneratedTextMock}
            fieldIdentifier="PlannerEventHubs.BannerContent"
            fieldTitle="Test Title"
            inputText="TESTFIELD"
            maxTextLength={100}
            assistantUrl="www.testingAIUrl.com"
            wrappedTextArea={
              <Textarea testID="withAI" label="Content Description" name="TESTFIELD" messages="This is test message" />
            }
            locale="en-US"
          />
        </Form>
      </TestWrapper>
    );

    expect(await screen.findByTestId('withAI-textarea')).toBeInTheDocument();
    const assistantIframe = querySelectorIframe(container) as HTMLIFrameElement;
    expect(assistantIframe.src).toContain('testingAIUrl.com');
    /* Axe test fails because of missing aria-label, label gets added when the actual iframe renders.
      It gets added in @cvent/writing-assistant-component
    */
  });

  it('Should render only Textare and not writing assitant when showAIAssistant is false', async () => {
    const { container } = render(
      <TestWrapper>
        <WritingAssistant
          showAIAssistant={false}
          saveWritingAssistantText={() => onAIGeneratedTextMock}
          fieldIdentifier="PlannerEventHubs.BannerContent"
          fieldTitle="Test Title"
          inputText="TESTFIELD"
          maxTextLength={100}
          assistantUrl="www.testingAIUrl.com"
          wrappedTextArea={
            <Textarea testID="withOutAI" label="Content Description" name="TESTFIELD" messages="This is test message" />
          }
        />
      </TestWrapper>
    );

    expect(await screen.findByTestId('withOutAI-textarea')).toBeInTheDocument();
    const assistantIframe = querySelectorIframe(container) as HTMLIFrameElement;
    expect(assistantIframe).not.toBeInTheDocument();
  });
});
