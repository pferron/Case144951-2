import React from 'react';
import { screen, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { Image } from '@components/common/imageUpload/Image';
import { MockedProvider } from '@apollo/client/testing';
import 'jest-axe/extend-expect';
import { aspectRatioTypes } from '@cvent/image-editor';

const mock = jest.fn();
const newImageData = {
  filename: 'test-image.png',
  url: '/img/0000000001.png',
  croppedUrl: '/croppedUrl/img/00000001.png',
  imageId: '0000000001',
  size: '1000',
  createdAt: '2022-05-05T17:48:16.200Z'
};

const currentImageData = {
  filename: 'test-image.png',
  url: '/img/0000000001.png',
  imageId: '0000000001',
  size: '1000',
  createdAt: '2022-05-05T17:48:16.200Z'
};

jest.mock('next/router', () => ({
  // spread out all "Router" exports
  ...(jest.requireActual('next/router') as Record<string, unknown>),

  // shallow merge the "default" exports with...
  default: {
    // all actual "default" exports...
    ...jest.requireActual('next/router').default,

    // and overwrite push and replace to be jest functions
    push: jest.fn(),
    replace: jest.fn()
  },
  useRouter() {
    return {
      pathname: '/channel/image',
      route: '/channel/image',
      query: { entityId: '8396f4ff-b3b9-4c51-85dd-f374ad87ce2d' }
    };
  }
}));

jest.mock('nucleus-text', () => {
  const actualMethods = jest.requireActual('nucleus-text');
  return {
    __esModule: true,
    ...actualMethods,
    useTranslate: jest.fn(() => {
      return {
        translate: jest.fn(input => {
          if (input === 'channel_image_alt_text') {
            return 'uploaded-image';
          }
          return 'No image attached';
        })
      };
    })
  };
});

describe('Image Card Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Render Image card when Image is already uploaded for the channel & it is in read mode', async () => {
    const { baseElement } = render(
      <MockedProvider>
        <TestWrapper>
          <Image
            editMode={false}
            setNewImage={mock}
            newImage={newImageData}
            currentImage={currentImageData}
            imageDeleted={false}
            setImageDeleted={mock}
            supportedText=""
            recommendedText=""
            incorrectImageUploadText=""
            maxWidthImage={20}
            noImageTitleText="channel_empty_image_alt_text"
            imageAltText="channel_image_alt_text"
            noImageUploadedText="channel_empty_image_alt_text"
            showPlaceHolderInReadMode
            imageMaximumSize={1000}
            entityId=""
            aspectRatio={aspectRatioTypes.sixteenByNine}
            allowImageEdit
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.getByTitle('uploaded-image')).toBeInTheDocument();
    expect(screen.getByAltText('uploaded-image')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Render Image card when Image is not uploaded for the channel & it is in read mode', async () => {
    const { baseElement } = render(
      <MockedProvider>
        <TestWrapper>
          <Image
            editMode={false}
            setNewImage={mock}
            newImage={null}
            currentImage={null}
            imageDeleted={false}
            setImageDeleted={mock}
            supportedText=""
            recommendedText=""
            incorrectImageUploadText=""
            maxWidthImage={20}
            noImageTitleText="channel_empty_image_alt_text"
            imageAltText="channel_image_alt_text"
            noImageUploadedText="channel_empty_image_alt_text"
            showPlaceHolderInReadMode
            imageMaximumSize={1000}
            entityId=""
            aspectRatio={aspectRatioTypes.sixteenByNine}
            disableDelete
            allowImageEdit
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.getByTitle('No image attached')).toBeInTheDocument();
    expect(screen.getByText('No image attached')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Render Image card when Image is already uploaded for the channel & it is in Edit mode', async () => {
    const { baseElement } = render(
      <MockedProvider>
        <TestWrapper>
          <Image
            editMode
            setNewImage={mock}
            newImage={newImageData}
            currentImage={currentImageData}
            imageDeleted={false}
            setImageDeleted={mock}
            supportedText=""
            recommendedText=""
            incorrectImageUploadText=""
            maxWidthImage={20}
            noImageTitleText="channel_empty_image_alt_text"
            imageAltText="channel_image_alt_text"
            noImageUploadedText="channel_empty_image_alt_text"
            showPlaceHolderInReadMode
            imageMaximumSize={1000}
            entityId=""
            aspectRatio={aspectRatioTypes.sixteenByNine}
            disableDelete
            allowImageEdit
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.getByTitle('uploaded-image')).toBeInTheDocument();
    expect(screen.getByAltText('uploaded-image')).toBeInTheDocument();
    expect(screen.getByTestId('image-replace-button')).toBeInTheDocument();
    expect(screen.getByTestId('image-edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('image-delete-button')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Render Image card when Image is not uploaded for the channel & it is in edit mode', async () => {
    const { baseElement } = render(
      <MockedProvider>
        <TestWrapper>
          <Image
            editMode
            setNewImage={mock}
            newImage={null}
            currentImage={null}
            imageDeleted={false}
            setImageDeleted={mock}
            supportedText=""
            recommendedText=""
            incorrectImageUploadText=""
            maxWidthImage={20}
            noImageTitleText="channel_empty_image_alt_text"
            imageAltText="channel_image_alt_text"
            noImageUploadedText="channel_empty_image_alt_text"
            showPlaceHolderInReadMode
            imageMaximumSize={1000}
            entityId=""
            aspectRatio={aspectRatioTypes.sixteenByNine}
            allowImageEdit
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.getByTitle('No image attached')).toBeInTheDocument();
    expect(screen.getByTestId('image-upload-button')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Render Image card when Image is already uploaded & it is in Edit mode, when editing is not allowed', async () => {
    const { baseElement } = render(
      <MockedProvider>
        <TestWrapper>
          <Image
            editMode
            setNewImage={mock}
            newImage={newImageData}
            currentImage={currentImageData}
            imageDeleted={false}
            setImageDeleted={mock}
            supportedText=""
            recommendedText=""
            incorrectImageUploadText=""
            maxWidthImage={20}
            noImageTitleText="channel_empty_image_alt_text"
            imageAltText="channel_image_alt_text"
            noImageUploadedText="channel_empty_image_alt_text"
            showPlaceHolderInReadMode
            imageMaximumSize={1000}
            entityId=""
            aspectRatio={aspectRatioTypes.sixteenByNine}
            disableDelete
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.getByTitle('uploaded-image')).toBeInTheDocument();
    expect(screen.getByAltText('uploaded-image')).toBeInTheDocument();
    expect(screen.getByTestId('image-replace-button')).toBeInTheDocument();
    expect(screen.queryByTestId('image-edit-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('image-delete-button')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
});
