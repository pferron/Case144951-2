import React from 'react';
import { render } from '@testing-library/react';
import { deleteEntityImage, getEntityImage, uploadEntityImage } from '@cvent/planner-event-hubs-model/operations/media';
import AdditionalCalendarItemMedia from '@components/media/AdditionalCalendarItemMedia';
import { screen } from 'nucleus-text/testing-library/screen';
import { MockedProvider } from '@apollo/client/testing';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import 'jest-axe/extend-expect';

const entity = {
  id: 'fecf930c-e6f0-4019-9857-7b135b716f78',
  type: 'CALENDAR_ADDITIONAL_ITEM'
};
const imageId = 'a4ece10a-af00-419c-bb5a-492ccb5fc22b';

const mocks = [
  {
    request: {
      query: getEntityImage,
      variables: { entity }
    },
    result: {
      data: {
        getEntityImage: null
      }
    }
  },
  {
    request: {
      query: uploadEntityImage,
      variables: {
        imageInput: {
          name: 'TestImage.jpeg',
          size: 130217,
          url: 'https://images-lower.cvent.com/S660/2da33e3f16234feba0923ab05c303415/7fa104b2-b6ca-41b7-b05c-a9da590b8cbf/image/fa91b7f9-6999-426a-8aa3-96d4247e4ed0!_!b4e4bbe435a08944e025e5caf598c56d.jpeg',
          entity
        }
      }
    },
    result: {
      data: {
        uploadEntityImage: {
          id: imageId,
          filename: 'TestImage.jpeg',
          size: 130217,
          url: 'https://images-lower.cvent.com/S660/2da33e3f16234feba0923ab05c303415/7fa104b2-b6ca-41b7-b05c-a9da590b8cbf/image/fa91b7f9-6999-426a-8aa3-96d4247e4ed0!_!b4e4bbe435a08944e025e5caf598c56d.jpeg',
          createdAt: '2021-12-15T12:04:30.857Z',
          entityId: 'fecf930c-e6f0-4019-9857-7b135b716f78',
          entityType: 'CALENDAR_ADDITIONAL_ITEM'
        }
      }
    }
  },
  {
    request: {
      query: deleteEntityImage,
      variables: {
        imageId
      }
    },
    result: {
      data: {
        deleteImage: {
          isSuccess: true
        }
      }
    }
  }
];

const mocksForExistingImage = [
  {
    request: {
      query: getEntityImage,
      variables: { entity }
    },
    result: {
      data: {
        getEntityImage: {
          id: imageId,
          filename: 'TestImage.jpeg',
          size: 130217,
          url: 'https://images-lower.cvent.com/S660/2da33e3f16234feba0923ab05c303415/7fa104b2-b6ca-41b7-b05c-a9da590b8cbf/image/fa91b7f9-6999-426a-8aa3-96d4247e4ed0!_!b4e4bbe435a08944e025e5caf598c56d.jpeg',
          createdAt: '2021-12-15T12:04:30.857Z',
          entityId: 'fecf930c-e6f0-4019-9857-7b135b716f78',
          entityType: 'CALENDAR_ADDITIONAL_ITEM'
        }
      }
    }
  },
  {
    request: {
      query: uploadEntityImage,
      variables: {
        imageInput: {
          name: 'TestImage.jpeg',
          size: 140217,
          url: 'https://images-lower.cvent.com/S660/2da33e3f16234feba0923ab05c303415/7fa104b2-b6ca-41b7-b05c-a9da590b8cbf/image/fa91b7f9-6999-426a-8aa3-96d4247e4ed0!_!b4e4bbe435a08944e025e5caf598c56d.jpeg',
          previousImageId: imageId,
          entity
        }
      }
    },
    result: {
      data: {
        uploadEntityImage: {
          id: '6087cf42-2221-4697-a9ea-f09f1ffcfc4f',
          filename: 'TestImage.jpeg',
          size: 140217,
          url: 'https://images-lower.cvent.com/S660/2da33e3f16234feba0923ab05c303415/7fa104b2-b6ca-41b7-b05c-a9da590b8cbf/image/fa91b7f9-6999-426a-8aa3-96d4247e4ed0!_!b4e4bbe435a08944e025e5caf598c56d.jpeg',
          createdAt: '2021-12-15T12:04:30.857Z',
          entityId: 'fecf930c-e6f0-4019-9857-7b135b716f78',
          entityType: 'CALENDAR_ADDITIONAL_ITEM'
        }
      }
    }
  },
  {
    request: {
      query: deleteEntityImage,
      variables: {
        imageId
      }
    },
    result: {
      data: {
        deleteImage: {
          isSuccess: true
        }
      }
    }
  }
];

describe('AdditionalCalendarItemMedia test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Render Event Media page', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <AdditionalCalendarItemMedia additionalCalendarId="fecf930c-e6f0-4019-9857-7b135b716f78" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByRole('button', { key: 'cancel_button_label' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { key: 'save_button_label' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { key: 'image_upload_button' })).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('Render Event Media page with existing image', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={mocksForExistingImage}>
        <TestWrapper>
          <AdditionalCalendarItemMedia additionalCalendarId="fecf930c-e6f0-4019-9857-7b135b716f78" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByRole('button', { key: 'cancel_button_label' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { key: 'save_button_label' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { key: 'image_replace_button' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { key: 'image_edit_button' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { key: 'image_delete_button' })).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});
