import React from 'react';
import { ProfileCard } from '@cvent/multi-dimensional-profile';
import { CardDesign, ProfileData } from '@cvent/multi-dimensional-profile/types/Profile';
import { ProfileCardModalStyles } from '@components/member-profile/style';
import { useStyle } from '@hooks/useStyle';
import { ScrollViewWithBars } from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import DismissButton from '@cvent/carina/components/ScrollViewWithBars/DismissButton';
import Modal from '@cvent/carina/components/Modal';
import { useTranslate } from 'nucleus-text';
import { BACKGROUND_COLOR, MODAL_ZINDEX } from '@components/constants';
import { HELVETICA_BLOCKS_FONT } from '@utils/constants';
import BlockThemeProvider from '@cvent/blocks/components/BlockThemeProvider';

function ProfileCardModal({
  onDismiss,
  profileCardModalIsOpen,
  profileData,
  logoImageUrl,
  cardDesign,
  formattedFullName
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const { cardContainer, headerContainer, header } = useStyle(ProfileCardModalStyles);

  const profileCarsModalHeader: JSX.Element = (
    <div css={headerContainer}>
      <h2 css={header}>{translate('profile_modal_preview')}</h2>
      <DismissButton
        autoFocus
        testID="member-details-dismiss-button"
        onClick={(): void => {
          onDismiss();
        }}
        accessibilityLabel={translate('close_modal_button_label')}
      />
    </div>
  );

  return (
    <Modal
      isOpen={profileCardModalIsOpen}
      onDismiss={(): void => {
        onDismiss();
      }}
      zIndex={MODAL_ZINDEX}
      testID="profile-card"
      aria-label={translate('profile_card_modal_label')}
    >
      <ScrollViewWithBars header={profileCarsModalHeader}>
        <BlockThemeProvider
          primary="#006de9"
          secondary="#006ae1"
          background={BACKGROUND_COLOR}
          mood="#FFFFFF"
          headingFont={HELVETICA_BLOCKS_FONT}
          bodyFont={HELVETICA_BLOCKS_FONT}
        >
          <div css={cardContainer}>
            <ProfileCard
              isVisible
              profile={profileData}
              logoImageUrl={logoImageUrl}
              cardDesign={cardDesign}
              testID="design-profile-card"
              formattedFullName={formattedFullName}
            />
          </div>
        </BlockThemeProvider>
      </ScrollViewWithBars>
    </Modal>
  );
}

interface Props {
  onDismiss: () => void;
  profileCardModalIsOpen: boolean;
  profileData: ProfileData;
  logoImageUrl?: string;
  cardDesign?: CardDesign;
  formattedFullName: string;
}

export default ProfileCardModal;
