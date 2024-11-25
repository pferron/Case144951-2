import React from 'react';
import { render, fireEvent, waitFor, within } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import FileUploadWrapper from '@components/common/imageUpload/FileUploadWrapper';
import { TestWrapper } from '@utils/testUtil/TestWrapper';

jest.mock('global', () => ({
  ...global,
  fetch: jest.fn()
}));

describe('FileUploadWrapper', () => {
  const acceptedFileActionMock = jest.fn();
  const onRemoveMock = jest.fn();
  const onEditFileMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const props = {
    acceptedFileAction: acceptedFileActionMock,
    currentImage: { url: 'https://example.com/image.jpg', filename: 'image.jpg' },
    imagefile: { name: 'image.jpg', path: 'https://example.com/image.jpg' },
    onRemove: onRemoveMock,
    onEditFile: onEditFileMock,
    recommendationTextForFileUpload: 'Recommended size: 600 x 400 pixels'
  };

  it('Should render fileUploader when there is no image present', async () => {
    render(
      <TestWrapper>
        <FileUploadWrapper {...props} currentImage={null} imagefile={null} />
      </TestWrapper>
    );
    const uploader = await screen.findByTextKey('shared_upload_input_accessibility_label');
    expect(uploader).toBeInTheDocument();
  });

  it('should render different recommendedtext for inset image template', async () => {
    render(
      <TestWrapper>
        <FileUploadWrapper {...props} currentImage={null} imagefile={null} />
      </TestWrapper>
    );
    const uploader = await screen.findByTextKey('shared_upload_input_accessibility_label');
    expect(uploader).toBeInTheDocument();
    const recommendationText = await screen.findByTextKey(
      'Banners-Image-Upload-Section-Supported-File-Size-Inset-Image'
    );
    expect(recommendationText).toBeInTheDocument();
  });

  it('should show uploaded file if the image is already present', async () => {
    render(
      <TestWrapper>
        <FileUploadWrapper {...props} />
      </TestWrapper>
    );
    const readOnlyImage = await screen.findByTestId('section-image-upload-readOnly');
    expect(readOnlyImage).toBeInTheDocument();
  });

  it('Should have menu options to download, edit and remove the image', async () => {
    render(
      <TestWrapper>
        <FileUploadWrapper {...props} />
      </TestWrapper>
    );
    const readOnlyImage = await screen.findByTestId('section-image-upload-readOnly');
    expect(readOnlyImage).toBeInTheDocument();
    const menuActionBtn = within(readOnlyImage).getByRole('button');
    fireEvent.click(menuActionBtn);
    expect(await screen.findByTextKey('download_button_label')).toBeInTheDocument();
    expect(await screen.findByTextKey('image_edit_button')).toBeInTheDocument();
    expect(await screen.findByTextKey('image_delete_button')).toBeInTheDocument();
  });

  it('Should call onEditFile when Edit is clicked in menu', async () => {
    render(
      <TestWrapper>
        <FileUploadWrapper {...props} />
      </TestWrapper>
    );
    const readOnlyImage = await screen.findByTestId('section-image-upload-readOnly');
    expect(readOnlyImage).toBeInTheDocument();
    const menuActionBtn = within(readOnlyImage).getByRole('button');
    fireEvent.click(menuActionBtn);
    const editImage = await screen.findByTextKey('image_edit_button');
    fireEvent.click(editImage);
    await waitFor(() => {
      expect(onEditFileMock).toHaveBeenCalledTimes(1);
    });
  });

  it('Should call onRemove when Delete is clicked in menu', async () => {
    render(
      <TestWrapper>
        <FileUploadWrapper {...props} />
      </TestWrapper>
    );
    const readOnlyImage = await screen.findByTestId('section-image-upload-readOnly');
    expect(readOnlyImage).toBeInTheDocument();
    const menuActionBtn = within(readOnlyImage).getByRole('button');
    fireEvent.click(menuActionBtn);
    const deleteImage = await screen.findByTextKey('image_delete_button');
    fireEvent.click(deleteImage);
    await waitFor(() => {
      expect(onRemoveMock).toHaveBeenCalledTimes(1);
    });
  });
  it('Should call onDownload when Download is clicked in menu', async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    render(
      <TestWrapper>
        <FileUploadWrapper {...props} />
      </TestWrapper>
    );
    const readOnlyImage = await screen.findByTestId('section-image-upload-readOnly');
    expect(readOnlyImage).toBeInTheDocument();
    const menuActionBtn = within(readOnlyImage).getByRole('button');
    fireEvent.click(menuActionBtn);
    const downloadImage = await screen.findByTextKey('download_button_label');
    fireEvent.click(downloadImage);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
