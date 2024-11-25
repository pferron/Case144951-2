import React, { Dispatch, SetStateAction } from 'react';
import { Modal } from '@cvent/carina/components/Modal';
import { Form } from '@cvent/carina/components/Forms';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { CreateChannelModalStyles } from '@components/channels/style';
import { injectTestId } from '@cvent/nucleus-test-automation';
import useBreakpoints from '@hooks/useBreakpoints';
import DismissButton from '@cvent/carina/components/ScrollViewWithBars/DismissButton';
import { UtmOverride } from '@cvent/planner-event-hubs-model/types';
import { ParameterFormData } from './ParameterFormData';

function AddTrackingParameterModal({
  isModalOpen,
  setIsModalOpen,
  trackingParamsList,
  setTrackingParametersList,
  setIsEdited,
  setSubmittedParams,
  submittedParams,
  setIsPageEdited,
  editParametersKeyAndValue,
  setEditParametersKeyAndValue
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const { isS, isM } = useBreakpoints();
  const { container, headerStyle } = useStyle(CreateChannelModalStyles);
  const submit = (_event, submission): void => {
    const { values } = submission;
    let updatedList;
    if (trackingParamsList.some(param => param.key === editParametersKeyAndValue.key)) {
      // If the key already exists, update the value
      updatedList = trackingParamsList.map(param => {
        if (param.key === editParametersKeyAndValue.key) {
          return { key: values.key, value: values.value };
        }
        return param;
      });
    } else {
      // If the key doesn't exist, add a new object to the list
      updatedList = [...trackingParamsList, { key: values.key, value: values.value }];
    }

    setTrackingParametersList(updatedList);
    setIsModalOpen(false);
    setSubmittedParams(true);
    setIsPageEdited(true);
    setEditParametersKeyAndValue({ key: '', value: '' });
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setIsPageEdited(false);
    setEditParametersKeyAndValue({ key: '', value: '' });
  };

  const currentKeyList = trackingParamsList.map(param => param.key);
  const modalHeaderLabel =
    editParametersKeyAndValue.key === ''
      ? 'add_tracking_parameters_modal_header'
      : 'edit_tracking_parameters_modal_header';
  return (
    <Modal
      format={(isS && 's') || (isM && 'm') || 'l'}
      isOpen={isModalOpen}
      onDismiss={closeModal}
      portal
      testID="add-or-edit-parameters-modal"
      aria-label={translate(modalHeaderLabel)}
    >
      <div css={container}>
        <div css={headerStyle}>
          <h3 {...injectTestId('add-or-edit-parameters-modal-header')}>{translate(modalHeaderLabel)}</h3>
          <DismissButton {...injectTestId('close-add-parameter-modal')} aria-label="close" onClick={closeModal} />
        </div>
        <Form
          onSubmit={submit}
          initialValues={{ key: editParametersKeyAndValue?.key, value: editParametersKeyAndValue.value }}
        >
          <ParameterFormData
            onCancel={closeModal}
            setIsEdited={setIsEdited}
            currentKeyList={currentKeyList}
            submittedParams={submittedParams}
            setSubmittedParams={setSubmittedParams}
            editParametersKeyAndValue={editParametersKeyAndValue}
          />
        </Form>
      </div>
    </Modal>
  );
}

interface Props {
  setIsEdited: (isPageEdited: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (close: boolean) => void;
  trackingParamsList: Array<UtmOverride>;
  setTrackingParametersList: Dispatch<SetStateAction<UtmOverride[]>>;
  setSubmittedParams: (add: boolean) => void;
  submittedParams: boolean;
  setIsPageEdited: (isPageEdited: boolean) => void;
  editParametersKeyAndValue: { key: string; value: string };
  setEditParametersKeyAndValue: Dispatch<SetStateAction<{ key: string; value: string }>>;
}

export default AddTrackingParameterModal;
