import Catalog from '@components/channels/videos/Catalog';
import React, { MutableRefObject, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ExtendedItem,
  ExtendedItemCatalog,
  ExtendedSection,
  ChannelCatalog,
  MenuActionData
} from '@components/channels/type/channelCatalog';
import {
  addVideoInSection,
  convertItemCatalogToVideoCatalog,
  createSectionWithVideos,
  EMPTY_CATALOG,
  getAndRemoveVideosFromSection,
  getDefaultSection,
  getItemIds,
  getSection,
  showSection
} from '@components/channels/videos/videoHelper';
import useItemCatalogConverter from '@components/channels/videos/useItemCatalogConverter';
import SectionModal from '@components/channels/videos/CreateSection/SectionModal';
import { SelectVideoModal, SelectedVideoType } from '@cvent/shared-upload-library';
import {
  CHANNEL_PAGE_MODAL_Z_INDEX,
  CREATE_SECTION_BANNER_VIDEO_LIMIT,
  CUSTOM_SECTION_TYPE,
  DEFAULT_SECTION_TYPE,
  MAX_ITEM_PER_PAGE_ON_SELECT_VIDEO_MODAL
} from '@utils/constants';
import { v4 } from 'uuid';
import { useTranslate } from 'nucleus-text';
import InsertSectionDialogBox from '@components/channels/videos/CreateSection/InsertSectionDialogBox';
import ConfirmationModal from '@components/common/ConfirmationModal';
import { useChannelsPageActionsApi } from '@metrics/client/react/useChannelsPageActionsApi';
import { PageAlert } from '@cvent/carina/components/Alert';

interface Props {
  videoCatalog: ChannelCatalog;
  onVideoCatalogUpdate: (videoCatalog: ChannelCatalog, setItemCatalog: (catalog: ExtendedItemCatalog) => void) => void;
  containerRef: MutableRefObject<HTMLInputElement>;
  setIsPageEdited: (isPageEdited: boolean) => void;
  isSuccess: boolean;
  setIsSuccess: (isSucces: boolean) => void;
  submitRef: MutableRefObject<HTMLButtonElement>;
}

function Videos({
  videoCatalog,
  onVideoCatalogUpdate,
  containerRef,
  setIsPageEdited,
  isSuccess,
  setIsSuccess,
  submitRef
}: Props): React.JSX.Element {
  const [itemCatalog, setItemCatalog] = useState<ExtendedItemCatalog>(null);
  const [isAddSectionModalOpen, setIsAddSectionModal] = useState<boolean>(false);
  const [isAddVideoModalOpen, setIsAddVideoModal] = useState<boolean>(false);
  const [isInsertSectionOpen, setIsInsertSectionOpen] = useState<boolean>(false);
  const [isUpdateSectionModalOpen, setIsUpdateSectionModal] = useState<boolean>(false);
  const [isDeletionSectionConfirmationModalOpen, setIsDeletionSectionConfirmationModalOpen] = useState<boolean>(false);
  const [menuActionData, setMenuActionData] = useState<MenuActionData>(null);
  const [isSectionFlyoutOpen, setIsSectionFlyoutOpen] = useState<boolean>(false);
  const convertCatalogToItemCatalog = useItemCatalogConverter(
    setItemCatalog,
    setIsInsertSectionOpen,
    setMenuActionData,
    setIsUpdateSectionModal,
    setIsDeletionSectionConfirmationModalOpen,
    setIsPageEdited
  );
  const showSections = useMemo(() => showSection(itemCatalog), [itemCatalog]);
  const { locale, translate } = useTranslate();
  const { selectVideoFromLibraryAddButtonClicked, createSectionAddButtonClicked } = useChannelsPageActionsApi();
  useEffect(() => {
    setItemCatalog(convertCatalogToItemCatalog(videoCatalog, true, showSections));
    // eslint-disable-next-line
  }, [videoCatalog]);

  const onSave = useCallback((): void => {
    setIsPageEdited(false);
    setIsSuccess(true);
    if (itemCatalog) {
      onVideoCatalogUpdate(convertItemCatalogToVideoCatalog(itemCatalog), setItemCatalog);
    }
  }, [itemCatalog, onVideoCatalogUpdate, setIsPageEdited, setIsSuccess]);

  const onDragAndDropItems = useCallback(
    (oldCatalog: ExtendedItemCatalog, updatedSections: Array<ExtendedSection>) => {
      setItemCatalog({
        ...oldCatalog,
        ...{ sections: updatedSections }
      });
      setIsPageEdited(true);
    },
    [setIsPageEdited]
  );

  const onAddSection = useCallback(
    (sectionName: string, selectedVideos: Array<string>) => {
      setIsAddSectionModal(false);
      setIsPageEdited(true);
      setItemCatalog(currentCatalog => {
        const moreVideoSection = getDefaultSection(currentCatalog);
        const { removedVideos, updatedSection } = getAndRemoveVideosFromSection(moreVideoSection, selectedVideos);
        const updatedNewSection = createSectionWithVideos(v4(), sectionName, removedVideos, CUSTOM_SECTION_TYPE);
        createSectionAddButtonClicked({
          sectionName,
          numberOfVideoAdded: selectedVideos?.length || 0
        });
        const updatedSections = [
          ...currentCatalog.sections.filter(section => section.id !== moreVideoSection.id),
          updatedNewSection,
          updatedSection
        ];

        return {
          ...currentCatalog,
          sections: updatedSections
        };
      });
    },
    [setIsPageEdited, createSectionAddButtonClicked]
  );

  const onAddVideo = useCallback(
    (selectedVideos: Array<SelectedVideoType>) => {
      setIsAddVideoModal(false);
      setIsPageEdited(true);
      setItemCatalog((catalog: ExtendedItemCatalog) => {
        const currentCatalog = catalog || EMPTY_CATALOG;
        const moreVideoSection = getDefaultSection(currentCatalog);
        const extendedItem: Array<ExtendedItem> = selectedVideos.map((selectedVideo: SelectedVideoType) => ({
          id: selectedVideo.id,
          videoId: selectedVideo.id,
          displayName: selectedVideo.title,
          thumbnail: selectedVideo?.thumbnail?.url?.href || selectedVideo.generatedThumbnail?.url?.href,
          duration: selectedVideo.duration,
          content: null
        }));
        selectVideoFromLibraryAddButtonClicked({
          numberOfVideoAdded: selectedVideos?.length || 0
        });
        const updatedNewSection = moreVideoSection
          ? addVideoInSection(moreVideoSection, extendedItem)
          : createSectionWithVideos(
              v4(),
              translate('channel_video_more_videos_label'),
              extendedItem,
              DEFAULT_SECTION_TYPE
            );

        const updatedSections = [
          ...currentCatalog.sections.filter(section => section.id !== moreVideoSection.id),
          updatedNewSection
        ];

        return {
          ...currentCatalog,
          sections: updatedSections
        };
      });
      const currentItems =
        itemCatalog?.sections?.find(section => section.sectionType === DEFAULT_SECTION_TYPE)?.items?.length || 0;
      if (
        itemCatalog?.sections?.length <= 1 &&
        currentItems < CREATE_SECTION_BANNER_VIDEO_LIMIT &&
        selectedVideos.length + currentItems >= CREATE_SECTION_BANNER_VIDEO_LIMIT
      ) {
        setIsSectionFlyoutOpen(true);
      }
    },
    [itemCatalog?.sections, setIsPageEdited, translate, selectVideoFromLibraryAddButtonClicked]
  );

  const onInsertSection = (sectionId: string, itemId: string, sectionName: string, isBefore: boolean) => {
    setIsPageEdited(true);
    setItemCatalog(catalog => {
      const currentCatalog = catalog || EMPTY_CATALOG;
      const section: ExtendedSection = getSection(catalog, sectionId);
      const sectionItems: Array<ExtendedItem> = section.items;
      const sectionIndex: number = catalog.sections.findIndex(({ id }) => id === sectionId);
      const itemIndex: number = section.items.findIndex(({ id }) => id === itemId);

      if (isBefore) {
        const extractedVideos = sectionItems.splice(0, itemIndex);
        const newSection: ExtendedSection = createSectionWithVideos(
          v4(),
          sectionName,
          extractedVideos,
          CUSTOM_SECTION_TYPE
        );
        const updatedSection: ExtendedSection = { ...section, itemCount: sectionItems.length, items: sectionItems };
        currentCatalog.sections.splice(sectionIndex, 1, newSection, updatedSection);
      } else {
        const extractedVideos = sectionItems.splice(itemIndex + 1, section.items.length - 1);
        const newSection: ExtendedSection = createSectionWithVideos(
          v4(),
          sectionName,
          extractedVideos,
          CUSTOM_SECTION_TYPE
        );
        const updatedSection: ExtendedSection = { ...section, itemCount: sectionItems.length, items: sectionItems };
        currentCatalog.sections.splice(sectionIndex, 1, updatedSection, newSection);
      }

      return { ...currentCatalog };
    });
  };

  const onEditSection = useCallback(
    (section: ExtendedSection, title: string, selectedVideos: Array<string>) => {
      setIsPageEdited(true);
      const { id: sectionId, items } = section;

      setIsAddSectionModal(false);
      setItemCatalog(currentCatalog => {
        const moreVideoSection: ExtendedSection = getDefaultSection(currentCatalog);
        const updatedMoreVideos = addVideoInSection(moreVideoSection, items);

        const { removedVideos, updatedSection } = getAndRemoveVideosFromSection(updatedMoreVideos, selectedVideos);
        const updatedNewSection = createSectionWithVideos(v4(), title, removedVideos, CUSTOM_SECTION_TYPE);

        const sectionIndex: number = currentCatalog.sections.findIndex(({ id }) => id === sectionId);
        currentCatalog.sections.splice(sectionIndex, 1, updatedNewSection);
        currentCatalog.sections.splice(currentCatalog.sections.length - 1, 1, updatedSection);

        return { ...currentCatalog };
      });
    },
    [setIsPageEdited]
  );

  const onSectionDelete = useCallback(
    (sectionId: string): void => {
      setIsPageEdited(true);
      setItemCatalog(oldItemCatalog => {
        const videoSection = getSection(oldItemCatalog, sectionId);
        const defaultSection = getDefaultSection(oldItemCatalog);
        const updatedDefaultSection = addVideoInSection(defaultSection, videoSection.items);
        const updatedSections = [
          ...oldItemCatalog.sections
            .filter(section => section.id !== sectionId)
            .filter(section => section.id !== defaultSection.id),
          updatedDefaultSection
        ];

        return {
          ...oldItemCatalog,
          sections: updatedSections
        };
      });
    },
    [setIsPageEdited, setItemCatalog]
  );

  const addVideoModal = useMemo(
    () => (
      <SelectVideoModal
        isOpen={isAddVideoModalOpen}
        onDismiss={() => setIsAddVideoModal(false)}
        baseGraphUrl=""
        onAddVideos={onAddVideo}
        maxRowsPerPage={MAX_ITEM_PER_PAGE_ON_SELECT_VIDEO_MODAL}
        excludedVideos={getItemIds(itemCatalog)}
        showFilters={false}
        showSearchBar
        multiSelectEnabled
        zIndex={CHANNEL_PAGE_MODAL_Z_INDEX}
        locale={locale}
        clientName="no-op"
      />
    ),
    [isAddVideoModalOpen, itemCatalog, onAddVideo, locale]
  );

  return (
    <>
      {isSuccess && (
        <div css={{ marginBottom: '1.5rem' }}>
          <PageAlert
            appearance="success"
            content={translate('channel_videos_update_message')}
            dismissible
            onDismiss={() => setIsSuccess(false)}
            testID="channel-videos-success"
          />
        </div>
      )}
      <button type="submit" ref={submitRef} hidden onClick={onSave}>
        Click
      </button>
      <Catalog
        itemCatalog={convertCatalogToItemCatalog(itemCatalog, true, showSections)}
        showSection={showSections}
        setIsAddSectionModal={setIsAddSectionModal}
        setIsAddVideoModal={setIsAddVideoModal}
        onDragAndDropItems={onDragAndDropItems}
        isSectionFlyoutOpen={isSectionFlyoutOpen}
        setIsSectionFlyoutOpen={setIsSectionFlyoutOpen}
        containerRef={containerRef}
      />
      {isAddSectionModalOpen && (
        <SectionModal
          isOpen={isAddSectionModalOpen}
          setIsModalOpen={setIsAddSectionModal}
          onCreate={onAddSection}
          isEditMode={false}
          videos={getDefaultSection(itemCatalog).items}
          onUpdate={() => {
            // no-op
          }}
        />
      )}
      {isUpdateSectionModalOpen && (
        <SectionModal
          isOpen={isUpdateSectionModalOpen}
          setIsModalOpen={setIsUpdateSectionModal}
          onUpdate={onEditSection}
          isEditMode
          section={getSection(itemCatalog, menuActionData.sectionId)}
          videos={[...getDefaultSection(itemCatalog).items, ...getSection(itemCatalog, menuActionData.sectionId).items]}
          onCreate={() => {
            // no-op
          }}
        />
      )}
      {isAddVideoModalOpen && addVideoModal}
      {isInsertSectionOpen && (
        <InsertSectionDialogBox
          isOpen={isInsertSectionOpen}
          setIsModalOpen={setIsInsertSectionOpen}
          onAdd={onInsertSection}
          sectionId={menuActionData?.sectionId}
          itemId={menuActionData?.itemId}
          isBefore={menuActionData?.isBefore}
        />
      )}
      {isDeletionSectionConfirmationModalOpen && (
        <ConfirmationModal
          header={translate('channel_video_delete_section_modal_header_label')}
          content={translate('channel_video_delete_section_modal_text')}
          cancelText={translate('keep_button')}
          confirmationText={translate('channel_video_delete_section_modal_button_label')}
          confirmationAction={() => {
            onSectionDelete(menuActionData?.sectionId);
            setIsDeletionSectionConfirmationModalOpen(false);
          }}
          setIsModalOpen={setIsDeletionSectionConfirmationModalOpen}
        />
      )}
    </>
  );
}

export default Videos;
