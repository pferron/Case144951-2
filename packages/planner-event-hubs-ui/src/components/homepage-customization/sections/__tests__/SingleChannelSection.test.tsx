import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import { getPlannerPaginatedChannelsQuery } from '@cvent/planner-event-hubs-model/operations/channel';
import { PageSection } from '@cvent/planner-event-hubs-model/types';
import { ContentFilterType, PageSectionTemplates } from '@components/homepage-customization/HomePageSectionMeta';
import { v4 as uuidV4 } from 'uuid';
import { getVideosQuery } from '@cvent/planner-event-hubs-model/operations/video';
import { BreakpointMocker } from '@utils/testUtil/BreakpointMocker';
import SingleChannelSection from '../SingleChannelSection';

jest.mock('@hooks/useCenterInfo', () => ({
  useCenterInfo: () => {
    return {
      hubData: {
        id: 'hub-id'
      },
      calendarId: 'calendarId-1'
    };
  }
}));

const channelSectionData = (scenario?: string): PageSection => {
  const scenarios = {
    default: {
      title: "What's New",
      pageSectionTemplate: PageSectionTemplates.DEFAULT_VIDEOS,
      sectionId: uuidV4(),
      originPageId: null,
      contentFilterType: ContentFilterType.NEW_VIDEOS
    }
  };
  return scenarios[scenario] || scenarios.default;
};

function displayTimeFrameOptions(sectionId: string): void {
  const el = screen.getByTestId(`videos-section-source-${sectionId}__top-videos`);
  fireEvent.click(el);
}

const channelsListSection = {
  alignment: 'Left',
  buttonEnabled: null,
  buttonExternalTarget: null,
  buttonInternalTarget: null,
  buttonTargetType: null,
  buttonText: null,
  contentFilterDateAbstract: null,
  contentFilterType: 'custom',
  contentIds: ['d55732c5-7e04-45b6-a3a1-27fddc1c899b', '53ee105c-22a2-49fa-bdc9-4cd26b47cc5b'],
  contentLimitOnInitialLoad: 4,
  contentType: null,
  featuredContentType: null,
  featuredContentTypeId: '9e2c8ba2-dffa-48d4-b78c-b3ea0fac3217',
  imageAltText: null,
  imageUrl: null,
  layout: null,
  originPageId: '2bc1cc09-52d3-427f-9a56-3bd8f9024800',
  originalImageUrl: null,
  pageSectionTemplate: 'SingleChannel',
  sectionId: '14efb8fc-50f3-46d5-9814-f5485a2a1ba8',
  textBody: null,
  textColor: null,
  title: 'Channel title'
};
const currentToken = '4718cbb4-0517-4d59-b232-d4cf4dae973a';

const mocks = [
  {
    request: {
      query: getPlannerPaginatedChannelsQuery,
      variables: {
        hubId: 'hub-id'
      }
    },
    result: {
      data: {
        getPlannerPaginatedChannels: {
          data: [
            {
              id: 'c7378d60-979f-4cb6-b71f-d4f7bcd22532',
              title: 'Channel to be created in demo',
              description: 'explain plan test description',
              status: 'INACTIVE',
              catalogId: 'f3699bf6-f58b-4430-b872-966f2b572a96',
              imageUrl: null,
              order: 1,
              videoCount: 0,
              __typename: 'PlannerChannelListObject'
            },
            {
              id: 'a46a6605-4667-41ae-920a-065be8710c15',
              title: 'sample channel 6',
              description: 'Some description',
              status: 'INACTIVE',
              order: 2,
              catalogId: 'f3699bf6-f58b-4430-b872-966f2b572a96',
              imageUrl: null,
              videoCount: 0,
              __typename: 'PlannerChannelListObject'
            }
          ],
          paging: {
            currentToken,
            nextToken: '23a228a3-fa65-4b8c-87c1-576bb49659ad',
            limit: 15,
            __typename: 'Paging'
          },
          __typename: 'PlannerPaginatedChannels'
        }
      }
    }
  },
  {
    request: {
      query: getVideosQuery,
      variables: {
        input: {
          filter: "status eq 'Available' AND tags eq 'include-in-library'",
          limit: 25,
          sort: 'title:ASC'
        }
      }
    },
    result: {
      data: {
        getVideos: {
          data: [
            {
              catalogs: [],
              created: '2024-02-21T17:32:16.413Z',
              createdBy: null,
              description: '',
              duration: 12000,
              events: ['00000000-0000-0000-0000-000000000000'],
              exhibitors: [],
              id: 'fa84d42c-2d43-47ec-a910-cd7cebeba15a',
              lastModified: '2024-02-21T17:32:58.991Z',
              lastModifiedBy: null,
              sessions: [],
              source: null,
              sourceProvider: 'CVENT_VIDEO',
              speakers: [],
              status: 'Available',
              thumbnail: null,
              title: 'video-b',
              generatedThumbnail: {
                url: {
                  href: 'https://images-lower.cvent.com/uvs/T2/7f378243-2c62-49fa-82e9-90e5498d30c3/00000000-0000-0000-0000-000000000000/fa84d42c-2d43-47ec-a910-cd7cebeba15a/converted-videos-1708536740/poster/poster.jpg'
                }
              },
              tags: ['active', 'include-in-library']
            }
          ],
          paging: {
            currentToken,
            nextToken: '23a228a3-fa65-4b8c-87c1-576bb49659ad',
            limit: 15,
            __typename: 'Paging'
          },
          __typename: 'PlannerPaginatedChannels'
        }
      }
    }
  }
];

const mockSetIsPageEdited = jest.fn();
const mockOnSectionUpdate = jest.fn();
const mockSetSelectedSection = jest.fn();
const mockGetUpdatedSectionIds = jest.fn().mockReturnValue({
  temporarySectionId: uuidV4(),
  updatedSectionIds: []
});
let pageSection: PageSection;

describe('Single Channel Section', () => {
  beforeEach(() => {
    pageSection = channelSectionData();
  });
  it('Should render without errors', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <SingleChannelSection
            pageSection={{
              ...channelsListSection,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const channelSection = await screen.findByTextKey('home_page_custom_single_channel_section_description');
    expect(channelSection).toBeInTheDocument();
    expect(screen.getByTestId('single-channel-section-previewer')).toBeInTheDocument();
  });

  it('Should call setIsPageEdited and setUpdatedSectionIds when a field is edited in form for the first time', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <SingleChannelSection
            pageSection={{
              ...channelsListSection,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const channelNameDisplayed = await screen.findByTestId(
      'home_page_single_channel_14efb8fc-50f3-46d5-9814-f5485a2a1ba8'
    );
    expect(channelNameDisplayed).toBeInTheDocument();
    const displayNameInput = screen.getByTestId('title-input');
    fireEvent.change(displayNameInput, { target: { value: 'Channel title' } });

    expect(screen.getByTextKey('home_page_single_channel_videos_section_title')).toBeInTheDocument();
    const noOfChannelsRadioOption3 = screen.getByRole('radio', {
      key: 'home_page_default_videos_source_option_new_label'
    });
    expect(noOfChannelsRadioOption3).toBeInTheDocument();
  });
  it('Should call onSectionUpdate, setIsPageEdited and getUpdatedSectionIds when changes are made and clicked Done', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <SingleChannelSection
            pageSection={{
              ...channelsListSection,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const noOfChannelsRadioOption3 = screen.getByRole('radio', {
      key: 'home_page_default_videos_source_option_new_label'
    });
    expect(noOfChannelsRadioOption3).toBeInTheDocument();
    const descriptionElement = await screen.findByTextKey('home_page_custom_single_channel_section_description');
    expect(descriptionElement).toBeInTheDocument();
    const doneBtn = screen.getByTextKey('home_page_sections_add_section_modal_footer_btn_done');
    expect(doneBtn).toBeInTheDocument();
    fireEvent.click(doneBtn);
    expect(mockSetIsPageEdited).toHaveBeenCalled();
    expect(mockGetUpdatedSectionIds).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockOnSectionUpdate).toHaveBeenCalled();
    });
  });

  it('displays a Time Frame dropdown when Top is selected', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <SingleChannelSection
            pageSection={pageSection}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    displayTimeFrameOptions(pageSection.sectionId);
    expect(screen.getByTestId(`home_page_content_filter_time_window_${pageSection.sectionId}`)).toBeInTheDocument();
  });

  it('does not display a Time Frame dropdown when New is selected', () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <SingleChannelSection
            pageSection={pageSection}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const newRadioEl = screen.getByTestId(`videos-section-source-${pageSection.sectionId}__new-videos`);
    fireEvent.click(newRadioEl);
    expect(
      screen.queryByTestId(`home_page_content_filter_time_window_${pageSection.sectionId}`)
    ).not.toBeInTheDocument();
  });

  it('presents Time frame options: Last 7 days, Last 30 days, Last 90 days, All time', () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <SingleChannelSection
            pageSection={pageSection}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    displayTimeFrameOptions(pageSection.sectionId);
    const dropdown = screen.getByTestId(`home_page_content_filter_time_window_${pageSection.sectionId}`);
    fireEvent.click(dropdown);
    expect(
      screen.getByTestId(`home_page_content_filter_time_window_${pageSection.sectionId}-option-0`)
    ).toHaveTextContent('Last 7 days');
    expect(
      screen.getByTestId(`home_page_content_filter_time_window_${pageSection.sectionId}-option-1`)
    ).toHaveTextContent('Last 30 days');
    expect(
      screen.getByTestId(`home_page_content_filter_time_window_${pageSection.sectionId}-option-2`)
    ).toHaveTextContent('Last 90 days');
    expect(
      screen.getByTestId(`home_page_content_filter_time_window_${pageSection.sectionId}-option-3`)
    ).toHaveTextContent('All time');
  });

  it('display Select Videos button when Custom us selected', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <SingleChannelSection
            pageSection={pageSection}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const newRadioEl = screen.getByTestId(`videos-section-source-${pageSection.sectionId}__custom`);
    fireEvent.click(newRadioEl);
    const selectBtn = await screen.findByRole('button', { key: 'home_page_single_channel_select_videos_button' });
    expect(selectBtn).toBeInTheDocument();
  });

  it('should not show previewer on Mobile screens', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <BreakpointMocker isS>
            <SingleChannelSection
              pageSection={pageSection}
              setIsPageEdited={mockSetIsPageEdited}
              onSectionUpdate={mockOnSectionUpdate}
              getUpdatedSectionIds={mockGetUpdatedSectionIds}
              setSelectedSection={mockSetSelectedSection}
              setShowSectionTemplate={jest.fn()}
            />
          </BreakpointMocker>
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.queryByTestId('single-channel-section-previewer')).not.toBeInTheDocument();
    const previewText = screen.getByTextKey('home_page_sections_mobile_preview_text');
    expect(previewText).toBeInTheDocument();
  });
});
