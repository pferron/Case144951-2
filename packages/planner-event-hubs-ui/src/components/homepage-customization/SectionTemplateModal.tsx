import React from 'react';
import { EventCalendar, PageSection } from '@cvent/planner-event-hubs-model/types';
import { v4 as uuidV4 } from 'uuid';
import { PageSectionTemplates } from './HomePageSectionMeta';
import SectionCard from './SectionCard';
import ChannelsListSection from './sections/ChannelsListSection';
import EventCalendarSection from './sections/EventCalendarSection';
import MyEventsSection from './sections/MyEventsSection';
import SingleChannelSection from './sections/SingleChannelSection';
import UpcomingEventSection from './sections/UpcomingEventSection';
import VideosSection from './sections/VideosSection';
import NewSection from './sections/NewSection';

interface Props {
  pageSection?: PageSection;
  selectedSection?: string;
  setIsPageEdited?: (val: boolean) => void;
  onSectionUpdate: (section: PageSection, originalSectionId: string) => void;
  setUpdatedSectionIds?: (updatedSections: string[]) => void;
  setShowSectionTemplate?: (val: boolean) => void;
  updatedSectionIds: string[];
  calendarListData?: EventCalendar[];
  setSelectedSection?: (val: string) => void;
  getUpdatedSectionIds: (section: PageSection) => { temporarySectionId: string; updatedSectionIds: string[] };
}

const sectionMap = {
  [PageSectionTemplates.EVENT_CALENDAR]: EventCalendarSection,
  [PageSectionTemplates.DEFAULT_UPCOMING_EVENTS]: UpcomingEventSection,
  [PageSectionTemplates.DEFAULT_VIDEOS]: VideosSection,
  [PageSectionTemplates.SINGLE_CHANNEL]: SingleChannelSection,
  [PageSectionTemplates.DEFAULT_MY_EVENTS]: MyEventsSection,
  [PageSectionTemplates.DEFAULT_CHANNELS]: ChannelsListSection,
  [PageSectionTemplates.TEXT_IMAGE_TEMPLATE]: NewSection
};

function SectionTemplateModal({
  pageSection,
  selectedSection,
  setIsPageEdited,
  onSectionUpdate,
  setUpdatedSectionIds,
  setShowSectionTemplate,
  updatedSectionIds,
  calendarListData,
  setSelectedSection,
  getUpdatedSectionIds
}: Props): React.JSX.Element {
  const SectionComponent = sectionMap[selectedSection] || null;
  const newSectionId = uuidV4();
  return (
    <div>
      {SectionComponent && (
        <SectionCard>
          <SectionComponent
            pageSection={pageSection}
            setIsPageEdited={setIsPageEdited}
            onSectionUpdate={onSectionUpdate}
            setUpdatedSectionIds={setUpdatedSectionIds}
            setShowSectionTemplate={setShowSectionTemplate}
            updatedSectionIds={updatedSectionIds}
            calendarListData={calendarListData}
            setSelectedSection={setSelectedSection}
            newSectionId={newSectionId}
            getUpdatedSectionIds={getUpdatedSectionIds}
          />
        </SectionCard>
      )}
    </div>
  );
}

export default SectionTemplateModal;
