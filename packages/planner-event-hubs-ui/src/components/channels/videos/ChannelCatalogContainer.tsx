import React, { MutableRefObject, useCallback, useState } from 'react';
import Videos from '@components/channels/videos/Videos';
import { ChannelCatalog, ExtendedItemCatalog } from '@components/channels/type/channelCatalog';
import { useMutation, useQuery } from '@apollo/client';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';

import { ChannelInformationType } from '@components/channels/type/channel';
import { getVideoIds } from '@components/channels/videos/videoHelper';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';

import {
  createCatalogMutation,
  updateCatalogMutation,
  getCatalogQuery
} from '@cvent/planner-event-hubs-model/operations/channel';

const LOG = LoggerFactory.create('channel-catalog');

interface Props {
  containerRef: MutableRefObject<HTMLInputElement>;
  setCatalogInChannelData: (catalogId: string) => void;
  channelData: ChannelInformationType;
  setIsPageEdited: (isPageEdited: boolean) => void;
  submitRef: MutableRefObject<HTMLButtonElement>;
}

function ChannelCatalogContainer({
  channelData: { catalogId, id: channelId },
  containerRef,
  setCatalogInChannelData,
  setIsPageEdited,
  submitRef
}: Props): JSX.Element {
  const [videoCatalog, setVideoCatalog] = useState<ChannelCatalog>(null);
  const { loading: loadingCatalog } = useQuery(getCatalogQuery, {
    skip: !catalogId,

    variables: { catalogId },
    onCompleted: ({ getCatalog }) => {
      setVideoCatalog(getCatalog);
    }
  });

  const [createCatalog, { loading: creatingCatalog }] = useMutation(createCatalogMutation);

  const [updateCatalog, { loading: updatingCatalog }] = useMutation(updateCatalogMutation);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleCatalogMutationResponse = useCallback(
    (cache, newCatalogData, existingCatalogId) => {
      cache.writeQuery({
        query: getCatalogQuery,
        variables: { catalogId: existingCatalogId || newCatalogData.id },
        data: {
          getCatalog: newCatalogData
        }
      });
      setVideoCatalog(newCatalogData);
      setCatalogInChannelData(newCatalogData?.id);
    },
    [setCatalogInChannelData]
  );

  const onVideoCatalogUpdate = useCallback(
    async (updatedCatalogData: ChannelCatalog, setItemCatalog: (catalog: ExtendedItemCatalog) => void) => {
      try {
        if (catalogId) {
          await updateCatalog({
            variables: {
              channelId,
              catalogId,
              catalogInput: updatedCatalogData
            },
            update: (cache, { data: { updateCatalog: newCatalogData } }) => {
              handleCatalogMutationResponse(cache, newCatalogData, catalogId);
            }
          });
        } else if (getVideoIds(updatedCatalogData).length > 0) {
          await createCatalog({
            variables: {
              channelId,
              catalogInput: updatedCatalogData
            },
            update: (cache, { data: { createCatalog: newCatalogData } }) => {
              handleCatalogMutationResponse(cache, newCatalogData, catalogId);
            }
          });
        } else {
          setItemCatalog(null);
        }
      } catch (error) {
        LOG.error('Error occurred while updating catalog: ', error);
      }
    },
    [catalogId, channelId, createCatalog, handleCatalogMutationResponse, updateCatalog]
  );

  if (loadingCatalog || updatingCatalog || creatingCatalog) {
    return <LoadingSpinner size="l" />;
  }

  return (
    <Videos
      videoCatalog={videoCatalog}
      onVideoCatalogUpdate={onVideoCatalogUpdate}
      containerRef={containerRef}
      setIsPageEdited={setIsPageEdited}
      isSuccess={isSuccess}
      setIsSuccess={setIsSuccess}
      submitRef={submitRef}
    />
  );
}

export default ChannelCatalogContainer;
