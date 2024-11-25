import React from 'react';
import { BannerTemplatesStyle } from '@components/videoCenters/style';
import DismissButton from '@cvent/carina/components/ScrollViewWithBars/DismissButton';
import { ExistingBanner } from '@cvent/planner-event-hubs-model/types';
import { Form } from '@cvent/carina/components/Forms/Form';
import { injectTestId } from '@cvent/nucleus-test-automation';
import Modal from '@cvent/carina/components/Modal';
import { omit } from 'lodash';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import useBreakpoints from '@hooks/useBreakpoints';
import useQueryParams from '@hooks/useQueryParam';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import { useMutation, useQuery } from '@apollo/client';
import { VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { UPDATE_BANNER_MUTATION, GET_BANNERS } from '@cvent/planner-event-hubs-model/operations/banner';
import BannerNameField from './formSections/BannerNameField';
import { BANNER_NAME_FIELD } from './BannerConstants';

type BannerEditNameModalProps = {
  showEditNameModal: boolean;
  onDismiss: () => void;
  bannerData: ExistingBanner;
};

function BannerEditNameModal({
  showEditNameModal,
  onDismiss,
  bannerData
}: BannerEditNameModalProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { modalHeader, modalHeaderTitle, modalContent } = useStyle(BannerTemplatesStyle);
  const { isS } = useBreakpoints();

  const query = useQueryParams();
  const centerId = query[VIDEO_HUB_PATH_PARAM] as string;
  const initialBannerName = bannerData?.name;

  // Save banner name
  const [updateBannerMutation] = useMutation(UPDATE_BANNER_MUTATION);
  const onUpdateBannerName = async (event, { values, dirty, hasErrors }) => {
    if (dirty && !hasErrors) {
      const newBanner = {
        ...bannerData,
        name: values[BANNER_NAME_FIELD]
      };
      const bannerToSave = omit(newBanner, ['__typename', 'button.__typename', 'text.__typename']);
      updateBannerMutation({
        variables: { input: bannerToSave },
        onCompleted: () => {
          onDismiss();
        }
      });
    }
    if (!dirty && !hasErrors) {
      onDismiss();
    }
  };

  // List of current banner names for duplicate name check
  const { data } = useQuery(GET_BANNERS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      bannerFilter: {
        centerId,
        filterInput: {}
      }
    }
  });
  const currentBannerNames = data?.banners.data.map(banner => banner.name);
  const currentNamesRemoveSelf = currentBannerNames?.filter(name => name !== initialBannerName);

  const bannerEditHeader: React.JSX.Element = (
    <div css={modalHeader}>
      <h1 css={modalHeaderTitle} {...injectTestId('template-selection-modal-header')}>
        {translate('Banners-Name-Selection-Title')}
      </h1>
      <div>
        <DismissButton aria-label={translate('Banners-Template-Selection-Close-Button')} onClick={onDismiss} />
      </div>
    </div>
  );

  return (
    <Modal
      format={isS ? 'fullscreen' : 'l'}
      css={modalContent}
      isOpen={showEditNameModal}
      testID="banners-edit-banner-name"
      portal
      aria-label={translate('Banners-Name-Selection-Title')}
    >
      <ScrollViewWithBars header={bannerEditHeader}>
        <Form
          name="bannerNameEdit"
          initialValues={{ [BANNER_NAME_FIELD]: initialBannerName }}
          initializationMode="reinitialize"
          testID="banner-name-form"
          onSubmit={onUpdateBannerName}
        >
          <div css={modalContent}>
            <BannerNameField
              secondaryButtonText={translate('cancel_button')}
              saveButtonText={translate('Banner-Name-Save-Button')}
              onDismiss={onDismiss}
              currentNames={currentNamesRemoveSelf}
            />
          </div>
        </Form>
      </ScrollViewWithBars>
    </Modal>
  );
}

export default BannerEditNameModal;
