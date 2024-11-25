import React from 'react';
import Textbox from '@cvent/carina/components/Textbox/Textbox';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { useBrandingPreview } from '@hooks/BrandingPreviewProvider';

interface Props {
  id: string;
  label: string;
  testID: string;
  isRequired?: boolean;
}

function LoginTextBox({ id, label, testID, isRequired }: Props): JSX.Element {
  const { bodyTextFontFamily } = useBrandingPreview();
  return (
    <div css={{ height: '4rem', marginBottom: '1.5rem' }}>
      <FormElement>
        <FormElement.Label label={label} labelFor={id} required={isRequired} css={{ fontFamily: bodyTextFontFamily }} />
        <Textbox id={id} isRequired={isRequired} testID={testID} aria-label={label} aria-describedby={id} value="" />
      </FormElement>
    </div>
  );
}

export default LoginTextBox;
