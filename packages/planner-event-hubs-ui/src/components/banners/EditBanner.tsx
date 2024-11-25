import Header from '@components/Header';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { BannerStyles } from '@components/videoCenters/style';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { useStyle } from '@hooks/useStyle';
import { BANNERS_URL, VIDEO_HUBS_URL, VIDEO_HUB_INFORMATION_URL, VIDEO_HUB_PATH_PARAM_KEY } from '@utils/constants';
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import { redirectClientSide } from '@utils/redirect';
import { DELETE_BANNER_MUTATION, GET_BANNER } from '@cvent/planner-event-hubs-model/operations/banner';
import router from 'next/router';
import { useTranslate } from 'nucleus-text';
import { logApolloError } from '../../apollo/ErrorApolloLink';
import BannerContentForm from './BannerContentForm';
import BannerEditNameModal from './BannerEditNameModal';
import DeleteBanner from './DeleteBanner';

const LOG = LoggerFactory.create('EditBanner');

interface Props {
  videoCenterId: string;
  videoCenterTitle: string;
  bannerId: string;
}

function EditBanner({ videoCenterId, videoCenterTitle, bannerId }: Props): JSX.Element {
  const { translate } = useTranslate();
  const { bannerFormContainer } = useStyle(BannerStyles);

  const {
    data,
    loading: isBannerLoading,
    error
  } = useQuery(GET_BANNER, {
    variables: {
      bannersSearch: {
        centerId: videoCenterId,
        bannerId
      }
    }
  });
  const bannerData = data?.banner;
  const bannerName = bannerData?.name;

  // Edit Banner Name
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const onCancelNameModal = () => {
    setShowEditNameModal(false);
  };

  // Delete Banner
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteBannerMutationCall] = useMutation(DELETE_BANNER_MUTATION);
  const deleteBanner = async (): Promise<void> => {
    setShowDeleteModal(false);
    const { data: deleteBannerData } = await deleteBannerMutationCall({
      variables: {
        bannersSearch: {
          centerId: videoCenterId,
          bannerId
        }
      },
      onError: apolloError => {
        logApolloError(apolloError, LOG);
      }
    });
    const redirectUrl = BANNERS_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId);
    await redirectClientSide(router, redirectUrl, { isSuccess: !!deleteBannerData });
  };

  const headerBreadCrumbs: JSX.Element = (
    <Breadcrumbs>
      <Crumb href={VIDEO_HUBS_URL}>{translate('video_hubs_header_title')}</Crumb>
      <Crumb href={VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId)}>
        {videoCenterTitle}
      </Crumb>
      <Crumb href={BANNERS_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId)}>
        {translate('media_center_banners_page_title')}
      </Crumb>
      <Crumb>{bannerName}</Crumb>
    </Breadcrumbs>
  );

  const headerActions: ActionType[] = [
    {
      value: translate('Banner-Delete-Menu-Option'),
      appearance: 'ghost',
      onClick: (): void => setShowDeleteModal(true),
      label: translate('Banner-Delete-Menu-Option')
    },
    {
      value: translate('banner_rename_button_label'),
      appearance: 'lined',
      onClick: (): void => setShowEditNameModal(true),
      label: translate('banner_rename_button_label')
    }
  ];

  const editBannerHeader: JSX.Element = (
    <Header title={bannerName} breadCrumbs={headerBreadCrumbs} actions={headerActions} />
  );

  const editBannerContainer = (): JSX.Element => (
    <div css={{ flexGrow: 1, overflowY: 'auto', height: '100%' }}>
      <BannerContentForm videoCenterId={videoCenterId} bannerData={bannerData} />
      <BannerEditNameModal
        showEditNameModal={showEditNameModal}
        onDismiss={onCancelNameModal}
        bannerData={bannerData}
      />
      {showDeleteModal && (
        <DeleteBanner
          deleteBanner={deleteBanner}
          setIsModalOpen={setShowDeleteModal}
          videoCenterId={videoCenterId}
          bannerId={bannerId}
        />
      )}
    </div>
  );

  return (
    <div css={bannerFormContainer}>
      <ScrollViewWithBars header={editBannerHeader}>
        <LoadingWrapper loading={isBannerLoading} renderer={editBannerContainer} errors={[error]} />
      </ScrollViewWithBars>
    </div>
  );
}

export default EditBanner;
