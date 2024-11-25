import { HomePageCustomizationStyles } from '@components/homepage-customization/homePageCustomizationStyles';
import { EyeOffIcon } from '@cvent/carina/components/Icon';
import { Placements } from '@cvent/carina/components/Popover';
import { Tooltip } from '@cvent/carina/components/Tooltip';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';

interface Props {
  message: string;
}

function HiddenPill({ message }: Props): React.JSX.Element {
  const { hiddenToolTioContainer, hiddenToolTip } = useStyle(HomePageCustomizationStyles);
  const { translate } = useTranslate();

  return (
    <div css={hiddenToolTioContainer}>
      <Tooltip
        placement={Placements.start}
        text={message}
        preventOverflow={false}
        zIndex={10}
        trigger={
          <div css={hiddenToolTip} role="tooltip" aria-label={message}>
            <EyeOffIcon size="s" />
            {translate('home_page_hidden_section_tooltip_label')}
          </div>
        }
      />
    </div>
  );
}

export default HiddenPill;
