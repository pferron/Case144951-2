import { MockedProvider } from '@apollo/client/testing';
import InsertImageTemplate from '@components/banners/icons/InsertImageTemplate';
import { fireEvent, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { screen } from 'nucleus-text/testing-library/screen';
import { BannerTemplateSectionTile, SectionTile } from '../AddSectionTiles';

const mockSetSelectedSection = jest.fn();
const mockSetSelectedTemplate = jest.fn();

describe('SectionTile', () => {
  it('should render the tile with correct title and description', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <SectionTile
            testId="test-id1"
            setSelectedSection={mockSetSelectedSection}
            selectedSectionInState=""
            defaultSectionValue=""
            title="Test Title"
            description="Test Description"
          />
        </TestWrapper>
      </MockedProvider>
    );

    expect(await screen.findByText('Test Title')).toBeInTheDocument();
    expect(await screen.findByText('Test Description')).toBeInTheDocument();
  });

  it('should call setSelectedSection when a section is selected', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <SectionTile
            testId="test-id2"
            setSelectedSection={mockSetSelectedSection}
            selectedSectionInState=""
            defaultSectionValue="section1"
            title="Test Title"
            description="Test Description"
          />
        </TestWrapper>
      </MockedProvider>
    );
    const title = await screen.findByText('Test Title');
    expect(title).toBeInTheDocument();
    fireEvent.click(title);
    expect(mockSetSelectedSection).toHaveBeenCalled();
  });

  describe('BannerTemplateSectionTile', () => {
    it('should render the tile with correct title and description', async () => {
      render(
        <MockedProvider>
          <TestWrapper>
            <BannerTemplateSectionTile
              testId="test-id3"
              image={<InsertImageTemplate />}
              title="Banner Title"
              description="Banner Description"
              tileTemplate="template1"
              setSelectedTemplate={mockSetSelectedTemplate}
              selectedTemplateInState=""
            />
          </TestWrapper>
        </MockedProvider>
      );

      const title = await screen.findByText('Banner Title');
      expect(title).toBeInTheDocument();
      expect(await screen.findByText('Banner Description')).toBeInTheDocument();
    });

    it('should call setSelectedTemplate when a template is selected', async () => {
      render(
        <MockedProvider>
          <TestWrapper>
            <BannerTemplateSectionTile
              testId="test-id4"
              image={<InsertImageTemplate />}
              title="Banner Title"
              description="Banner Description"
              tileTemplate="template1"
              setSelectedTemplate={mockSetSelectedTemplate}
              selectedTemplateInState=""
            />
          </TestWrapper>
        </MockedProvider>
      );
      const title = await screen.findByText('Banner Title');
      expect(title).toBeInTheDocument();
      fireEvent.click(title);
      expect(mockSetSelectedTemplate).toHaveBeenCalled();
    });
  });
});
