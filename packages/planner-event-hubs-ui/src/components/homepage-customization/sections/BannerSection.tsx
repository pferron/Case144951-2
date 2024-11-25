import { useQuery } from '@apollo/client';
import { EDIT_MENU_ITEM } from '@components/banners/BannerConstants';
import {
  HomePageCustomizationStyles,
  BannerSectionStyles,
  AddSectionModalStyles
} from '@components/homepage-customization/homePageCustomizationStyles';
import Menu from '@cvent/carina/components/Menu';
import { Button } from '@cvent/carina/components/Button';
import { LockIcon, MoreVerticalIcon, XIcon } from '@cvent/carina/components/Icon';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { useStyle } from '@hooks/useStyle';
import { BANNERS_URL, VIDEO_HUB_PATH_PARAM_KEY } from '@utils/constants';
import { GET_BANNERS_ASSOCIATIONS } from '@cvent/planner-event-hubs-model/operations/banner';
import { groupBy } from 'lodash';
import { useTranslate } from 'nucleus-text';
import { useCallback, useMemo, useState } from 'react';
import { Placements } from '@cvent/carina/components/Popover';
import { injectTestId } from '@cvent/nucleus-test-automation';
import Modal from '@cvent/carina/components/Modal';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars';

type Props = {
  centerId: string;
};

function BannerSection({ centerId }: Props): JSX.Element {
  const { translate } = useTranslate();
  const { font } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const buttonMoreIcon = () => <MoreVerticalIcon size="s" color="black" />;

  const { title, description, listTitle } = useStyle(HomePageCustomizationStyles);
  const { titleStyle } = useStyle(AddSectionModalStyles);
  const { outerContainer, titleContainer, listItem, accordionContainer, modalTitleContainer } =
    useStyle(BannerSectionStyles);
  const { data, loading: bannersAssociationLoading } = useQuery(GET_BANNERS_ASSOCIATIONS, {
    variables: {
      bannerAssociationSearch: {
        centerId
      }
    }
  });
  const homePageBanners = useMemo(() => {
    const groupedData = groupBy(data?.bannerAssociations?.data, 'entityType');
    return groupedData.Homepage || [];
  }, [data?.bannerAssociations?.data]);

  const bannerActions: ActionType[] = [
    {
      value: EDIT_MENU_ITEM,
      label: translate('home_page_sections_edit_menu'),
      onClick: () => setModalOpen(true)
    }
  ];
  const selectTemplateModalHeader = (
    <div css={modalTitleContainer}>
      <div css={titleContainer}>
        <div css={titleStyle}>
          {translate('home_page_custom_banner_card_title', { count: homePageBanners?.length || 0 })}
        </div>
      </div>
      <Button
        appearance="ghost"
        icon={XIcon}
        aria-label={translate('close_modal_button_label')}
        onClick={() => {
          setModalOpen(false);
        }}
        testID="close-select-template-modal"
      />
    </div>
  );

  const menuButton = useCallback(
    (handlePress): JSX.Element => (
      <Button
        appearance="ghost"
        onClick={handlePress}
        icon={buttonMoreIcon}
        aria-label={translate('Banners-List-Overflow-Menu-Aria-Label')}
        {...injectTestId(`banner-item-overflow-menu-button`)}
      />
    ),
    [translate]
  );
  return (
    <>
      <div css={accordionContainer} {...injectTestId(`row-default-banners`)}>
        <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', wordBreak: 'break-all' }}>
          <div css={titleContainer}>
            <LockIcon color={font.color.soft} size="s" />
            <div css={title}>
              {translate('home_page_custom_banner_card_title', { count: homePageBanners?.length || 0 })}
            </div>
          </div>
          <Menu
            testID="banner-list-option-menu"
            options={bannerActions}
            placement={Placements.bottomEnd}
            onSelect={() => {
              setModalOpen(true);
            }}
            shouldCloseOnMissing
            popperjsModifiers={[]}
            trigger={handlePress => menuButton(handlePress)}
          />
        </div>
      </div>
      {modalOpen && (
        <Modal
          format="fullscreen"
          isOpen
          testID="add-section-details-modal"
          portal
          aria-label={translate('home_page_sections_add_section_modal_title')}
          onDismiss={() => {
            setModalOpen(false);
          }}
        >
          <ScrollViewWithBars header={selectTemplateModalHeader}>
            <div css={outerContainer}>
              <div css={[description, { margin: 12 }]}>{translate('home_page_custom_banner_card_description')}</div>
              <div>
                <Button
                  text={translate('home_page_custom_banner_card_btn_text')}
                  element="a"
                  href={BANNERS_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)}
                  css={{ margin: 12 }}
                  testID="banner-page-btn"
                />
              </div>
              <div css={[listTitle, { margin: '0.75rem 0 0 0.75rem' }]}>
                {translate('home_page_custom_banner_list_title')}
              </div>
              {bannersAssociationLoading ? (
                <LoadingSpinner size="m" aria-label={translate('events_plus_generic_loading')} />
              ) : (
                <div>
                  {homePageBanners?.length > 0 ? (
                    <ul>
                      {homePageBanners?.map(item => (
                        <li css={listItem} key={item.banner.id}>
                          {item.banner.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div css={[description, { margin: '24px 0 0 12px' }]}>
                      {translate('home_page_custom_banner_list_no_items_msg')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollViewWithBars>
        </Modal>
      )}
    </>
  );
}

export default BannerSection;
