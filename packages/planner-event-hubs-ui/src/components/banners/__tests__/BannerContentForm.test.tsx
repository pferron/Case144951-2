import { MockedProvider as ApolloProvider } from '@apollo/client/testing';
import { ExistingBanner } from '@cvent/planner-event-hubs-model/types';
import { fireEvent, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { HUB_PAGES, UPDATE_BANNER_MUTATION } from '@cvent/planner-event-hubs-model/operations/banner';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import { FULL_IMAGE, INSET_IMAGE, TEXT_COLOR } from '../BannerConstants';
import BannerContentForm from '../BannerContentForm';

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

const bannerFormProps: { videoCenterId: string; bannerData: ExistingBanner } = {
  videoCenterId: '123-abc',
  bannerData: {
    id: 'abc-123',
    centerId: '123-abc',
    name: 'My Banner',
    layout: FULL_IMAGE,
    button: { enabled: false }
  }
};

const bannerWithImageFormProps: { videoCenterId: string; bannerData: ExistingBanner } = {
  videoCenterId: '123-abc',
  bannerData: {
    id: 'abc-123',
    centerId: '123-abc',
    name: 'My Banner',
    layout: FULL_IMAGE,
    button: { enabled: false },
    imageUrl: 'https://images-lower.cvent.com/test!_!hash.jpg',
    originalImageUrl: 'https://images-lower.cvent.com/test.jpg'
  }
};

const bannerWithAllDataProps: { videoCenterId: string; bannerData: ExistingBanner } = {
  videoCenterId: '123-abc',
  bannerData: {
    centerId: '55113f0a-9f28-4257-8c0e-3ca34f44c4b9',
    id: '48b8279e-36af-4324-b5b3-2055911a815a',
    name: 'test',
    layout: 'FULL_IMAGE',
    imageAlignment: 'Right',
    imageUrl:
      'https://images-lower.cvent.com/S606/f6d746482c09496fa3e3e3f6cd1503a0/video-center/55113f0a-9f28-4257-8c0e-3ca34f44c4b9/banner/48b8279e-36af-4324-b5b3-2055911a815a/69f8c46a294a908fff6c5c83df6af5c8!_!56c9871d97eb0444b64299d9a13a6225.png',
    originalImageUrl:
      'https://silo606-custom.core.cvent.org/f6d746482c09496fa3e3e3f6cd1503a0/video-center/55113f0a-9f28-4257-8c0e-3ca34f44c4b9/banner/48b8279e-36af-4324-b5b3-2055911a815a/connections.png',
    imageAltText: 'My Banner',
    text: {
      __typename: 'BannerText',
      title: 'Banner Title',
      body: 'Banner Body',
      alignment: 'Left',
      color: null
    },
    button: {
      __typename: 'BannerButton',
      enabled: false,
      text: 'Button',
      targetType: 'Internal',
      internalTarget: '87544b4f-e158-4681-87e0-6a6df8085b01',
      target: ''
    }
  }
};
const MOCK_MUTATION = {
  request: {
    query: UPDATE_BANNER_MUTATION,
    context: { clientName: 'video-hub' },
    variables: {
      input: { ...bannerWithAllDataProps.bannerData }
    },
    refetchQueries: jest.fn(),
    onCompleted: () => {
      jest.fn();
    }
  },
  result: {
    data: {
      bannerUpdate: true
    }
  }
};

const MOCK_HUB_PAGES = {
  request: {
    query: HUB_PAGES,
    variables: {
      id: {
        id: '123-abc'
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

describe('BannerContentForm', () => {
  describe('ExistingBanner image banners with no attached image', () => {
    it('renders expected elements with FULL_IMAGE', async () => {
      bannerFormProps.bannerData.layout = FULL_IMAGE;
      const { container } = render(
        <ApolloProvider>
          <TestWrapper>
            <BannerContentForm {...bannerFormProps} />
          </TestWrapper>
        </ApolloProvider>
      );

      expect(screen.getByTestId('banner-preview')).toBeInTheDocument();
      expect(screen.getByTestId('banner-content-form')).toBeInTheDocument();
      expect(screen.getByTestId('banner-images')).toBeInTheDocument();
      expect(screen.getByTestId('banner-content')).toBeInTheDocument();
      expect(screen.getByTestId('banner-style')).toBeInTheDocument();
      expect(screen.getByTestId('banner-pages')).toBeInTheDocument();
      expect(screen.getByTestId('banner-images-edit-button')).toBeInTheDocument();
      expect(await axe(container)).toHaveNoViolations();
    });

    it('image section should be editable', async () => {
      bannerFormProps.bannerData.layout = FULL_IMAGE;
      const { container } = render(
        <ApolloProvider>
          <TestWrapper>
            <BannerContentForm {...bannerFormProps} />
          </TestWrapper>
        </ApolloProvider>
      );
      const bannerImageEditBtn = await screen.findByTestId('banner-images-edit-button');
      fireEvent.click(bannerImageEditBtn);
      expect(await screen.findByTextKey('Banners-Image-Upload-Section-Supported-File-Size')).toBeInTheDocument();
      expect(await axe(container)).toHaveNoViolations();
    });

    it('renders expected elements with INSET', async () => {
      bannerFormProps.bannerData.layout = INSET_IMAGE;
      const { container } = render(
        <ApolloProvider>
          <TestWrapper>
            <BannerContentForm {...bannerFormProps} />
          </TestWrapper>
        </ApolloProvider>
      );

      expect(screen.getByTestId('banner-preview')).toBeInTheDocument();
      expect(screen.getByTestId('banner-content-form')).toBeInTheDocument();
      expect(screen.getByTestId('banner-images')).toBeInTheDocument();
      expect(screen.getByTestId('banner-content')).toBeInTheDocument();
      expect(screen.getByTestId('banner-style')).toBeInTheDocument();
      expect(screen.getByTestId('banner-pages')).toBeInTheDocument();
      expect(screen.getByTestId('banner-images-edit-button')).toBeInTheDocument();
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe('ExistingBanners with an image', () => {
    it('can have the FULL BACKGROUND image deleted', async () => {
      bannerWithImageFormProps.bannerData.layout = FULL_IMAGE;
      const { container } = render(
        <TestWrapper>
          <ApolloProvider mocks={[MOCK_HUB_PAGES]}>
            <BannerContentForm {...bannerWithImageFormProps} />
          </ApolloProvider>
        </TestWrapper>
      );
      expect(screen.getByTestId('banner-image-alt-text')).toHaveTextContent('Image alt text');
      expect(screen.getByTestId('banner-images-edit-button')).toBeInTheDocument();
      const editBtn = await screen.findByTestId('banner-images-edit-button');
      const mockHandlerEdit = jest.fn();
      editBtn.addEventListener('click', mockHandlerEdit);
      fireEvent.click(editBtn);

      const deleteBtn = await screen.findByTestId('image-delete-button');
      const mockHandlerDelete = jest.fn();
      deleteBtn.addEventListener('click', mockHandlerDelete);
      fireEvent.click(deleteBtn);

      expect(screen.getByTestId('image-upload-button')).toBeVisible();
      expect(screen.getByTestId('banner-preview-full-image')).toHaveStyle('background-image: url(undefined)');
      expect(await axe(container)).toHaveNoViolations();
    });

    it('can have the INSET image deleted', async () => {
      bannerWithImageFormProps.bannerData.layout = INSET_IMAGE;
      const { container } = render(
        <TestWrapper>
          <ApolloProvider mocks={[MOCK_HUB_PAGES]}>
            <BannerContentForm {...bannerWithImageFormProps} />
          </ApolloProvider>
        </TestWrapper>
      );

      expect(screen.getByTestId('banner-image-alt-text')).toHaveTextContent('Image alt text');
      expect(screen.getByTestId('banner-images-edit-button')).toBeInTheDocument();
      const editBtn = await screen.findByTestId('banner-images-edit-button');
      const mockHandlerEdit = jest.fn();
      editBtn.addEventListener('click', mockHandlerEdit);
      fireEvent.click(editBtn);

      const deleteBtn = await screen.findByTestId('image-delete-button');
      const mockHandlerDelete = jest.fn();
      deleteBtn.addEventListener('click', mockHandlerDelete);
      fireEvent.click(deleteBtn);

      expect(screen.getByTestId('image-upload-button')).toBeVisible();
      expect(screen.queryByTestId('banner-preview-image-inlay-element')).not.toBeInTheDocument();
      expect(await axe(container)).toHaveNoViolations();
    });

    it('canceling Image Edit restores the original image data', async () => {
      bannerWithImageFormProps.bannerData.layout = INSET_IMAGE;
      const { container } = render(
        <TestWrapper>
          <ApolloProvider mocks={[MOCK_HUB_PAGES]}>
            <BannerContentForm {...bannerWithImageFormProps} />
          </ApolloProvider>
        </TestWrapper>
      );
      expect(screen.getByTestId('banner-image-alt-text')).toHaveTextContent('Image alt text');
      expect(screen.getByTestId('banner-images-edit-button')).toBeInTheDocument();

      const editBtn = await screen.findByTestId('banner-images-edit-button');
      const mockHandlerEdit = jest.fn();
      editBtn.addEventListener('click', mockHandlerEdit);
      fireEvent.click(editBtn);

      const deleteBtn = await screen.findByTestId('image-delete-button');
      const mockHandlerDelete = jest.fn();
      deleteBtn.addEventListener('click', mockHandlerDelete);
      fireEvent.click(deleteBtn);

      expect(screen.getByTestId('image-upload-button')).toBeVisible();
      expect(screen.queryByTestId('banner-preview-image-inlay-element')).not.toBeInTheDocument();

      const cancelBtn = await screen.findByTestId('banner-images-edit-cancel-button');
      const mockHandlerCancel = jest.fn();
      cancelBtn.addEventListener('click', mockHandlerCancel);
      fireEvent.click(cancelBtn);

      expect(screen.getByTestId('banner-image-alt-text')).toHaveTextContent('Image alt text');
      expect(screen.getByTestId('banner-preview-image-inlay-element')).toHaveAttribute(
        'src',
        bannerWithImageFormProps.bannerData.imageUrl
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it('renders expected elements for an ExistingBanner with TEXT_COLOR layout', async () => {
    bannerFormProps.bannerData.layout = TEXT_COLOR;
    const { container } = render(
      <ApolloProvider>
        <TestWrapper>
          <BannerContentForm {...bannerFormProps} />
        </TestWrapper>
      </ApolloProvider>
    );

    expect(screen.queryByTestId('banner-images')).not.toBeInTheDocument();
    expect(screen.queryByTestId('banner-images-edit-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('banner-preview')).toBeInTheDocument();
    expect(screen.getByTestId('banner-content-form')).toBeInTheDocument();
    expect(screen.getByTestId('banner-content')).toBeInTheDocument();
    expect(screen.getByTestId('banner-style')).toBeInTheDocument();
    expect(screen.getByTestId('banner-pages')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should be able to submit the banner content after editing', async () => {
    bannerFormProps.bannerData.layout = FULL_IMAGE;
    const { container } = render(
      <ApolloProvider mocks={[MOCK_MUTATION]}>
        <TestWrapper>
          <BannerContentForm {...bannerWithAllDataProps} />
        </TestWrapper>
      </ApolloProvider>
    );
    const designEditBtn = await screen.findByTestId('banner-style-edit-button');
    fireEvent.click(designEditBtn);
    const centerTextAlignment = await screen.findByTestId('banner-styling-text-alignment-Center-color-square');
    expect(centerTextAlignment).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
    fireEvent.click(centerTextAlignment);
    const saveBtn = await screen.findByTestId('banner-style-edit-save-button');
    expect(saveBtn).toBeInTheDocument();
    fireEvent.click(saveBtn);
  });

  it('Should show remaining characters for the external button url', async () => {
    bannerFormProps.bannerData.layout = TEXT_COLOR;
    render(
      <ApolloProvider>
        <TestWrapper>
          <BannerContentForm {...bannerFormProps} />
        </TestWrapper>
      </ApolloProvider>
    );
    const editContentBtn = await screen.findByTestId('banner-content-edit-button');
    expect(editContentBtn).toBeInTheDocument();
    fireEvent.click(editContentBtn);
    const externalRadioBtn = await screen.findByTestId('bannerButtonDestinationType__External');
    fireEvent.click(externalRadioBtn);
    expect(await screen.findByTextKey('characters_left_label', { characterCount: '255' })).toBeInTheDocument();
  });
});
