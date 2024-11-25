import { useTable } from '@cvent/carina/components/Table';
import { DraggableTableProps } from '@cvent/carina/components/Table/DraggableTable';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useMemo, useState } from 'react';

import TextLink from '@cvent/carina/components/TextLink';
import { ThemeContext } from '@cvent/carina/components/ThemeProvider/ThemeContext';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useTranslate } from 'nucleus-text';

import ContentCard from '@components/ContentCard';
import { BANNERS_PATH_PARAM_KEY, BANNER_URL, VIDEO_HUB_PATH_PARAM, VIDEO_HUB_PATH_PARAM_KEY } from '@utils/constants';
import { useRouter } from 'next/router';

import { useMutation, useQuery } from '@apollo/client';
import { ExistingBannerAssociationWithBanner } from '@cvent/planner-event-hubs-model/types';
import useQueryParams from '@hooks/useQueryParam';
import { UPDATE_BANNER_ASSOCIATIONS } from '@cvent/planner-event-hubs-model/operations/banner';
import { getChannelQuery } from '@cvent/planner-event-hubs-model/operations/channel';

const MAX_PLACEMENTS = 6;

const DraggableTable = dynamic<DraggableTableProps>(() =>
  import('@cvent/carina/components/Table').then(mod => mod.DraggableTable)
);

const bannerAssociationUpdate = fields =>
  fields.map((f, index) => ({
    banner: f.banner.id,
    displayOrder: index + 1
  }));

const useStyles = () => {
  const appTheme = useContext(ThemeContext);

  return {
    row: {
      fontSize: appTheme.font.base.size.m,
      display: 'flex',
      gap: 5,
      justifyContent: 'space-between',
      '& div': {
        fontSize: appTheme.font.base.size.m
      }
    },
    description: {
      marginTop: 8,
      '& div': {
        fontSize: appTheme.font.base.size.xs,
        color: appTheme.font.color.soft
      }
    },
    footer: {
      marginTop: 8,
      fontSize: appTheme.font.base.size.s,
      color: appTheme.font.color.soft
    }
  };
};

interface Props {
  totalBannersNumber?: number;
  data: Array<ExistingBannerAssociationWithBanner>;
}

function DragAndDropBannerPlacements({ data }: Props): JSX.Element {
  const { row, description, footer } = useStyles();
  const { translate } = useTranslate();
  const router = useRouter();
  const query = useQueryParams();
  const centerId = query[VIDEO_HUB_PATH_PARAM] as string;

  const [updateBannerAssociationMutation] = useMutation(UPDATE_BANNER_ASSOCIATIONS);

  const [bannerPlacements, setPlacementList] = useState([]);

  const tableRows = useMemo(() => bannerPlacements, [bannerPlacements]);

  const { data: channelData } = useQuery(getChannelQuery, {
    variables: {
      channelId: data[0].entityId
    },
    skip: !(data[0].entityType === 'Channel' && data[0].entityId)
  });

  useEffect(() => {
    setPlacementList(() =>
      data.map((item, index: number) => ({
        ...item,
        rowName: `${index}`
      }))
    );
  }, [data]);

  const onUpdateBannerAssociations = async (updatedAssociations): Promise<void> => {
    const associationsToSave = bannerAssociationUpdate(updatedAssociations);
    const associatedCenterId = updatedAssociations[0].centerId;
    const associatedEntityId = updatedAssociations[0].entityId;
    const associatedEntityType = updatedAssociations[0].entityType;
    await updateBannerAssociationMutation({
      variables: {
        input: {
          centerId: associatedCenterId.toString(),
          entityId: associatedEntityId.toString(),
          entityType: associatedEntityType.toString(),
          bannerAssociation: associationsToSave
        }
      }
    });
  };
  const [Table, TableColumn] = useTable({ data: tableRows, isDraggable: true, DraggableTable });

  const onDragEndCallback = ({ fromIndex, toIndex }: { fromIndex?: number; toIndex?: number }) => {
    const newPlacementList = [...bannerPlacements];
    if (fromIndex !== undefined && toIndex !== undefined) {
      newPlacementList.splice(toIndex, 0, newPlacementList.splice(fromIndex, 1)[0]);
      setPlacementList(newPlacementList);
      onUpdateBannerAssociations(newPlacementList);
    }
  };

  const onEdit = (bannerId: string): void => {
    if (bannerId) {
      const redirection = BANNER_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId).replace(
        BANNERS_PATH_PARAM_KEY,
        bannerId
      );
      router.push({
        pathname: redirection
      });
    }
  };

  const placementCellRenderer = (_, { rowData }): JSX.Element => (
    <div {...injectTestId('banner-placement-table-row')} css={row}>
      <div>
        <div {...injectTestId(`banner-placement-table-row-${rowData.rowName}`)}>{rowData?.banner?.name}</div>
        <div css={description} {...injectTestId(`banner-placement-table-row-visibility-${rowData.rowName}`)} />
      </div>
      <TextLink element="button" size="l" onClick={() => onEdit(rowData.banner.id)}>
        {translate('BannerPlacements-Edit-Banner-Link')}
      </TextLink>
    </div>
  );

  const pageName = data[0].entityType !== 'Channel' ? 'Homepage' : channelData?.getChannelInformation?.title;

  const dragAndDropBannerPlacementHeader: JSX.Element = <h3 style={{ margin: 0 }}>{pageName}</h3>;

  const contentCardBodyContent: JSX.Element = (
    <>
      <Table allowDragAndDrop rowMode="drag-and-drop" onDragEnd={onDragEndCallback} hideHeader paddingMode="roomy">
        <TableColumn name="name" cellRenderer={placementCellRenderer} />
      </Table>
      <div css={footer}>
        {translate('BannerPlacements-NumBannersAssigned-Footer', {
          numBannersAssigned: data.length.toString(),
          totalNumBanners: MAX_PLACEMENTS
        })}
      </div>
    </>
  );

  return (
    <ContentCard
      collapsible
      containerStyle={{ margin: 24 }}
      cardName={data[0].entityType}
      header={dragAndDropBannerPlacementHeader}
      BodyComponent={contentCardBodyContent}
    />
  );
}

export default DragAndDropBannerPlacements;
