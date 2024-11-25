import React, { MutableRefObject, useCallback, useState } from 'react';
import { Form } from '@cvent/carina/components/Forms';
import { CardBody, CardContainer } from '@cvent/carina/components/Card';
import { ChannelInformationFormData } from '@components/channels/information/ChannelInformationFormData';
import { ChannelInformationType } from '@components/channels/type/channel';
import { ChannelInformationModalStyles } from '@components/channels/information/style';
import { useStyle } from '@hooks/useStyle';
import { NewImage } from '@components/common/imageUpload/types';
import { NetworkStatus, useMutation } from '@apollo/client';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { toUpper } from 'lodash';
import { ChannelStatus } from '@cvent/planner-event-hubs-model/types';
import { useTranslate } from 'nucleus-text';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { useChannelsPageActionsApi } from '@metrics/client/react/useChannelsPageActionsApi';
import {
  uploadChannelImageMutation,
  deleteChannelImageMutation,
  updateChannelMutation,
  getChannelQuery
} from '@cvent/planner-event-hubs-model/operations/channel';
import { PageAlert } from '@cvent/carina/components/Alert';

const LOG = LoggerFactory.create('channel-information');

export function ChannelInformation({
  channelData,
  channelId,
  networkStatus,
  setIsPageEdited,
  isPageEdited,
  submitRef
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const [imageDeleted, setImageDeleted] = useState(false);
  const [newImage, setNewImage] = useState<NewImage>(null);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [channelStatus, setChannelStatus] = useState<ChannelStatus>(channelData.status);

  // Upload ChannelImage mutation
  const [imageUploadMutation, { loading: uploadingImage }] = useMutation(uploadChannelImageMutation);

  // Delete ChannelImage mutation
  const [deleteImageMutation, { loading: deletingImage }] = useMutation(deleteChannelImageMutation);

  // Update Channel Mutation
  const [updateChannelDetail, { loading: updatingChannel }] = useMutation(updateChannelMutation);

  const { channelStatusToggled, channelImageChecked } = useChannelsPageActionsApi();
  const updateChannel = useCallback(
    async (submittedValues, uploadedImage) =>
      updateChannelDetail({
        variables: {
          channelInput: {
            id: channelId,
            title: submittedValues.values.title?.trim(),
            description: submittedValues.values.description?.trim(),
            status:
              submittedValues.values.status === ChannelStatus.Inactive ? ChannelStatus.Inactive : ChannelStatus.Active
          }
        },
        refetchQueries: [getChannelQuery],
        update: (cache, result) => {
          const channelInfo = result?.data?.updateChannel;
          let updatedImage = channelData?.image;
          if (uploadedImage) {
            updatedImage = uploadedImage?.data?.uploadChannelImage;
          }
          cache.writeQuery({
            query: getChannelQuery,
            variables: { channelId },
            data: {
              getChannelInformation: {
                ...channelInfo,
                status: channelInfo?.status,
                image: {
                  imageId: updatedImage?.imageId,
                  filename: updatedImage?.filename,
                  size: updatedImage?.size,
                  url: updatedImage?.url,
                  createdAt: updatedImage?.createdAt
                }
              }
            }
          });
        }
      }),
    [channelData?.image, channelId, updateChannelDetail]
  );

  const uploadImage = useCallback(
    async newImageData =>
      imageUploadMutation({
        variables: {
          channelId,
          imageInput: {
            filename: newImageData?.filename,
            size: newImageData?.size,
            url: newImageData?.croppedUrl || newImageData?.url
          }
        },
        refetchQueries: [getChannelQuery],
        update: (cache, result) => {
          const imageData = result?.data?.uploadChannelImage;
          cache.writeQuery({
            query: getChannelQuery,
            variables: { channelId },
            data: {
              getChannelInformation: {
                ...channelData,
                status: toUpper(channelData.status),
                image: {
                  imageId: imageData?.imageId,
                  filename: imageData?.filename,
                  size: imageData?.size,
                  url: imageData?.url,
                  createdAt: imageData?.createdAt
                }
              }
            }
          });
          setNewImage(null);
        }
      }),
    [channelData, channelId, imageUploadMutation]
  );

  const deleteImage = useCallback(
    async updatedChannel => {
      let updatedChannelData = channelData;
      if (updatedChannel) {
        updatedChannelData = updatedChannel?.data?.updateChannel;
      }
      return deleteImageMutation({
        variables: {
          channelId,
          imageId: channelData?.image?.imageId
        },
        update: cache => {
          cache.writeQuery({
            query: getChannelQuery,
            variables: { channelId },
            data: {
              getChannelInformation: {
                ...updatedChannelData,
                status: toUpper(updatedChannelData?.status),
                image: null
              }
            }
          });
        }
      });
    },
    [channelData, channelId, deleteImageMutation]
  );

  const onSubmit = useCallback(
    async (event, submission) => {
      const edited = isPageEdited;
      setIsPageEdited(false);

      let uploadedImage = null;
      let updatedChannel = null;
      try {
        if (newImage) {
          uploadedImage = await uploadImage(newImage);
          channelImageChecked({});
        }

        // Checks if channel Data is changed or not, then calls update mutation
        if (edited) {
          // Analytics
          if (channelData?.status !== submission?.values?.status) {
            channelStatusToggled({
              channelStatus: submission?.values?.status
            });
          }
          updatedChannel = await updateChannel(submission, uploadedImage);
        }

        if (imageDeleted && channelData.image) {
          await deleteImage(updatedChannel);
        }
        setShowAlertSuccess(true);
      } catch (error) {
        LOG.error('Error occurred while updating channel information: ', error);
      }
    },
    [
      isPageEdited,
      setIsPageEdited,
      newImage,
      imageDeleted,
      channelData.image,
      channelData?.status,
      uploadImage,
      channelImageChecked,
      updateChannel,
      channelStatusToggled,
      deleteImage
    ]
  );

  const { cardBodyStyles } = useStyle(ChannelInformationModalStyles);

  if (networkStatus === NetworkStatus.refetch || uploadingImage || deletingImage || updatingChannel) {
    return <LoadingSpinner size="l" />;
  }
  return (
    <>
      {showAlertSuccess && (
        <div css={{ marginBottom: '1.5rem' }}>
          <PageAlert
            appearance="success"
            content={translate('channel_information_update_message')}
            dismissible
            onDismiss={() => setShowAlertSuccess(false)}
            testID="channel-information-form-success"
          />
        </div>
      )}
      <CardContainer responsive>
        <div css={cardBodyStyles}>
          <CardBody>
            <Form
              testID="channel-information-form"
              id="channel-information-form"
              initialValues={channelData}
              initializationMode="reinitialize"
              onSubmit={onSubmit}
            >
              <ChannelInformationFormData
                channelData={channelData}
                imageDeleted={imageDeleted}
                setImageDeleted={setImageDeleted}
                newImage={newImage}
                setNewImage={setNewImage}
                setIsPageEdited={setIsPageEdited}
                channelStatus={channelStatus}
                setChannelStatus={setChannelStatus}
              />
              <button type="submit" hidden ref={submitRef}>
                Click
              </button>
            </Form>
          </CardBody>
        </div>
      </CardContainer>
    </>
  );
}

interface Props {
  channelData: ChannelInformationType;
  channelId: string;
  networkStatus: NetworkStatus;
  isPageEdited: boolean;
  setIsPageEdited: (isPageEdited: boolean) => void;
  submitRef: MutableRefObject<HTMLButtonElement>;
}
