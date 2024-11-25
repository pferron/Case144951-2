import React, { useCallback, useMemo } from 'react';
import Menu from '@cvent/carina/components/Menu';
import { Button } from '@cvent/carina/components/Button';
import {
  ClockIcon,
  MoreVerticalIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  EditPencilIcon,
  TrashIcon
} from '@cvent/carina/components/Icon';
import { ExtendedItemCatalog, ChannelCatalog, MenuActionData } from '@components/channels/type/channelCatalog';
import { useStyle } from '@hooks/useStyle';
import { VideoListStyles } from '@components/channels/videos/style';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useTranslate } from 'nucleus-text';
import { EMPTY_CATALOG, getAndRemoveVideosFromSection, getSection } from '@components/channels/videos/videoHelper';
import { DEFAULT_SECTION_TYPE } from '@utils/constants';
import useBreakpoints from '@hooks/useBreakpoints';
import Link from 'next/link';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function useItemCatalogConverter(
  setItemCatalog: (oldItemCatalog) => void,
  setIsInsertSectionOpen: (isOpen: boolean) => void,
  setMenuActionData: (data: MenuActionData) => void,
  setIsUpdateSectionModal: (isOpen: boolean) => void,
  setIsDeletionSectionConfirmationModalOpen: (isOpen: boolean) => void,
  setIsPageEdited: (isPageEdited: boolean) => void
): (catalog: ExtendedItemCatalog | ChannelCatalog, isEditMode: boolean, showSections) => ExtendedItemCatalog {
  const { translate } = useTranslate();
  const { isDefaultSize } = useBreakpoints();
  const {
    itemContainerStyle,
    itemThumbnail,
    itemTextEditModeStyle,
    itemTextReadModeStyle,
    placeholderImage,
    sectionTextStyle,
    menuText
  } = useStyle(VideoListStyles);
  const theme = useTheme();
  const videoMenuAccessibilityLabel = useMemo(() => translate('channel_video_section_item_menu'), [translate]);
  const sectionMenuAccessibilityLabel = useMemo(() => translate('channel_section_item_menu'), [translate]);
  const defaultSectionName = useMemo(() => translate('channel_video_more_videos_label'), [translate]);
  const deleteRowText = useMemo(() => translate('channel_video_remove_video_button_text'), [translate]);
  const addSectionAboveTxt = useMemo(() => translate('channel_video_insert_section_before_label'), [translate]);
  const addSectionBelowTxt = useMemo(() => translate('channel_video_insert_section_after_label'), [translate]);
  const deleteSectionTxt = useMemo(() => translate('channel_video_delete_section_label'), [translate]);
  const editSectionTxt = useMemo(() => translate('channel_video_edit_section_label'), [translate]);
  const menuIcon = useCallback((): JSX.Element => <MoreVerticalIcon size="m" />, []);

  const onRowDelete = useCallback(
    (sectionId: string, itemId: string): void => {
      setIsPageEdited(true);
      setItemCatalog(oldItemCatalog => {
        const videoSection = getSection(oldItemCatalog, sectionId);
        const { updatedSection } = getAndRemoveVideosFromSection(videoSection, [itemId]);
        const updatedSections = oldItemCatalog.sections.map(section => {
          if (section.id !== videoSection.id) {
            return section;
          }
          return updatedSection;
        });
        return {
          ...oldItemCatalog,
          sections: updatedSections
        };
      });
    },
    [setIsPageEdited, setItemCatalog]
  );

  const rowActions = useCallback(
    (selectedAction): void => {
      if (selectedAction.payload.type === 'add_section_above') {
        setIsInsertSectionOpen(true);
        setMenuActionData({
          sectionId: selectedAction.payload.sectionId,
          itemId: selectedAction.payload.itemId,
          isBefore: true
        });
      }
      if (selectedAction.payload.type === 'add_section_below') {
        setIsInsertSectionOpen(true);
        setMenuActionData({
          sectionId: selectedAction.payload.sectionId,
          itemId: selectedAction.payload.itemId,
          isBefore: false
        });
      }
      if (selectedAction.payload.type === 'row_delete') {
        onRowDelete(selectedAction.payload.sectionId, selectedAction.payload.itemId);
      }
    },
    [onRowDelete, setIsInsertSectionOpen, setMenuActionData]
  );

  const menuButton = useCallback(
    (handlePress, accessibilityLabel): JSX.Element => (
      <Button
        aria-label={accessibilityLabel}
        appearance="ghost"
        testID="menu-button"
        accessible
        onClick={handlePress}
        icon={menuIcon}
      />
    ),
    [menuIcon]
  );

  const Space = useMemo(() => <span css={{ width: '0.625rem' }} />, []);

  const videoDetails = useCallback(
    (thumbnail, title, isEditMode): JSX.Element => (
      <>
        {!isDefaultSize && (
          <div css={itemThumbnail}>
            {thumbnail ? (
              <img src={thumbnail} css={itemThumbnail} alt={title} />
            ) : (
              <div css={placeholderImage}>
                <ClockIcon size="m" color={theme.backgroundColor.interactive.fill.base} />
              </div>
            )}
          </div>
        )}
        <div css={isEditMode ? itemTextEditModeStyle : itemTextReadModeStyle}>{title}</div>
      </>
    ),
    [
      isDefaultSize,
      itemTextEditModeStyle,
      itemTextReadModeStyle,
      itemThumbnail,
      placeholderImage,
      theme.backgroundColor.interactive.fill.base
    ]
  );

  const rowContent = useCallback(
    (
      isEditMode: boolean,
      sectionId: string,
      itemId: string,
      title: string,
      thumbnail: string,
      videoId: string,
      isFirstItem: boolean,
      isLastItem: boolean,
      isDefaultSection: boolean
    ): JSX.Element => {
      const menuOptions = () => {
        const items = [];
        if (!isFirstItem) {
          items.push({
            value: { addSectionAboveTxt },
            label: (
              <>
                <ArrowUpCircleIcon size="m" color={theme.backgroundColor.interactive.fill.base} />
                {Space}
                <div css={menuText}>{addSectionAboveTxt}</div>
              </>
            ),
            payload: { type: 'add_section_above', itemId, sectionId }
          });
        }
        if (!isLastItem && !isDefaultSection) {
          items.push({
            value: { addSectionBelowTxt },
            label: (
              <>
                <ArrowDownCircleIcon size="m" color={theme.backgroundColor.interactive.fill.base} />
                {Space}
                <div css={menuText}>{addSectionBelowTxt}</div>
              </>
            ),
            payload: { type: 'add_section_below', itemId, sectionId }
          });
        }
        items.push({
          value: { deleteRowText },
          testId: 'remove-button',
          label: <div css={menuText}>{deleteRowText}</div>,
          payload: { type: 'row_delete', itemId, sectionId }
        });
        return items;
      };

      return (
        <div css={{ width: '100%' }}>
          {isEditMode ? (
            <div
              css={{
                ...itemContainerStyle,
                marginLeft: isEditMode ? null : '0.7rem',
                cursor: isEditMode ? null : 'pointer'
              }}
              {...injectTestId(`item-${itemId}`)}
            >
              {videoDetails(thumbnail, title, true)}
              <div css={{ marginLeft: 'auto' }}>
                <Menu
                  id={`menu-${sectionId}-${itemId}`}
                  testID={`menu-${sectionId}-${itemId}`}
                  options={menuOptions()}
                  onSelect={rowActions}
                  placement="top-start"
                  trigger={handlePress => menuButton(handlePress, videoMenuAccessibilityLabel)}
                />
              </div>
            </div>
          ) : (
            <Link href={`${publicRuntimeConfig.PLANNER_VIDEO_SOLUTION_URL}/videos/${videoId}`}>
              <a
                href={`${publicRuntimeConfig.PLANNER_VIDEO_SOLUTION_URL}/videos/${videoId}`}
                aria-label={translate('go_to_aria_label', { entity: title })}
                style={{ textDecorationLine: 'none' }}
              >
                <div
                  css={{
                    ...itemContainerStyle,
                    marginLeft: isEditMode ? null : '0.7rem',
                    cursor: isEditMode ? null : 'pointer'
                  }}
                  {...injectTestId(`item-${itemId}`)}
                >
                  {videoDetails(thumbnail, title, false)}
                </div>
              </a>
            </Link>
          )}
        </div>
      );
    },
    [
      itemContainerStyle,
      videoDetails,
      rowActions,
      translate,
      deleteRowText,
      menuText,
      addSectionAboveTxt,
      theme.backgroundColor.interactive.fill.base,
      Space,
      addSectionBelowTxt,
      menuButton,
      videoMenuAccessibilityLabel
    ]
  );

  const sectionAction = useCallback(
    (selectedAction): void => {
      if (selectedAction.payload.type === 'section_delete') {
        setMenuActionData({
          sectionId: selectedAction.payload.sectionId
        });
        setIsDeletionSectionConfirmationModalOpen(true);
      }
      if (selectedAction.payload.type === 'edit_section') {
        setMenuActionData({
          sectionId: selectedAction.payload.sectionId
        });
        setIsUpdateSectionModal(true);
      }
    },
    [setIsDeletionSectionConfirmationModalOpen, setIsUpdateSectionModal, setMenuActionData]
  );

  /**
   * Provides UI content for section
   */
  const sectionContent = useCallback(
    (isEditMode: boolean, sectionId: string, title: string, videoCount: number, sectionType: string): JSX.Element => {
      const menuItems = () => {
        const items = [];
        items.push({
          value: { editSectionTxt },
          label: (
            <>
              <EditPencilIcon size="m" color={theme.backgroundColor.interactive.fill.base} />
              {Space}
              <div css={menuText}>{editSectionTxt}</div>
            </>
          ),
          payload: { type: 'edit_section', sectionId }
        });

        items.push({
          value: { deleteSectionTxt },
          label: (
            <>
              <TrashIcon size="m" color={theme.backgroundColor.interactive.fill.base} />
              {Space}
              <div css={menuText}>{deleteSectionTxt}</div>
            </>
          ),
          payload: { type: 'section_delete', sectionId }
        });

        return items;
      };
      return (
        <div css={itemContainerStyle} {...injectTestId(`section-${sectionId}`)}>
          <p css={sectionTextStyle}>
            {title} ({videoCount})
          </p>
          {isEditMode && sectionType !== DEFAULT_SECTION_TYPE && (
            <div css={{ marginLeft: 'auto' }}>
              <Menu
                id={`menu-${sectionId}`}
                testID={`menu-${sectionId}`}
                options={menuItems()}
                onSelect={sectionAction}
                placement="bottom-end"
                trigger={handlePress => menuButton(handlePress, sectionMenuAccessibilityLabel)}
              />
            </div>
          )}
        </div>
      );
    },
    [
      itemContainerStyle,
      sectionTextStyle,
      sectionAction,
      editSectionTxt,
      theme.backgroundColor.interactive.fill.base,
      Space,
      menuText,
      deleteSectionTxt,
      menuButton,
      sectionMenuAccessibilityLabel
    ]
  );

  /**
   * This function is used to convert videos catalog data to Item catalog(DragAndDrop catalog type)
   * @param catalog
   * @param setItemCatalog
   * @param isEditMode
   * @param style
   */
  return useCallback(
    (
      catalog: ExtendedItemCatalog | ChannelCatalog,
      isEditMode: boolean,
      showSections: boolean
    ): ExtendedItemCatalog => {
      if (!catalog) {
        return EMPTY_CATALOG;
      }
      const sections = catalog.sections?.map(section => {
        const itemList = section.items === undefined ? section.videos : section.items;
        const items = itemList
          ? itemList?.map((item, index) => ({
              id: item.id,
              videoId: item.videoId,
              displayName: item.displayName,
              thumbnail: item.thumbnail,
              duration: item.duration,
              content: rowContent(
                isEditMode,
                section.id,
                item.id,
                item.displayName,
                item.thumbnail,
                item.videoId,
                index === 0,
                index === itemList.length - 1,
                section.sectionType === DEFAULT_SECTION_TYPE
              )
            }))
          : [];
        return {
          id: section.id,
          title: section.sectionType === DEFAULT_SECTION_TYPE ? defaultSectionName : section.title,
          itemCount: items?.length,
          items,
          sectionType: section.sectionType,
          content:
            !!showSections && sectionContent(isEditMode, section.id, section.title, items?.length, section.sectionType)
        };
      });
      return {
        id: catalog.id,
        sections
      };
    },
    [sectionContent, rowContent, defaultSectionName]
  );
}
