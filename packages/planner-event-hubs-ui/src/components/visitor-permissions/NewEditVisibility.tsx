import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import { useTranslate } from 'nucleus-text';
import React from 'react';
import CardContainerEditEnabled from '@components/privacy/CardContainerEditEnabled';
import { EditVisibilityStyle } from '@components/visitor-permissions/style';
import { useStyle } from '@hooks/useStyle';
import { GuestVisibility } from '@cvent/planner-event-hubs-model/types';
import { Tooltip } from '@cvent/carina/components/Tooltip';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import RadioButton from '@cvent/carina/components/RadioGroup/components/RadioButton';
import { getGuestVisibilityOptions } from '@components/visitor-permissions/VisibilityOptions';
import AllowedLimitedViewsBeforeLogin from '@components/visitor-permissions/AllowedLimitedViewsBeforeLogin';
import { InfoIcon } from '@cvent/carina-icon';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { Placements } from '@cvent/carina/components/Popover';

function NewEditVisibility({ registrationSettings, setRegistrationSettings, setIsPageEdited }: Props): JSX.Element {
  const styles = useStyle(EditVisibilityStyle);
  const { translate } = useTranslate();
  const visibilityOptions = getGuestVisibilityOptions(translate);
  const theme = useTheme();
  const trigger = (openTooltip, closeTooltip) => (
    <div
      role="button"
      tabIndex={0}
      aria-label={translate('visitor_permissions_visibility_public_tooltip')}
      {...injectTestId(`tooltip-container`)}
      onMouseEnter={() => {
        openTooltip();
      }}
      onMouseLeave={() => {
        closeTooltip();
      }}
      onFocus={() => {
        openTooltip();
      }}
      onBlur={() => {
        closeTooltip();
      }}
      css={styles.tooltipStyle}
    >
      <div>
        <InfoIcon size="s" color={theme.font.color.soft} />
      </div>
    </div>
  );

  return (
    <CardContainerEditEnabled testID="edit-guest-visibility-field">
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
              }}
            />
            <div css={styles.tooltip}>
              <Tooltip
                portal
                placement={Placements.end}
                aria-label={translate('visitor_permissions_visibility_public_tooltip')}
                text={translate('visitor_permissions_visibility_public_tooltip')}
                trigger={(openTooltip, closeTooltip) => trigger(openTooltip, closeTooltip)}
              />
            </div>
          </div>
          <div>
            {visibilityOptions
              .filter(option => option.value !== GuestVisibility.Public)
              .map((option, index) => (
                <div key={option.value}>
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
    </CardContainerEditEnabled>
  );
}

interface Props {
  registrationSettings: VisitorPermissionsProps;
  setRegistrationSettings: React.Dispatch<React.SetStateAction<VisitorPermissionsProps>>;
  setIsPageEdited: (isPageEdited: boolean) => void;
}

export default NewEditVisibility;
