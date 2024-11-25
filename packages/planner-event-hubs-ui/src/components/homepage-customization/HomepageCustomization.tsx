import { useMutation, useQuery } from '@apollo/client';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import Header from '@components/Header';
import LeavePageAlert from '@components/common/LeavePageAlert';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { FEATURES } from '@components/features/constants';
import { HomePageCustomizationStyles } from '@components/homepage-customization/homePageCustomizationStyles';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import {
  createPageMutation,
  createSectionMutation,
  getPublishedPageOrDefaults,
  updatePageMutation,
  updateSectionMutation
} from '@cvent/planner-event-hubs-model/operations/homepageCustomization';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { useStyle } from '@hooks/useStyle';
import {
  HUB_OVERVIEW_URL,
  VIDEO_HUBS_URL,
  VIDEO_HUB_HOMEPAGE_URL,
  VIDEO_HUB_INFORMATION_URL,
  VIDEO_HUB_PATH_PARAM_KEY
} from '@utils/constants';
import { getCenterFeatures } from '@cvent/planner-event-hubs-model/operations/hub';
import { useTranslate } from 'nucleus-text';
import React, { useCallback, useMemo, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { PageAlert, UserAlert } from '@cvent/carina/components/Alert';
import { GET_CALENDAR_LIST } from '@cvent/planner-event-hubs-model/operations/upcomingEvents';
import AddSectionModal from './AddSectionModal';
import DragAndDropTable from './DragAndDropTable';
import { DEFAULT_HOME_PAGE_SECTIONS, PageSectionTemplates } from './HomePageSectionMeta';
import BannerSection from './sections/BannerSection';

interface Props {
  centerId: string;
  centerTitle: string;
}

export enum Status {
  PUBLISHED = 'Published',
  DRAFT = 'Draft'
}

function HomepageCustomization({ centerId, centerTitle }: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const { hubOverviewFeature } = useAppFeatures();
  const { sectionTitle, sectionTitleContainer, containerStyles, contentStyles } = useStyle(HomePageCustomizationStyles);

  // States
  const [isPageEdited, setIsPageEdited] = useState<boolean>(false);
  const [newPageId, setNewPageId] = useState<string>('');
  const [updatedSectionIds, setUpdatedSectionIds] = useState<string[]>([]);
  const [homePageSections, setHomePageSections] = useState([]);
  const [isUpcomingEventsEnabled, setIsUpcomingEventsEnabled] = useState(false);
  const [isYourEventsEnabled, setIsYourEventsEnabled] = useState(false);
  const [calendarListData, setCalendarListData] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [createPageMutationCall, { loading: updatingDraftPage }] = useMutation(createPageMutation);
  const [updatePageMutationCall, { loading: publishingChanges }] = useMutation(updatePageMutation);
  const [createSectionMutationCall, { loading: creatingSection }] = useMutation(createSectionMutation);
  const [updateSectionMutationCall, { loading: updatingSection }] = useMutation(updateSectionMutation);

  const { loading: fetchingCalendars, error: fetchCalendarsError } = useQuery(GET_CALENDAR_LIST, {
    fetchPolicy: 'cache-and-network',
    onCompleted: data => {
      setCalendarListData(data?.calendars?.data);
    }
  });
  // Upcoming Events Status
  const { calendarId } = useCenterInfo();

  // Upcoming Events and Your Events feature Status
  const { loading: fetchingFeaturesData, error: fetchFeaturesError } = useQuery(getCenterFeatures, {
    fetchPolicy: 'cache-and-network',

    variables: {
      id: {
        id: centerId
      }
    },
    onCompleted: data => {
      const features = data?.getCenterFeatures.reduce(
        (acc, feature) => {
          if (feature.code === FEATURES.UPCOMING_EVENTS && calendarId) {
            acc.upcomingEventsFeature = feature.enabled;
          } else if (feature.code === FEATURES.YOUR_EVENTS) {
            acc.yourEventsFeature = feature.enabled;
          }
          return acc;
        },
        { upcomingEventsFeature: false, yourEventsFeature: false }
      );

      setIsUpcomingEventsEnabled(features.upcomingEventsFeature);
      setIsYourEventsEnabled(features.yourEventsFeature);
    }
  });

  // Initial Data
  const { error: homePageError, loading: loadingHomePageData } = useQuery(getPublishedPageOrDefaults, {
    variables: {
      input: {
        id: centerId
      }
    },
    onCompleted: pageData => {
      if (pageData?.getPublishedPageOrDefaults?.page) {
        setUpdatedSectionIds(pageData?.getPublishedPageOrDefaults?.page.sectionIds);
        setHomePageSections(pageData?.getPublishedPageOrDefaults?.sections);
      }
    }
  });

  const defaultSectionsToAdd = useMemo(
    () =>
      DEFAULT_HOME_PAGE_SECTIONS.filter(
        template => !homePageSections.some(section => section.pageSectionTemplate === template)
      ),
    [homePageSections]
  );

  const { isUpcomingEventsAddedAndDisabled, isYourEventsAddedAndDisabled } = useMemo(
    () => ({
      isUpcomingEventsAddedAndDisabled:
        !defaultSectionsToAdd.includes(PageSectionTemplates.DEFAULT_UPCOMING_EVENTS) && !isUpcomingEventsEnabled,
      isYourEventsAddedAndDisabled:
        !defaultSectionsToAdd.includes(PageSectionTemplates.DEFAULT_MY_EVENTS) && !isYourEventsEnabled
    }),
    [defaultSectionsToAdd, isUpcomingEventsEnabled, isYourEventsEnabled]
  );

  const onDragAndDropHandler = async (updatedSections): Promise<void> => {
    setIsPageEdited(true);
    if (!newPageId) {
      onFirstPageOrSectionUpdate(updatedSections);
    } else {
      onPageUpdate(updatedSections);
    }
  };

  // Create Section mutation call
  const onCreateSection = async (section, originalSectionId): Promise<void> => {
    await createSectionMutationCall({
      variables: {
        input: {
          id: centerId
        },
        data: {
          ...section,
          originPageId: newPageId
        }
      },
      onCompleted: createSectionData => {
        // Replace the section in homePageSection with the new section created'
        if (originalSectionId) {
          const sectionIndex = homePageSections.findIndex(item => item.sectionId === originalSectionId);
          const updatedSections = [...homePageSections];
          updatedSections[sectionIndex] = createSectionData?.createSection;
          setHomePageSections(updatedSections);
        } else {
          setHomePageSections(prevSections => [...prevSections, createSectionData?.createSection]);
        }
      }
    });
  };

  // Update Section mutation call
  const onUpdateSection = async (section, originalSectionId): Promise<void> => {
    updateSectionMutationCall({
      variables: {
        input: {
          id: centerId
        },
        data: {
          ...section
        }
      },
      onCompleted: updateSectionData => {
        const sectionIndex = homePageSections.findIndex(item => item.sectionId === originalSectionId);
        const updatedSections = [...homePageSections];
        updatedSections[sectionIndex] = updateSectionData?.updateSection;
        setHomePageSections(updatedSections);
      }
    });
  };

  // if section has already been modified in a page draft then its record will have already been created
  const sectionRecordCreated = section => section?.originPageId === newPageId;

  // Handle changes within the section
  const onSectionUpdate = async (section, originalSectionId, sectionIdList = updatedSectionIds): Promise<void> => {
    if (!newPageId) {
      await onFirstPageOrSectionUpdate(sectionIdList, section, originalSectionId);
    } else if (originalSectionId && sectionRecordCreated(section)) {
      await onUpdateSection(section, originalSectionId);
    } else {
      await onCreateSection(section, originalSectionId);
    }
  };

  const onDeleteHandler = async (sectionId): Promise<void> => {
    const updatedSections = updatedSectionIds.filter(id => id !== sectionId);
    setHomePageSections(homePageSections.filter(item => item.sectionId !== sectionId));
    setIsPageEdited(true);
    if (!newPageId) {
      onFirstPageOrSectionUpdate(updatedSections);
    } else {
      onPageUpdate(updatedSections);
    }
  };

  // Drag and Drop - Draft and final publish mutation call
  const onPageUpdate = useCallback(
    async (updatedSections, pageStatus = Status.DRAFT): Promise<void> => {
      await updatePageMutationCall({
        variables: {
          data: {
            pageId: newPageId,
            videoCenterId: centerId,
            status: pageStatus,
            sectionIds: updatedSections
          }
        },
        onCompleted: updateDraftData => {
          if (pageStatus === Status.PUBLISHED) {
            setShowSuccessMessage(true);
            setIsPageEdited(false);
            setNewPageId('');
          }
          setUpdatedSectionIds(updateDraftData?.updatePage?.sectionIds);
        },
        refetchQueries: pageStatus === Status.PUBLISHED ? ['getPublishedPageOrDefaults'] : []
      });
    },
    [centerId, newPageId, updatePageMutationCall, setIsPageEdited, setNewPageId, setUpdatedSectionIds]
  );

  // First action mutation for creating a new page when Drag and Drop or any Section updates.
  const onFirstPageOrSectionUpdate = async (
    updatedSections,
    section = null,
    originalSectionId = null
  ): Promise<void> => {
    const newPageIdForMutation = newPageId || uuidV4();
    const newSectionData = section ? { ...section, originPageId: newPageIdForMutation } : null;
    await createPageMutationCall({
      variables: {
        page: {
          pageId: newPageIdForMutation,
          videoCenterId: centerId,
          status: Status.DRAFT,
          sectionIds: updatedSections
        },
        newSection: newSectionData
      },
      onCompleted: updateDraftData => {
        setUpdatedSectionIds(updateDraftData?.createPage?.page?.sectionIds);
        setNewPageId(updateDraftData?.createPage?.page?.pageId);
        // Replace the section in homePageSection with the new section created
        if (originalSectionId) {
          const sectionIndex = homePageSections.findIndex(item => item.sectionId === originalSectionId);
          const newHomePageSections = [...homePageSections];
          newHomePageSections[sectionIndex] = updateDraftData?.createPage?.newSection;
          setHomePageSections(newHomePageSections);
        } else if (newSectionData) {
          setHomePageSections(prevSections => [...prevSections, updateDraftData?.createPage?.newSection]);
        }
      }
    });
  };

  const getUpdatedSectionIds = section => {
    let temporarySectionId = section?.sectionId;
    let updatedSectionIdsLocal = [...updatedSectionIds];

    // if section has been created or modified for the first time in a page draft
    // replace section id with new id
    if (!sectionRecordCreated(section)) {
      temporarySectionId = uuidV4();
      updatedSectionIdsLocal = updatedSectionIdsLocal.map(id => (id === section?.sectionId ? temporarySectionId : id));

      if (!updatedSectionIdsLocal.includes(temporarySectionId)) {
        updatedSectionIdsLocal.push(temporarySectionId);
      }
    }
    setUpdatedSectionIds(updatedSectionIdsLocal);

    return {
      temporarySectionId,
      updatedSectionIds: updatedSectionIdsLocal
    };
  };

  const disableAddAndPublish = publishingChanges || updatingDraftPage || creatingSection || updatingSection;
  const headerActions: ActionType[] = useMemo(
    () => [
      {
        value: translate('home_page_custom_publish'),
        onClick: (): void => {
          onPageUpdate(updatedSectionIds, Status.PUBLISHED);
        },
        label: translate('home_page_custom_publish'),
        disabled: !isPageEdited || disableAddAndPublish
      }
    ],
    [translate, isPageEdited, disableAddAndPublish, onPageUpdate, updatedSectionIds]
  );

  const headerBreadCrumbs: React.JSX.Element = (
    <Breadcrumbs>
      <Crumb href={VIDEO_HUBS_URL}>{translate('video_hubs_header_title')}</Crumb>
      <Crumb
        href={
          hubOverviewFeature
            ? HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)
            : VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)
        }
      >
        {centerTitle}
      </Crumb>
      <Crumb href={VIDEO_HUB_HOMEPAGE_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)}>
        {translate('video_hub_side_nav_homePage')}
      </Crumb>
    </Breadcrumbs>
  );

  const HomepageCustomizationHeader: React.JSX.Element = (
    <Header
      testID="homePage-customization"
      title={translate('video_hub_side_nav_homePage')}
      actions={headerActions}
      breadCrumbs={headerBreadCrumbs}
    />
  );

  const dropDownRenderer = (): JSX.Element => (
    <div css={contentStyles}>
      <div css={sectionTitleContainer}>
        <div css={sectionTitle}>
          <div>{translate('home_page_sections_title')}</div>
          <p>{translate('home_page_sections_subtitle')}</p>
        </div>
        <div>
          <AddSectionModal
            onSectionUpdate={onSectionUpdate}
            defaultSectionsToAdd={defaultSectionsToAdd}
            disableBtn={disableAddAndPublish}
            calendarsExist={calendarListData.length > 0}
            setIsPageEdited={setIsPageEdited}
            setUpdatedSectionIds={setUpdatedSectionIds}
            updatedSectionIds={updatedSectionIds}
            calendarListData={calendarListData}
            getUpdatedSectionIds={getUpdatedSectionIds}
          />
        </div>
      </div>
      <div css={{ margin: '0 2rem 1.5rem 2rem' }}>
        {isUpcomingEventsAddedAndDisabled || isYourEventsAddedAndDisabled ? (
          <PageAlert
            appearance="info"
            id="1"
            title={translate('home_page_hidden_alert_message_title')}
            content={translate('home_page_hidden_alert_message_content')}
            actionPosition="end"
            dismissible
            testID="hidden-section-alert"
          />
        ) : null}
      </div>
      <BannerSection centerId={centerId} />
      <DragAndDropTable
        setIsPageEdited={setIsPageEdited}
        onDragAndDropHandler={onDragAndDropHandler}
        onSectionUpdate={onSectionUpdate}
        setHomePageSections={setHomePageSections}
        homePageSections={homePageSections}
        updatedSectionIds={updatedSectionIds}
        setUpdatedSectionIds={setUpdatedSectionIds}
        onDeleteHandler={onDeleteHandler}
        isUpcomingEventsEnabled={isUpcomingEventsEnabled}
        isYourEventsEnabled={isYourEventsEnabled}
        calendarListData={calendarListData}
        getUpdatedSectionIds={getUpdatedSectionIds}
      />
      <div css={{ textAlign: 'center', paddingTop: '1.5rem' }}>
        <AddSectionModal
          onSectionUpdate={onSectionUpdate}
          setIsPageEdited={setIsPageEdited}
          defaultSectionsToAdd={defaultSectionsToAdd}
          disableBtn={disableAddAndPublish}
          calendarsExist={calendarListData.length > 0}
          setUpdatedSectionIds={setUpdatedSectionIds}
          updatedSectionIds={updatedSectionIds}
          calendarListData={calendarListData}
          getUpdatedSectionIds={getUpdatedSectionIds}
        />
      </div>
    </div>
  );

  return (
    <div css={containerStyles}>
      {showSuccessMessage && (
        <div css={{ '> div': { marginTop: 42 } }}>
          <UserAlert
            appearance="success"
            content={translate('home_page_custom_publish_success_message')}
            dismissInterval={5000}
            onDismiss={() => setShowSuccessMessage(false)}
          />
        </div>
      )}
      <ScrollViewWithBars header={HomepageCustomizationHeader}>
        <LoadingWrapper
          loading={loadingHomePageData || fetchingFeaturesData || fetchingCalendars}
          renderer={dropDownRenderer}
          errors={[homePageError, fetchFeaturesError, fetchCalendarsError]}
        />
        <LeavePageAlert isPageEdited={isPageEdited} setIsPageEdited={setIsPageEdited} />
      </ScrollViewWithBars>
    </div>
  );
}

export default HomepageCustomization;
