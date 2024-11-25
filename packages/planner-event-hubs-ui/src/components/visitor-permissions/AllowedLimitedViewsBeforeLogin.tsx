import React from 'react';
import { Checkbox as CheckBox } from '@cvent/carina/components/Checkbox';
import { Textbox } from '@cvent/carina/components/Textbox';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useStyle } from '@hooks/useStyle';
import { EditVisibilityStyle } from '@components/visitor-permissions/style';
import { Tooltip } from '@cvent/carina/components/Tooltip';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { InfoIcon } from '@cvent/carina-icon';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import { useTranslate } from 'nucleus-text';
import { Placements } from '@cvent/carina/components/Popover';

interface Props {
  testId: string;
  registrationSettings: VisitorPermissionsProps;
  setRegistrationSettings: (registrationSettings) => void;
  setIsPageEdited: (isPageEdited: boolean) => void;
}

function AllowedLimitedViewsBeforeLogin({
  testId,
  registrationSettings,
  setRegistrationSettings,
  setIsPageEdited
}: Props): JSX.Element {
  const styles = useStyle(EditVisibilityStyle);
  const theme = useTheme();
  const { translate } = useTranslate();
  const variant = 'grid';
  const isValidValue = value => {
    const numValue = parseInt(value, 10);
    return numValue >= 1 && numValue <= 9;
  };
  // MAUVE
  /* eslint-disable */
  const triggerAllowLimitedViewsTooltip = (handleOpen, handleClose) => (
    <div
      role="tooltip"
      aria-label={translate('allow_limited_views_before_login')}
      onMouseOver={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onBlur={handleClose}
      tabIndex={0}
    >
      <InfoIcon size="s" color={theme.font.color.soft} />
    </div>
  );

  return (
    <div css={{ marginLeft: '1.5rem', display: 'flex' }} {...injectTestId(testId)}>
      <CheckBox
        onKeyDown={(event): void => {
          if (event.code === 'Enter') {
            setRegistrationSettings(prev => ({
              ...prev,
              allowLimitedViewsBeforeLogin: !registrationSettings.allowLimitedViewsBeforeLogin
            }));
            setIsPageEdited(true);
          }
        }}
        id="allowLimitedViewsBeforeLogin"
        accessibilityLabel={translate('allow_limited_views_before_login')}
        checked={registrationSettings.allowLimitedViewsBeforeLogin}
        onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
          setRegistrationSettings(prev => ({
            ...prev,
            allowLimitedViewsBeforeLogin: target.checked
          }));
          setIsPageEdited(true);
        }}
      >
        {translate('allow_limited_views_before_login')}
      </CheckBox>
      <div css={{ width: '1.5rem', display: 'flex' }}>
        <Textbox
          css={{ marginRight: '1rem' }}
          iconEnd={false}
          iconStart={false}
          accessibilityLabel="Login Count TextBox"
          id="allowLimitedViewsBeforeLoginCountTextBox"
          value={
            registrationSettings.allowLimitedViewsBeforeLoginCount
              ? registrationSettings.allowLimitedViewsBeforeLoginCount.toString()
              : ''
          }
          onChange={({ target }) => {
            const { value } = target;
            if (value === '' || isValidValue(value)) {
              setRegistrationSettings(prevValues => ({
                ...prevValues,
                allowLimitedViewsBeforeLoginCount: parseInt(value, 10)
              }));
              setIsPageEdited(true);
            }
          }}
          variant={variant}
        />
        <div css={styles.tooltip} {...injectTestId('allow-limited-views-before-login-tooltip')}>
          <Tooltip
            portal
            placement={Placements.end}
            arrowLabel="visitor_permissions_visibility_videoPlaybackPrivate_tooltip"
            text={translate('allow_limited_views_before_login_tooltip_text')}
            trigger={(handleOpen, handleClose) => triggerAllowLimitedViewsTooltip(handleOpen, handleClose)}
          />
        </div>
      </div>
    </div>
  );
}
export default AllowedLimitedViewsBeforeLogin;
