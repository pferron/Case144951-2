import React from 'react';
import CardContainerEditEnabled from '@components/privacy/CardContainerEditEnabled';
import { RadioGroup } from '@cvent/carina/components/RadioGroup';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Form } from '@cvent/carina/components/Forms';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { PrivacySettings } from '@components/privacy/type/PrivacySettings';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import { EditPrivacyPolicyFieldsStyle } from '@components/privacy/style';

function EditSearchEngineVisibilityFields({
  privacySettings: originalSettings,
  setPrivacySettings,
  setIsPageEdited
}: Props): JSX.Element {
  const styles = useStyle(EditPrivacyPolicyFieldsStyle);
  const { translate } = useTranslate();

  return (
    <CardContainerEditEnabled testID="edit-search-engine-visibility-fields">
      <div>
        <h2 css={styles.title}>{translate('privacy_search_engine_visibility_heading')}</h2>
        <Form testID="search-engine-visibility-edit-form">
          <Row margin={{ start: -11 }}>
            <Col>
              <FormElement>
                <div css={styles.questionContainer}>
                  <div>
                    <FormElement.Label
                      label={translate('privacy_search_engine_visibility_sub_heading')}
                      labelFor="searchEngineSettingsEditRadioGroup"
                    />
                  </div>
                </div>
                <RadioGroup
                  id="searchEngineSettingsEditRadioGroup"
                  name="Search Engine Visibility Settings"
                  options={[
                    {
                      label: translate('privacy_search_engine_visibility_option_yes'),
                      value: 1
                    },
                    {
                      label: translate('privacy_search_engine_visibility_option_no'),
                      value: 0
                    }
                  ]}
                  selected={originalSettings.allowHubSearchEngineIndexing ? 1 : 0}
                  onUpdate={selectedOption => {
                    setPrivacySettings(prev => ({ ...prev, allowHubSearchEngineIndexing: Boolean(selectedOption) }));
                    setIsPageEdited(true);
                  }}
                  testID="cvent-search-engine-settings-radio"
                />
              </FormElement>
            </Col>
          </Row>
        </Form>
      </div>
    </CardContainerEditEnabled>
  );
}

interface Props {
  privacySettings: PrivacySettings;
  setIsPageEdited: (isPageEdited: boolean) => void;
  setPrivacySettings: React.Dispatch<React.SetStateAction<PrivacySettings>>;
}

export default EditSearchEngineVisibilityFields;
