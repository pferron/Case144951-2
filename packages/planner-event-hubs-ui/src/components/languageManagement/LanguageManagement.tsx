import { useMutation, useLazyQuery } from '@apollo/client';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import Header from '@components/Header';
import ConfirmationModal from '@components/common/ConfirmationModal';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import { Tabs, TabsContextProvider, TabsPanel } from '@cvent/carina/components/Tabs';
import { RESET_TRANSLATIONS } from '@cvent/planner-event-hubs-model/operations/languageManagement';
import { getFileImportHistory } from '@cvent/planner-event-hubs-model/operations/fileImport';
import { Translation } from '@cvent/planner-event-hubs-model/types';
import useTranslationUpdater from '@hooks/useUpdateTranslation';
import {
  ASC,
  DESC,
  HUB_OVERVIEW_URL,
  LANGUAGE_MANAGEMENT_TRANSLATION_EXPORT,
  LANGUAGE_MANAGEMENT_URL,
  VIDEO_HUBS_URL,
  VIDEO_HUB_INFORMATION_URL,
  VIDEO_HUB_PATH_PARAM_KEY,
  INITIAL_PAGE_LIMIT
} from '@utils/constants';
import { useTranslate } from 'nucleus-text';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DownloadIcon, LoadPreviousIcon, UndoIcon, UploadIcon } from '@cvent/carina-icon';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import Modal from '@cvent/carina/components/Modal';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { TRANSLATION_IMPORT_SCHEMA } from './LanguageManagementConstants';
import LanguageManagementImportWizard from './LanguageManagementImportWizard';
import CheckConfirmationModal from './CheckConfirmationModal';
import TranslationTable from './TranslationTable';
import { transformObjectToArray } from './utils/localeHelper';
import LocalesListWrapper from './LocalesListWrapper';
import LanguageManagementImportHistory from './LanguageManagementImportHistory';

interface Props {
  centerId: string;
  centerTitle: string;
}

export enum TranslationTypes {
  phraseAppKeys = 'PhraseApp-Key',
  customKeys = 'custom-translation'
}

export type TrackerType = {
  [key: string]: Translation;
};

export type ConfirmationActionFnType = () => void;

function LanguageManagement({ centerId, centerTitle }: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const { hubOverviewFeature, languageManagementImportFeature } = useAppFeatures();
  const [selectedType, setSelectedType] = useState(TranslationTypes.customKeys);
  const dirtyFormTrackerMapRef = useRef<TrackerType>({});
  const importRef = useRef(null);
  const [searchedTranslation, setSearchedTranslation] = useState('');

  const [sortColumn, setSortColumn] = useState('itemId');
  const [sortDirection, setSortDirection] = useState<typeof ASC | typeof DESC | undefined>(ASC);
  const [selectedFilterByType, setSelectedFilterByType] = useState<string | null>(TranslationTypes.customKeys);

  const [showLocalesListTable, setShowLocalesListTable] = useState(true);
  const [selectedLocale, setSelectedLocale] = useState('en-US');
  const [selectedLocaleTitle, setSelectedLocaleTitle] = useState('English');
  const [wizardOpen, setWizardOpen] = useState(false);

  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [openImportHistory, setOpenImportHistory] = useState(false);
  const [pageLimit, setPageLimit] = useState(INITIAL_PAGE_LIMIT);

  // Temporary state var
  let selectedTypeTemp = selectedType;

  const setDirtyFormTrackerMapRef = useCallback(value => {
    dirtyFormTrackerMapRef.current = value;
  }, []);

  const clearDirtyFormTracker = useCallback(() => {
    dirtyFormTrackerMapRef.current = {};
  }, []);

  useEffect(() => {
    if (wizardOpen && importRef.current) {
      setTimeout(() => importRef.current.focus(), 200);
    }
  }, [wizardOpen]);

  const { updateTranslationHandler } = useTranslationUpdater();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveAction, setSaveAction] = useState(null);

  const checkForUnsavedChanges = action => {
    if (Object.keys(dirtyFormTrackerMapRef.current).length > 0) {
      setIsModalOpen(true);
      setSaveAction(() => action);
    } else {
      action();
    }
  };

  const handleSaveBtnAction = () => {
    if (Object.keys(dirtyFormTrackerMapRef.current).length > 0) {
      updateTranslationHandler(centerId, selectedLocale, transformObjectToArray(dirtyFormTrackerMapRef.current));
      saveAction();
    }
    clearDirtyFormTracker();
    setIsModalOpen(false);
  };

  const handleDoNotSaveBtnAction = () => {
    saveAction();
    setIsModalOpen(false);
    clearDirtyFormTracker();
  };

  // Action Menu Data
  const [showActionConfirmation, setActionConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const [confirmationAction, setConfirmationAction] = useState(null);

  // Action Menu Client Calls
  const [resetTranslationsMutation] = useMutation(RESET_TRANSLATIONS);
  const resetTranslations = useCallback(async () => {
    resetTranslationsMutation({
      variables: {
        input: {
          hubId: centerId,
          locale: selectedLocale,
          type: selectedType
        }
      },
      onCompleted: () => {
        setActionConfirmation(false); // close the modal
        clearDirtyFormTracker();
      },
      onError: () => {
        setActionConfirmation(false);
      },
      refetchQueries: ['getTranslations']
    });
  }, [centerId, selectedLocale, resetTranslationsMutation, selectedType, clearDirtyFormTracker]);

  const [fetchImportHistory, { data: importHistory, loading: importHistoryLoading }] = useLazyQuery(
    getFileImportHistory,
    {
      variables: {
        hubId: centerId,
        fileImportHistoryInput: { schemaName: TRANSLATION_IMPORT_SCHEMA, locale: selectedLocale }
      },
      fetchPolicy: 'cache-and-network'
    }
  );

  const headerBreadCrumbs: React.JSX.Element = (
    <Breadcrumbs>
      <Crumb href={VIDEO_HUBS_URL}>{translate('video_hubs_header_title')}</Crumb>
      <Crumb
        href={
          hubOverviewFeature
            ? HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)
            : VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)
        }
      >
        {centerTitle}
      </Crumb>
      <Crumb onClick={() => checkForUnsavedChanges(goBack)}>{translate('language_management_side_nav_text')}</Crumb>
      {!showLocalesListTable && (
        <Crumb href={LANGUAGE_MANAGEMENT_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)}>{selectedLocaleTitle}</Crumb>
      )}
    </Breadcrumbs>
  );

  const goBack = () => {
    setSelectedFilterByType(TranslationTypes.customKeys);
    setSelectedType(TranslationTypes.customKeys);
    setSearchedTranslation('');
    setShowLocalesListTable(true);
    setDisplaySuccess(false);
    setSuccessMessage('');
    setSelectedType(TranslationTypes.customKeys);
  };

  const updateTab = () => {
    setSelectedType(selectedTypeTemp);
    setSearchedTranslation('');
  };

  const handleTabUpdate = val => {
    selectedTypeTemp = val;
    checkForUnsavedChanges(updateTab);
  };

  const onExport = (locale?: string) => {
    let sortColumnOverride;
    if (sortColumn) {
      sortColumnOverride = sortColumn === 'itemId' ? 'id' : sortColumn;
    } else if (!sortColumn) {
      sortColumnOverride = selectedType === TranslationTypes.customKeys ? 'type' : 'id';
    }
    const params = new URLSearchParams();
    params.set('hubId', `${centerId}`);
    params.set('locale', `${locale || selectedLocale}`);
    params.set('sort', `${sortColumnOverride}:${sortDirection}`);
    const downloadLink = document.createElement('a');
    downloadLink.href = `${LANGUAGE_MANAGEMENT_TRANSLATION_EXPORT}?${params}`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  const Space = useMemo(() => <span css={{ width: '0.625rem' }} />, []);

  const headerActions = [
    {
      value: translate('language_management_back_link'),
      onClick: () => {
        checkForUnsavedChanges(goBack);
      }
    },
    {
      value: translate('language_management_reset_action'),
      onClick: () => {
        setConfirmationAction(() => resetTranslations);
        setConfirmationMessage(translate('language_management_confirm_reset_custom_text'));
        setActionConfirmation(true);
      }
    },
    {
      value: translate('language_management_export_action'),
      onClick: onExport
    }
  ];

  const headerActionsForImport: ActionType[] = [
    {
      value: translate('language_management_back_link'),
      onClick: () => {
        checkForUnsavedChanges(goBack);
      }
    },
    {
      value: translate('language_management_export_text'),
      label: (
        <div
          {...injectTestId('language-management-export')}
          css={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <UploadIcon size="s" />
          {Space}
          <div>{translate('language_management_export_text')}</div>
        </div>
      ),
      onClick: onExport
    },
    {
      value: translate('language_management_import_text'),
      label: (
        <div
          {...injectTestId('language-management-import')}
          css={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <DownloadIcon size="s" />
          {Space}
          <div>{translate('language_management_import_text')}</div>
        </div>
      ),
      onClick: () => {
        setWizardOpen(true);
        setDisplaySuccess(false);
      }
    },
    {
      value: translate('language_management_revert_action'),
      label: (
        <div
          {...injectTestId('language-management-revert')}
          css={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <UndoIcon size="s" />
          {Space}
          <div> {translate('language_management_revert_action')}</div>
        </div>
      ),
      onClick: () => {
        setConfirmationAction(() => resetTranslations);
        setConfirmationMessage(translate('language_management_confirm_reset_custom_text'));
        setActionConfirmation(true);
      }
    },
    {
      value: translate('language_management_view_history_action'),
      label: (
        <div
          {...injectTestId('language-management-import-history')}
          css={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <LoadPreviousIcon size="s" />
          {Space}
          <div> {translate('language_management_view_history_action')}</div>
        </div>
      ),
      onClick: () => {
        fetchImportHistory();
        setOpenImportHistory(true);
      }
    }
  ];

  const pageTitle = showLocalesListTable
    ? translate('language_management_page_title')
    : translate('language_management_locale_page_title', { locale: selectedLocaleTitle });

  let actions = null;
  if (!showLocalesListTable) {
    actions = languageManagementImportFeature ? headerActionsForImport : headerActions;
  }

  const LanguageManagementHeader: React.JSX.Element = (
    <Header
      testID="language-management-locale-page"
      title={pageTitle}
      breadCrumbs={headerBreadCrumbs}
      actions={actions}
      moreActionsText={languageManagementImportFeature && translate('language_management_actions_button_text')}
    />
  );

  const ImportWizardHeader: React.JSX.Element = (
    <Header testID="import-wizard-page" title={translate('language_management_import_text')} />
  );

  if (wizardOpen) {
    return (
      <ScrollViewWithBars header={ImportWizardHeader} tabIndex={0} forwardScrollViewRef={importRef}>
        <LanguageManagementImportWizard
          onWizardOpen={setWizardOpen}
          centerId={centerId}
          setDisplaySuccess={setDisplaySuccess}
          setSuccessMessage={setSuccessMessage}
          selectedLocale={selectedLocale}
          setOpenImportHistory={setOpenImportHistory}
          fetchImportHistory={fetchImportHistory}
        />
      </ScrollViewWithBars>
    );
  }

  if (openImportHistory) {
    return (
      <Modal
        format="fullscreen"
        isOpen
        testID="import-history-modal"
        portal
        onDismiss={() => {
          setOpenImportHistory(false);
        }}
      >
        <LanguageManagementImportHistory
          importHistory={importHistory?.fileImportHistory}
          setOpenImportHistory={setOpenImportHistory}
          setDisplaySuccess={setDisplaySuccess}
          setSuccessMessage={setSuccessMessage}
          loading={importHistoryLoading}
        />
      </Modal>
    );
  }

  return (
    <>
      <ScrollViewWithBars header={LanguageManagementHeader}>
        {showLocalesListTable ? (
          <LocalesListWrapper
            centerId={centerId}
            setShowLocalesListTable={setShowLocalesListTable}
            setSelectedLocale={setSelectedLocale}
            setSelectedLocaleTitle={setSelectedLocaleTitle}
            onExport={onExport}
            setWizardOpen={setWizardOpen}
          />
        ) : (
          <TabsContextProvider value={selectedType}>
            <Tabs
              onUpdate={handleTabUpdate}
              options={[
                { label: translate('language_management_original_text_tab'), value: TranslationTypes.customKeys },
                { label: translate('language_management_phrase_text_tab'), value: TranslationTypes.phraseAppKeys }
              ]}
              testID="translation-table"
            />
            <TabsPanel value={TranslationTypes.customKeys} css={{ height: '100%' }}>
              <TranslationTable
                translationType={TranslationTypes.customKeys}
                locale={selectedLocale}
                centerId={centerId}
                title={translate('language_management_original_text_title')}
                subTitle={translate('language_management_original_text_subtitle')}
                dirtyFormTrackerMapRef={dirtyFormTrackerMapRef}
                setDirtyFormTrackerMapRef={setDirtyFormTrackerMapRef}
                checkForUnsavedChanges={checkForUnsavedChanges}
                searchedTranslation={searchedTranslation}
                setSearchedTranslation={setSearchedTranslation}
                sortColumn={sortColumn}
                setSortColumn={setSortColumn}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                selectedFilterByType={selectedFilterByType ?? TranslationTypes.customKeys}
                setSelectedFilterByType={setSelectedFilterByType}
                displaySuccess={displaySuccess}
                successMessage={successMessage}
                setDisplaySuccess={setDisplaySuccess}
                pageLimit={pageLimit}
                setPageLimit={setPageLimit}
              />
            </TabsPanel>
            <TabsPanel value={TranslationTypes.phraseAppKeys} css={{ height: '100%' }}>
              <TranslationTable
                translationType={TranslationTypes.phraseAppKeys}
                locale={selectedLocale}
                centerId={centerId}
                title={translate('language_management_phrase_text_title')}
                subTitle={translate('language_management_phrase_text_subtitle')}
                dirtyFormTrackerMapRef={dirtyFormTrackerMapRef}
                setDirtyFormTrackerMapRef={setDirtyFormTrackerMapRef}
                checkForUnsavedChanges={checkForUnsavedChanges}
                searchedTranslation={searchedTranslation}
                setSearchedTranslation={setSearchedTranslation}
                sortColumn={sortColumn}
                setSortColumn={setSortColumn}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                selectedFilterByType={TranslationTypes.phraseAppKeys}
                setSelectedFilterByType={setSelectedFilterByType}
                displaySuccess={displaySuccess}
                successMessage={successMessage}
                setDisplaySuccess={setDisplaySuccess}
                pageLimit={pageLimit}
                setPageLimit={setPageLimit}
              />
            </TabsPanel>
          </TabsContextProvider>
        )}
      </ScrollViewWithBars>

      {showActionConfirmation && (
        <ConfirmationModal
          header={translate('language_management_confirm_reset_header')}
          content={confirmationMessage}
          cancelText={translate('language_management_cancel_reset_button')}
          confirmationText={translate('language_management_confirm_reset_button')}
          confirmationAction={confirmationAction}
          setIsModalOpen={setActionConfirmation}
        />
      )}
      <CheckConfirmationModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        saveAction={handleSaveBtnAction}
        cancelAction={handleDoNotSaveBtnAction}
      />
    </>
  );
}

export default LanguageManagement;
