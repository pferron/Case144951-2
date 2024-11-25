import React from 'react';
import { Modal } from '@cvent/carina/components/Modal';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { Form } from '@cvent/carina/components/Forms';
import { injectTestId } from '@cvent/nucleus-test-automation';
import useBreakpoints from '@hooks/useBreakpoints';
import DismissButton from '@cvent/carina/components/ScrollViewWithBars/DismissButton';
import { BannerPageModalStyles } from '@components/videoCenters/style';
import { HubPage } from '@cvent/planner-event-hubs-model/types';
import { PagesDropdown } from './PagesDropdown';

function BannerPagesModal({
  pagesData,
  isModalOpen,
  setSelectedPageOption,
  setIsModalOpen,
  onSave
}: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const { isS, isM } = useBreakpoints();
  const { container, headerStyle, pagesModal, titleStyle } = useStyle(BannerPageModalStyles);

  const selectPages = async (event, { values }): Promise<void> => {
    if (values.entity !== null || undefined) {
      setSelectedPageOption(values.entity);
      setIsModalOpen(false);
      onSave(values.entity);
    }
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      css={pagesModal}
      format={(isS && 's') || (isM && 'm') || 'l'}
      isOpen={isModalOpen}
      onDismiss={closeModal}
      portal
      aria-label={translate('Banners-Pages-Tab-Label')}
      testID="banner-pages-modalId"
      zIndex={1000}
      scrollLock={false}
    >
      <div css={container}>
        <div css={headerStyle}>
          <h3 css={titleStyle} {...injectTestId('Banners-Pages-Tab-Label')}>
            {translate('Banners-Pages-Tab-Label')}
          </h3>
          <DismissButton {...injectTestId('close-create-channel-modal')} aria-label="close" onClick={closeModal} />
        </div>
        <Form onSubmit={selectPages}>
          <PagesDropdown pagesData={pagesData} onCancel={closeModal} />
        </Form>
      </div>
    </Modal>
  );
}

interface Props {
  isModalOpen: boolean;
  selectedPageOption: boolean;
  pagesData: Array<HubPage>;
  setSelectedPageOption: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setIsModalOpen: (close: boolean) => void;
  onSave: (entity: string) => void;
}

export default BannerPagesModal;
