import { useMutation, useQuery } from '@apollo/client';
import { CardContainerStyles } from '@components/common/style';
import { BannerListStyle, PagesSectionStyle } from '@components/videoCenters/style';
import { Button } from '@cvent/carina/components/Button';
import { injectTestId } from '@cvent/nucleus-test-automation';
import useQueryParams from '@hooks/useQueryParam';
import { useStyle } from '@hooks/useStyle';
import { BANNERS_PATH_PARAM, VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { useTranslate } from 'nucleus-text';
import React, { useCallback, useRef, useState, ReactNode } from 'react';
import { ViewChannelsStyle } from '@components/channels/style';
import { TrashIcon } from '@cvent/carina/components/Icon';
import { Table, TableColumn } from '@cvent/carina/components/Table';
import { useBannersPageActionsApi } from '@metrics/client/react/useBannersPageActionsApi';
import {
  GET_BANNERS_ASSOCIATIONS,
  HUB_PAGES,
  HUB_PAGES_WITH_BANNER,
  UPDATE_BANNER_ASSOCIATIONS
} from '@cvent/planner-event-hubs-model/operations/banner';
import BannerPagesModal from './BannerPagesModal';

function PagesSection(): JSX.Element {
  const { translate } = useTranslate();

  const { cardTitle, cardText } = useStyle(CardContainerStyles);
  const { description, buttonAlign } = useStyle(PagesSectionStyle);
  const ref = useRef(null);
  const { bannerPagesList, assignPages } = useStyle(BannerListStyle);

  const query = useQueryParams();

  const bannerId = query[BANNERS_PATH_PARAM] as string;
  const centerId = query[VIDEO_HUB_PATH_PARAM] as string;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState();
  const { tableFont, trashContainer } = useStyle(ViewChannelsStyle);

  const { assignPagesButtonClicked, pagesAssignButtonClicked } = useBannersPageActionsApi();

  const { data: bannerWithPagesData } = useQuery(HUB_PAGES_WITH_BANNER, {
    variables: {
      input: {
        hubId: centerId,
        bannerId
      }
    }
  });
  const bannerPages = bannerWithPagesData?.hubPagesWithBanner?.data;

  const [updateBannerAssociationCall] = useMutation(UPDATE_BANNER_ASSOCIATIONS);

  const { data: bannerPagesListData } = useQuery(HUB_PAGES, {
    variables: {
      id: {
        id: centerId
      }
    }
  });

  const availableBannerPages = bannerPagesListData?.hubPages?.data.filter(
    hubPage =>
      !bannerWithPagesData?.hubPagesWithBanner?.data.some(notAvailPage => notAvailPage.entityId === hubPage.entityId)
  );

  const bannerAssociationUpdate = fields =>
    fields?.map((f, index) => ({
      banner: f.banner.id,
      displayOrder: index + 1
    }));

  const { data: associationData } = useQuery(GET_BANNERS_ASSOCIATIONS, {
    variables: {
      bannerAssociationSearch: {
        centerId,
        limit: 100
      }
    }
  });

  const onSave = useCallback(
    (entity: string): void => {
      const selectedPageData = availableBannerPages.filter(obj => obj.entityId === entity);

      const fileredData = associationData?.bannerAssociations?.data?.filter(obj => obj.entityId === entity);
      const associationsToSave = bannerAssociationUpdate(fileredData);
      const newAssociation = [...associationsToSave, { banner: bannerId, displayOrder: associationsToSave.length + 1 }];

      updateBannerAssociationCall({
        variables: {
          input: {
            centerId,
            entityType: selectedPageData?.map(p => p.entityType).toString(),
            entityId: selectedPageData?.map(p => p.entityId).toString(),
            bannerAssociation: newAssociation
          }
        },
        refetchQueries: [HUB_PAGES_WITH_BANNER, GET_BANNERS_ASSOCIATIONS]
      });
      pagesAssignButtonClicked({
        bannerPlacement: selectedPageData?.[0]?.name
      });
    },
    [bannerId, centerId, availableBannerPages, updateBannerAssociationCall, associationData, pagesAssignButtonClicked]
  );

  const deletePageAssociation = useCallback(
    (rowData: string) => {
      const updatedAssociation = bannerWithPagesData?.hubPagesWithBanner?.data?.filter(item => item.name === rowData);
      const fileredData = associationData?.bannerAssociations?.data?.filter(
        obj => obj.entityId === updatedAssociation?.map(e => e.entityId).toString() && obj.banner.id !== bannerId
      );

      const associationsToSave = bannerAssociationUpdate(fileredData);

      updateBannerAssociationCall({
        variables: {
          input: {
            centerId,
            entityType: updatedAssociation?.map(en => en.entityType).toString(),
            entityId: updatedAssociation?.map(en => en.entityId).toString(),
            bannerAssociation: associationsToSave
          }
        },
        refetchQueries: [HUB_PAGES_WITH_BANNER, GET_BANNERS_ASSOCIATIONS]
      });
    },
    [updateBannerAssociationCall, centerId, bannerWithPagesData, bannerId, associationData]
  );

  const trashIcon = rowData => (
    <div css={{ marginLeft: 'auto' }}>
      <Button
        appearance="ghost"
        icon={TrashIcon}
        testID="trash-icon"
        accessibilityLabel={translate('channel_list_trash_label')}
        onClick={() => {
          deletePageAssociation(rowData);
        }}
      />
    </div>
  );

  const bannerPageEntityCellRenderer = (_, { rowData }): JSX.Element => (
    <div {...injectTestId('banner-placement-table-row')}>{rowData as unknown as ReactNode}</div>
  );

  const bannerPageDeleteCellRenderer = (_, { rowData }): JSX.Element => (
    <div css={[trashContainer, tableFont]}>{trashIcon(rowData)}</div>
  );

  return (
    <div>
      <h3 css={cardTitle} ref={ref}>
        {translate('Banners-Pages-Section-Title')}
      </h3>
      <p css={cardText}>{translate('Banners-Pages-Section-Description')}</p>
      {bannerPages?.length > 0 ? (
        <div>
          <ul css={bannerPagesList} {...injectTestId('banners-list')}>
            <div css={assignPages}>
              {availableBannerPages?.length > 0 && (
                <Button
                  text={translate('Banners-Assign-Pages-Button')}
                  appearance="filled"
                  onClick={() => {
                    setIsOpen(true);
                    assignPagesButtonClicked({});
                  }}
                />
              )}
              <BannerPagesModal
                pagesData={availableBannerPages}
                selectedPageOption={selectedPage}
                setSelectedPageOption={setSelectedPage}
                isModalOpen={isOpen}
                setIsModalOpen={setIsOpen}
                onSave={onSave}
              />
            </div>

            <div>
              <Table data={bannerPages.map(d => d.name)} hideHeader>
                <TableColumn name="entity" cellRenderer={bannerPageEntityCellRenderer} />
                <TableColumn name="delete" cellRenderer={bannerPageDeleteCellRenderer} />
              </Table>
            </div>
          </ul>
        </div>
      ) : (
        <>
          <div>
            <div css={description}>{translate('Banner-Pages-None-Added-Description')}</div>
            <div css={buttonAlign}>
              <Button
                css={{ margin: 'auto' }}
                text={translate('Banners-Assign-Pages-Button')}
                appearance="filled"
                onClick={() => {
                  setIsOpen(true);
                  assignPagesButtonClicked({});
                }}
              />
            </div>
          </div>
          <BannerPagesModal
            pagesData={availableBannerPages}
            selectedPageOption={selectedPage}
            setSelectedPageOption={setSelectedPage}
            isModalOpen={isOpen}
            setIsModalOpen={setIsOpen}
            onSave={onSave}
          />
        </>
      )}
    </div>
  );
}

export default PagesSection;
