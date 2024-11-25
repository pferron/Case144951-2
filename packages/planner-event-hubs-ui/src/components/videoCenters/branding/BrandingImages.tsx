import { Row } from '@cvent/carina/components/Row';
import { Col } from '@cvent/carina/components/Col';
import { Image } from '@components/common/imageUpload/Image';
import {
  ACCEPTED_FAVICON_FILE_FORMAT,
  FAVICON,
  IMAGE_MAXIMUM_SIZE,
  IMAGE_MAXIMUM_SIZE_IN_MB,
  LOGO
} from '@utils/constants';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import Textbox from '@cvent/carina/components/Textbox/Textbox';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { ImageStyle } from '@components/videoCenters/style';
import { NewImage } from '@components/common/imageUpload/types';
import { Popover } from '@cvent/carina/components/Popover';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { HelpCircleIcon } from '@cvent/carina/components/Icon';
import { useBrandImagesStyles } from '@components/videoCenters/branding/styles';
import useBlockTheme from '@cvent/blocks/hooks/useTheme';
import Button from '@cvent/carina/components/Button';
import { useMutation } from '@apollo/client';
import { GET_VIDEO_HUB, UPDATE_BRANDING_IMAGES } from '@cvent/planner-event-hubs-model/operations/hub';
import { LoggerFactory } from '@cvent/auth-client';
import { Hub, Theme } from '@cvent/planner-event-hubs-model/types';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { aspectRatioTypes, translations } from '@cvent/image-editor';

const MAX_LENGTH_ALT_TEXT = 100;

type PopOverProps = {
  testId: string;
  popOverText: string;
};

export function PopOverHelper({ testId, popOverText }: PopOverProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { font } = useBlockTheme();

  return (
    <Popover
      placement="start-top"
      // MAUVE
      /* eslint-disable */
      trigger={({ toggleOpen }): React.JSX.Element => (
        <div {...injectTestId(`${testId}_help_circle`)}>
          <button
            type="button"
            id={`${testId}_help_circle_icon`}
            css={{ marginLeft: '0.2rem', padding: '0.1rem', background: 'inherit', border: 'none' }}
            onClick={toggleOpen}
            aria-label={translate(popOverText)}
          >
            <HelpCircleIcon color={font.color.disabled} />
          </button>
        </div>
      )}
    >
      <p id={`${testId}_circle_icon_description`} style={{ margin: '0rem' }}>
        {translate(popOverText)}
      </p>
    </Popover>
  );
}

const LOG = LoggerFactory.create('VideoCenterBranding');

export function BrandingImages({
  hubId,
  favicon,
  logoImageUrl,
  logoOriginalUrl,
  logoAltText,
  themeState,
  setThemeState,
  onSuccess,
  onFailure,
  setIsPageEdited
}: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const { imageAltText } = useStyle(ImageStyle);
  const { sectionTitle, sectionSubTitle, headerContainer, title } = useBrandImagesStyles();

  const [loading, setLoading] = useState<boolean>(false);

  const [existingFavicon, setExistingFavicon] = useState<NewImage>({ url: favicon, croppedUrl: favicon });

  const [newFavicon, setNewFavicon] = useState<NewImage>({ url: favicon, croppedUrl: favicon });

  const [faviconDeleted, setFaviconDeleted] = useState(false);

  const [existingLogo, setExistingLogo] = useState<NewImage>({
    croppedUrl: logoImageUrl,
    url: logoOriginalUrl
  });

  const [newLogo, setNewLogo] = useState<NewImage>({
    croppedUrl: logoImageUrl,
    url: logoOriginalUrl
  });

  const [logoDeleted, setLogoDeleted] = useState(false);

  const [existingLogoAltText, setExistingLogoAltText] = useState<string>(logoAltText || '');
  const [newLogoAltText, setNewLogoAltText] = useState<string>(logoAltText || '');

  const [updateBrandingImages] = useMutation(UPDATE_BRANDING_IMAGES);

  const isEdited = useMemo(() => {
    const edited =
      newFavicon?.url !== existingFavicon?.url ||
      newLogo?.url !== existingLogo?.url ||
      newLogo?.croppedUrl !== existingLogo?.croppedUrl ||
      existingLogoAltText !== newLogoAltText;
    return edited;
  }, [existingFavicon, newFavicon, newLogo, existingLogo, existingLogoAltText, newLogoAltText]);

  useEffect(() => {
    setIsPageEdited(isEdited);
  }, [isEdited]);
  const saveBrandImage = async () => {
    setLoading(true);
    await updateBrandingImages({
      variables: {
        input: {
          hubId,
          logoOriginalUrl: !!newLogo?.url ? existingLogo?.url : null,
          logoUrl: !!newLogo?.url ? existingLogo?.croppedUrl : null,
          newLogoOriginalUrl:
            !!newLogo?.url && (newLogo?.url !== existingLogo?.url || newLogo?.croppedUrl !== existingLogo?.croppedUrl)
              ? newLogo?.url
              : null,
          newLogoUrl:
            !!newLogo?.url && (newLogo?.url !== existingLogo?.url || newLogo?.croppedUrl !== existingLogo?.croppedUrl)
              ? newLogo?.croppedUrl || newLogo?.url
              : null,
          logoAltText: newLogoAltText,
          faviconUrl: existingFavicon?.url === newFavicon?.url ? existingFavicon?.url : newFavicon?.url
        }
      },
      refetchQueries: [GET_VIDEO_HUB],
      onError: apolloError => {
        LOG.error(`Error while saving branding images for hub [${hubId}], Network error : `, apolloError.networkError);
        LOG.error(`Error while saving branding images for hub [${hubId}], graph error : `, apolloError.graphQLErrors);
        setLoading(false);
        onFailure?.();
      },
      onCompleted: (data: { updateBrandingImages: Hub }) => {
        setNewFavicon({ ...newFavicon, url: data.updateBrandingImages.theme.faviconUrl });
        setExistingFavicon({ ...newFavicon, url: data.updateBrandingImages.theme.faviconUrl });
        setExistingLogo({
          ...newLogo,
          url: data.updateBrandingImages.theme.logoOriginalImageUrl,
          croppedUrl: data.updateBrandingImages.theme.logoImageUrl
        });
        setNewLogo({
          ...newLogo,
          url: data.updateBrandingImages.theme.logoOriginalImageUrl,
          croppedUrl: data.updateBrandingImages.theme.logoImageUrl
        });
        setExistingLogoAltText(newLogoAltText);
        setThemeState({
          ...themeState,
          logoOriginalImageUrl: data.updateBrandingImages.theme.logoOriginalImageUrl,
          logoImageUrl: data.updateBrandingImages.theme.logoImageUrl,
          faviconUrl: data.updateBrandingImages.theme.faviconUrl,
          logoAltText: newLogoAltText
        });
        setLoading(false);
        onSuccess?.();
      }
    });
  };

  const remainingLengthMessage = translate('characters_left_label', {
    characterCount: MAX_LENGTH_ALT_TEXT - (newLogoAltText?.length || 0)
  });

  const BrandingImageContent = (
    <>
      <Row margin={0}>
        <Col padding={0} testID={'video_hub_theming_logo'} width={1 / 2}>
          <Row>
            <Col padding={0}>
              <h4 css={sectionTitle}>{translate('video_hub_branding_logo_image_header')}</h4>
              <p css={sectionSubTitle}>{translate('video_hub_branding_logo_image_text')}</p>
            </Col>
            <Col padding={0}>
              <div>
                <Image
                  showImageName={false}
                  isLogo
                  preSignedUpload={false}
                  editMode
                  setNewImage={setNewLogo}
                  newImage={newLogo}
                  currentImage={existingLogo}
                  imageDeleted={logoDeleted}
                  setImageDeleted={setLogoDeleted}
                  supportedText={translate('video_hub_branding_logo_image_supported_fileType', {
                    maxSize: IMAGE_MAXIMUM_SIZE_IN_MB
                  })}
                  recommendedText="video_hub_branding_logo_image_recommended_dimension_text"
                  incorrectImageUploadText={translate('video_hub_branding_logo_image_supported_fileType', {
                    maxSize: IMAGE_MAXIMUM_SIZE_IN_MB
                  })}
                  maxWidthImage={10.63}
                  noImageTitleText="theming_empty_image_alt_text"
                  imageAltText={logoAltText}
                  noImageUploadedText="theming_empty_image_alt_text"
                  showPlaceHolderInReadMode={false}
                  imageMaximumSize={IMAGE_MAXIMUM_SIZE}
                  entityId={hubId}
                  videoCenterId={hubId}
                  aspectRatioOptions={Array.of(
                    translations.crop16By9,
                    translations.crop4By3,
                    translations.crop3By2,
                    translations.cropSquare,
                    translations.freeForm
                  )}
                  aspectRatio={1.89}
                  disableDelete={null}
                  allowImageEdit
                  fileNameWidth={70}
                  entityType={LOGO}
                  imageUploadTriggerLocation="Branding-logo"
                />
              </div>
            </Col>
            {!!newLogo?.url ? (
              <Col padding={{ start: 0, end: 32 }}>
                <div>
                  <FormElement>
                    <div css={imageAltText}>
                      <div>
                        <FormElement.Label label={translate('theme_image_alt_label')} labelFor="logoAltText" required />
                      </div>
                      <div>
                        <PopOverHelper testId="logo_alt_image" popOverText="logo_image_alt_text_tooltip_body" />
                      </div>
                    </div>
                    <>
                      <Textbox
                        id="logoAltText"
                        name="logoAltText"
                        value={newLogoAltText}
                        onChange={e => setNewLogoAltText(e.target.value?.trimStart())}
                        maxLength={100}
                        hasError={!!newLogo?.url && newLogoAltText?.length === 0}
                      />
                      <FormElement.Message
                        text={
                          newLogoAltText?.length > 0
                            ? remainingLengthMessage
                            : translate('video_hub_branding_logo_image_alt_text_required_error_message')
                        }
                        type={newLogoAltText?.length > 0 ? 'info' : 'error'}
                      />
                    </>
                  </FormElement>
                </div>
              </Col>
            ) : null}
          </Row>
        </Col>
        <Col testID={'video_hub_theming_favicon'} width={1 / 2}>
          <Col padding={0}>
            <h4 css={sectionTitle}>{translate('video_hub_branding_favicon_image_header')}</h4>
            <p css={sectionSubTitle}>{translate('video_hub_branding_favicon_image_text')}</p>
          </Col>
          <Col padding={0}>
            <div>
              <Image
                editMode
                setNewImage={setNewFavicon}
                newImage={newFavicon}
                currentImage={existingFavicon}
                imageDeleted={faviconDeleted}
                setImageDeleted={setFaviconDeleted}
                supportedText={translate('video_hub_branding_favicon_image_supported_fileType', {
                  maxSize: IMAGE_MAXIMUM_SIZE_IN_MB
                })}
                recommendedText="video_hub_branding_favicon_image_recommended_dimension_text"
                incorrectImageUploadText={translate('video_hub_branding_favicon_image_supported_fileType', {
                  maxSize: IMAGE_MAXIMUM_SIZE_IN_MB
                })}
                maxWidthImage={5.63}
                noImageTitleText="theming_empty_image_alt_text"
                imageAltText={logoAltText}
                noImageUploadedText="theming_empty_image_alt_text"
                showPlaceHolderInReadMode={false}
                imageMaximumSize={IMAGE_MAXIMUM_SIZE}
                entityId={hubId}
                videoCenterId={hubId}
                aspectRatio={aspectRatioTypes.oneByOne}
                disableDelete={null}
                allowImageEdit={false}
                fileNameWidth={70}
                acceptedFileFormats={ACCEPTED_FAVICON_FILE_FORMAT}
                entityType={FAVICON}
                imageUploadTriggerLocation="Branding-favIcon"
                showImageName={false}
              />
            </div>
          </Col>
        </Col>
      </Row>
    </>
  );

  return (
    <div>
      <Row margin={0}>
        <Col css={headerContainer} padding={{ paddingLeft: 0 }}>
          <h3 css={title}>{translate('video_hub_branding_images_header')}</h3>
          <Button
            text={translate('video_hub_branding_page_save_changes')}
            appearance="filled"
            size="s"
            disabled={loading || !isEdited || (!!newLogo?.url && newLogoAltText?.length === 0)}
            onClick={saveBrandImage}
          />
        </Col>
      </Row>
      {!loading ? <> {BrandingImageContent} </> : <LoadingSpinner size="m" testID="loading-branding-image-spinner" />}
    </div>
  );
}

interface Props {
  hubId: string;
  logoAltText?: string;
  logoImageUrl?: string;
  logoOriginalUrl: string;
  themeState: Theme;
  setThemeState: (args: Theme) => void;
  favicon?: string;
  onSuccess?: () => {};
  onFailure?: () => {};
  setIsPageEdited: (isPageEdited: boolean) => void;
}
