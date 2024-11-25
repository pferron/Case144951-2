import React, { useState, useCallback } from 'react';
import {
  TemplateActions as Actions,
  IllustrationNotice,
  IllustrationHeader,
  IllustrationContent
} from '@cvent/carina/components/Templates';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { StatusLabel } from '@cvent/carina/components/StatusLabel';
import { VideoCenterListingStyles } from '@components/videoCenters/style';
import { TableProps, Table, TableColumn } from '@cvent/carina/components/Table';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import { VideoCenterStatus } from '@components/videoCenters/constants';
import { Hub } from '@cvent/planner-event-hubs-model/types';
import { HeroBuild } from '@cvent/carina/components/Illustrations';
import ConfirmationModal from '@components/common/ConfirmationModal';
import { VIDEO_HUB_PATH_PARAM_KEY, VIDEO_HUB_INFORMATION_URL, HUB_OVERVIEW_URL } from '@utils/constants';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import NextLink from 'next/link';

interface VideoHubsViewProps {
  videoHubs: Array<Hub>;
  loadingVideoCentersList: boolean;
  headerActions: ActionType[];
  deleteVideoCenter: (videoCenterId: string) => void;
}

function ViewVideoCenters({
  videoHubs,
  loadingVideoCentersList,
  headerActions,
  deleteVideoCenter
}: VideoHubsViewProps): JSX.Element {
  const { translate } = useTranslate();
  const { container, hubTitleLink } = useStyle(VideoCenterListingStyles);
  const OWNER = 'owner';
  const { hubOverviewFeature } = useAppFeatures();

  const videoHubList = videoHubs.map(hub => ({
    rowName: hub.id,
    id: hub.id,
    status: hub.status,
    title: (
      <NextLink
        href={
          hubOverviewFeature
            ? HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, hub.id)
            : VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, hub.id)
        }
      >
        <a
          href={
            hubOverviewFeature
              ? HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, hub.id)
              : VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, hub.id)
          }
          css={hubTitleLink}
        >
          {hub.config?.title}
        </a>
      </NextLink>
    ),
    locale: hub.config?.locale,
    url: hub.config?.url,
    owner: translate('Universal-FullName', {
      firstName: hub.config?.ownerFirstName,
      lastName: hub.config?.ownerLastName
    })
  }));

  const [selectedVideoHubId, setSelectedVideoHubId] = useState<string>('');
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const handleDeleteVideoCenter = () => {
    setDeleteModal(false);
    deleteVideoCenter(selectedVideoHubId);
  };

  const handlePreviewAction = rowData => {
    window.open(rowData?.url || '/404', '_blank');
  };

  const handleHubDeleteAction = (rowName: string) => {
    setSelectedVideoHubId(rowName);
    setDeleteModal(true);
  };

  // In-development menu items commented out below.
  const hubActions: TableProps<unknown>['actions'] = useCallback(
    rowData => [
      {
        label: translate('video_hub_action_preview_text'),
        onClick: (): void => handlePreviewAction(rowData)
      },
      // {
      //   label: translate('video_hub_action_edit_status_text'),
      //   onClick: () => console.log('CLICK EDIT STATUS: ', rowData.id)
      // },
      // {
      //   label: translate('video_hub_action_copy_text'),
      //   onClick: () => console.log('CLICK COPY: ', rowData.id)
      // },
      {
        label: translate('video_hub_action_delete_text'),
        onClick: (): void => handleHubDeleteAction(rowData.rowName)
      }
    ],
    [translate]
  );

  const statusLabelRenderer = (cellData: string): JSX.Element => {
    if (cellData === VideoCenterStatus.ACTIVE) {
      return <StatusLabel variant="positive">{translate('video_hub_status_active')}</StatusLabel>;
    }
    return <StatusLabel variant="neutral">{translate('video_hub_status_inactive')}</StatusLabel>;
  };

  const statusTextRenderer = (cellData: string): string =>
    translate(cellData === VideoCenterStatus.ACTIVE ? 'video_hub_status_active' : 'video_hub_status_inactive');
  const sortOwnerCol = (a, b) => (a[OWNER].toLowerCase() > b[OWNER].toLowerCase() ? 1 : -1);

  if (loadingVideoCentersList) {
    return <LoadingSpinner {...injectTestId('video-hubs-list-loading-spinner')} size="l" />;
  }

  if (!loadingVideoCentersList && videoHubList?.length < 1) {
    return (
      <IllustrationNotice
        testID="video-hub-empty-page-container"
        illustration={HeroBuild}
        aria-label={translate('video_hub_empty_page_accessibility_label')}
        title={translate('video_hub_empty_page_illustration_title')}
      >
        <IllustrationHeader>{translate('video_hub_empty_page_message_header')}</IllustrationHeader>
        <IllustrationContent>{translate('video_hub_empty_page_message_content')}</IllustrationContent>
        <Actions actions={headerActions} position="center" />
      </IllustrationNotice>
    );
  }

  return (
    <div css={container} {...injectTestId('video-hubs-view')}>
      <Table data={videoHubList} initialSortColumn="title" striped staticActionsMenu actions={hubActions}>
        <TableColumn name="title" heading={translate('video_hub_column_name')} minWidth={350} sortable />
        <TableColumn
          name="status"
          heading={translate('video_hub_column_status')}
          sortable
          cellRenderer={statusLabelRenderer}
          collapsedCellRenderer={statusTextRenderer}
        />
        <TableColumn
          name="owner"
          heading={translate('video_hub_column_owner')}
          sortable
          sortFunction={sortOwnerCol}
          hideWhenCollapsed
        />
      </Table>
      {deleteModal && (
        <ConfirmationModal
          header={translate('video_hub_delete_modal_header')}
          content={translate('video_hub_delete_modal_content')}
          cancelText={translate('cancel_button_label')}
          confirmationText={translate('video_hub_delete_modal_confirmation_text')}
          confirmationAction={handleDeleteVideoCenter}
          setIsModalOpen={setDeleteModal}
        />
      )}
    </div>
  );
}

export default ViewVideoCenters;
