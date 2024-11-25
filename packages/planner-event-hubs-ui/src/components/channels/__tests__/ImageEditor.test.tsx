import React from 'react';
import { screen, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { ImageEditorWrapper } from '@components/common/imageUpload/ImageEditorWrapper';
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

jest.mock('nucleus-text', () => {
  const actualMethods = jest.requireActual('nucleus-text');
  return {
    __esModule: true,
    ...actualMethods,
    useTranslate: jest.fn(() => {
      return {
        translate: jest.fn(param => param)
      };
    })
  };
});

describe('ImageEditor Card Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Render ImageEditor when loader is running', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <ImageEditorWrapper
          currentImage={currentImageData}
          imageData={newImageData}
          setNewImage={mock}
          setIsOpen={mock}
          entityId="DUMMY_ENTITY_ID"
          isLoading
          style={{ imageEditorStyle: { backgroundColor: '#ddd' } }}
          aspectRatio={aspectRatioTypes.sixteenByNine}
          useCroppedImage
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('image-editor-loader-modal')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Render ImageEditor', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <ImageEditorWrapper
          currentImage={currentImageData}
          imageData={newImageData}
          setNewImage={mock}
          setIsOpen={mock}
          entityId="DUMMY_ENTITY_ID"
          isLoading={false}
          style={{ imageEditorStyle: { backgroundColor: '#ddd' } }}
          aspectRatio={aspectRatioTypes.sixteenByNine}
          useCroppedImage
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('image-editor')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
});
