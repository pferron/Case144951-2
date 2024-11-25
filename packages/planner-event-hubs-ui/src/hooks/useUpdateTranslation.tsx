import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { SET_TRANSLATIONS } from '@cvent/planner-event-hubs-model/operations/languageManagement';

const SHOW_SAVED_MESSAGE_INTERVAL = 1000;

const useTranslationUpdater = (onCompletedCallback = null, onErrorCallback = null) => {
  const [updateTranslation, { loading: saving, error }] = useMutation(SET_TRANSLATIONS);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [showErrorInSavingAlert, setShowErrorInSavingAlert] = useState(false);

  const updateTranslationHandler = (centerId, locale, translatedData) => {
    updateTranslation({
      variables: {
        input: {
          id: centerId
        },
        locale,
        data: translatedData
      },
      onCompleted: () => {
        setShowSavedMessage(true);
        setTimeout(() => {
          setShowSavedMessage(false);
        }, SHOW_SAVED_MESSAGE_INTERVAL);

        if (onCompletedCallback) {
          onCompletedCallback();
        }
      },
      onError: () => {
        setShowErrorInSavingAlert(true);

        if (onErrorCallback) {
          onErrorCallback();
        }
      }
    });
  };

  return {
    updateTranslationHandler,
    saving,
    error,
    showSavedMessage,
    showErrorInSavingAlert
  };
};

export default useTranslationUpdater;
