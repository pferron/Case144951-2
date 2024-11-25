import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen, within } from 'nucleus-text/testing-library/screen';
import { MockedProvider } from '@apollo/client/testing';
import { ActionButtons } from '@components/common/imageUpload/ActionButtons';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { S3_GENERATE_PRESIGNED_URL, S3_SCAN_STATUS } from '@cvent/planner-event-hubs-model/operations/upload';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import { aspectRatioTypes } from '@cvent/image-editor';

const mock = jest.fn();
const queryMocks = [
  {
    request: {
      query: S3_GENERATE_PRESIGNED_URL,
      variables: {
        centerId: 'abcd-1234',
        entityId: '1234-abcd',
        entityType: 'Temp',
        fileName: 'image',
        fileExtension: 'jpg'
      }
    },
    result: {
      data: {
        presignedUrl: {
          uploadUrl: 'https://blah/image.jpg',
          fileId: '1234',
          fullFilePath: '/blah/blah/image.jpg'
        }
      }
    }
  },
  {
    request: {
      query: S3_SCAN_STATUS,
      variables: {
        filePath: '/blah/blah/image.jpg'
      }
    },
    result: {
      data: {
        s3ScanStatus: {
          fileId: '1234',
          fullFilePath: '/blah/blah/image.jpg',
          location: 'https://blah/image.jpg',
          status: 'SCAN_SUCCESS',
          failureReason: ''
        }
      }
    }
  }
];
const dummyImageUrl = 'https://dummyImage.jpeg';
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
  // FIREBALL
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  useRouter(): any {
    return {
      pathname: '/channel/image',
      route: '/channel/image',
      query: { entityId: '8396f4ff-b3b9-4c51-85dd-f374ad87ce2d' }
    };
  }
}));

describe('Action Buttons Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Render Action buttons when Image is already uploaded for the event', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={queryMocks}>
        <TestWrapper>
          <ActionButtons
            imageUrl={dummyImageUrl}
            setNewImage={mock}
            newImage={newImageData}
            currentImage={currentImageData}
            setImageDeleted={mock}
            incorrectImageUploadText=""
            imageMaximumSize={1000}
            entityId=""
            aspectRatio={aspectRatioTypes.sixteenByNine}
            disableDelete
            isLogo={false}
            useCroppedImage
            allowImageEdit
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.getByTestId('image-replace-button')).toBeInTheDocument();
    expect(screen.getByTestId('image-edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('image-delete-button')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Render Action buttons without edit when Image is already uploaded for the event and edit is not allowed', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={queryMocks}>
        <TestWrapper>
          <ActionButtons
            imageUrl={dummyImageUrl}
            setNewImage={mock}
            newImage={newImageData}
            currentImage={currentImageData}
            setImageDeleted={mock}
            incorrectImageUploadText=""
            imageMaximumSize={1000}
            entityId=""
            aspectRatio={aspectRatioTypes.sixteenByNine}
            disableDelete
            isLogo={false}
            useCroppedImage
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.getByTestId('image-replace-button')).toBeInTheDocument();
    expect(screen.queryByTestId('image-edit-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('image-delete-button')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Render Action buttons when Image is not present for the event', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={queryMocks}>
        <TestWrapper>
          <ActionButtons
            imageUrl={null}
            setNewImage={mock}
            newImage={newImageData}
            currentImage={currentImageData}
            setImageDeleted={mock}
            incorrectImageUploadText=""
            imageMaximumSize={1000}
            entityId=""
            aspectRatio={aspectRatioTypes.sixteenByNine}
            disableDelete
            isLogo={false}
            useCroppedImage
            allowImageEdit
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.getByTestId('image-upload-button')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('should option input modal when upload image is clicked', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={queryMocks}>
        <TestWrapper>
          <ActionButtons
            imageUrl={null}
            setNewImage={mock}
            newImage={newImageData}
            currentImage={currentImageData}
            setImageDeleted={mock}
            incorrectImageUploadText=""
            imageMaximumSize={1000}
            entityId=""
            aspectRatio={aspectRatioTypes.sixteenByNine}
            disableDelete
            isLogo={false}
            useCroppedImage
            allowImageEdit
          />
        </TestWrapper>
      </MockedProvider>
    );
    const uploadBtn = await screen.findByTestId('image-upload-button');
    expect(uploadBtn).toBeInTheDocument();
    fireEvent.click(uploadBtn);
    expect(await screen.findByTestId('image-upload-input')).toBeInTheDocument();
    expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Should use fileUploader to upload images when useFileUpload is true', async () => {
    render(
      <MockedProvider mocks={queryMocks}>
        <TestWrapper>
          <ActionButtons
            imageUrl={null}
            setNewImage={mock}
            newImage={newImageData}
            currentImage={null}
            setImageDeleted={mock}
            incorrectImageUploadText=""
            imageMaximumSize={1000}
            entityId=""
            aspectRatio={aspectRatioTypes.sixteenByNine}
            disableDelete
            isLogo={false}
            useCroppedImage
            allowImageEdit
            useFileUpload
          />
        </TestWrapper>
      </MockedProvider>
    );
    const fileuploader = await screen.findByTextKey('shared_upload_input_accessibility_label');
    expect(fileuploader).toBeInTheDocument();
  });

  it('Should remove image when delete button is clicked in already uploaded image', async () => {
    render(
      <MockedProvider mocks={queryMocks}>
        <TestWrapper>
          <ActionButtons
            imageUrl={dummyImageUrl}
            setNewImage={mock}
            newImage={newImageData}
            currentImage={currentImageData}
            setImageDeleted={mock}
            incorrectImageUploadText=""
            imageMaximumSize={1000}
            entityId=""
            aspectRatio={aspectRatioTypes.sixteenByNine}
            disableDelete
            isLogo={false}
            useCroppedImage
            allowImageEdit
            useFileUpload
          />
        </TestWrapper>
      </MockedProvider>
    );
    const readOnlyImage = await screen.findByTestId('section-image-upload-readOnly');
    expect(readOnlyImage).toBeInTheDocument();
    const menuActionBtn = within(readOnlyImage).getByRole('button');
    fireEvent.click(menuActionBtn);
    const deleteBtn = await screen.findByTextKey('image_delete_button');
    fireEvent.click(deleteBtn);
    // // Fileuploader shows when image is not present
    const fileuploader = await screen.findByTextKey('shared_upload_input_accessibility_label');
    expect(fileuploader).toBeInTheDocument();
  });

  it('Should open image editor when edit button is clicked in already uploaded image', async () => {
    render(
      <MockedProvider mocks={queryMocks}>
        <TestWrapper>
          <ActionButtons
            imageUrl={dummyImageUrl}
            setNewImage={mock}
            newImage={newImageData}
            currentImage={currentImageData}
            setImageDeleted={mock}
            incorrectImageUploadText=""
            imageMaximumSize={1000}
            entityId=""
            aspectRatio={aspectRatioTypes.sixteenByNine}
            disableDelete
            isLogo={false}
            useCroppedImage
            allowImageEdit
            useFileUpload
          />
        </TestWrapper>
      </MockedProvider>
    );
    const readOnlyImage = await screen.findByTestId('section-image-upload-readOnly');
    expect(readOnlyImage).toBeInTheDocument();
    const menuActionBtn = within(readOnlyImage).getByRole('button');
    fireEvent.click(menuActionBtn);
    const editBtn = await screen.findByTextKey('image_edit_button');
    fireEvent.click(editBtn);
    const imageEditor = await screen.findByTestId('image-editor');
    expect(imageEditor).toBeInTheDocument();
  });
});
