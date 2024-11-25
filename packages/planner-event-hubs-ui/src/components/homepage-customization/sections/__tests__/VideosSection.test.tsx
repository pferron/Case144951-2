import { MockedProvider } from '@apollo/client/testing';
import { PageSection } from '@cvent/planner-event-hubs-model/types';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import userEvent from '@testing-library/user-event';
import { v4 as uuidV4 } from 'uuid';
import { ContentFilterType, PageSectionTemplates } from '../../HomePageSectionMeta';
import VideosSection from '../VideosSection';

const videoSectionData = (scenario?: string): PageSection => {
  const scenarios = {
    default: {
      title: "What's New",
      pageSectionTemplate: PageSectionTemplates.DEFAULT_VIDEOS,
      sectionId: uuidV4(),
      originPageId: null,
      contentFilterType: ContentFilterType.NEW_VIDEOS
    },
    nullTitle: {
      title: null,
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

const setIsPageEdited = jest.fn();
const onSectionUpdate = jest.fn();
const setSelectedSection = jest.fn();
const getUpdatedSectionIds = jest.fn().mockReturnValue({
  temporarySectionId: uuidV4(),
  updatedSectionIds: []
});
let pageSection: PageSection;

describe('VideosSection', () => {
  beforeEach(() => {
    pageSection = videoSectionData();
  });

  it('meets accessibility guidelines', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <VideosSection
            pageSection={pageSection}
            setIsPageEdited={setIsPageEdited}
            onSectionUpdate={onSectionUpdate}
            getUpdatedSectionIds={getUpdatedSectionIds}
            setSelectedSection={setSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has Source options: Top, New', () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <VideosSection
            pageSection={pageSection}
            setIsPageEdited={setIsPageEdited}
            onSectionUpdate={onSectionUpdate}
            getUpdatedSectionIds={getUpdatedSectionIds}
            setSelectedSection={setSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.getByTestId(`videos-section-source-${pageSection.sectionId}__top-videos`)).toBeInTheDocument();
    expect(screen.getByTestId(`videos-section-source-${pageSection.sectionId}__new-videos`)).toBeInTheDocument();
  });

  it('displays a Time Frame dropdown when Top is selected', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <VideosSection
            pageSection={pageSection}
            setIsPageEdited={setIsPageEdited}
            onSectionUpdate={onSectionUpdate}
            getUpdatedSectionIds={getUpdatedSectionIds}
            setSelectedSection={setSelectedSection}
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
          <VideosSection
            pageSection={pageSection}
            setIsPageEdited={setIsPageEdited}
            onSectionUpdate={onSectionUpdate}
            getUpdatedSectionIds={getUpdatedSectionIds}
            setSelectedSection={setSelectedSection}
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
          <VideosSection
            pageSection={pageSection}
            setIsPageEdited={setIsPageEdited}
            onSectionUpdate={onSectionUpdate}
            getUpdatedSectionIds={getUpdatedSectionIds}
            setSelectedSection={setSelectedSection}
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

  it('calls setIsPageEdited, onSectionUpdate, and getUpdatedSectionIds when form is edited and clicked on Done', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <VideosSection
            pageSection={pageSection}
            setIsPageEdited={setIsPageEdited}
            onSectionUpdate={onSectionUpdate}
            getUpdatedSectionIds={getUpdatedSectionIds}
            setSelectedSection={setSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    displayTimeFrameOptions(pageSection.sectionId);
    const cardEl = await screen.findByTextKey(`home_page_default_videos_purpose`);
    expect(cardEl).toBeInTheDocument();
    const doneBtn = screen.getByTextKey('home_page_sections_add_section_modal_footer_btn_done');
    expect(doneBtn).toBeInTheDocument();
    fireEvent.click(doneBtn);
    expect(getUpdatedSectionIds).toHaveBeenCalled();
    await waitFor(() => {
      expect(onSectionUpdate).toHaveBeenCalled();
    });
  });

  it('Should display the default Videos value in title when title is null', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <VideosSection
            pageSection={videoSectionData('nullTitle')}
            setIsPageEdited={setIsPageEdited}
            onSectionUpdate={onSectionUpdate}
            getUpdatedSectionIds={getUpdatedSectionIds}
            setSelectedSection={setSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const titleInput = await screen.findByTestId('title-input');
    expect(titleInput).toHaveValue('Videos');
  });

  it('Should display the Videos title when title is not null', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <VideosSection
            pageSection={pageSection}
            setIsPageEdited={setIsPageEdited}
            onSectionUpdate={onSectionUpdate}
            getUpdatedSectionIds={getUpdatedSectionIds}
            setSelectedSection={setSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const titleInput = await screen.findByTestId('title-input');
    expect(titleInput).toHaveValue("What's New");
  });

  it('Should disable the done button when title is empty', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <VideosSection
            pageSection={pageSection}
            setIsPageEdited={setIsPageEdited}
            onSectionUpdate={onSectionUpdate}
            getUpdatedSectionIds={getUpdatedSectionIds}
            setSelectedSection={setSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const titleInput = await screen.findByTestId('title-input');
    await userEvent.clear(titleInput);
    const doneBtn = await screen.findByRole('button', { key: 'home_page_sections_add_section_modal_footer_btn_done' });
    expect(doneBtn).toBeDisabled();
  });
});
