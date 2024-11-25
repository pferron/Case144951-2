import Tile from '@cvent/carina/components/Tile/Tile';
import { Tooltip } from '@cvent/carina/components/Tooltip';
import { useStyle } from '@hooks/useStyle';
import { AddSectionModalStyles } from './homePageCustomizationStyles';

interface SectionTileProps {
  setSelectedSection: (section: string) => void;
  selectedSectionInState: string;
  defaultSectionValue: string;
  title: string;
  description: string;
  testId: string;
  disabledSection?: boolean;
  disabledToolTipMessage?: string;
}

export function SectionTile({
  setSelectedSection,
  selectedSectionInState,
  defaultSectionValue,
  title,
  description,
  testId,
  disabledSection = false,
  disabledToolTipMessage = ''
}: SectionTileProps): JSX.Element {
  const { tileTitle, tileDescription } = useStyle(AddSectionModalStyles, { disabled: disabledSection?.toString() });
  const SectionTileComponent = (
    <div css={{ marginBottom: 16 }}>
      <Tile
        clickable
        onClick={() => {
          setSelectedSection(defaultSectionValue);
        }}
        padding={12}
        selectable
        selectedIndicatorPlacement="top-end"
        testID={testId}
        isSelected={selectedSectionInState === defaultSectionValue}
        isDisabled={disabledSection || selectedSectionInState === defaultSectionValue}
      >
        <div>
          <span css={tileTitle}>{title}</span>
          <div css={tileDescription}>{description}</div>
        </div>
      </Tile>
    </div>
  );
  // Add tooltip if section is disabled
  if (disabledSection) {
    return (
      <Tooltip
        text={disabledToolTipMessage}
        placement="bottom"
        aria-label={disabledToolTipMessage}
        testID={testId}
        trigger={SectionTileComponent}
      />
    );
  }
  // Return section tile if section is not disabled
  return SectionTileComponent;
}

interface BannerTemplateSectionTileProps {
  image: JSX.Element;
  title: string;
  description: string;
  tileTemplate: string;
  setSelectedTemplate: (template: string) => void;
  selectedTemplateInState: string;
  testId: string;
}
export function BannerTemplateSectionTile({
  image,
  title,
  description,
  tileTemplate,
  setSelectedTemplate,
  selectedTemplateInState,
  testId
}: BannerTemplateSectionTileProps): JSX.Element {
  const { templateTitle, tileTemplateDescription, templateContainer } = useStyle(AddSectionModalStyles);
  return (
    <div css={templateContainer}>
      <Tile
        clickable
        padding={12}
        selectable
        onClick={() => {
          setSelectedTemplate(tileTemplate);
        }}
        selectedIndicatorPlacement="top-end"
        testID={testId}
        isSelected={tileTemplate === selectedTemplateInState}
        isDisabled={tileTemplate === selectedTemplateInState}
      >
        <div css={{ margin: '0 auto' }}>{image}</div>
        <div css={templateTitle}>{title}</div>
        <div css={tileTemplateDescription}>{description}</div>
      </Tile>
    </div>
  );
}
