import React, { useCallback, useState } from 'react';
import { useTranslate } from 'nucleus-text';
import { useRouter } from 'next/router';
import { BANNERS_PATH_PARAM_KEY, BANNER_URL, VIDEO_HUB_PATH_PARAM, VIDEO_HUB_PATH_PARAM_KEY } from '@utils/constants';
import useQueryParams from '@hooks/useQueryParam';
import { Form } from '@cvent/carina/components/Forms/Form';
import { useMutation } from '@apollo/client';
import { NewBanner } from '@cvent/planner-event-hubs-model/types';
import { useBannersPageActionsApi } from '@metrics/client/react/useBannersPageActionsApi';
import { CREATE_BANNER_MUTATION } from '@cvent/planner-event-hubs-model/operations/banner';
import BannerNameField from './formSections/BannerNameField';
import { BANNER_NAME_FIELD } from './BannerConstants';

type BannerCreateNameFormProps = {
  templateType: string;
  onDismiss: () => void;
  currentNames?: Array<string>;
};

function BannerCreateNameForm({ templateType, onDismiss, currentNames = [] }: BannerCreateNameFormProps): JSX.Element {
  const query = useQueryParams();
  const hubId = query[VIDEO_HUB_PATH_PARAM] as string;
  const { translate } = useTranslate();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { bannerNameProvided } = useBannersPageActionsApi();

  const [createBanner] = useMutation(CREATE_BANNER_MUTATION);
  const bannerCreate = useCallback(
    (event, { values }): void => {
      setIsSubmitting(true);
      if (!isSubmitting) {
        const newBannerData: NewBanner = {
          centerId: hubId,
          name: values[BANNER_NAME_FIELD],
          layout: templateType
        };
        createBanner({
          variables: {
            input: newBannerData
          },
          onCompleted: ({ bannerCreate: bannerId }) => {
            const redirection = BANNER_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, hubId).replace(
              BANNERS_PATH_PARAM_KEY,
              bannerId
            );
            router.push({
              pathname: redirection
            });
          }
        });
        bannerNameProvided({
          bannerName: values[BANNER_NAME_FIELD],
          bannerTemplate: templateType
        });
      }
    },
    [isSubmitting, hubId, templateType, createBanner, router, bannerNameProvided]
  );

  return (
    <Form initialValues={{ [BANNER_NAME_FIELD]: '' }} onSubmit={bannerCreate}>
      <BannerNameField
        secondaryButtonText={translate('Banner-Name-Selection-Back-Button')}
        saveButtonText={translate('Banner-Name-Save-Button')}
        onDismiss={onDismiss}
        currentNames={currentNames}
      />
    </Form>
  );
}

export default BannerCreateNameForm;
