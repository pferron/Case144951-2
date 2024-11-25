import React, { useCallback, useState } from 'react';
import { Table, TableColumn } from '@cvent/carina/components/Table';
import { useTranslate } from 'nucleus-text';
import { ChannelListingType } from '@components/channels/type/channel';
import { TrashIcon } from '@cvent/carina/components/Icon';
import { Button } from '@cvent/carina/components/Button';
import useBreakpoints from '@hooks/useBreakpoints';
import DeleteChannel from '@components/channels/delete/DeleteChannel';
import { ViewChannelsStyle } from '@components/channels/style';
import { useStyle } from '@hooks/useStyle';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { ChannelStatus } from '@cvent/planner-event-hubs-model/types';
import { ASC, CHANNEL_TABLE_LABELS } from '@utils/constants';
import StatusText from '@components/common/StatusText';
import { useTheme } from '@cvent/carina/components/ThemeProvider';
import DragAndDropCatalog from '@cvent/drag-and-drop-catalog';
import { ExtendedItemCatalog, ExtendedSection } from '@components/channels/type/channelCatalog';
import Col from '@cvent/carina/components/Col';
import Row from '@cvent/carina/components/Row';
import { Catalog } from '@cvent/drag-and-drop-catalog/dist/types/catalogTypes';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { injectTestId } from '@cvent/nucleus-test-automation';

function ChannelsTable({
  channels,
  loadingMoreChannel,
  deleteChannel,
  isDraggable,
  scrollViewRef,
  channelCatalog,
  setChannelCatalog,
  setIsPageEdited
}: Props): JSX.Element {
  const channelList = channels.map(channel => ({
    ...channel,
    rowName: channel.id
  }));

  const [channelIdDelete, setChannelIdDelete] = useState<string>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const { tableFont, trashContainer, tableContainer, singleChannelLink } = useStyle(ViewChannelsStyle);
  const { translate } = useTranslate();
  const { isMobileOrTablet } = useBreakpoints();
  const router = useRouter();
  const currentPath = router.asPath;
  const theme = useTheme();
  const handleDeleteChannel = () => {
    setDeleteModal(false);
    deleteChannel(channelIdDelete);
  };

  const trashIcon = rowData => (
    <div css={{ marginLeft: 'auto' }}>
      <Button
        appearance="ghost"
        icon={TrashIcon}
        testID={`trash-icon-${rowData.rowData.rowName}`}
        aria-label={translate('channel_list_trash_label')}
        onClick={() => {
          setChannelIdDelete(rowData.rowData.id);
          setDeleteModal(true);
        }}
      />
    </div>
  );

  const onDragAndDropItems = useCallback(
    (oldCatalog: ExtendedItemCatalog, updatedSections: Array<ExtendedSection>) => {
      setChannelCatalog({
        ...oldCatalog,
        ...{ sections: updatedSections }
      });
      setIsPageEdited(true);
    },
    [setChannelCatalog, setIsPageEdited]
  );

  return (
    <div css={tableContainer}>
      {isDraggable ? (
        <div>
          <div css={{ backgroundColor: theme.backgroundColor.base }}>
            <Row>
              <Col
                width={2 / 3}
                padding={{
                  paddingTop: 16,
                  paddingBottom: 16,
                  paddingLeft: isMobileOrTablet ? 64 : 80
                }}
              >
                {translate('channel_list_name')}
              </Col>
              <Col
                width={1 / 3}
                padding={{
                  paddingTop: 16,
                  paddingBottom: 16,
                  paddingLeft: isMobileOrTablet ? 24 : 32
                }}
              >
                {translate('channel_list_status')}
              </Col>
            </Row>
          </div>
          <DragAndDropCatalog
            externalContainerRef={scrollViewRef}
            accessibilityLabels={CHANNEL_TABLE_LABELS}
            isEditMode={isDraggable}
            catalog={channelCatalog}
            updateCatalog={onDragAndDropItems}
            showSection={false}
            makeLastSectionNonDraggable
            translate={translate}
          />
        </div>
      ) : (
        <Table
          data={channelList}
          striped
          staticActionsMenu
          paddingMode="roomy"
          testID="channel-list-table"
          externallySorted
          sortDirection={ASC}
        >
          <TableColumn
            name="title"
            dataKey="title"
            heading={translate('channel_list_name')}
            sortable={false}
            minWidth={(isMobileOrTablet && 80) || 320}
            // FIREBALL
            /* eslint-disable */
            cellRenderer={(cellData, rowData) => (
              <div css={tableFont}>
                <NextLink href={`${currentPath}/${rowData.rowData.rowName}`}>
                  <a
                    href={`${currentPath}/${rowData.rowData.rowName}`}
                    {...injectTestId(`channel-title-${rowData.rowData.rowName}`)}
                    css={singleChannelLink}
                  >
                    {cellData}
                  </a>
                </NextLink>
              </div>
            )}
          />
          <TableColumn
            name="status"
            dataKey="status"
            heading={translate('channel_list_status')}
            sortable={false}
            hideWhenCollapsed
            // FIREBALL
            /* eslint-disable */
            cellRenderer={(cellData, rowData) => (
              <div css={[trashContainer, tableFont]}>
                <StatusText isActive={cellData === ChannelStatus.Active} />
                {trashIcon(rowData)}
              </div>
            )}
          />
        </Table>
      )}
      {loadingMoreChannel && <LoadingSpinner size="m" testID="loading-more-channels-spinner" />}
      {deleteModal && <DeleteChannel setIsModalOpen={setDeleteModal} deleteChannel={handleDeleteChannel} />}
    </div>
  );
}

interface Props {
  channels: Array<ChannelListingType>;
  loadingMoreChannel: boolean;
  deleteChannel: (channelId: string) => void;
  isDraggable: boolean;
  scrollViewRef;
  channelCatalog: Catalog;
  setChannelCatalog;
  setIsPageEdited;
}

export default ChannelsTable;
