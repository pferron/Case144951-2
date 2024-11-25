import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { HelpCirclePopper } from '@components/tracking-codes/HelpCirclePopper';
import { CardContainer } from '@cvent/carina/components/Card';
import { RadioGroup } from '@cvent/carina/components/RadioGroup';
import { useTheme } from '@cvent/carina/components/ThemeProvider';
import { CSSObject } from '@emotion/react';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { GET_VIDEO_HUB, UPDATE_VIDEO_HUB } from '@cvent/planner-event-hubs-model/operations/hub';
import { omit } from 'lodash';
import { useTranslate } from 'nucleus-text';
import { PageAlert } from '@cvent/carina/components/Alert';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import LocalesListAndModal from './LocalesListAndModal';

const LOG = LoggerFactory.create('LanguageManagementLocales');

const useStyles = (): CSSObject => {
  const { font } = useTheme();

  return {
    localeContainer: {
      padding: '2rem',
      width: '100%'
    },
    subTitle: {
      color: font.color.soft,
      fontSize: font.base.size.m
    },
    radiogroup: {
      display: 'flex',
      alignItems: 'center',
      color: font.color.soft,
      gap: 8
    }
  };
};
interface Props {
  centerId: string;
  setShowLocalesListTable: (show: boolean) => void;
  setSelectedLocale: (locale: string) => void;
  setSelectedLocaleTitle: (title: string) => void;
  onExport: () => void;
  setWizardOpen: (open: boolean) => void;
}

function LocalesListWrapper({
  centerId,
  setShowLocalesListTable,
  setSelectedLocale,
  setSelectedLocaleTitle,
  onExport,
  setWizardOpen
}: Props): React.JSX.Element {
  const { hubData } = useCenterInfo();
  const { config } = hubData || { config: {} };
  const { translate } = useTranslate();
  const styles = useStyles();
  const [saveChanges] = useMutation(UPDATE_VIDEO_HUB);
  const [errorAlertMessaage, setErrorAlertMessage] = useState<string>(null);

  const handleOnRadioButtonChange = value => {
    const newHubData = {
      ...hubData,
      config: {
        ...hubData.config,
        autoDetectBrowserLocale: !!value
      }
    };
    const hubToSave = omit(
      newHubData,
      'status',
      '__typename',
      'config.__typename',
      'theme.__typename',
      'calendar.__typename'
    );

    saveChanges({
      variables: { input: hubToSave },
      optimisticResponse: { hubUpdate: newHubData },
      onError: apolloError => {
        LOG.error(`Error while adding a locale to hub [${centerId}] with error : `, apolloError);
        setErrorAlertMessage('hub_network_error_text');
      },
      update(cache) {
        cache.writeQuery({
          query: GET_VIDEO_HUB,
          variables: { hubID: { id: centerId } },
          data: { hub: newHubData }
        });
      }
    });
  };
  const { enableMultiLanguageFeature } = useAppFeatures();

  return (
    <div css={styles.localeContainer}>
      {errorAlertMessaage && (
        <div css={{ paddingBottom: '1.5rem' }}>
          <PageAlert
            appearance="danger"
            id="1"
            content={translate(errorAlertMessaage)}
            dismissible
            onDismiss={() => setErrorAlertMessage(null)}
            isRtl={false}
            testID="languague-management-alert-form-error"
          />
        </div>
      )}
      <CardContainer responsive>
        <div css={styles.localeContainer}>
          <h2>{translate('language_management_manage_languages_page_title')}</h2>
          <p>{translate('language_management_manage_languages_page_subTitle')}</p>

          {enableMultiLanguageFeature && (
            <>
              <div css={styles.radiogroup}>
                <div>{translate('language_management_detect_browser_radio_title')}</div>
                <HelpCirclePopper
                  testID="enable-language-detection-helper"
                  helpText={translate('language_management_languages_list_popover_text')}
                  accessibilityLabel={translate('language_management_detect_browser_radio_title')}
                />
              </div>
              <RadioGroup
                id="browserLanguageDetection"
                name="enableBrowserLanguageDetection"
                options={[
                  {
                    label: translate('language_management_detect_browser_option_yes'),
                    value: 1
                  },
                  {
                    label: translate('language_management_detect_browser_option_no'),
                    value: 0
                  }
                ]}
                selected={config?.autoDetectBrowserLocale ? 1 : 0}
                onUpdate={handleOnRadioButtonChange}
              />
            </>
          )}

          <LocalesListAndModal
            centerId={centerId}
            setShowLocalesListTable={setShowLocalesListTable}
            setSelectedLocale={setSelectedLocale}
            setSelectedLocaleTitle={setSelectedLocaleTitle}
            onExport={onExport}
            setWizardOpen={setWizardOpen}
          />
        </div>
      </CardContainer>
    </div>
  );
}

export default LocalesListWrapper;
