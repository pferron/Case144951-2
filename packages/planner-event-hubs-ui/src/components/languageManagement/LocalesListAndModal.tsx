import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@cvent/carina/components/Button';
import { CheckboxGroup } from '@cvent/carina/components/Checkbox';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import Modal from '@cvent/carina/components/Modal';
import DismissButton from '@cvent/carina/components/ScrollViewWithBars/DismissButton';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import { useTheme } from '@cvent/carina/components/ThemeProvider';
import { accountLocale } from '@cvent/planner-event-hubs-model/operations/coreSOA';
import { addHubLocales, hubLocales } from '@cvent/planner-event-hubs-model/operations/hub';
import { useMeasurePageLoad, usePageActions } from '@cvent/sli-nextjs-metrics';
import { CSSObject } from '@emotion/react';
import { useTranslate } from 'nucleus-text';
import React, { useMemo, useState } from 'react';
import LocalesListTable from './LocalesListTable';

const useStyles = (): CSSObject => {
  const { font } = useTheme();

  return {
    modalWrapper: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    modalContainer: {
      padding: '1.5rem',
      paddingTop: '0.5rem',
      maxHeight: '90vh'
    },
    modalTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    subTitle: {
      color: font.color.soft,
      marginTop: 0
    },
    btnContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '1rem',
      paddingTop: '0.5rem',
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

function LocalesListAndModal({
  centerId,
  setShowLocalesListTable,
  setSelectedLocale,
  setSelectedLocaleTitle,
  onExport,
  setWizardOpen
}: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const [openAddLanguageModal, setOpenAddLanguageModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedLocalesCount, setSelectedLocalesCount] = useState(0);
  const styles = useStyles();
  const { getBaseProps } = usePageActions();
  const baseProps = getBaseProps();

  // fetch Supported Hub Locales
  const {
    loading: hublocalesLoading,
    data: hubLocalesList,
    refetch: refetchHubLocales,
    error
  } = useQuery(hubLocales, {
    variables: {
      id: {
        id: centerId
      }
    },
    onCompleted: data => {
      setSelected(() => data?.getHubLocales?.data.map(val => val.locale));
      setSelectedLocalesCount(() => data?.getHubLocales?.data?.length);
    },
    fetchPolicy: 'cache-and-network'
  });

  const localesInhub = hubLocalesList?.getHubLocales?.data;

  // fetch Supported Hub Locales
  const { data: accountSupportedLocales, loading: loadingAccountLocales } = useQuery(accountLocale);

  // Page load metrics
  useMeasurePageLoad({
    pageIsLoading: (): boolean => hublocalesLoading || loadingAccountLocales,
    pageError: () => error,
    data: { ...baseProps }
  });

  const { options: transformedOptions, langMap: languageMap } = useMemo(() => {
    const options = [];
    const langMap = {};
    const disabledLocales = new Set(localesInhub?.map(item => item.locale));
    accountSupportedLocales?.accountLocale?.forEach(item => {
      langMap[item.Locale.CultureCode] = item.Locale.CountryLanguage;
      options.push({
        value: item.Locale.CultureCode,
        label: item.Locale.CountryLanguage,
        disabled: disabledLocales.has(item.Locale.CultureCode)
      });
    });
    return { options, langMap };
  }, [accountSupportedLocales, localesInhub]);

  const [addLocalesToHub] = useMutation(addHubLocales);

  const handleOnClickAdd = () => {
    if (selectedLocalesCount !== selected.length) {
      addLocalesToHub({
        variables: {
          id: { id: centerId },
          hubLocales: {
            data: selected
          }
        },
        onCompleted: () => {
          setOpenAddLanguageModal(false);
          refetchHubLocales();
        }
      });
    }
  };

  const languageModalFooter: React.JSX.Element = (
    <div css={styles.btnContainer}>
      <Button
        appearance="ghost"
        onClick={() => setOpenAddLanguageModal(false)}
        text={translate('language_management_locales_modal_cancel_btn')}
        aria-label={translate('language_management_locales_modal_cancel_btn_accessibility')}
        testID="locale-list-modal-cancel-btn"
      />
      <Button
        appearance="filled"
        text={translate('language_management_locales_modal_add_btn')}
        onClick={handleOnClickAdd}
        disabled={selectedLocalesCount === selected.length}
        aria-label={translate('language_management_locales_modal_add_btn_accessibility')}
        testID="locale-list-modal-add-btn"
      />
    </div>
  );

  return (
    <>
      <div css={styles.modalWrapper}>
        <h3>{translate('language_management_languages_list_title')}</h3>
        <Button
          text={translate('language_management_add_language_btn')}
          appearance="lined"
          testID="add-language-btn"
          onClick={() => setOpenAddLanguageModal(true)}
        />
      </div>
      {openAddLanguageModal && (
        <Modal
          format="s"
          isOpen={openAddLanguageModal}
          testID="add-locales-modal"
          portal
          aria-label={translate('language_management_locales_modal_title')}
          onDismiss={() => {
            setOpenAddLanguageModal(false);
          }}
        >
          <ScrollViewWithBars footer={languageModalFooter}>
            <div css={styles.modalContainer}>
              <div css={styles.modalTitle}>
                <h3>{translate('language_management_locales_modal_title')}</h3>
                <DismissButton aria-label="close" onClick={() => setOpenAddLanguageModal(false)} />
              </div>
              <p css={styles.subTitle}>{translate('language_management_locales_modal_subTitle')}</p>
              <CheckboxGroup
                name="localesList"
                labelText=""
                testID="form-locale-checkbox-group"
                options={transformedOptions}
                selected={selected}
                onUpdate={selection => setSelected(selection)}
              />
            </div>
          </ScrollViewWithBars>
        </Modal>
      )}
      {hublocalesLoading ? (
        <LoadingSpinner
          size="m"
          testID="loading-locales-list"
          aria-label={translate('language_management_locale_list_loading_accessibility')}
        />
      ) : (
        <LocalesListTable
          tableData={localesInhub}
          languageMap={languageMap}
          setShowLocalesListTable={setShowLocalesListTable}
          setSelectedLocale={setSelectedLocale}
          setSelectedLocaleTitle={setSelectedLocaleTitle}
          onExport={onExport}
          setWizardOpen={setWizardOpen}
        />
      )}
    </>
  );
}
export default LocalesListAndModal;
