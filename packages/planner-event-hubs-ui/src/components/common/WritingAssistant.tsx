import React from 'react';
import { CventWritingAssistant, TextType } from '@cvent/writing-assistant-component';

interface WritingAssistantProps {
  showAIAssistant: boolean;
  wrappedTextArea: JSX.Element;
  saveWritingAssistantText: (obj: { generatedText: string }) => void;
  fieldIdentifier: string;
  fieldTitle: string;
  inputText: string;
  maxTextLength?: number;
  assistantUrl: string;
  locale?: string;
}

function WritingAssistant({
  showAIAssistant,
  wrappedTextArea,
  saveWritingAssistantText,
  fieldIdentifier,
  fieldTitle,
  inputText,
  maxTextLength,
  assistantUrl,
  locale = 'en-US'
}: WritingAssistantProps): JSX.Element {
  return (
    <div>
      {showAIAssistant ? (
        <CventWritingAssistant
          fieldIdentifier={fieldIdentifier as `${string}.${string}`}
          fieldTitle={fieldTitle}
          inputText={inputText}
          maxTextLength={maxTextLength}
          onDone={saveWritingAssistantText}
          textType={TextType.Description}
          assistantUrl={assistantUrl}
          locale={locale}
        >
          {wrappedTextArea}
        </CventWritingAssistant>
      ) : (
        wrappedTextArea
      )}
    </div>
  );
}

export default WritingAssistant;
