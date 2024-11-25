import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import { useTranslate } from 'nucleus-text';
import React, { useState } from 'react';
import CardContainer from '@components/visitor-permissions/CardContainer';
import { EditVisibilityStyle } from '@components/visitor-permissions/style';
import { useStyle } from '@hooks/useStyle';
import { GuestVisibility } from '@cvent/planner-event-hubs-model/types';
import { Tooltip } from '@cvent/carina/components/Tooltip';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import RadioButton from '@cvent/carina/components/RadioGroup/components/RadioButton';
import { getGuestVisibilityOptions } from '@components/visitor-permissions/VisibilityOptions';
import { injectTestId } from '@cvent/nucleus-test-automation';
import VisitorPermissionsEditModal from '@components/visitor-permissions/VisitorPermissionConfirmationModal';
import AllowedLimitedViewsBeforeLogin from '@components/visitor-permissions/AllowedLimitedViewsBeforeLogin';
import { InfoIcon } from '@cvent/carina-icon';

function EditVisibility({
  saveChangesModalOpen,
  setSaveChangesModalOpen,
  registrationSettings: originalSettings,
  onSave: originalOnSave,
  onCancel,
  isEdit,
  setIsPageEdited
}: Props): JSX.Element {
  const styles = useStyle(EditVisibilityStyle);
  const { translate } = useTranslate();
  const [registrationSettings, setRegistrationSettings] = useState(originalSettings);
  const visibilityOptions = getGuestVisibilityOptions(translate);
  const theme = useTheme();

  const onSave = () => {
    if (
      registrationSettings.guestVisibility === GuestVisibility.Public &&
      originalSettings.guestVisibility !== GuestVisibility.Public
    ) {
      setSaveChangesModalOpen(true);
    } else {
      originalOnSave({
        ...registrationSettings,
        guestVisibility: registrationSettings.guestVisibility,
        allowLimitedViewsBeforeLogin: registrationSettings.allowLimitedViewsBeforeLogin,
        allowLimitedViewsBeforeLoginCount: registrationSettings.allowLimitedViewsBeforeLoginCount
      });
    }
    setIsPageEdited(false);
  };

  return (
    <CardContainer testID="edit-guest-visibility-field" onSave={() => onSave()} onCancel={onCancel} isEdit={isEdit}>
      <div {...injectTestId('registration-settings-container')}>
        <VisitorPermissionsEditModal
          onSaveButtonContent={translate('visibility_settings_override_modal_override_button')}
          onCancelButtonContent={translate('visibility_settings_override_cancel_button')}
          isModalOpen={saveChangesModalOpen}
          setIsModalOpen={setSaveChangesModalOpen}
          onSave={() => {
            originalOnSave({
              ...registrationSettings,
              guestVisibility: registrationSettings.guestVisibility,
              allowLimitedViewsBeforeLogin: registrationSettings.allowLimitedViewsBeforeLogin,
              allowLimitedViewsBeforeLoginCount: registrationSettings.allowLimitedViewsBeforeLoginCount
            });
            setIsPageEdited(false);
          }}
          onCancel={() => {
            setSaveChangesModalOpen(false);
            setIsPageEdited(false);
          }}
          heading={translate('visibility_settings_override_modal_heading')}
          content={translate('visibility_settings_override_modal_description')}
        />
      </div>
      <div>
        <h2 css={styles.title}>{translate('visitor_permissions_visibility_header')}</h2>
        <p css={styles.description}>{translate('visitor_permissions_visibility_sub_header')}</p>
        <div>
          <div css={styles.publicRadio}>
            <RadioButton
              id="guestVisibilityOptions"
              name="guestVisibilityOptions"
              option={{
                ...visibilityOptions.find(option => option.value === GuestVisibility.Public),
                checked: registrationSettings.guestVisibility === GuestVisibility.Public
              }}
              testID="guest-visibility-public-radio"
              onUpdate={(selectedOption: GuestVisibility) => {
                setRegistrationSettings(prev => ({ ...prev, guestVisibility: selectedOption }));
                setIsPageEdited(true);
              }}
            />
            <div css={styles.tooltip}>
              <Tooltip
                portal
                arrowLabel={translate('visitor_permissions_visibility_public_tooltip')}
                text={translate('visitor_permissions_visibility_public_tooltip')}
                // MAUVE
                /* eslint-disable */
                trigger={(handleOpen, handleClose) => (
                  <div
                    onMouseOver={handleOpen}
                    onMouseLeave={handleClose}
                    onFocus={handleOpen}
                    onBlur={handleClose}
                    tabIndex={0}
                  >
                    <InfoIcon size="s" color={theme.font.color.soft} />
                  </div>
                )}
              />
            </div>
          </div>
          <div>
            {visibilityOptions
              .filter(option => option.value !== GuestVisibility.Public)
              .map((option, index) => (
                <div key={index}>
                  <RadioButton
                    id={`guestVisibilityOptions-${index}`}
                    name="guestVisibilityOptions"
                    option={{
                      ...option,
                      checked: registrationSettings.guestVisibility === option.value
                    }}
                    testID={`guest-visibility-${index}-radio`}
                    onUpdate={(selectedOption: GuestVisibility) => {
                      setRegistrationSettings(prev => ({ ...prev, guestVisibility: selectedOption }));
                      setIsPageEdited(true);
                    }}
                  />
                  {option.value === GuestVisibility.VideoPlaybackPrivate &&
                    registrationSettings.guestVisibility === GuestVisibility.VideoPlaybackPrivate && (
                      <AllowedLimitedViewsBeforeLogin
                        testId="allow-limited-views-before-login-container"
                        registrationSettings={registrationSettings}
                        setRegistrationSettings={setRegistrationSettings}
                        setIsPageEdited={setIsPageEdited}
                      />
                    )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </CardContainer>
  );
}

interface Props {
  saveChangesModalOpen: boolean;
  setSaveChangesModalOpen: (value: boolean) => void;
  registrationSettings: VisitorPermissionsProps;
  onSave: (settings) => void;
  onCancel: (settings) => void;
  isEdit: boolean;
  setIsPageEdited: (isPageEdited: boolean) => void;
}

export default EditVisibility;
