import React, { MutableRefObject, useCallback, useMemo } from 'react';
import { Button } from '@cvent/carina/components/Button';
import { XIcon } from '@cvent/carina/components/Icon';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { VideoStyles } from '@components/channels/videos/style';
import DragAndDropCatalog from '@cvent/drag-and-drop-catalog';
import { convertCatalogToCatalogPreview, getDefaultSection, labels } from '@components/channels/videos/videoHelper';
import { CatalogVideoSkeleton } from '@cvent/preview-skeleton/dist/CatalogVideoSkeleton';
import { CardBody, CardContainer } from '@cvent/carina/components/Card';
import useBreakpoints from '@hooks/useBreakpoints';
import { ExtendedItemCatalog, ExtendedSection } from '@components/channels/type/channelCatalog';
import { Flyout } from '@cvent/carina/components/Flyout';
import HeroSearch from '@cvent/carina/components/Illustrations/HeroSearch';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { CHANNEL_PAGE_FLYOUT_Z_INDEX } from '@utils/constants';
import { useChannelsPageActionsApi } from '@metrics/client/react/useChannelsPageActionsApi';

interface Props {
  itemCatalog: ExtendedItemCatalog;
  showSection: boolean;
  onDragAndDropItems: (oldCatalog: ExtendedItemCatalog, updatedSections: Array<ExtendedSection>) => void;
  setIsAddVideoModal: (isOpen: boolean) => void;
  setIsAddSectionModal: (isOpen: boolean) => void;
  isSectionFlyoutOpen: boolean;
  setIsSectionFlyoutOpen: (isOpen: boolean) => void;
  containerRef: MutableRefObject<HTMLInputElement>;
}

function Catalog({
  itemCatalog,
  showSection,
  setIsAddVideoModal,
  setIsAddSectionModal,
  onDragAndDropItems,
  isSectionFlyoutOpen,
  setIsSectionFlyoutOpen,
  containerRef
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const {
    catalogContainer,
    previewContainer,
    textStyle,
    sectionFlyoutText,
    editContentHeaderText,
    cardContainerStyleEditMode,
    catalogButtonStyles
  } = useStyle(VideoStyles);
  const { isMobileOrTablet, widthWindow } = useBreakpoints();

  const moreVideosSection = useMemo(() => getDefaultSection(itemCatalog), [itemCatalog]);
  const hasVideosInDefaultSection = useMemo(
    () => moreVideosSection?.items?.length > 0,
    [moreVideosSection?.items?.length]
  );

  const { addExistingVideoButtonClicked, createASectionButtonClicked } = useChannelsPageActionsApi();

  const editContentHeader = useMemo(
    () => (
      <Col width="content">
        <h3 css={editContentHeaderText}>{translate('channel_video_header')}</h3>
      </Col>
    ),
    [editContentHeaderText, translate]
  );

  const CatalogPreview = useMemo(
    () => (
      <div {...injectTestId('catalog-preview')} css={previewContainer}>
        <CatalogVideoSkeleton
          catalog={convertCatalogToCatalogPreview(itemCatalog)}
          showSections={showSection}
          accessibilityLabel={translate('channel_video_section_preview_aria_label')}
          maxElementPerRow={4}
          minHeight="28rem"
        />
      </div>
    ),
    [itemCatalog, previewContainer, showSection, translate]
  );

  const sectionButton = useMemo(
    () => (
      <div css={{ paddingTop: '0.5rem' }}>
        <Button
          accessibilityLabel={translate('channel_video_create_section_button_label')}
          accessible
          onClick={(): void => {
            setIsAddSectionModal(true);
            createASectionButtonClicked({});
          }}
          size="m"
          appearance="lined"
          text={translate('channel_video_create_section_button_label')}
          disabled={!hasVideosInDefaultSection}
        />
      </div>
    ),
    [hasVideosInDefaultSection, setIsAddSectionModal, translate, createASectionButtonClicked]
  );

  const heroImage = useMemo(
    (): JSX.Element => (
      <div css={{ marginBottom: '-1rem' }}>
        <HeroSearch height={120} width={119} title={translate('channel_video_create_section_button_flyout_header')} />
      </div>
    ),
    [translate]
  );

  const flyoutText = useMemo(
    (): JSX.Element => (
      <>
        <h4 css={{ margin: 0 }}>{translate('channel_video_create_section_button_flyout_header')}</h4>
        <p>{translate('channel_video_create_section_button_flyout_text')}</p>
      </>
    ),
    [translate]
  );

  const closeFlyoutButton = useCallback(
    (onClose): JSX.Element => (
      <div css={{ marginTop: '-0.5rem' }}>
        <Button
          icon={XIcon}
          type="reset"
          appearance="ghost"
          accessibilityLabel={translate('channel_edit_cancel_accessibility_button_label')}
          testID="channel-information-page-cancel-edit-form-button"
          onClick={() => {
            onClose(false);
          }}
          variant="neutral"
        />
      </div>
    ),
    [translate]
  );

  const sectionButtonWithFlyout = useMemo(
    () => (
      <Flyout
        placement={isMobileOrTablet ? 'bottom-start' : 'end'}
        zIndex={CHANNEL_PAGE_FLYOUT_Z_INDEX}
        onClose={() => setIsSectionFlyoutOpen(false)}
        isFixed
        noPadding={false}
        preventOverflow={false}
        // FIREBALL
        /* eslint-disable */
        content={onClose =>
          widthWindow > 800 ? (
            <Row>
              <Col width="content" padding={0}>
                {heroImage}
              </Col>
              <Col width="content" padding={0}>
                <div css={sectionFlyoutText}>{flyoutText}</div>
              </Col>
              <Col width="content" padding={0}>
                {closeFlyoutButton(onClose)}
              </Col>
            </Row>
          ) : (
            <div css={{ width: 'min-content' }}>
              <Row>
                <Col width={9 / 10} padding={0} css={{ textAlign: 'center' }}>
                  {heroImage}
                </Col>
                <Col width={1 / 10} padding={0}>
                  {closeFlyoutButton(onClose)}
                </Col>
              </Row>
              <Row>
                <div css={{ maxWidth: 'fit-content' }}>{flyoutText}</div>
              </Row>
            </div>
          )
        }
        defaultOpen={isSectionFlyoutOpen}
        trigger={() => sectionButton}
      />
    ),
    [
      closeFlyoutButton,
      flyoutText,
      heroImage,
      isMobileOrTablet,
      isSectionFlyoutOpen,
      widthWindow,
      sectionButton,
      sectionFlyoutText,
      setIsSectionFlyoutOpen
    ]
  );

  return (
    <div css={catalogContainer}>
      <div css={cardContainerStyleEditMode}>
        <CardContainer width="100%" responsive>
          <CardBody>
            <Row>
              <Col width="fill">
                <Row> {editContentHeader} </Row>
                <Row>
                  <Col width="fill">
                    <p css={textStyle}>{translate('channel_video_text')}</p>
                    <div css={catalogButtonStyles}>
                      {isSectionFlyoutOpen ? sectionButtonWithFlyout : sectionButton}
                      <div css={{ marginLeft: '0.5rem' }} />
                      <div css={{ paddingTop: '0.5rem' }}>
                        <Button
                          accessibilityLabel={translate('channel_video_add_video_button_text')}
                          accessible
                          onClick={(): void => {
                            setIsAddVideoModal(true);
                            addExistingVideoButtonClicked({});
                          }}
                          size="m"
                          appearance="filled"
                          text={translate('channel_video_add_video_button_text')}
                          testID="channel-video-add-video-button"
                        />
                      </div>
                    </div>
                    <Row>
                      <Col padding={{ start: 0, bottom: 24, top: 8, end: 0 }}>
                        <DragAndDropCatalog
                          catalog={itemCatalog}
                          showSection={showSection}
                          isEditMode
                          updateCatalog={onDragAndDropItems}
                          accessibilityLabels={labels}
                          makeLastSectionNonDraggable
                          allowDropInExpandedSections
                          externalContainerRef={containerRef}
                          translate={translate}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </CardContainer>
      </div>
      {CatalogPreview}
    </div>
  );
}

export default Catalog;
