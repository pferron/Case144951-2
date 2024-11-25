import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import { HUB_PAGES } from '@cvent/planner-event-hubs-model/operations/banner';
import { newSectionTemplates } from '@components/homepage-customization/HomePageSectionMeta';
import { BreakpointMocker } from '@utils/testUtil/BreakpointMocker';
import { v4 as uuidV4 } from 'uuid';
import NewSection from '../NewSection';

const newSection = {
  sectionId: 'f47ac10b-58cc-4372-a567-0e02b2c3d478',
  originPageId: '6d3d0b64-2c6f-4d5b-8d4a-1a0a9e6ae0ef',
  pageSectionTemplate: 'TextImage',
  title: 'New Section',
  contentLimitOnInitialLoad: 3,
  featuredContentType: 'calendarName-1',
  featuredContentTypeId: 'calendarId-1',
  contentType: null,
  contentIds: null,
  contentFilterDateAbstract: null,
  alignment: 'Left',
  layout: newSectionTemplates.TextAndColorBackground,
  textBody: 'New Section Description',
  textColor: '#000000',
  buttonEnabled: true,
  buttonText: 'New Section Button',
  buttonExternalTarget: 'https://www.google.com',
  buttonInternalTarget: 'Other link',
  buttonTargetType: 'External',
  imageUrl:
    'https://images-lower.cvent.com/S606/f6d746482c09496fa3e3e3f6cd1503a0/video-center/55113f0a-9f28-4257-8c0e-3ca34f44c4b9/banner/48b8279e-36af-4324-b5b3-2055911a815a/69f8c46a294a908fff6c5c83df6af5c8!_!56c9871d97eb0444b64299d9a13a6225.png',
  originalImageUrl:
    'https://silo606-custom.core.cvent.org/f6d746482c09496fa3e3e3f6cd1503a0/video-center/55113f0a-9f28-4257-8c0e-3ca34f44c4b9/banner/48b8279e-36af-4324-b5b3-2055911a815a/connections.png',
  imageAltText: 'New Section',
  rowName: '2ff9b4d1-3b53-4b2c-8f3f-9e1eb2d51a6f'
};

const newSectionInsetImage = {
  ...newSection,
  layout: newSectionTemplates.InsetImage
};

const newSectionInsetImageWithoutImage = {
  ...newSection,
  imageUrl: null,
  originalImageUrl: null,
  layout: newSectionTemplates.InsetImage
};

const newSectionFullImage = {
  ...newSection,
  layout: null // Default to FullImageBackground
};

const mockSetIsPageEdited = jest.fn();
const mockOnSectionUpdate = jest.fn();
const mockSetShowSectionTemplate = jest.fn();
const mockSetSelectedSection = jest.fn();
const mockGetUpdatedSectionIds = jest.fn().mockReturnValue({
  temporarySectionId: uuidV4(),
  updatedSectionIds: []
});

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/path',
      route: '/route',
      query: { isSuccess: true, 'video-center': 'test' },
      replace: jest.fn()
    };
  }
}));

jest.mock('@hooks/useCenterInfo', () => {
  const originalModule = jest.requireActual('@hooks/useCenterInfo');
  return {
    __esModule: true,
    ...originalModule,
    useCenterInfo: jest.fn().mockReturnValue({
      theme: {
        actionColor: '#1a6137',
        backgroundColor: '#1ce6e6',
        logoImageRelativePath: null,
        logoImageUrl: null,
        logoAltText: null,
        mainColor: '#1622e6',
        logoOriginalImageUrl: '',
        moodColor: 'white',
        safeMode: false,
        faviconUrl: '',
        headingsFont: null,
        bodyFont: null
      }
    })
  };
});

const MOCK_HUB_PAGES = {
  request: {
    query: HUB_PAGES,
    variables: {
      id: {
        id: 'test'
      }
    }
  },
  result: {
    data: {
      hubPages: {
        data: []
      }
    }
  }
};

describe('New Section', () => {
  it('Should render text and color background without errors', async () => {
    const { container } = render(
      <MockedProvider mocks={[MOCK_HUB_PAGES]}>
        <TestWrapper>
          <NewSection
            pageSection={{
              ...newSection,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setShowSectionTemplate={mockSetShowSectionTemplate}
            setSelectedSection={mockSetSelectedSection}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.getByTestId('banner-preview')).toBeInTheDocument();
    expect(screen.queryByTestId('image-replace-button')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should render text and color background template in medium screen', async () => {
    const { container } = render(
      <MockedProvider mocks={[MOCK_HUB_PAGES]}>
        <TestWrapper>
          <BreakpointMocker isS>
            <NewSection
              pageSection={{
                ...newSection,
                __typename: 'PageSection'
              }}
              setIsPageEdited={mockSetIsPageEdited}
              onSectionUpdate={mockOnSectionUpdate}
              getUpdatedSectionIds={mockGetUpdatedSectionIds}
              setShowSectionTemplate={mockSetShowSectionTemplate}
              setSelectedSection={mockSetSelectedSection}
            />
          </BreakpointMocker>
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.getByTestId('banner-preview')).toBeInTheDocument();
    expect(screen.queryByTestId('image-replace-button')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should render inset image without errors', async () => {
    render(
      <MockedProvider mocks={[MOCK_HUB_PAGES]}>
        <TestWrapper>
          <NewSection
            pageSection={{
              ...newSectionInsetImage,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setShowSectionTemplate={mockSetShowSectionTemplate}
            setSelectedSection={mockSetSelectedSection}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.getByTestId('banner-preview')).toBeInTheDocument();
    const linkElement = screen.getByTitle('connections.png');
    expect(linkElement).toBeInTheDocument();
    // CARINA-8302 and CARINA-8303 to fix accessibility issues in FileUploadReadOnly
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('Should not be able to create a section without image', async () => {
    const { container } = render(
      <MockedProvider mocks={[MOCK_HUB_PAGES]}>
        <TestWrapper>
          <NewSection
            pageSection={{
              ...newSectionInsetImageWithoutImage,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setShowSectionTemplate={mockSetShowSectionTemplate}
            setSelectedSection={mockSetSelectedSection}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.getByTestId('banner-preview')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeDisabled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should render full image background without errors', async () => {
    render(
      <MockedProvider mocks={[MOCK_HUB_PAGES]}>
        <TestWrapper>
          <NewSection
            pageSection={{
              ...newSectionFullImage,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setShowSectionTemplate={mockSetShowSectionTemplate}
            setSelectedSection={mockSetSelectedSection}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.getByTestId('banner-preview')).toBeInTheDocument();
    const linkElement = screen.getByTitle('connections.png');
    expect(linkElement).toBeInTheDocument();
    // CARINA-8302 and CARINA-8303 to fix accessibility issues in FileUploadReadOnly
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('Should call onSectionUpdate, getUpdatedSectionIds, and setIsPageEdited when changes are made', async () => {
    render(
      <MockedProvider mocks={[MOCK_HUB_PAGES]}>
        <TestWrapper>
          <NewSection
            pageSection={{
              ...newSection,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setShowSectionTemplate={mockSetShowSectionTemplate}
            setSelectedSection={mockSetSelectedSection}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const titleTextbox = screen.getAllByRole('textbox');
    expect(titleTextbox[0]).toBeInTheDocument();
    fireEvent.change(titleTextbox[0], { target: { value: 'New Title' } });
    const doneBtn = screen.getByTextKey('home_page_sections_add_section_modal_footer_btn_done');
    expect(doneBtn).toBeInTheDocument();
    fireEvent.click(doneBtn);
    expect(mockSetIsPageEdited).toHaveBeenCalled();
    expect(mockGetUpdatedSectionIds).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockOnSectionUpdate).toHaveBeenCalled();
    });
  });

  it('Should have options to download edit and delete the already uploaded image', async () => {
    render(
      <MockedProvider mocks={[MOCK_HUB_PAGES]}>
        <TestWrapper>
          <NewSection
            pageSection={{
              ...newSectionInsetImage,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setShowSectionTemplate={mockSetShowSectionTemplate}
            setSelectedSection={mockSetSelectedSection}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const uploadedFile = await screen.findByTestId('section-image-upload-readOnly');
    expect(uploadedFile).toBeInTheDocument();
    const optionsBtn = await within(uploadedFile).findByRole('button');
    fireEvent.click(optionsBtn);
    expect(await screen.findByTextKey('download_button_label')).toBeInTheDocument();
    expect(await screen.findByTextKey('image_edit_button')).toBeInTheDocument();
    expect(await screen.findByTextKey('image_delete_button')).toBeInTheDocument();
  });

  it('Should show an alert if the image layout is changed and the image is already present', async () => {
    render(
      <MockedProvider mocks={[MOCK_HUB_PAGES]}>
        <TestWrapper>
          <NewSection
            pageSection={{
              ...newSectionInsetImage,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setShowSectionTemplate={mockSetShowSectionTemplate}
            setSelectedSection={mockSetSelectedSection}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const uploadedFile = await screen.findByTestId('section-image-upload-readOnly');
    expect(uploadedFile).toBeInTheDocument();
    const fullImageBgOption = screen.getByTextKey('Banners-Template-Selection-Full-Image-Title');
    fireEvent.click(fullImageBgOption);
    const alertMessage = await screen.findByTextKey('home_page_sections_image_template_change_alert_msg');
    expect(alertMessage).toBeInTheDocument();
  });
});
