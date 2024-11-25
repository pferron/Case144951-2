import { EXIT, SUCCESS, ImportWizard, ImportWizardLocales } from '@cvent/import-wizard';
import React, { useState } from 'react';
import type { SettingsOptions } from '@cvent/import-wizard/lib/types/steps/settings/SettingsOptions';
import type { TextCustomizations } from '@cvent/import-wizard/lib/types/import-wizard/ImportWizard';
import { LocalizationProvider, useTranslate } from 'nucleus-text';
import { getBearerToken, getEnvironment, isDevEnvironment } from '@utils/appConfig';
import useBreakpoints from '@hooks/useBreakpoints';
import getConfig from 'next/config';
import { PageAlert } from '@cvent/carina/components/Alert';
import TextLink from '@cvent/carina/components/TextLink';
import { injectTestId } from '@cvent/nucleus-test-automation';
import type { ReviewOptions } from '@cvent/import-wizard/lib/types/steps/review/Review';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { TRANSLATION_IMPORT_SCHEMA } from './LanguageManagementConstants';

type LanguageManagementImportWizardModalProps = {
  onWizardOpen: (isOpen: boolean) => void;
  centerId: string;
  setDisplaySuccess?: (val: boolean) => void;
  setSuccessMessage?: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  selectedLocale?: string;
  setOpenImportHistory: (open: boolean) => void;
  fetchImportHistory: () => void;
};

export function useEventHandler(
  onWizardOpen: (isOpen: boolean) => void,
  setOpenImportHistory: (open: boolean) => void,
  fetchImportHistory: () => void,
  setDisplaySuccess?: (val: boolean) => void,
  setSuccessMessage?: React.Dispatch<React.SetStateAction<React.ReactNode>>,
  setDisplayWarning?: (val: boolean) => void,
  setWarningMessage?: React.Dispatch<React.SetStateAction<React.ReactNode>>
) {
  const { translate } = useTranslate();
  const { font } = useTheme();

  return (event: string) => {
    const successMessageContent = (
      <>
        {translate('language_management_import_success_toast_message')}
        <TextLink
          css={{ color: font?.color?.interactive?.hover }}
          onClick={() => {
            fetchImportHistory();
            setOpenImportHistory(true);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fetchImportHistory();
              setOpenImportHistory(true);
            }
          }}
        >
          {translate('language_management_import_success_goto_history_message')}
        </TextLink>
      </>
    );

    switch (event) {
      case EXIT.EXIT_WIZARD:
      case EXIT.EXIT_TO_IMPORT_LIST:
        onWizardOpen(false);
        break;
      case SUCCESS.REVIEW.SUCCESS_GET_VALIDATION_ERRORS:
        setDisplayWarning(true);
        setWarningMessage(translate('language_management_import_warning_toast_message'));
        break;
      case SUCCESS.REVIEW.SUCCESS_IMPORT_FILE_DATA:
        setDisplaySuccess(true);
        setSuccessMessage(successMessageContent);
        break;
      case SUCCESS.REVIEW.SUCCESS_GET_IMPORT:
        setDisplayWarning(false);
        break;
      case SUCCESS.UPLOAD.SUCCESS_CREATE_IMPORT:
        setDisplaySuccess(false);
        break;
      default:
        break;
    }
  };
}

function LanguageManagementImportWizard({
  onWizardOpen,
  centerId,
  setDisplaySuccess,
  setSuccessMessage,
  selectedLocale,
  setOpenImportHistory,
  fetchImportHistory
}: LanguageManagementImportWizardModalProps): React.JSX.Element {
  const environment = isDevEnvironment() ? 'T2' : getEnvironment();
  const bearerToken = getBearerToken();
  const { locale } = useTranslate();
  const { isMobileOrTablet } = useBreakpoints();
  const { publicRuntimeConfig } = getConfig();
  const [displayWarning, setDisplayWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const textCustomizations: TextCustomizations = {
    upload: {
      header: 'language_management_import_choose_data_text',
      subHeader: 'language_management_import_choose_data_subtext',
      fileUploadLabel: 'language_management_import_supported_file_types_text',
      templateSubLabel: 'language_management_import_download_template_text',
      fileLimitLabel: 'language_management_import_file_limit_text'
    }
  };

  const handleEvent = useEventHandler(
    onWizardOpen,
    setOpenImportHistory,
    fetchImportHistory,
    setDisplaySuccess,
    setSuccessMessage,
    setDisplayWarning,
    setWarningMessage
  );

  // overrides the default import wizard formatter which incorrectly converts
  // unique IDs and some other text to a date
  const reviewOptions: ReviewOptions = {
    fieldFormatter: (value): string => value
  };

  const settingsOptions: SettingsOptions = {
    showExistingRecords: false,
    showNewRecords: false,
    showSavePreferences: false,
    questions: [
      {
        id: 'overwriteFormattedText',
        heading: 'language_management_import_formatted_text_question',
        inline: true,
        value: false,
        options: [
          {
            label: 'language_management_import_formatted_text_skip_label',
            value: false,
            confirmationText: 'language_management_import_formatted_text_skip_confirmation_text'
          },
          {
            label: 'language_management_import_formatted_text_overwrite_label',
            value: true,
            confirmationText: 'language_management_import_formatted_text_overwrite_confirmation_text'
          }
        ]
      }
    ]
  };

  return (
    <LocalizationProvider locale={locale} locales={ImportWizardLocales}>
      {displayWarning && (
        <div css={{ margin: '1.5rem' }}>
          <PageAlert
            appearance="warning"
            content={warningMessage}
            dismissible
            testID="import-wizard-warning-toast-message"
          />
        </div>
      )}
      <div
        {...injectTestId('import-wizard')}
        css={{ width: isMobileOrTablet ? 700 : '100%', '> div': { height: '70vh' } }}
      >
        <ImportWizard
          bearerToken={bearerToken}
          environment={environment}
          eventId={centerId}
          locale={selectedLocale}
          importService={`${publicRuntimeConfig.FILE_IMPORT_URL}/v1`}
          onEvent={handleEvent}
          schema={TRANSLATION_IMPORT_SCHEMA}
          settingsOptions={settingsOptions}
          textCustomizations={textCustomizations}
          reviewOptions={reviewOptions}
          skipConfirmationPage
          showConfirmUploadText
          acceptedFileTypes={['csv', 'xlsx']}
        />
      </div>
    </LocalizationProvider>
  );
}

export default LanguageManagementImportWizard;
