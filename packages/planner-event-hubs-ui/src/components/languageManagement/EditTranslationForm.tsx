import { ApolloError } from '@apollo/client';
import { Button } from '@cvent/carina/components/Button';
import FormElement from '@cvent/carina/components/FormElement';
import { useFormContext, useWatchDirty, useWatchField } from '@cvent/carina/components/Forms';
import { Textarea } from '@cvent/carina/components/Forms/BasicFields/Textarea';
import { Form } from '@cvent/carina/components/Forms/Form';
import { CheckIcon, XIcon } from '@cvent/carina/components/Icon';
import { Translation } from '@cvent/planner-event-hubs-model/types';
import { CSSObject } from '@emotion/react';
import useTranslationUpdater from '@hooks/useUpdateTranslation';
import { useTranslate } from 'nucleus-text';
import { RefObject } from 'react';

import { TrackerType } from './LanguageManagement';

const useStyles = (): CSSObject => ({
  customStyles: {
    '& fieldset': {
      top: '-0.2rem',
      height: '100%'
    },
    '& textarea': {
      borderRadius: '0.375rem'
    }
  },
  btnContainer: {
    display: 'flex',
    marginLeft: 8,
    gap: 4,
    flexWrap: 'wrap'
  }
});

interface FormActionProps {
  formValue: Translation & { itemId: string };
}

// Buttons in Form
function FormActionButtons({ formValue }: FormActionProps) {
  const { setValue } = useFormContext();
  const { translate } = useTranslate();

  const handleOnCancel = () => {
    const newValue = formValue.translatedValue || '';
    setValue(formValue.id, newValue);
  };
  const styles = useStyles();
  return (
    <div css={styles.btnContainer}>
      <Button
        appearance="ghost"
        onClick={handleOnCancel}
        text=""
        icon={XIcon}
        aria-label={translate('language_management_cancel_translation_btn_accessibility')}
      />
      <Button
        appearance="ghost"
        icon={CheckIcon}
        type="submit"
        text=""
        aria-label={translate('language_management_save_translation_btn_accessibility')}
      />
    </div>
  );
}

interface FormTextProps {
  formValue: Translation & { itemId: string };
  dirtyFormTrackerMapRef: RefObject<TrackerType>;
  setDirtyFormTrackerMapRef: (val: TrackerType | object) => void;
  locale: string;
  error?: ApolloError;
  setIsPageEdited: (isPageEdited: boolean) => void;
}
// Textarea in Form
function FormTextArea({
  formValue,
  dirtyFormTrackerMapRef,
  locale,
  error,
  setDirtyFormTrackerMapRef,
  setIsPageEdited
}: FormTextProps) {
  const wathcingField = useWatchField([formValue.id]);
  const dirty = useWatchDirty();
  const styles = useStyles();

  const { translate } = useTranslate();
  if (dirty) {
    const newTrackerMap = {
      ...dirtyFormTrackerMapRef.current,
      [formValue.id]: {
        type: formValue.type,
        locale,
        id: formValue.itemId,
        translatedValue: (wathcingField[formValue.id] as string)?.trim() || null
      }
    };
    setDirtyFormTrackerMapRef(newTrackerMap);
    setIsPageEdited(true);
  } else if (Object.hasOwn(dirtyFormTrackerMapRef.current, formValue.id)) {
    const newTrackerMap = { ...dirtyFormTrackerMapRef.current };
    delete newTrackerMap[formValue.id];
    setDirtyFormTrackerMapRef(newTrackerMap);

    if (Object.keys(newTrackerMap).length === 0) {
      setIsPageEdited(false);
    }
  }
  return (
    <div css={styles.customStyles}>
      <Textarea
        id={`${formValue.id}-text`}
        name={formValue.id}
        label=""
        aria-label={translate('language_management_edit_area_accessibility')}
      />
      {dirty && !error && (
        <div>
          <FormElement.Message text={translate('language_management_form_save_your_changes_message')} type="error" />
        </div>
      )}
    </div>
  );
}
interface EditFormProps {
  value: Translation & { itemId: string };
  centerId: string;
  locale: string;
  dirtyFormTrackerMapRef: RefObject<TrackerType>;
  setShowErrorInSavingAlert: (val: boolean) => void;
  setDirtyFormTrackerMapRef: (val: TrackerType | object) => void;
  setIsPageEdited: (isPageEdited: boolean) => void;
}

function EditTranslationForm({
  value,
  centerId,
  locale,
  dirtyFormTrackerMapRef,
  setShowErrorInSavingAlert,
  setDirtyFormTrackerMapRef,
  setIsPageEdited
}: EditFormProps): JSX.Element {
  const intialFormValues = {
    ...value,
    [value.id]: value.translatedValue || ''
  };
  const onErrorWhileSaving = () => {
    setShowErrorInSavingAlert(true);
  };
  const { translate } = useTranslate();

  const { updateTranslationHandler, showSavedMessage, saving, error } = useTranslationUpdater(null, onErrorWhileSaving);
  const handleOnSubmit = (_event, { values, dirty, hasErrors, resetForm }) => {
    if (dirty && !hasErrors) {
      updateTranslationHandler(centerId, locale, [
        {
          type: values.type,
          locale,
          id: values.itemId,
          translatedValue: values[values.id].trim() || null
        }
      ]);
    }
    if (value.translatedValue === null && values[values.id].trim() === '') {
      resetForm();
    }
  };

  return (
    <Form
      onSubmit={handleOnSubmit}
      initialValues={intialFormValues}
      css={{ display: 'flex' }}
      initializationMode="reinitialize"
    >
      <div css={{ flexGrow: 1 }}>
        <FormTextArea
          formValue={value}
          dirtyFormTrackerMapRef={dirtyFormTrackerMapRef}
          locale={locale}
          error={error}
          setDirtyFormTrackerMapRef={setDirtyFormTrackerMapRef}
          setIsPageEdited={setIsPageEdited}
        />
        {error && (
          <div>
            <FormElement.Message text={translate('language_management_form_error_message')} type="error" />
          </div>
        )}
      </div>
      <div css={{ minWidth: '20%' }}>
        {showSavedMessage && (
          <div css={{ padding: '0.5rem 1rem 1rem' }}>{translate('language_management_form_saved_message')}</div>
        )}
        {saving && (
          <div css={{ padding: '0.5rem 1rem 1rem' }}>{translate('language_management_form_saving_message')}</div>
        )}
        {!saving && !showSavedMessage && <FormActionButtons formValue={value} />}
      </div>
    </Form>
  );
}

export default EditTranslationForm;
