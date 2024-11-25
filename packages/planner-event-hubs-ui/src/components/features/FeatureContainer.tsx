import { useStyle } from '@hooks/useStyle';
import { Style } from '@components/features/style';
import { injectTestId } from '@cvent/nucleus-test-automation';
import React from 'react';
import { Switch } from '@cvent/carina/components/Switch';
import { Button } from '@cvent/carina/components/Button';
import { useTranslate } from 'nucleus-text';
import { useRouter } from 'next/router';
import { VIDEO_HUBS_URL } from '@utils/constants';
import { useFeaturesPageActionsApi } from '@metrics/client/react/useFeaturesPageActionsApi';
import Image from 'next/image';
import { FEATURES } from './constants';

export function FeatureContainer({
  description,
  title,
  image,
  videoCenterId,
  featureCardTestID,
  featureCard,
  onUpdate,
  enabled,
  setEnabled,
  featureButton,
  route,
  featureCardButtonDisabled
}: Props): JSX.Element {
  const styles = useStyle(Style);
  const router = useRouter();
  const { translate } = useTranslate();
  const { upcomingEventsSetupButtonClicked } = useFeaturesPageActionsApi();

  return (
    <div {...injectTestId(featureCardTestID)} css={[styles.card, { filter: `grayscale(${enabled ? '0%' : '100%'})` }]}>
      <div css={styles.imageAndBodyContainer}>
        <div css={styles.imageStyle}>
          <Image
            src={image}
            width="120%"
            height="120%"
            alt="Feature-image"
            {...injectTestId(`${featureCardTestID}-image`)}
          />
        </div>
        <div css={styles.contentContainer}>
          <div css={{ width: '100%' }}>
            <div {...injectTestId(`${featureCardTestID}-title`)} css={styles.titleStyle}>
              {title}
            </div>
            <div {...injectTestId(`${featureCardTestID}-description`)} css={styles.descriptionStyle}>
              {description}
            </div>
          </div>

          {featureButton && enabled && (
            <div css={styles.buttonStyle}>
              <Button
                text={translate('feature_member_card_button')}
                appearance="lined"
                testID={`${featureCardTestID}-setup`}
                accessibilityLabel={translate('feature_member_card_button')}
                onClick={() => {
                  if (featureCard === FEATURES.UPCOMING_EVENTS) {
                    upcomingEventsSetupButtonClicked({});
                  }
                  router.push(`${VIDEO_HUBS_URL}/${videoCenterId}${route}`);
                }}
              />
            </div>
          )}
        </div>
      </div>
      {!featureCardButtonDisabled && (
        <div css={styles.switchContainer}>
          <Switch
            role="switch"
            aria-label={description}
            value={enabled}
            onUpdate={newValue => {
              onUpdate(featureCard, newValue, setEnabled);
            }}
            {...injectTestId(`${featureCardTestID}-switch`)}
          />
        </div>
      )}
    </div>
  );
}
interface Props {
  description: string;
  title: string;
  image: string;
  videoCenterId: string;
  featureCardTestID: string;
  onUpdate: (featureCard: string, newValue: boolean, setEnabled: (boolean) => void) => void;
  enabled: boolean;
  // MAUVE
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  setEnabled: (p: (prev) => any) => void;
  featureCard: string;
  featureButton?: boolean;
  route?: string;
  featureCardButtonDisabled?: boolean;
}
