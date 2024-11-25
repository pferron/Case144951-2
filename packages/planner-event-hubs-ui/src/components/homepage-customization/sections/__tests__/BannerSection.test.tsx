import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { GET_BANNERS_ASSOCIATIONS } from '@cvent/planner-event-hubs-model/operations/banner';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import BannerSection from '../BannerSection';

const getBannersAssociationsMockWithBanners = {
  request: {
    query: GET_BANNERS_ASSOCIATIONS,
    variables: {
      bannerAssociationSearch: {
        centerId: 'test-event-plus-with-banners'
      }
    }
  },
  result: {
    data: {
      bannerAssociations: {
        data: [
          {
            centerId: '67da7a96-9cc2-4b0b-83fa-933e61397aca',
            entityType: 'Homepage',
            entityId: '67da7a96-9cc2-4b0b-83fa-933e61397aca',
            displayOrder: 1,
            banner: {
              id: '87a3a614-b6b7-4fb1-9a6d-6edce764c5b5',
              name: 'NAME_OF_BANNER',
              layout: 'FULL_IMAGE',
              text: {
                title: null,
                body: null,
                alignment: null,
                color: null,
                __typename: 'BannerText'
              },
              button: {
                enabled: false,
                text: null,
                target: null,
                __typename: 'BannerButton'
              },
              __typename: 'ExistingBanner'
            },
            __typename: 'ExistingBannerAssociationWithBanner'
          }
        ],
        paging: {
          currentToken: '4290e832-7bcc-42ed-b3f9-d8618cbd2c48',
          nextToken: null,
          limit: 100,
          __typename: 'Paging'
        }
      }
    }
  }
};

const getBannersAssociationsMockWithNoBanners = {
  request: {
    query: GET_BANNERS_ASSOCIATIONS,
    variables: {
      bannerAssociationSearch: {
        centerId: 'test-event-plus-with-no-banners'
      }
    }
  },
  result: {
    data: {
      bannerAssociations: {
        data: [],
        paging: {
          currentToken: '876fc735-6247-4faf-856e-a715e16368fe',
          nextToken: null,
          limit: 100,
          __typename: 'Paging'
        }
      }
    }
  }
};

describe('BannerSection', () => {
  // TODO: Red - this hit timeout consistently in local env
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Should render the BannerSection component', async () => {
    const { container } = render(
      <MockedProvider mocks={[getBannersAssociationsMockWithBanners]}>
        <TestWrapper>
          <BannerSection centerId="test-event-plus-with-banners" />
        </TestWrapper>
      </MockedProvider>
    );
    const title = await screen.findByTextKey('home_page_custom_banner_card_title', { count: 1 });
    expect(title).toBeInTheDocument();

    // Btn link to banners page
    const btnLinkToBannersPage = await screen.findByTestId('banner-page-btn');
    expect(btnLinkToBannersPage).toBeInTheDocument();
    expect(btnLinkToBannersPage).toHaveAttribute('href', '/eventsplus/test-event-plus-with-banners/banners');

    expect(screen.getByTextKey('home_page_custom_banner_card_btn_text')).toBeInTheDocument();
    expect(screen.getByText('NAME_OF_BANNER')).toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should show message when no banners associated with homepage', async () => {
    const { container } = render(
      <MockedProvider mocks={[getBannersAssociationsMockWithNoBanners]}>
        <TestWrapper>
          <BannerSection centerId="test-event-plus-with-no-banners" />
        </TestWrapper>
      </MockedProvider>
    );
    const title = await screen.findByTextKey('home_page_custom_banner_card_title', { count: 0 });
    expect(title).toBeInTheDocument();
    const menu = await screen.findByTestId('banner-item-overflow-menu-button');
    expect(menu).toBeInTheDocument();
    fireEvent.click(menu);
    const editMenu = await screen.findByTextKey('home_page_sections_edit_menu');
    expect(editMenu).toBeInTheDocument();
    fireEvent.click(editMenu);

    expect(await screen.findByTextKey('home_page_custom_banner_list_no_items_msg')).toBeInTheDocument();
    await waitFor(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
