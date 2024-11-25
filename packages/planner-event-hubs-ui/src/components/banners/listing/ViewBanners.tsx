import React, { useCallback, useState } from 'react';
import { useTranslate } from 'nucleus-text';
import { BannerListStyle } from '@components/videoCenters/style';
import { useStyle } from '@hooks/useStyle';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { Menu } from '@cvent/carina/components/Menu';
import Button from '@cvent/carina/components/Button';
import { MoreVerticalIcon } from '@cvent/carina/components/Icon';
import { TextLink } from '@cvent/carina/components/TextLink';
import { Placements } from '@cvent/carina/components/Popover';
import { useMutation } from '@apollo/client';
import {
  BANNERS_PATH_PARAM_KEY,
  BANNERS_URL,
  BANNER_URL,
  VIDEO_HUB_PATH_PARAM,
  VIDEO_HUB_PATH_PARAM_KEY
} from '@utils/constants';
import { useRouter } from 'next/router';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import { Alerts } from '@cvent/carina/components/Alert';
import { redirectClientSide } from '@utils/redirect';
import { GET_BANNERS, DELETE_BANNER_MUTATION } from '@cvent/planner-event-hubs-model/operations/banner';
import DeleteBanner from '../DeleteBanner';

export interface BannersList {
  name: string;
  layout: string;
  id: string;
}
interface BannerListProps {
  bannersList: BannersList[];
}
function ViewBanners(list: BannerListProps): JSX.Element {
  const EDIT_MENU_ITEM = 'edit';
  const DELETE_MENU_ITEM = 'delete';
  const router = useRouter();
  const { query = {} } = router;
  const { isSuccess } = router.query;
  const { translate } = useTranslate();
  const videoCenterId = query[VIDEO_HUB_PATH_PARAM] as string;
  const { bannerList, listItemContent } = useStyle(BannerListStyle);

  const [isBannerDeleteSuccess, setIsBannerDeleteSuccess] = useState<boolean>();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [bannerSelectedForAction, setBannerSelectedForAction] = useState(null);

  const onEdit = (banner: BannersList): void => {
    if (banner) {
      const redirection = BANNER_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId).replace(
        BANNERS_PATH_PARAM_KEY,
        banner.id
      );
      router.push({
        pathname: redirection
      });
    }
  };
  const onMenuSelection = (selection: { value: string }, pageBanner: BannersList): void => {
    setBannerSelectedForAction(pageBanner);
    return selection.value === EDIT_MENU_ITEM ? onEdit(pageBanner) : setDeleteModal(true);
  };
  const bannerActions: ActionType[] = [
    {
      value: EDIT_MENU_ITEM,
      label: translate('Banner-Edit-Menu-Option')
    },
    {
      value: DELETE_MENU_ITEM,
      label: translate('Banner-Delete-Menu-Option')
    }
  ];

  const [deleteBannerMutationCall] = useMutation(DELETE_BANNER_MUTATION);
  const deleteBanner = useCallback(async () => {
    const bannerId = bannerSelectedForAction.id;
    setDeleteModal(false);
    const data = deleteBannerMutationCall({
      variables: {
        bannersSearch: {
          centerId: videoCenterId,
          bannerId
        }
      },
      refetchQueries: [GET_BANNERS],
      onCompleted: () => {
        setIsBannerDeleteSuccess(true);
      },
      onError: () => {
        setIsBannerDeleteSuccess(false);
      }
    });

    const redirectUrl = BANNERS_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId);
    await redirectClientSide(router, redirectUrl, { isSuccess: !!data });
  }, [deleteBannerMutationCall, bannerSelectedForAction, setIsBannerDeleteSuccess, videoCenterId, router]);

  const showAlert = useCallback(
    (successParam: string | string[]): JSX.Element | null => {
      let success = null;
      if (typeof successParam === 'string') {
        success = successParam;
      } else {
        const successMessage = successParam[0];
        success = successMessage;
      }
      if (success !== 'true' && success !== 'false') return null;
      const appearance = success === 'true' ? 'success' : 'danger';
      const content = success === 'true' ? translate('banner_delete_success') : translate('banner_delete_error');
      const testId = `banner-deletion-${appearance}`;
      return (
        <div css={{ margin: '1.2rem 1.5rem 1rem 1.5rem' }}>
          <Alerts
            variant="page"
            isRtl={false}
            testID={testId}
            alerts={[
              {
                appearance,
                content,
                dismissible: true,
                id: '0',
                isRtl: false,
                onDismiss: () => {
                  setIsBannerDeleteSuccess(undefined);
                  router.replace(BANNERS_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId), undefined, {
                    shallow: true
                  });
                }
              }
            ]}
          />
        </div>
      );
    },
    [router, videoCenterId, translate]
  );

  const buttonMoreIcon = () => <MoreVerticalIcon size="m" />;
  const menuButton = useCallback(
    (handlePress, index): JSX.Element => (
      <Button
        appearance="ghost"
        onClick={handlePress}
        icon={buttonMoreIcon}
        aria-label={translate('Banners-List-Overflow-Menu-Aria-Label')}
        {...injectTestId(`${index}-banner-item-overflow-menu-button`)}
      />
    ),
    [translate]
  );

  const { bannersList: bannerListItems } = list;
  return (
    <>
      <div>
        {(isSuccess !== undefined || isBannerDeleteSuccess !== undefined) &&
          showAlert(isBannerDeleteSuccess?.toString() ?? isSuccess)}
      </div>

      <div css={{ margin: '1.5rem 1.5rem 7rem 1.5rem' }}>
        <ul css={bannerList} {...injectTestId('banners-list')}>
          {bannerListItems.map((pageBanner, index) => (
            <li key={pageBanner.name} {...injectTestId(`${index}-banners-listItem`)}>
              <div css={listItemContent}>
                <TextLink
                  onClick={() => {
                    onEdit(pageBanner);
                  }}
                >
                  {pageBanner.name}
                </TextLink>
                <Menu
                  testID={`${index}-banner-list-option-menu`}
                  options={bannerActions}
                  placement={Placements.bottomEnd}
                  onSelect={selection => {
                    onMenuSelection(selection, pageBanner);
                  }}
                  shouldCloseOnMissing
                  popperjsModifiers={[]}
                  trigger={handlePress => menuButton(handlePress, index)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {deleteModal && (
        <DeleteBanner
          deleteBanner={deleteBanner}
          setIsModalOpen={setDeleteModal}
          videoCenterId={videoCenterId}
          bannerId={bannerSelectedForAction.id}
        />
      )}
    </>
  );
}

export default ViewBanners;
