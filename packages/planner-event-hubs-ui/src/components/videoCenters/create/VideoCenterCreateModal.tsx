import React, { useState } from 'react';
// TODO: Restore when fixed by Carina - BackNavigationButton,
import { BackNavigationButton, DismissButton } from '@cvent/carina/components/ScrollViewWithBars';
import { Button } from '@cvent/carina/components/Button';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { ConfigInput } from '@cvent/planner-event-hubs-model/types';
import { Form } from '@cvent/carina/components/Forms';
import { CreateModalStyles } from '@components/videoCenters/style';
import InformationFields from '@components/videoCenters/information/InformationFields';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { HubCreate } from '@cvent/planner-event-hubs-model/operations';
import Modal from '@cvent/carina/components/Modal';
import { PageAlert } from '@cvent/carina/components/Alert';
import useBreakpoints from '@hooks/useBreakpoints';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import { HUB_OVERVIEW_URL, VIDEO_HUB_INFORMATION_URL, VIDEO_HUB_PATH_PARAM_KEY } from '@utils/constants';
import { CREATE_VIDEO_HUB } from '@cvent/planner-event-hubs-model/operations/hub';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { useEventsPlusHubPageActionsApi } from '@metrics/client/react/useEventsPlusHubPageActionsApi';

interface CreateModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (close: boolean) => void;
  refetchVideoCenters: () => void;
  defaultLanguage: string;
}

function VideoCenterCreateModal({ isModalOpen, setIsModalOpen, defaultLanguage }: CreateModalProps): JSX.Element {
  const { translate } = useTranslate();
  const { container, navHeader, modalHeader, alertContainer, videoCenterCard, formContainer } =
    useStyle(CreateModalStyles);
  const { isS } = useBreakpoints();
  const closeModal = (): void => {
    setIsModalOpen(false);
  };
  const [showAlert, setShowAlert] = useState(false);
  const initialValues: ConfigInput = {
    locale: defaultLanguage
  };
  const { hubOverviewFeature } = useAppFeatures();
  const { createEventsplusHubButtonClicked } = useEventsPlusHubPageActionsApi();

  const router = useRouter();
  const [createVideoHub] = useMutation(CREATE_VIDEO_HUB);
  const submitCreateVideoHub = (event, submission): void => {
    if (submission.hasErrors) {
      setShowAlert(true);
    } else {
      const newHubData: HubCreate = {
        config: submission.values,
        theme: {
          mainColor: '#1C1C1D',
          actionColor: '#388BE8',
          backgroundColor: '#121212',
          logoAltText: translate('logo_image_alt_text_default')
        }
      };
      createVideoHub({
        variables: { hubUpdate: newHubData },
        onCompleted: ({ hubCreate }) => {
          const redirection = hubOverviewFeature
            ? HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, hubCreate)
            : VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, hubCreate);
          router.push({
            pathname: redirection
          });
        }
      });

      createEventsplusHubButtonClicked({
        hubName: submission?.values?.title,
        eventHubLanguageSelected: submission?.values?.locale,
        hubOwnerFirstName: submission?.values?.ownerFirstName,
        hubOwnerLastName: submission?.values?.ownerLastName,
        hubOwnerEmail: submission?.values?.ownerEmail,
        triggerLocation: 'New Events+ Hub creation modal'
      });
      setIsModalOpen(false);
    }
  };

  return (
    <Modal format="fullscreen" isOpen={isModalOpen} onDismiss={closeModal} portal testID="video-hub-create-modalId">
      <div css={container}>
        <div css={navHeader}>
          <BackNavigationButton
            testID="video-hub-create-modal-back"
            onClick={closeModal}
            aria-label={translate('universal_back')}
            id="video-hub-create-modal-header-back-button"
          />
          <DismissButton {...injectTestId('video-hub-close-create-modal')} aria-label="close" onClick={closeModal} />
        </div>
        <div css={videoCenterCard}>
          <div css={modalHeader}>
            <h2 {...injectTestId('video-hub-create-modal-title')}>{translate('video_hub_create_modal_title')}</h2>
            <p {...injectTestId('video-hub-create-modal-subtitle')}>{translate('video_hub_create_modal_subtitle')}</p>
          </div>
          {showAlert && (
            <div css={alertContainer}>
              <PageAlert
                appearance="danger"
                id="1"
                content={translate('video_hub_alert_validation_error')}
                dismissible
                onDismiss={() => setShowAlert(false)}
                isRtl={false}
                testID="video-hub-alert-form-error"
              />
            </div>
          )}
          <Form initialValues={initialValues} initializationMode="reinitialize" onSubmit={submitCreateVideoHub}>
            <div css={formContainer}>
              <InformationFields />
            </div>
            <Row margin={isS ? 16 : 0} justifyContent="flex-end">
              <Col width="content" padding={0}>
                <Button
                  type="submit"
                  text={translate('video_hub_create_modal_submit_button_text')}
                  accessibilityLabel={translate('video_hub_create_modal_submit_button_text')}
                  appearance="filled"
                  testID="video-hub-create-save-button"
                />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </Modal>
  );
}

export default VideoCenterCreateModal;
