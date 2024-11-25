import React, { Fragment, useState } from 'react';
import { ScrollViewWithBars, DismissButton } from '@cvent/carina/components/ScrollViewWithBars';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { BannerTemplatesStyle } from '@components/videoCenters/style';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import BannerTemplateCard from './BannerTemplateCard';
import BannerCreateNameForm from './BannerCreateNameForm';
import ColorBackgroundTemplate from './icons/ColorBackgroundTemplate';
import { FULL_IMAGE, INSET_IMAGE, TEXT_COLOR } from './BannerConstants';
import FullImageTemplate from './icons/FullImageTemplate';
import InsertImageTemplate from './icons/InsertImageTemplate';

type BannerTemplatesProps = {
  onDismiss: () => void;
  currentNames: Array<string>;
};

function BannerTemplates({ onDismiss, currentNames = [] }: BannerTemplatesProps): JSX.Element {
  const { translate } = useTranslate();

  const { modalHeader, modalHeaderTitle, modalContent } = useStyle(BannerTemplatesStyle);

  const [showNameSelection, setShowNameSelection] = useState(false);
  const [templateType, setTemplateType] = useState(null);

  const bannerTemplateHeader: JSX.Element = (
    <div css={modalHeader}>
      <h1 css={modalHeaderTitle} {...injectTestId('template-selection-modal-header')}>
        {translate(showNameSelection ? 'Banners-Name-Selection-Title' : 'Banners-Template-Selection-Title')}
      </h1>
      <div>
        <DismissButton aria-label={translate('Banners-Template-Selection-Close-Button')} onClick={onDismiss} />
      </div>
    </div>
  );

  return (
    <ScrollViewWithBars header={bannerTemplateHeader}>
      <div css={modalContent}>
        {!showNameSelection ? (
          <>
            <BannerTemplateCard
              image={<ColorBackgroundTemplate />}
              title={translate('Banners-Template-Selection-Color-Background-Title')}
              body={translate('Banners-Template-Selection-Color-Background-Body')}
              onClick={() => {
                setShowNameSelection(true);
                setTemplateType(TEXT_COLOR);
              }}
              testId="Banners-Template-Card-TextOnly"
            />
            <BannerTemplateCard
              image={<InsertImageTemplate />}
              title={translate('Banners-Template-Selection-Inset-Image-Title')}
              body={translate('Banners-Template-Selection-Inset-Image-Body')}
              onClick={() => {
                setShowNameSelection(true);
                setTemplateType(INSET_IMAGE);
              }}
              testId="Banners-Template-Card-InsetImage"
            />
            <BannerTemplateCard
              image={<FullImageTemplate />}
              title={translate('Banners-Template-Selection-Full-Image-Title')}
              body={translate('Banners-Template-Selection-Full-Image-Body')}
              onClick={() => {
                setShowNameSelection(true);
                setTemplateType(FULL_IMAGE);
              }}
              testId="Banners-Template-Card-FullImage"
            />
          </>
        ) : (
          <BannerCreateNameForm
            templateType={templateType}
            onDismiss={() => setShowNameSelection(false)}
            currentNames={currentNames}
          />
        )}
      </div>
    </ScrollViewWithBars>
  );
}

export default BannerTemplates;
