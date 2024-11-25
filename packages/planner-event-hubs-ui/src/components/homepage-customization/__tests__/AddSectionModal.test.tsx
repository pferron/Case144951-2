import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import AddSectionModal from '../AddSectionModal';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/path',
      route: '/route',
      query: { isSuccess: true },
      replace: jest.fn()
    };
  }
}));

const mockGetUpdatedSectionIds = jest.fn();

describe('AddSectionModal', () => {
  it('renders button initially and open the modal when clicked on it', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <AddSectionModal
            defaultSectionsToAdd={[]}
            disableBtn={false}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const addSectionBtn = await screen.findByRole('button', { key: 'home_page_sections_add_section_btn_txt' });
    expect(addSectionBtn).toBeInTheDocument();
    fireEvent.click(addSectionBtn);
    const modalTitle = await screen.findByTextKey('home_page_sections_add_section_modal_title');
    expect(modalTitle).toBeInTheDocument();
    const addBtn = await screen.findByRole('button', { key: 'home_page_sections_add_section_modal_footer_btn_add' });
    expect(addBtn).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should display tiles passed in defaultSectionsToAdd', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <AddSectionModal
            defaultSectionsToAdd={['DefaultChannels', 'DefaultUpcomingEvents']}
            disableBtn={false}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const addSectionBtn = await screen.findByRole('button', { key: 'home_page_sections_add_section_btn_txt' });
    expect(addSectionBtn).toBeInTheDocument();
    fireEvent.click(addSectionBtn);
    // Check Upcoming Events Section
    const upcomingEventsTile = await screen.findByTextKey('home_page_sections_add_section_upcmg_events');
    expect(upcomingEventsTile).toBeInTheDocument();
  });

  it('should call onAddSectionHandler when a section tile is clicked', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <AddSectionModal
            defaultSectionsToAdd={['DefaultChannels', 'DefaultUpcomingEvents']}
            disableBtn={false}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const addSectionBtn = await screen.findByRole('button', { key: 'home_page_sections_add_section_btn_txt' });
    expect(addSectionBtn).toBeInTheDocument();
    fireEvent.click(addSectionBtn);
    const upcomingEventsTile = await screen.findByTextKey('home_page_sections_add_section_upcmg_events');
    expect(upcomingEventsTile).toBeInTheDocument();
    fireEvent.click(upcomingEventsTile);
    const addBtn = await screen.findByRole('button', { key: 'home_page_sections_add_section_modal_footer_btn_add' });
    fireEvent.click(addBtn);
    expect(screen.getByTestId('add-section-details-modal')).toBeInTheDocument();
  });

  it('Should close the modal when X icon is clicked', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <AddSectionModal
            defaultSectionsToAdd={['DefaultChannels', 'DefaultUpcomingEvents']}
            disableBtn={false}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const addSectionBtn = await screen.findByRole('button', { key: 'home_page_sections_add_section_btn_txt' });
    expect(addSectionBtn).toBeInTheDocument();
    fireEvent.click(addSectionBtn);

    // Close add section modal
    const addSectionModalCloseBtn = await screen.findByTestId('close-select-section-modal');
    fireEvent.click(addSectionModalCloseBtn);
    expect(screen.queryByTextKey('home_page_sections_add_section_new_section')).not.toBeInTheDocument();
  });
});
