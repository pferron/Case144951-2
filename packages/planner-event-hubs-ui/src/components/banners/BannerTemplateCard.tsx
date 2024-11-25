import React from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useTranslate } from 'nucleus-text';
import { Button } from '@cvent/carina/components/Button';
import { BannerTemplatesCardStyle } from '@components/videoCenters/style';
import { useStyle } from '@hooks/useStyle';

type BannerTemplatesProps = {
  image: JSX.Element;
  title: string;
  body: string;
  onClick: () => void;
  testId: string;
};

function BannerTemplateCard({ image, title, body, onClick, testId }: BannerTemplatesProps): JSX.Element {
  const { translate } = useTranslate();

  const { template, centeredContent, titleStyling, bodyStyling, buttonStyle } = useStyle(BannerTemplatesCardStyle);

  return (
    <div css={template} {...injectTestId(testId)}>
      <div css={centeredContent}>{image}</div>
      <h2 css={titleStyling}>{title}</h2>
      <p css={bodyStyling}>{body}</p>
      <div css={centeredContent}>
        <Button
          css={buttonStyle}
          text={translate('BannerTemplate-Select-Button')}
          appearance="lined"
          onClick={onClick}
        />
      </div>
    </div>
  );
}

export default BannerTemplateCard;
