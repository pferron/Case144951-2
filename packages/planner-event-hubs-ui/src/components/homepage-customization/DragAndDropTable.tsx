import { useQuery } from '@apollo/client';
import { DELETE_MENU_ITEM, EDIT_MENU_ITEM } from '@components/banners/BannerConstants';
import { MoreVerticalIcon, XIcon } from '@cvent/carina-icon';
import Button from '@cvent/carina/components/Button';
import Menu from '@cvent/carina/components/Menu';
import Modal from '@cvent/carina/components/Modal';
import { Placements } from '@cvent/carina/components/Popover';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars';
import { DraggableTableProps, useTable } from '@cvent/carina/components/Table';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { EventCalendar, PageSection } from '@cvent/planner-event-hubs-model/types';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { useStyle } from '@hooks/useStyle';
import { getPlannerPaginatedChannelsQuery } from '@cvent/planner-event-hubs-model/operations/channel';
import ConfirmationModal from '@components/common/ConfirmationModal';
import dynamic from 'next/dynamic';
import { useTranslate } from 'nucleus-text';
import React, { useCallback, useMemo, useState } from 'react';
import {
  PageSectionTemplates,
  PageSectionTitlesTranslationKeys,
  DEFAULT_HOME_PAGE_SECTIONS
} from './HomePageSectionMeta';
import SectionTemplateModal from './SectionTemplateModal';
import {
  AddSectionModalStyles,
  HomePageCustomizationStyles,
  ReorderableTableStyle
} from './homePageCustomizationStyles';
import HiddenPill from './HiddenPill';

export interface Section {
  sectionOrder: string;
  order: number;
}

type HomePageSection = PageSection & {
  rowName: string;
};
interface Props {
  setIsPageEdited: (val: boolean) => void;
  onDragAndDropHandler: (updatedSections: string[]) => void;
  onSectionUpdate: (section: PageSection, originalSectionId: string) => void;
  homePageSections: HomePageSection[];
  setHomePageSections: (sections: HomePageSection[]) => void;
  updatedSectionIds: string[];
  setUpdatedSectionIds: (updatedSections: string[]) => void;
  onDeleteHandler: (sectionId: string) => void;
  isUpcomingEventsEnabled?: boolean;
  isYourEventsEnabled?: boolean;
  calendarListData?: EventCalendar[];
  getUpdatedSectionIds: (section: PageSection) => { temporarySectionId: string; updatedSectionIds: string[] };
}

const DraggableTable = dynamic<DraggableTableProps>(() =>
  import('@cvent/carina/components/Table').then(mod => mod.DraggableTable)
);

function DragAndDropTable({
  setIsPageEdited,
  onDragAndDropHandler,
  onSectionUpdate,
  homePageSections,
  setHomePageSections,
  updatedSectionIds,
  setUpdatedSectionIds,
  onDeleteHandler,
  isUpcomingEventsEnabled,
  isYourEventsEnabled,
  calendarListData,
  getUpdatedSectionIds
}: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const buttonMoreIcon = () => <MoreVerticalIcon size="m" />;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({} as PageSection);
  const { titleContainer, titleStyle, sectionContainerMargin } = useStyle(AddSectionModalStyles);
  const { title } = useStyle(HomePageCustomizationStyles);
  const { calendarId, hubData } = useCenterInfo();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deletingSectionId, setDeletingSectionId] = useState(null);

  const { data: channelsData } = useQuery(getPlannerPaginatedChannelsQuery, {
    variables: {
      hubId: hubData?.id
    }
  });

  const sectionActions: ActionType[] = [
    {
      value: EDIT_MENU_ITEM,
      label: translate('home_page_sections_edit_menu'),
      onClick: () => setModalOpen(true)
    },
    {
      value: DELETE_MENU_ITEM,
      label: translate('home_page_sections_delete_menu')
    }
  ];

  const onEdit = (rowData): void => {
    setModalData(rowData);
    setModalOpen(true);
  };

  const onDelete = (rowData): void => {
    setDeletingSectionId(rowData.sectionId);
    setDeleteModal(true);
  };

  const handleDeleteHomePageSection = () => {
    setDeleteModal(false);
    onDeleteHandler(deletingSectionId);
  };

  const onMenuSelection = (selection: { value: string }, rowData: []): void =>
    selection.value === EDIT_MENU_ITEM ? onEdit(rowData) : onDelete(rowData);

  const menuButton = useCallback(
    (handlePress, sectionName): React.JSX.Element => (
      <Button
        appearance="ghost"
        onClick={handlePress}
        icon={buttonMoreIcon}
        aria-label={translate('home_page_sections_list_overflow_menu_aria_label')}
        {...injectTestId(`section-item-overflow-menu-button-${sectionName}`)}
      />
    ),
    [translate]
  );

  const getCalendarName = (featuredCalendarId: string): string => {
    const calendar = calendarListData.find(cal => cal.id.toUpperCase() === featuredCalendarId?.toUpperCase());
    return calendar?.name ? `: ${calendar.name}` : '';
  };

  const getChannelName = (channelId: string): string => {
    const channel = channelsData?.getPlannerPaginatedChannels?.data.find(
      chan => chan.id.toUpperCase() === channelId.toUpperCase()
    );
    return channel?.title ? `: ${channel.title}` : '';
  };

  const getRowTitle = (rowData: HomePageSection): string => {
    // Return the phrase keys for default sections
    if (
      DEFAULT_HOME_PAGE_SECTIONS.includes(rowData.pageSectionTemplate) &&
      rowData.pageSectionTemplate !== PageSectionTemplates.DEFAULT_UPCOMING_EVENTS
    ) {
      return translate(PageSectionTitlesTranslationKeys[rowData.pageSectionTemplate]);
    }

    switch (rowData.pageSectionTemplate) {
      case PageSectionTemplates.EVENT_CALENDAR: {
        const calendarName = getCalendarName(rowData.featuredContentTypeId);
        return `${translate(PageSectionTitlesTranslationKeys.EventCalendar)}${calendarName}`;
      }
      case PageSectionTemplates.SINGLE_CHANNEL: {
        const channelName = getChannelName(rowData.featuredContentTypeId);
        return `${translate(PageSectionTitlesTranslationKeys.SingleChannel)}${channelName}`;
      }
      case PageSectionTemplates.DEFAULT_UPCOMING_EVENTS: {
        const upcomingEventsCalendarName = getCalendarName(calendarId);
        return `${translate(PageSectionTitlesTranslationKeys.DefaultUpcomingEvents)}${upcomingEventsCalendarName}`;
      }
      default:
        return rowData.title || translate(PageSectionTitlesTranslationKeys[rowData?.pageSectionTemplate]);
    }
  };

  const placementCellRenderer = (_, { rowData }): React.JSX.Element => {
    const isDefaultUpcomingEventsHidden =
      rowData.pageSectionTemplate === PageSectionTemplates.DEFAULT_UPCOMING_EVENTS && !isUpcomingEventsEnabled;
    const isYourEventsHidden =
      rowData.pageSectionTemplate === PageSectionTemplates.DEFAULT_MY_EVENTS && !isYourEventsEnabled;

    const hiddenMessage =
      rowData.pageSectionTemplate === PageSectionTemplates.DEFAULT_UPCOMING_EVENTS
        ? 'home_page_hidden_upcoming_event_tooltip_msg'
        : 'home_page_hidden_your_event_tooltip_msg';

    return (
      <div
        {...injectTestId(`row-${rowData.pageSectionTemplate}`)}
        css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', wordBreak: 'break-all' }}
      >
        <div css={title}>{getRowTitle(rowData)}</div>
        <div css={{ display: 'flex' }}>
          {isDefaultUpcomingEventsHidden || isYourEventsHidden ? (
            <HiddenPill message={translate(hiddenMessage)} />
          ) : null}
          <Menu
            testID={`section-list-option-menu-${rowData.pageSectionTemplate}`}
            options={sectionActions}
            placement={Placements.bottomEnd}
            onSelect={selection => {
              onMenuSelection(selection, rowData);
            }}
            portal
            trigger={handlePress => menuButton(handlePress, rowData.pageSectionTemplate)}
          />
        </div>
      </div>
    );
  };

  const memoizedHomePageSections = useMemo(
    () =>
      homePageSections.reduce((acc, section) => {
        if (section.pageSectionTemplate === PageSectionTemplates.EVENT_CALENDAR && calendarListData?.length === 0) {
          return acc;
        }
        return [...acc, { ...section, rowName: section.sectionId }];
      }, []),
    [homePageSections, calendarListData]
  );

  const [Table, TableColumn] = useTable({
    data: memoizedHomePageSections,
    isDraggable: true,
    DraggableTable
  });

  const onDragEndCallback = ({ fromIndex, toIndex }: { fromIndex?: number; toIndex?: number }) => {
    const newPlacementList = [...updatedSectionIds];
    const newPlacementListWithData = [...memoizedHomePageSections];
    if (fromIndex !== undefined && toIndex !== undefined) {
      // Drag and Drop view changes
      newPlacementListWithData.splice(toIndex, 0, newPlacementListWithData.splice(fromIndex, 1)[0]);
      setHomePageSections(newPlacementListWithData);
      // Call to update the section order in draft
      const section = newPlacementList[fromIndex];
      newPlacementList.splice(fromIndex, 1);
      newPlacementList.splice(toIndex, 0, section);
      setIsPageEdited(true);
      onDragAndDropHandler(newPlacementList);
    }
  };

  const selectSectionTemplateHeader = (
    <div css={titleContainer}>
      <div>
        <div css={titleStyle}>{translate(PageSectionTitlesTranslationKeys[modalData.pageSectionTemplate])}</div>
      </div>
      <Button
        appearance="ghost"
        icon={XIcon}
        aria-label={translate('close_modal_button_label')}
        onClick={() => {
          setModalOpen(false);
        }}
        testID="close-select-template-modal"
      />
    </div>
  );

  const styles = useStyle(ReorderableTableStyle);

  return (
    <>
      <Table
        css={styles.tableHandleStyle}
        hideHeader
        hideSideBorders
        testID="reorderable-table-fields"
        allowDragAndDrop
        paddingMode="condensed"
        rowMode="drag-and-drop"
        onDragEnd={onDragEndCallback}
      >
        <TableColumn name="sectionId" minWidth={1} heading="sections" cellRenderer={placementCellRenderer} />
      </Table>
      {deleteModal && (
        <ConfirmationModal
          header={translate('home_page_delete_section_confirmation_header_title')}
          content={translate('home_page_delete_section_confirmation_header_content')}
          cancelText={translate('keep_button')}
          confirmationText={translate('home_page_sections_delete_menu')}
          confirmationAction={handleDeleteHomePageSection}
          setIsModalOpen={setDeleteModal}
        />
      )}
      {modalOpen && (
        <Modal
          format="fullscreen"
          isOpen
          testID="add-section-details-modal"
          portal
          aria-label={translate('home_page_sections_add_section_modal_title')}
          onDismiss={() => {
            setModalOpen(false);
          }}
        >
          <ScrollViewWithBars header={selectSectionTemplateHeader}>
            <div css={sectionContainerMargin}>
              <SectionTemplateModal
                pageSection={modalData}
                setShowSectionTemplate={setModalOpen}
                selectedSection={modalData.pageSectionTemplate}
                setIsPageEdited={setIsPageEdited}
                setUpdatedSectionIds={setUpdatedSectionIds}
                onSectionUpdate={onSectionUpdate}
                updatedSectionIds={updatedSectionIds}
                calendarListData={calendarListData}
                getUpdatedSectionIds={getUpdatedSectionIds}
              />
            </div>
          </ScrollViewWithBars>
        </Modal>
      )}
    </>
  );
}

export default DragAndDropTable;
