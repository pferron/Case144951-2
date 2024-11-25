import { Button } from '@cvent/carina/components/Button';
import { XIcon } from '@cvent/carina/components/Icon';
import Modal from '@cvent/carina/components/Modal';
import { ScrollViewWithBars } from '@cvent/carina/components/ScrollViewWithBars';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import React, { useState } from 'react';
import { EventCalendar, PageSection } from '@cvent/planner-event-hubs-model/types';
import { SectionTile } from './AddSectionTiles';
import { PageSectionTemplates, PageSectionTitlesTranslationKeys } from './HomePageSectionMeta';
import { AddSectionModalStyles } from './homePageCustomizationStyles';
import SectionTemplateModal from './SectionTemplateModal';

interface Props {
  defaultSectionsToAdd?: string[];
  disableBtn?: boolean;
  calendarsExist?: boolean;
  setIsPageEdited?: (val: boolean) => void;
  setUpdatedSectionIds?: (updatedSections: string[]) => void;
  onSectionUpdate?: (section: PageSection, originalSectionId: string) => void;
  updatedSectionIds?: string[];
  calendarListData?: EventCalendar[];
  getUpdatedSectionIds: (section: PageSection) => { temporarySectionId: string; updatedSectionIds: string[] };
}

function AddSectionModal({
  defaultSectionsToAdd = [],
  disableBtn,
  calendarsExist,
  setIsPageEdited,
  setUpdatedSectionIds,
  onSectionUpdate,
  updatedSectionIds,
  calendarListData,
  getUpdatedSectionIds
}: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const [openAddSectionModal, setOpenAddSectionModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSectionTemplate, setShowSectionTemplate] = useState(false);
  const {
    titleContainer,
    titleStyle,
    subtitleStyle,
    addBtnStyle,
    sectionModalContainer,
    sectionHeading,
    sectionContainerMargin
  } = useStyle(AddSectionModalStyles);
  const [selectedSection, setSelectedSection] = useState('');

  const defaultSectionsTitleAndDescriptionMap = {
    [PageSectionTemplates.DEFAULT_UPCOMING_EVENTS]: {
      title: 'home_page_sections_add_section_upcmg_events',
      description: 'home_page_sections_add_section_upcmg_events_description'
    },
    [PageSectionTemplates.DEFAULT_VIDEOS]: {
      title: 'home_page_sections_add_section_videos',
      description: 'home_page_sections_add_section_videos_description'
    },
    [PageSectionTemplates.DEFAULT_CHANNELS]: {
      title: 'home_page_sections_add_section_channel_list',
      description: 'home_page_sections_add_section_channel_list_description'
    },
    [PageSectionTemplates.DEFAULT_MY_EVENTS]: {
      title: 'home_page_sections_add_section_my_events',
      description: 'home_page_sections_add_section_my_events_description'
    }
  };

  const handleAddSectionModalFooterBtnOnClick = () => {
    setShowSectionTemplate(true);
    setOpenAddSectionModal(false);
  };

  const selectSectionModalFooter = (
    <div css={addBtnStyle}>
      <Button
        aria-label={translate('home_page_sections_add_section_modal_footer_btn_add')}
        onClick={handleAddSectionModalFooterBtnOnClick}
        text={translate('home_page_sections_add_section_modal_footer_btn_add')}
        disabled={!selectedSection}
        testID="add-section-modal-footer-btn-add"
      />
    </div>
  );

  const selectSectionModalHeader = (
    <div css={titleContainer}>
      <div>
        <div css={titleStyle}>{translate('home_page_sections_add_section_modal_title')}</div>
        <div css={subtitleStyle}>{translate('home_page_sections_add_section_modal_subtitle')}</div>
      </div>
      <Button
        appearance="ghost"
        icon={XIcon}
        aria-label={translate('close_modal_button_label')}
        onClick={() => {
          setSelectedSection('');
          setOpenAddSectionModal(false);
        }}
        testID="close-select-section-modal"
      />
    </div>
  );

  const selectSectionTemplateHeader = (
    <div css={titleContainer}>
      <div>
        <div css={titleStyle}>{translate(PageSectionTitlesTranslationKeys[selectedSection])}</div>
      </div>
      <Button
        appearance="ghost"
        icon={XIcon}
        aria-label={translate('close_modal_button_label')}
        onClick={() => {
          setShowSectionTemplate(false);
          setSelectedSection('');
        }}
        testID="close-select-template-modal"
      />
    </div>
  );

  return (
    <div>
      <Button
        testID="Add-sections-button"
        text={translate('home_page_sections_add_section_btn_txt')}
        onClick={() => setOpenAddSectionModal(true)}
        disabled={disableBtn}
      />
      {openAddSectionModal && (
        <Modal
          format={showTemplateModal ? 'l' : 'm'}
          isOpen
          testID="add-section-modal"
          portal
          aria-label={translate('home_page_sections_add_section_modal_title')}
          onDismiss={() => {
            setOpenAddSectionModal(false);
            setSelectedSection('');
            if (showTemplateModal) {
              setShowTemplateModal(false);
            }
          }}
        >
          <ScrollViewWithBars header={selectSectionModalHeader} footer={selectSectionModalFooter}>
            <div css={sectionModalContainer}>
              <SectionTile
                setSelectedSection={setSelectedSection}
                selectedSectionInState={selectedSection}
                defaultSectionValue={PageSectionTemplates.SINGLE_CHANNEL}
                title={translate('home_page_sections_add_section_channel')}
                description={translate('home_page_sections_add_section_channel_description')}
                testId="add-section-channel"
              />
              <SectionTile
                setSelectedSection={setSelectedSection}
                selectedSectionInState={selectedSection}
                defaultSectionValue={PageSectionTemplates.EVENT_CALENDAR}
                title={translate('home_page_sections_add_section_event_calendar')}
                description={translate('home_page_sections_add_section_event_calendar_description')}
                testId="add-section-event-calendar"
                disabledSection={!calendarsExist}
                disabledToolTipMessage={translate('home_page_sections_add_section_event_calendar_disabled_tooltip')}
              />
              {defaultSectionsToAdd?.length > 0 && (
                <>
                  <div css={sectionHeading}>{translate('home_page_sections_add_section_default_title')}</div>
                  {defaultSectionsToAdd.map(section => (
                    <SectionTile
                      setSelectedSection={setSelectedSection}
                      selectedSectionInState={selectedSection}
                      defaultSectionValue={section}
                      title={translate(defaultSectionsTitleAndDescriptionMap[section]?.title)}
                      description={translate(defaultSectionsTitleAndDescriptionMap[section]?.description)}
                      key={section}
                      testId={`add-section-${section}`}
                    />
                  ))}
                </>
              )}
              <div css={sectionHeading}>{translate('home_page_sections_add_section_custom_title')}</div>
              <SectionTile
                setSelectedSection={setSelectedSection}
                selectedSectionInState={selectedSection}
                defaultSectionValue={PageSectionTemplates.TEXT_IMAGE_TEMPLATE}
                title={translate('home_page_sections_add_section_new_section')}
                description={translate('home_page_sections_add_section_new_section_description')}
                testId="add-section-new-section"
              />
            </div>
          </ScrollViewWithBars>
        </Modal>
      )}
      {showSectionTemplate && (
        <Modal
          format="fullscreen"
          isOpen
          testID="add-section-details-modal"
          portal
          aria-label={translate('home_page_sections_add_section_modal_title')}
          onDismiss={() => {
            setShowSectionTemplate(false);
          }}
        >
          <ScrollViewWithBars header={selectSectionTemplateHeader}>
            <div css={sectionContainerMargin}>
              <SectionTemplateModal
                setShowSectionTemplate={setShowSectionTemplate}
                selectedSection={selectedSection}
                setIsPageEdited={setIsPageEdited}
                setUpdatedSectionIds={setUpdatedSectionIds}
                onSectionUpdate={onSectionUpdate}
                updatedSectionIds={updatedSectionIds}
                calendarListData={calendarListData}
                setSelectedSection={setSelectedSection}
                getUpdatedSectionIds={getUpdatedSectionIds}
              />
            </div>
          </ScrollViewWithBars>
        </Modal>
      )}
    </div>
  );
}

export default AddSectionModal;
