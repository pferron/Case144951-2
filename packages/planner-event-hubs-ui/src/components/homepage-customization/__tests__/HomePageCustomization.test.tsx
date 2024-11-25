import { MockedProvider } from '@apollo/client/testing';
import HomepageCustomization from '@components/homepage-customization/HomepageCustomization';
import {
  createPageMutation,
  createSectionMutation,
  getPublishedPageOrDefaults,
  updatePageMutation,
  updateSectionMutation
} from '@cvent/planner-event-hubs-model/src/operations/homepageCustomization';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { GET_BANNERS_ASSOCIATIONS } from '@cvent/planner-event-hubs-model/operations/banner';
import { GET_CALENDAR_LIST } from '@cvent/planner-event-hubs-model/operations/upcomingEvents';
import { screen } from 'nucleus-text/testing-library/screen';
import { getCenterFeatures } from '@cvent/planner-event-hubs-model/operations/hub';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';

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

jest.mock('@hooks/useCenterInfo', () => ({
  useCenterInfo: () => {
    return {
      calendarId: 'calendarId-1'
    };
  }
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid')
}));

const getCenterFeaturesMock = {
  request: {
    query: getCenterFeatures,
    variables: {
      id: {
        id: 'test-event-plus-hub'
      }
    }
  },
  result: {
    data: {
      getCenterFeatures: [
        {
          code: 'PROFILE_SETUP',
          enabled: true
        },
        {
          code: 'YOUR_EVENTS',
          enabled: true
        },
        {
          code: 'CONNECTIONS',
          enabled: true
        },
        {
          code: 'UPCOMING_EVENTS',
          enabled: true
        }
      ]
    }
  }
};

const createPageMutationMock = {
  request: {
    query: createPageMutation,
    variables: {
      page: {
        pageId: 'mocked-uuid',
        videoCenterId: 'test-event-plus-hub',
        status: 'Draft',
        sectionIds: ['mocked-uuid', 'channel-section-id']
      },
      newSection: {
        sectionId: 'mocked-uuid',
        originPageId: 'mocked-uuid',
        pageSectionTemplate: 'DefaultUpcomingEvents',
        title: 'Section title',
        visibleFields: ['field 1', 'field 2'],
        contentLimitOnInitialLoad: 4,
        featuredContentType: 'featured content type',
        featuredContentTypeId: '39d6ed4a-f090-402c-8f66-00b9025a1e62',
        contentType: 'content type',
        contentIds: [
          'da9a0663-08f2-45be-a5db-7f49e04dcbbf',
          '95332cdb-e081-459a-8032-78a5698b3221',
          '34e8815b-0f6a-49b1-b2e6-ac8c6a8c932b'
        ],
        contentFilterType: 'new-videos',
        contentFilterDateAbstract: 'content filter date abstract',
        alignment: 'Top',
        layout: 'FullImage',
        textBody: 'text body',
        textColor: '#AABBCC',
        buttonEnabled: true,
        buttonText: 'button text',
        buttonExternalTarget: 'button external target',
        buttonInternalTarget: 'button internal target',
        buttonTargetType: 'Internal',
        imageUrl: 'https://some.imageurl.com',
        originalImageUrl: 'https://some.originalimageurl.com',
        imageAltText: 'Image alt text'
      }
    }
  },
  result: {
    data: {
      createPage: {
        newSection: {
          sectionId: 'mocked-uuid',
          originPageId: 'mocked-uuid',
          pageSectionTemplate: 'DefaultUpcomingEvents',
          title: 'Section title',
          visibleFields: ['field 1', 'field 2'],
          contentLimitOnInitialLoad: 4,
          featuredContentType: 'featured content type',
          featuredContentTypeId: '39d6ed4a-f090-402c-8f66-00b9025a1e62',
          contentType: 'content type',
          contentIds: [
            'da9a0663-08f2-45be-a5db-7f49e04dcbbf',
            '95332cdb-e081-459a-8032-78a5698b3221',
            '34e8815b-0f6a-49b1-b2e6-ac8c6a8c932b'
          ],
          contentFilterType: 'new-videos',
          contentFilterDateAbstract: 'content filter date abstract',
          alignment: 'Top',
          layout: 'FullImage',
          textBody: 'text body',
          textColor: '#AABBCC',
          buttonEnabled: true,
          buttonText: 'button text',
          buttonExternalTarget: 'button external target',
          buttonInternalTarget: 'button internal target',
          buttonTargetType: 'Internal',
          imageUrl: 'https://some.imageurl.com',
          originalImageUrl: 'https://some.originalimageurl.com',
          imageAltText: 'Image alt text'
        },
        page: {
          pageId: 'mocked-uuid',
          sectionIds: ['mocked-uuid', 'channel-section-id'],
          videoCenterId: 'test-event-plus-hub'
        }
      }
    }
  }
};

const createPageMutationOnDeleteMock = {
  request: {
    query: createPageMutation,
    variables: {
      page: {
        pageId: 'mocked-uuid',
        videoCenterId: 'test-event-plus-hub',
        status: 'Draft',
        sectionIds: ['calendar-section-id']
      },
      newSection: null
    }
  },
  result: {
    data: {
      createPage: {
        newSection: null,
        page: {
          pageId: 'mocked-uuid',
          sectionIds: ['calendar-section-id'],
          status: 'Draft',
          videoCenterId: 'test-event-plus-hub'
        }
      }
    }
  }
};

const createSectionMutationMock = {
  request: {
    query: createSectionMutation,
    variables: {
      input: {
        id: 'test-event-plus-hub'
      },
      data: {
        sectionId: 'mocked-uuid',
        originPageId: 'mocked-uuid',
        pageSectionTemplate: 'DefaultChannels',
        title: 'Section title',
        visibleFields: ['field 1', 'field 2', 'name'],
        contentLimitOnInitialLoad: 8,
        featuredContentType: 'featured content type',
        featuredContentTypeId: '39d6ed4a-f090-402c-8f66-00b9025a1e62',
        contentType: 'content type',
        contentIds: [
          'da9a0663-08f2-45be-a5db-7f49e04dcbbf',
          '95332cdb-e081-459a-8032-78a5698b3221',
          '34e8815b-0f6a-49b1-b2e6-ac8c6a8c932b'
        ],
        contentFilterType: 'new-videos',
        contentFilterDateAbstract: 'content filter date abstract',
        alignment: 'Left',
        layout: 'FullImage',
        textBody: 'text body',
        textColor: '#AABBCC',
        buttonEnabled: true,
        buttonText: 'button text',
        buttonExternalTarget: 'button external target',
        buttonInternalTarget: 'button internal target',
        buttonTargetType: 'Internal',
        imageUrl: 'https://some.imageurl.com',
        originalImageUrl: 'https://some.originalimageurl.com',
        imageAltText: 'Image alt text'
      }
    }
  },
  result: {
    data: {
      createSection: {
        sectionId: 'mocked-uuid',
        originPageId: 'mocked-uuid',
        pageSectionTemplate: 'DefaultChannels',
        title: 'Section title',
        visibleFields: ['field 1', 'field 2', 'name'],
        contentLimitOnInitialLoad: 8,
        featuredContentType: 'featured content type',
        featuredContentTypeId: '39d6ed4a-f090-402c-8f66-00b9025a1e62',
        contentType: 'content type',
        contentIds: [
          'da9a0663-08f2-45be-a5db-7f49e04dcbbf',
          '95332cdb-e081-459a-8032-78a5698b3221',
          '34e8815b-0f6a-49b1-b2e6-ac8c6a8c932b'
        ],
        contentFilterType: 'new-videos',
        contentFilterDateAbstract: 'content filter date abstract',
        alignment: 'Left',
        layout: 'FullImage',
        textBody: 'text body',
        textColor: '#AABBCC',
        buttonEnabled: true,
        buttonText: 'button text',
        buttonExternalTarget: 'button external target',
        buttonInternalTarget: 'button internal target',
        buttonTargetType: 'Internal',
        imageUrl: 'https://some.imageurl.com',
        originalImageUrl: 'https://some.originalimageurl.com',
        imageAltText: 'Image alt text'
      }
    }
  }
};

const updatePageMutationMock = {
  request: {
    query: updatePageMutation,
    variables: {
      data: {
        pageId: 'mocked-uuid',
        videoCenterId: 'test-event-plus-hub',
        status: 'Published',
        sectionIds: ['mocked-uuid', 'channel-section-id']
      }
    }
  },
  result: {
    data: {
      updatePage: {
        pageId: 'mocked-uuid',
        sectionIds: ['mocked-uuid', 'channel-section-id'],
        status: 'Published',
        videoCenterId: 'test-event-plus-hub'
      }
    }
  }
};

const updateSectionMutationMock = {
  request: {
    query: updateSectionMutation,
    variables: {
      input: {
        id: 'test-event-plus-hub'
      },
      data: {
        sectionId: 'mocked-uuid',
        originPageId: 'mocked-uuid',
        pageSectionTemplate: 'DefaultUpcomingEvents',
        title: 'Section title',
        visibleFields: ['field 1', 'field 2'],
        contentLimitOnInitialLoad: 4,
        featuredContentType: 'featured content type',
        featuredContentTypeId: '39d6ed4a-f090-402c-8f66-00b9025a1e62',
        contentType: 'content type',
        contentIds: [
          'da9a0663-08f2-45be-a5db-7f49e04dcbbf',
          '95332cdb-e081-459a-8032-78a5698b3221',
          '34e8815b-0f6a-49b1-b2e6-ac8c6a8c932b'
        ],
        contentFilterType: 'new-videos',
        contentFilterDateAbstract: 'content filter date abstract',
        alignment: 'Left',
        layout: 'FullImage',
        textBody: 'text body',
        textColor: '#AABBCC',
        buttonEnabled: true,
        buttonText: 'button text',
        buttonExternalTarget: 'button external target',
        buttonInternalTarget: 'button internal target',
        buttonTargetType: 'Internal',
        imageUrl: 'https://some.imageurl.com',
        originalImageUrl: 'https://some.originalimageurl.com',
        imageAltText: 'Image alt text'
      }
    }
  },
  result: {
    data: {
      updateSection: {
        sectionId: 'mocked-uuid',
        originPageId: 'mocked-uuid',
        pageSectionTemplate: 'DefaultUpcomingEvents',
        title: 'Section title',
        visibleFields: ['field 1', 'field 2'],
        contentLimitOnInitialLoad: 4,
        featuredContentType: 'featured content type',
        featuredContentTypeId: '39d6ed4a-f090-402c-8f66-00b9025a1e62',
        contentType: 'content type',
        contentIds: [
          'da9a0663-08f2-45be-a5db-7f49e04dcbbf',
          '95332cdb-e081-459a-8032-78a5698b3221',
          '34e8815b-0f6a-49b1-b2e6-ac8c6a8c932b'
        ],
        contentFilterType: 'new-videos',
        contentFilterDateAbstract: 'content filter date abstract',
        alignment: 'Top',
        layout: 'FullImage',
        textBody: 'text body',
        textColor: '#AABBCC',
        buttonEnabled: true,
        buttonText: 'button text',
        buttonExternalTarget: 'button external target',
        buttonInternalTarget: 'button internal target',
        buttonTargetType: 'Internal',
        imageUrl: 'https://some.imageurl.com',
        originalImageUrl: 'https://some.originalimageurl.com',
        imageAltText: 'Image alt text'
      }
    }
  }
};

const getCalendarQueryMock = {
  request: {
    query: GET_CALENDAR_LIST,
    variables: {}
  },
  result: {
    data: {
      calendars: {
        data: [
          {
            id: 'calendarId-1',
            name: 'calendarName-1'
          },
          {
            id: 'calendarId-2',
            name: 'calendarName-2'
          }
        ]
      }
    }
  }
};

const mocks = [
  {
    request: {
      query: GET_BANNERS_ASSOCIATIONS,
      variables: {
        bannerAssociationSearch: {
          centerId: 'test-event-plus-hub'
        }
      }
    },
    result: {
      data: {
        bannerAssociations: {
          data: [
            {
              centerId: 'test-event-plus-hub',
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
  },
  {
    request: {
      query: getPublishedPageOrDefaults,
      variables: {
        input: {
          id: 'test-event-plus-hub'
        }
      }
    },
    result: {
      data: {
        getPublishedPageOrDefaults: {
          page: {
            pageId: '44d2e13a-5fcc-447a-b7cb-d048f8b6fd78',
            videoCenterId: 'test-event-plus-hub',
            status: 'Published',
            sectionIds: ['calendar-section-id', 'channel-section-id']
          },
          sections: [
            {
              sectionId: 'channel-section-id',
              originPageId: '7d7a5619-2057-4f0d-87c3-2c5ea57311e6',
              pageSectionTemplate: 'DefaultChannels',
              title: 'Section title',
              visibleFields: ['field 1', 'field 2'],
              contentLimitOnInitialLoad: 4,
              featuredContentType: 'featured content type',
              featuredContentTypeId: '39d6ed4a-f090-402c-8f66-00b9025a1e62',
              contentType: 'content type',
              contentIds: [
                'da9a0663-08f2-45be-a5db-7f49e04dcbbf',
                '95332cdb-e081-459a-8032-78a5698b3221',
                '34e8815b-0f6a-49b1-b2e6-ac8c6a8c932b'
              ],
              contentFilterType: 'new-videos',
              contentFilterDateAbstract: 'content filter date abstract',
              alignment: 'Left',
              layout: 'FullImage',
              textBody: 'text body',
              textColor: '#AABBCC',
              buttonEnabled: true,
              buttonText: 'button text',
              buttonExternalTarget: 'button external target',
              buttonInternalTarget: 'button internal target',
              buttonTargetType: 'Internal',
              imageUrl: 'https://some.imageurl.com',
              originalImageUrl: 'https://some.originalimageurl.com',
              imageAltText: 'Image alt text',
              __typename: 'PageSection'
            },
            {
              sectionId: 'calendar-section-id',
              originPageId: '7d7a5619-2057-4f0d-87c3-2c5ea57311e6',
              pageSectionTemplate: 'DefaultUpcomingEvents',
              title: 'Section title',
              visibleFields: ['field 1', 'field 2'],
              contentLimitOnInitialLoad: 4,
              featuredContentType: 'featured content type',
              featuredContentTypeId: '39d6ed4a-f090-402c-8f66-00b9025a1e62',
              contentType: 'content type',
              contentIds: [
                'da9a0663-08f2-45be-a5db-7f49e04dcbbf',
                '95332cdb-e081-459a-8032-78a5698b3221',
                '34e8815b-0f6a-49b1-b2e6-ac8c6a8c932b'
              ],
              contentFilterType: 'new-videos',
              contentFilterDateAbstract: 'content filter date abstract',
              alignment: 'Left',
              layout: 'FullImage',
              textBody: 'text body',
              textColor: '#AABBCC',
              buttonEnabled: true,
              buttonText: 'button text',
              buttonExternalTarget: 'button external target',
              buttonInternalTarget: 'button internal target',
              buttonTargetType: 'Internal',
              imageUrl: 'https://some.imageurl.com',
              originalImageUrl: 'https://some.originalimageurl.com',
              imageAltText: 'Image alt text',
              __typename: 'PageSection'
            }
          ]
        }
      }
    }
  }
];
const upcomingEventsSectionMock = {
  request: {
    query: getPublishedPageOrDefaults,
    variables: {
      input: {
        id: 'test-event-plus-hub'
      }
    },
    onCompleted: () => {
      jest.fn();
    }
  },
  result: {
    data: {
      getPublishedPageOrDefaults: {
        page: {
          pageId: '44d2e13a-5fcc-447a-b7cb-d048f8b6fd78',
          videoCenterId: 'test-event-plus-hub',
          status: 'Published',
          sectionIds: ['upcoming-events-section-id']
        },
        sections: [
          {
            sectionId: 'upcoming-events-section-id',
            originPageId: '7d7a5619-2057-4f0d-87c3-2c5ea57311e6',
            pageSectionTemplate: 'DefaultUpcomingEvents',
            title: 'Section title',
            visibleFields: null,
            contentLimitOnInitialLoad: 4,
            featuredContentType: 'featured content type',
            featuredContentTypeId: '39d6ed4a-f090-402c-8f66-00b9025a1e62',
            contentType: 'content type',
            contentIds: null,
            contentFilterType: 'new-videos',
            contentFilterDateAbstract: 'content filter date abstract',
            alignment: 'Left',
            layout: 'FullImage',
            textBody: 'text body',
            textColor: '#AABBCC',
            buttonEnabled: true,
            buttonText: 'button text',
            buttonExternalTarget: 'button external target',
            buttonInternalTarget: 'button internal target',
            buttonTargetType: 'Internal',
            imageUrl: 'https://some.imageurl.com',
            originalImageUrl: 'https://some.originalimageurl.com',
            imageAltText: 'Image alt text',
            __typename: 'PageSection'
          }
        ]
      }
    }
  }
};

const yourEventsSectionMock = {
  request: {
    query: getPublishedPageOrDefaults,
    variables: {
      input: {
        id: 'test-event-plus-hub'
      }
    },
    onCompleted: () => {
      jest.fn();
    }
  },
  result: {
    data: {
      getPublishedPageOrDefaults: {
        page: {
          pageId: '44d2e13a-5fcc-447a-b7cb-d048f8b6fd78',
          videoCenterId: 'test-event-plus-hub',
          status: 'Published',
          sectionIds: ['your-events-section-id']
        },
        sections: [
          {
            sectionId: 'your-events-section-id',
            originPageId: '7d7a5619-2057-4f0d-87c3-2c5ea57311e6',
            pageSectionTemplate: 'MyEventCalendar',
            title: 'Section title',
            visibleFields: null,
            contentLimitOnInitialLoad: 4,
            featuredContentType: 'featured content type',
            featuredContentTypeId: '39d6ed4a-f090-402c-8f66-00b9025a1e62',
            contentType: 'content type',
            contentIds: null,
            contentFilterType: 'new-videos',
            contentFilterDateAbstract: 'content filter date abstract',
            alignment: 'Left',
            layout: 'FullImage',
            textBody: 'text body',
            textColor: '#AABBCC',
            buttonEnabled: true,
            buttonText: 'button text',
            buttonExternalTarget: 'button external target',
            buttonInternalTarget: 'button internal target',
            buttonTargetType: 'Internal',
            imageUrl: 'https://some.imageurl.com',
            originalImageUrl: 'https://some.originalimageurl.com',
            imageAltText: 'Image alt text',
            __typename: 'PageSection'
          }
        ]
      }
    }
  }
};

const mocksWithNoData = [
  {
    request: {
      query: getPublishedPageOrDefaults,
      variables: {
        input: {
          id: 'test-event-plus-hub'
        }
      },
      onCompleted: () => {
        jest.fn();
      }
    },
    result: {
      data: {
        getPublishedPageOrDefaults: {
          page: null,
          sections: null
        }
      }
    }
  }
];

describe('HomepageCustomization', () => {
  it('should render the HomepageCustomization component', async () => {
    const { container } = render(
      <MockedProvider mocks={[...mocks, getCalendarQueryMock]}>
        <TestWrapper>
          <HomepageCustomization centerId="test-event-plus-hub" centerTitle="Title" />
        </TestWrapper>
      </MockedProvider>
    );
    const title = screen.getByTestId('homePage-customization-title');
    expect(title).toBeInTheDocument();
    expect(screen.queryByTextKey('home_page_custom_publish_success_message')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should render the HomepageCustomization component with table data', async () => {
    const { container } = render(
      <MockedProvider mocks={[...mocks, getCalendarQueryMock]}>
        <TestWrapper>
          <HomepageCustomization centerId="test-event-plus-hub" centerTitle="Title" />
        </TestWrapper>
      </MockedProvider>
    );
    const table = await screen.findByTestId('reorderable-table-fields');
    expect(table).toBeInTheDocument();
    const channelSection = await screen.findByTestId('reorderable-table-fields-row-0');
    expect(channelSection).toBeInTheDocument();
    expect(screen.getByTextKey('home_page_sections_add_section_channel_list')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should render the HomepageCustomization component without table data', async () => {
    const { container } = render(
      <MockedProvider mocks={mocksWithNoData}>
        <TestWrapper>
          <HomepageCustomization centerId="test-event-plus-hub" centerTitle="Title" />
        </TestWrapper>
      </MockedProvider>
    );

    const title = await screen.findByTestId('homePage-customization-title');
    expect(title).toBeInTheDocument();
    const table = screen.queryByTestId('reorderable-table-accordion');
    expect(table).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should call createPageMutation when an edit is made on the section first time', async () => {
    const { container } = render(
      <MockedProvider mocks={[...mocks, getCalendarQueryMock, createPageMutationMock, getCenterFeaturesMock]}>
        <TestWrapper>
          <HomepageCustomization centerId="test-event-plus-hub" centerTitle="Title" />
        </TestWrapper>
      </MockedProvider>
    );
    const table = await screen.findByTestId('reorderable-table-fields');
    expect(table).toBeInTheDocument();

    const menu = await screen.findByTestId('section-item-overflow-menu-button-DefaultUpcomingEvents');
    expect(menu).toBeInTheDocument();
    fireEvent.click(menu);

    const editMenu = await screen.findByTextKey('home_page_sections_edit_menu');
    expect(editMenu).toBeInTheDocument();
    fireEvent.click(editMenu);

    const alignmentRadioOptionTop = await screen.findByTestId('up-events-section-alignement__Top');
    fireEvent.click(alignmentRadioOptionTop);
    const doneButton = await screen.findByRole('button', {
      key: 'home_page_sections_add_section_modal_footer_btn_done'
    });
    fireEvent.click(doneButton);
    await waitFor(() => expect(createPageMutationMock.result.data.createPage).toBeDefined());
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should call updateSectionMutation when an edit is made on the section after first time', async () => {
    render(
      <MockedProvider
        mocks={[
          ...mocks,
          getCalendarQueryMock,
          createPageMutationMock,
          updateSectionMutationMock,
          getCenterFeaturesMock
        ]}
      >
        <TestWrapper>
          <HomepageCustomization centerId="test-event-plus-hub" centerTitle="Title" />
        </TestWrapper>
      </MockedProvider>
    );

    const table = await screen.findByTestId('reorderable-table-fields');
    expect(table).toBeInTheDocument();

    let menu = await screen.findByTestId('section-item-overflow-menu-button-DefaultUpcomingEvents');
    expect(menu).toBeInTheDocument();
    fireEvent.click(menu);

    let editMenu = await screen.findByTextKey('home_page_sections_edit_menu');
    expect(editMenu).toBeInTheDocument();
    fireEvent.click(editMenu);

    const alignmentRadioOptionTop = await screen.findByTestId('up-events-section-alignement__Top');
    fireEvent.click(alignmentRadioOptionTop);

    const doneButton = await screen.findByRole('button', {
      key: 'home_page_sections_add_section_modal_footer_btn_done'
    });
    fireEvent.click(doneButton);
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    expect(createPageMutationMock.result.data.createPage).toBeDefined();

    menu = await screen.findByTestId('section-item-overflow-menu-button-DefaultUpcomingEvents');
    fireEvent.click(menu);
    editMenu = await screen.findByTextKey('home_page_sections_edit_menu');
    fireEvent.click(editMenu);

    const alignementRadioOptionLeft = await screen.findByTestId('up-events-section-alignement__Left');
    fireEvent.click(alignementRadioOptionLeft);
    fireEvent.click(doneButton);
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    expect(updateSectionMutationMock.result.data.updateSection).toBeDefined();
  });

  it('Should call updatePageMutation when an edit is made and the page is published', async () => {
    const { container } = render(
      <MockedProvider
        mocks={[...mocks, getCalendarQueryMock, createPageMutationMock, getCenterFeaturesMock, updatePageMutationMock]}
      >
        <TestWrapper>
          <HomepageCustomization centerId="test-event-plus-hub" centerTitle="Title" />
        </TestWrapper>
      </MockedProvider>
    );
    const table = await screen.findByTestId('reorderable-table-fields');
    expect(table).toBeInTheDocument();

    const menu = await screen.findByTestId('section-item-overflow-menu-button-DefaultUpcomingEvents');
    expect(menu).toBeInTheDocument();
    fireEvent.click(menu);

    const editMenu = await screen.findByTextKey('home_page_sections_edit_menu');
    expect(editMenu).toBeInTheDocument();
    fireEvent.click(editMenu);

    const alignmentRadioOptionTop = await screen.findByTestId('up-events-section-alignement__Top');
    fireEvent.click(alignmentRadioOptionTop);

    const doneButton = await screen.findByRole('button', {
      key: 'home_page_sections_add_section_modal_footer_btn_done'
    });
    fireEvent.click(doneButton);
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    await waitFor(() => expect(createPageMutationMock.result.data.createPage).toBeDefined());
    const publishButton = await screen.findByRole('button', { key: 'home_page_custom_publish' });
    fireEvent.click(publishButton);
    await waitFor(() => expect(updatePageMutationMock.result.data.updatePage).toBeDefined());
    expect(await screen.findByTextKey('home_page_custom_publish_success_message')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
    const dismissButton = screen.getAllByRole('button', { name: 'Dismiss' });
    fireEvent.click(dismissButton[0]);
    await waitFor(() => {
      expect(screen.queryByTextKey('home_page_custom_publish_success_message')).not.toBeInTheDocument();
    });
  });

  it('Should call createPageMutation when delete button is clicked', async () => {
    render(
      <MockedProvider mocks={[...mocks, getCalendarQueryMock, createPageMutationOnDeleteMock]}>
        <TestWrapper>
          <HomepageCustomization centerId="test-event-plus-hub" centerTitle="Title" />
        </TestWrapper>
      </MockedProvider>
    );
    const table = await screen.findByTestId('reorderable-table-fields');
    expect(table).toBeInTheDocument();

    const menu = await screen.findByTestId('section-item-overflow-menu-button-DefaultChannels');
    expect(menu).toBeInTheDocument();
    fireEvent.click(menu);

    const deleteMenu = await screen.findByTextKey('home_page_sections_delete_menu');
    expect(deleteMenu).toBeInTheDocument();
    fireEvent.click(deleteMenu);
    const deleteMenuConfirm = await screen.findByTextKey('home_page_sections_delete_menu');
    expect(deleteMenuConfirm).toBeInTheDocument();
    fireEvent.click(deleteMenuConfirm);
    await waitFor(() => {
      expect(createPageMutationOnDeleteMock.result.data.createPage).toBeDefined();
    });
  });

  // Red: HUB-175212
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Should call createSectionMutation when page has Draft status and edit is made on section for first time', async () => {
    render(
      <MockedProvider mocks={[...mocks, getCalendarQueryMock, createPageMutationMock, createSectionMutationMock]}>
        <TestWrapper>
          <HomepageCustomization centerId="test-event-plus-hub" centerTitle="Title" />
        </TestWrapper>
      </MockedProvider>
    );
    const table = await screen.findByTestId('reorderable-table-fields');
    expect(table).toBeInTheDocument();

    let menu = await screen.findByTestId('section-item-overflow-menu-button-DefaultUpcomingEvents');
    expect(menu).toBeInTheDocument();
    fireEvent.click(menu);

    let editMenu = await screen.findByTextKey('home_page_sections_edit_menu');
    expect(editMenu).toBeInTheDocument();
    fireEvent.click(editMenu);
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });

    const alignmentRadioOptionTop = await screen.findByTestId('up-events-section-alignement__Top');
    fireEvent.click(alignmentRadioOptionTop);

    let doneButton = await screen.findByTextKey('home_page_sections_add_section_modal_footer_btn_done');
    fireEvent.click(doneButton);
    await waitFor(() => expect(createPageMutationMock.result.data.createPage).toBeDefined());

    menu = await screen.findByTestId('section-item-overflow-menu-button-DefaultChannels');
    expect(menu).toBeInTheDocument();
    fireEvent.click(menu);

    editMenu = await screen.findByTextKey('home_page_sections_edit_menu');
    expect(editMenu).toBeInTheDocument();
    fireEvent.click(editMenu);

    const contentLimit8 = await screen.findByTestId('channels-section-onload-limit__8');
    fireEvent.click(contentLimit8);

    doneButton = await screen.findByTextKey('home_page_sections_add_section_modal_footer_btn_done');
    fireEvent.click(doneButton);
    await waitFor(() => expect(createSectionMutationMock.result.data.createSection).toBeDefined());
  });

  it('Should show Hidden pill next to upcomingEvents when calendarId is not set', async () => {
    render(
      <MockedProvider
        mocks={[
          upcomingEventsSectionMock,
          getCalendarQueryMock,
          createPageMutationMock,
          createPageMutationOnDeleteMock
        ]}
      >
        <TestWrapper>
          <HomepageCustomization centerId="test-event-plus-hub" centerTitle="Title" />
        </TestWrapper>
      </MockedProvider>
    );
    const table = await screen.findByTestId('reorderable-table-fields');
    expect(table).toBeInTheDocument();
    const hiddenText = await screen.findByTextKey('home_page_hidden_section_tooltip_label');
    expect(hiddenText).toBeInTheDocument();
  });

  it('Should not show Hidden pill next to upcomingEvents when calendarId is set and feature is enabled', async () => {
    render(
      <MockedProvider
        mocks={[
          upcomingEventsSectionMock,
          getCalendarQueryMock,
          createPageMutationMock,
          createPageMutationOnDeleteMock,
          getCenterFeaturesMock
        ]}
      >
        <TestWrapper>
          <HomepageCustomization centerId="test-event-plus-hub" centerTitle="Title" />
        </TestWrapper>
      </MockedProvider>
    );
    const table = await screen.findByTestId('reorderable-table-fields');
    expect(table).toBeInTheDocument();
    expect(screen.queryByTextKey('home_page_hidden_section_tooltip_label')).not.toBeInTheDocument();
  });

  it('Should show Hidden pill next to yourEvents when feature is not set', async () => {
    render(
      <MockedProvider
        mocks={[yourEventsSectionMock, getCalendarQueryMock, createPageMutationMock, createPageMutationOnDeleteMock]}
      >
        <TestWrapper>
          <HomepageCustomization centerId="test-event-plus-hub" centerTitle="Title" />
        </TestWrapper>
      </MockedProvider>
    );
    const table = await screen.findByTestId('reorderable-table-fields');
    expect(table).toBeInTheDocument();
    const hiddenText = await screen.findByTextKey('home_page_hidden_section_tooltip_label');
    expect(hiddenText).toBeInTheDocument();
  });

  it('Should show Hidden pill next to yourEvents when feature is set', async () => {
    render(
      <MockedProvider
        mocks={[
          yourEventsSectionMock,
          getCalendarQueryMock,
          createPageMutationMock,
          createPageMutationOnDeleteMock,
          getCenterFeaturesMock
        ]}
      >
        <TestWrapper>
          <HomepageCustomization centerId="test-event-plus-hub" centerTitle="Title" />
        </TestWrapper>
      </MockedProvider>
    );
    const table = await screen.findByTestId('reorderable-table-fields');
    expect(table).toBeInTheDocument();
    expect(screen.queryByTextKey('home_page_hidden_section_tooltip_label')).not.toBeInTheDocument();
  });
});
