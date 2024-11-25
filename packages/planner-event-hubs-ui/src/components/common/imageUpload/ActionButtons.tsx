import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Button } from '@cvent/carina/components/Button';
import { PencilIcon, TrashIcon, UploadIcon } from '@cvent/carina/components/Icon';
import { Row } from '@cvent/carina/components/Row';
import { Alerts } from '@cvent/carina/components/Alert';
import { ImageEditorWrapper } from '@components/common/imageUpload/ImageEditorWrapper';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { ImageUploadStyles } from '@components/common/imageUpload/style';
import { uploadFileToPresignedUrl, uploadFileToS3 } from '@utils/imageUtils';
import { ACCEPTED_FILE_FORMAT, CHANNEL_PAGE_RELATIVE_PATH, FAVICON, LOGO, VIDEO_HUBS_URL } from '@utils/constants';
import { useTranslate } from 'nucleus-text';
import { CurrentImage, NewImage } from '@components/common/imageUpload/types';
import { useStyle } from '@hooks/useStyle';
import { isAcceptedFileFormat, trimFileBaseName } from '@utils/commonComponentsUtils';
import { useLazyQuery } from '@apollo/client';
import { EntityType, PreSignedResponse, ScanStatus } from '@cvent/planner-event-hubs-model/types';
import { extractFileBaseName, extractFileExtension } from '@utils/apiUtils';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { isEmpty } from 'lodash';
import { S3_GENERATE_PRESIGNED_URL, S3_SCAN_STATUS } from '@cvent/planner-event-hubs-model/operations/upload';
import { LoadingIcon } from '@cvent/carina/components/LoadingIcon';
import { useEventsPlusHubPageActionsApi } from '@metrics/client/react/useEventsPlusHubPageActionsApi';
import { aspectRatioTypes } from '@cvent/image-editor';
import FileUploadWrapper from '@components/common/imageUpload/FileUploadWrapper';

const LOG = LoggerFactory.create('ActionButton');

/**
 * ActionButtons Component
 * to be used to provide buttons to perform upload / replace / delete operations
 * on an image
 */

export function ActionButtons({
  preSignedUpload,
  videoCenterId,
  imageUrl,
  setNewImage,
  newImage,
  currentImage,
  setImageDeleted,
  incorrectImageUploadText,
  imageMaximumSize,
  entityId,
  aspectRatioOptions,
  aspectRatio,
  disableDelete,
  acceptedFileFormats = ACCEPTED_FILE_FORMAT,
  isLogo,
  useCroppedImage,
  maxFileNameLength,
  allowImageEdit = false,
  entityType = '',
  imageUploadTriggerLocation,
  useFileUpload = false,
  recommendationTextForFileUpload
}: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const imageUploadInput = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [unacceptedFiles, setUnacceptedFiles] = useState<string>(null);
  const [fileErrors, setFileErrors] = useState<Array<string>>([]);
  const [uploadError, setUploadError] = useState<string>(null);
  const [isLoading, setLoading] = useState(false);
  const style = useStyle(ImageUploadStyles);
  const { alertStyle, actionButtonStyles, deleteButtonStyles } = style;
  const returnUrl = useMemo(
    () => `${VIDEO_HUBS_URL}/${videoCenterId}/${CHANNEL_PAGE_RELATIVE_PATH}/${entityId}`,
    [entityId, videoCenterId]
  );

  const { imageUploadClicked } = useEventsPlusHubPageActionsApi();

  /**
   * Direct upload path
   */
  const setImageTempS3Url = useCallback(
    async (file): Promise<void> => {
      setLoading(true);
      const s3TempUrl = await uploadFileToS3(file, returnUrl, entityId, entityType);
      setNewImage({
        filename: trimFileBaseName(file.name, maxFileNameLength),
        size: file.size,
        url: s3TempUrl,
        croppedUrl: null
      });
      setLoading(false);
    },
    [returnUrl, entityId, entityType, setNewImage, maxFileNameLength]
  );
  /**
   * END Direct upload path
   */

  /**
   * Pre-signed upload path
   */
  const [generatePresignedUrl] = useLazyQuery(S3_GENERATE_PRESIGNED_URL, {
    onError: error => {
      LOG.error('Failed to generate Presigned URL for upload.', error);
      setUploadError(translate('file_upload_generic_error'));
    }
  });
  const [checkScanStatus, { stopPolling }] = useLazyQuery(S3_SCAN_STATUS, {
    pollInterval: 500,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onError: error => {
      stopPolling();
      setLoading(false);
      setIsOpen(false);
      LOG.error('Poll for scan status failed', error);
      setUploadError(translate('file_upload_generic_error'));
    }
  });
  const setTempS3UrlFromPreSignedUpload = useCallback(
    async (file): Promise<void> => {
      setLoading(true);
      const presignedResponse = await generatePresignedUrl({
        variables: {
          input: {
            centerId: videoCenterId,
            entityId,
            entityType: EntityType.Temp,
            fileName: extractFileBaseName(file.name).replaceAll(/\s+/g, '-'),
            fileExtension: extractFileExtension(file.name)
          }
        }
      });
      LOG.info('Generated PreSigned URL', presignedResponse);
      const presignedData: PreSignedResponse = presignedResponse.data.generatePreSignedUrl;
      await uploadFileToPresignedUrl(file, presignedData.uploadUrl);

      await checkScanStatus({
        variables: {
          input: {
            filePath: presignedData.fullFilePath
          }
        },
        onCompleted: async data => {
          if (isEmpty(data?.checkScanStatus?.status)) {
            return;
          }

          stopPolling();
          setLoading(false);
          if (data?.checkScanStatus?.status === ScanStatus.ScanSuccess) {
            setNewImage({
              filename: file.name.replaceAll(/\s/g, '-'),
              size: file.size,
              url: data.checkScanStatus.location,
              croppedUrl: null
            });
          } else {
            LOG.error('Scan status is not success', data?.checkScanStatus);
            let userMessage: string;

            switch (data?.checkScanStatus?.status) {
              case ScanStatus.ScanFailed:
                userMessage = translate('file_upload_scan_failed');
                break;

              default:
                userMessage = translate('file_upload_generic_error');
                break;
            }

            setUploadError(userMessage);
            setIsOpen(false);
            setNewImage(null);
          }
        }
      });
    },
    [generatePresignedUrl, videoCenterId, entityId, checkScanStatus, stopPolling, setNewImage, translate]
  );
  /**
   * END Pre-signed upload path
   */

  /**
   * Common paths
   */
  const onUploadClick = useCallback(() => {
    if (imageUploadInput.current) {
      imageUploadInput.current.click();
    }
    imageUploadClicked({
      triggerLocation: imageUploadTriggerLocation
    });
  }, [imageUploadClicked, imageUploadTriggerLocation]);

  const isValidImage = useCallback(
    async (file: File): Promise<boolean> => {
      if (file.size >= imageMaximumSize) {
        setUnacceptedFiles(file.name);
        fileErrors.push(
          translate('video_hub_branding_image_too_big', {
            size: (imageMaximumSize / (1024 * 1024)).toFixed(0)
          })
        );
        return false;
      }

      if (!isAcceptedFileFormat(file.name, acceptedFileFormats)) {
        setUnacceptedFiles(file.name);
        fileErrors.push(
          translate('video_hub_branding_incorrect_image_format', {
            formats: acceptedFileFormats?.replaceAll('.', '').toUpperCase()
          })
        );
        return false;
      }

      if (entityType === FAVICON) {
        const bitMap = await createImageBitmap(file);
        const { height, width } = bitMap;
        bitMap.close();
        if (!(height >= 16 && height <= 32) || !(width >= 16 && width <= 32)) {
          setUnacceptedFiles(file.name);
          fileErrors.push(translate('video_hub_branding_favicon_incorrect_image_dimension'));
          return false;
        }
      }

      return true;
    },
    [acceptedFileFormats, entityType, fileErrors, imageMaximumSize, translate]
  );

  const onImageUploadInputChange = useCallback(
    async (fileSelected): Promise<void> => {
      const file = useFileUpload ? fileSelected : fileSelected.target.files[0];
      if (await isValidImage(file)) {
        if (preSignedUpload) {
          setTempS3UrlFromPreSignedUpload(file);
        } else {
          setImageTempS3Url(file);
        }
        setImageDeleted(false);
        setUnacceptedFiles(null);
        setFileErrors([]);
        if (allowImageEdit) {
          setIsOpen(true);
        }
      }
    },
    [
      isValidImage,
      preSignedUpload,
      setImageDeleted,
      allowImageEdit,
      setTempS3UrlFromPreSignedUpload,
      setImageTempS3Url,
      useFileUpload
    ]
  );

  const getUnsupportedFileAlertContent = useCallback((): React.JSX.Element | null => {
    if (entityType === FAVICON || entityType === LOGO) {
      if (fileErrors.length) {
        return newImage?.filename ? (
          <>
            <div>{fileErrors[fileErrors.length - 1]}</div>
            <ul>
              <li>{unacceptedFiles}</li>
            </ul>
          </>
        ) : (
          <div>{fileErrors[fileErrors.length - 1]}</div>
        );
      }
      return null;
    }

    return unacceptedFiles ? (
      <>
        {incorrectImageUploadText}
        <ul>
          <li>{unacceptedFiles}</li>
        </ul>
      </>
    ) : null;
  }, [entityType, fileErrors, incorrectImageUploadText, newImage, unacceptedFiles]);

  const UnSupportedFileAlert = useMemo(
    () => (
      <div css={alertStyle}>
        {!!fileErrors.length && (
          <Alerts
            variant="page"
            isRtl={false}
            testID="incorrect-image-size-alert"
            alerts={[
              {
                appearance: 'danger',
                content: getUnsupportedFileAlertContent(),
                dismissible: true,
                id: '0',
                isRtl: false,
                testID: 'incorrect-image-size-alert',
                onDismiss: (): void => {
                  setUnacceptedFiles(null);
                  setFileErrors([]);
                  setImageFile(null);
                }
              }
            ]}
          />
        )}
      </div>
    ),
    [alertStyle, fileErrors.length, getUnsupportedFileAlertContent]
  );

  const uploadErrorAlert = useMemo(
    () => (
      <div css={alertStyle}>
        {uploadError && (
          <Alerts
            variant="page"
            isRtl={false}
            testID="upload-error-alerts"
            alerts={[
              {
                appearance: 'danger',
                content: uploadError,
                dismissible: true,
                id: '0',
                isRtl: false,
                testID: 'upload-error-alert',
                onDismiss: (): void => setUploadError(null)
              }
            ]}
          />
        )}
      </div>
    ),
    [alertStyle, uploadError, setUploadError]
  );
  /**
   * END Common paths
   */

  const [imagefile, setImageFile] = useState(() =>
    currentImage
      ? {
          path: currentImage?.url,
          name: currentImage?.filename
        }
      : null
  );

  const acceptedFileAction = acceptedFile => {
    setImageFile(acceptedFile[0]);
    onImageUploadInputChange(acceptedFile[0]);
  };

  const onRemoveFile = () => {
    setImageFile(null);
    setNewImage(null);
    setUnacceptedFiles(null);
    setFileErrors([]);
    if (currentImage) {
      setImageDeleted(true);
    }
  };

  const onEditFile = () => {
    if (newImage === null) {
      setNewImage({
        filename: currentImage?.filename,
        size: currentImage?.size,
        url: currentImage?.url,
        croppedUrl: null
      });
    }
    setIsOpen(true);
    setUnacceptedFiles(null);
    setFileErrors([]);
  };

  const imageUploadInputButton = (imageExist): React.JSX.Element => (
    <div css={actionButtonStyles}>
      {useFileUpload ? (
        <FileUploadWrapper
          imagefile={imagefile}
          acceptedFileAction={acceptedFileAction}
          currentImage={currentImage}
          onRemove={onRemoveFile}
          onEditFile={onEditFile}
          recommendationTextForFileUpload={recommendationTextForFileUpload}
        />
      ) : (
        <>
          <Button
            text={imageExist ? translate('image_replace_button') : translate('image_upload_button')}
            icon={isLoading && !allowImageEdit ? LoadingIcon : UploadIcon}
            testID={imageExist ? 'image-replace-button' : 'image-upload-button'}
            size="s"
            iconAlign="start"
            onClick={onUploadClick}
          />
          <label hidden htmlFor="uploadImage">
            {translate('channel_image_label')}
            <input
              type="file"
              ref={imageUploadInput}
              id="uploadImage"
              hidden
              accept={acceptedFileFormats || ACCEPTED_FILE_FORMAT}
              onChange={onImageUploadInputChange}
              {...injectTestId('image-upload-input')}
            />
          </label>
        </>
      )}
    </div>
  );

  return (
    <>
      {!imageUrl ? (
        <>
          {uploadErrorAlert}
          {UnSupportedFileAlert}
          {imageUploadInputButton(false)}
        </>
      ) : (
        <>
          {uploadErrorAlert}
          {UnSupportedFileAlert}
          <Row>
            {imageUploadInputButton(true)}
            {!useFileUpload && (
              <>
                {allowImageEdit ? (
                  <div css={actionButtonStyles}>
                    <Button
                      text={translate('image_edit_button')}
                      icon={PencilIcon}
                      size="s"
                      testID="image-edit-button"
                      iconAlign="start"
                      onClick={(): void => {
                        if (newImage === null) {
                          setNewImage({
                            filename: currentImage?.filename,
                            size: currentImage?.size,
                            url: currentImage?.url,
                            croppedUrl: null
                          });
                        }
                        setIsOpen(true);
                        setUnacceptedFiles(null);
                        setFileErrors([]);
                      }}
                    />
                  </div>
                ) : null}
                <div css={deleteButtonStyles}>
                  <Button
                    text={translate('image_delete_button')}
                    icon={TrashIcon}
                    size="s"
                    testID="image-delete-button"
                    iconAlign="start"
                    onClick={(): void => {
                      setNewImage(null);
                      setUnacceptedFiles(null);
                      setFileErrors([]);
                      if (currentImage) {
                        setImageDeleted(true);
                      }
                    }}
                    disabled={!!disableDelete}
                  />
                </div>
              </>
            )}
          </Row>
        </>
      )}
      {isOpen && allowImageEdit && (
        <ImageEditorWrapper
          currentImage={currentImage}
          imageData={newImage}
          setNewImage={setNewImage}
          setIsOpen={setIsOpen}
          entityId={entityId}
          isLoading={isLoading}
          style={style}
          aspectRatioOptionList={aspectRatioOptions}
          aspectRatio={isLogo ? aspectRatioTypes.freeForm : aspectRatio}
          useCroppedImage={useCroppedImage}
        />
      )}
    </>
  );
}

interface Props {
  preSignedUpload?: boolean;
  videoCenterId?: string;
  imageUrl: string;
  setNewImage: (NewImage) => void;
  newImage: NewImage;
  currentImage: CurrentImage;
  setImageDeleted: (boolean) => void;
  incorrectImageUploadText: string;
  imageMaximumSize: number;
  entityId: string;
  aspectRatio: number;
  aspectRatioOptions?: string[];
  disableDelete: boolean;
  acceptedFileFormats?: string;
  isLogo: boolean;
  useCroppedImage: boolean;
  maxFileNameLength?: number;
  allowImageEdit?: boolean;
  entityType?: string;
  imageUploadTriggerLocation?: string;
  useFileUpload?: boolean;
  recommendationTextForFileUpload?: string;
}
