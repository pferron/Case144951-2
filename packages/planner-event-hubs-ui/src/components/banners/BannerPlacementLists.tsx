import React, { useCallback, useRef, useState } from 'react';
import { useTranslate } from 'nucleus-text';
import { useQuery } from '@apollo/client';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import useQueryParams from '@hooks/useQueryParam';
import { VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { groupBy, sortBy } from 'lodash';
import {
  BannerAssociationPaging,
  ExistingBannerAssociationWithBanner,
  Paging
} from '@cvent/planner-event-hubs-model/types';
import { GET_BANNERS_ASSOCIATIONS } from '@cvent/planner-event-hubs-model/operations/banner';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import DragAndDropBannerPlacements from './DragAndDropBannerPlacements';

function BannerPlacementLists(): JSX.Element {
  const query = useQueryParams();
  const [loadingMoreBanners, setLoadingMoreBanners] = useState<boolean>(false);
  const [bannersPagination, setBannersPagination] = useState<Paging>(null);
  const associationTableRef = useRef(null);

  const [banners, setBanners] = useState<Array<ExistingBannerAssociationWithBanner>>([]);

  const centerId = query[VIDEO_HUB_PATH_PARAM] as string;
  const { translate } = useTranslate();

  const {
    data,
    loading: loadingBanners,
    fetchMore
  } = useQuery(GET_BANNERS_ASSOCIATIONS, {
    variables: {
      bannerAssociationSearch: {
        centerId,
        limit: 20
      }
    },
    onCompleted: ({ bannerAssociations }: { bannerAssociations: BannerAssociationPaging }) => {
      setBanners(bannerAssociations.data);
      setBannersPagination(bannerAssociations.paging);
    }
  });
  const loadMoreBanners = useCallback(async () => {
    const nextToken = bannersPagination?.nextToken;
    if (!loadingMoreBanners && nextToken) {
      setLoadingMoreBanners(true);
      await fetchMore({
        variables: {
          bannerAssociationSearch: {
            centerId,
            token: nextToken
          }
        },
        updateQuery: (prev, { fetchMoreResult }: { fetchMoreResult? }) => {
          if (!fetchMoreResult?.bannerAssociations?.data) return prev;
          setBanners(existingList => [...existingList, ...fetchMoreResult.bannerAssociations.data]);
          setBannersPagination(fetchMoreResult.bannerAssociations.paging);
          return {
            bannerAssociations: {
              ...fetchMoreResult.bannerAssociations,
              data: [...prev.bannerAssociations.data, ...fetchMoreResult.bannerAssociations.data]
            }
          };
        }
      });
      setLoadingMoreBanners(false);
    }
  }, [bannersPagination, loadingMoreBanners, centerId, fetchMore]);

  useInfiniteScroll(loadMoreBanners, associationTableRef, {
    bottomScrollLeft: 100,
    immediate: true
  });

  const grouped = groupBy(banners, 'entityId');
  const sortedGroups = [];

  Object.keys(grouped).forEach(group => {
    if (group) {
      sortedGroups.push(sortBy(grouped[group], 'displayOrder'));
    }
  });

  return (
    <ScrollViewWithBars forwardScrollViewRef={associationTableRef}>
      <div>
        {loadingBanners ? (
          <LoadingSpinner size="m" text={translate('PageBanners-Loading')} textInline />
        ) : (
          sortedGroups.map(pageBannerPage => (
            <DragAndDropBannerPlacements
              key={pageBannerPage.displayOrder}
              data={pageBannerPage}
              totalBannersNumber={data?.bannerAssociations?.data?.length}
            />
          ))
        )}
      </div>
    </ScrollViewWithBars>
  );
}

export default BannerPlacementLists;
