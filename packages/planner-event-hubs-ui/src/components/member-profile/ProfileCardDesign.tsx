import { ProfileCardDesignStyle } from '@components/member-profile/style';
import { useStyle } from '@hooks/useStyle';
import CardContainer from '@components/privacy/CardContainer';
import React, { Dispatch, SetStateAction } from 'react';
import { OptionItems } from '@components/member-profile/MemberProfileContainer';
import useBreakpoints from '@hooks/useBreakpoints';
import { useTranslate } from 'nucleus-text';
import DesignControlsGroup from '@cvent/multi-dimensional-profile/planner/edit/DesignControlsGroup';
import PreviewLink from '@components/member-profile/PreviewLink';
import { DESKTOP_SCREEN_WIDTH } from '@components/member-profile/ProfileDesignOptions';

function ProfileCardDesign({ onEdit, disabled, viewProfileCardArray, setIsPreviewProfile }: Props): JSX.Element {
  const { translate } = useTranslate();
  const styles = useStyle(ProfileCardDesignStyle);
  const { widthWindow } = useBreakpoints();
  const isMobileOrTablet = widthWindow < DESKTOP_SCREEN_WIDTH;
  return (
    <CardContainer testID="profile-design" onEdit={onEdit} disabled={disabled}>
      <div css={{ pointerEvents: disabled ? 'none' : null }}>
        <h3 css={styles.title}>{translate('profile_card_design')}</h3>
        <div css={styles.sectionContainer}>
          <DesignControlsGroup
            css={{ margin: isMobileOrTablet ? '' : '0rem 1.2rem' }}
            options={viewProfileCardArray}
            describedBy={translate('profile_card_label')}
            type="card design"
            accessibilityLabel={translate('profile_card_label')}
            testID="card-design"
            updateBackground={false}
          />
        </div>
        <PreviewLink setIsPreviewProfile={setIsPreviewProfile} />
      </div>
    </CardContainer>
  );
}

interface Props {
  onEdit: (value: boolean) => void;
  disabled: boolean;
  setIsPreviewProfile: Dispatch<SetStateAction<boolean>>;
  viewProfileCardArray: Array<OptionItems>;
}

export default ProfileCardDesign;
