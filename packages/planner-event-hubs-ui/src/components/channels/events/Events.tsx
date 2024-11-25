import React, { useMemo } from 'react';
import { useTranslate } from 'nucleus-text';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { Button } from '@cvent/carina/components/Button';
import { useStyle } from '@hooks/useStyle';
import { VideoStyles } from '@components/channels/videos/style';
import { CatalogVideoSkeleton } from '@cvent/preview-skeleton/dist/CatalogVideoSkeleton';
import CardContainer from '@components/common/CardContainer';

import { convertCatalogToCatalogPreview } from '@components/channels/videos/videoHelper';

interface Props {
  // FIREBALL
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  eventCatalog: any;
  editMode: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

function Events({ onEdit, onCancel, onSave, eventCatalog, editMode }: Props): JSX.Element {
  const { translate } = useTranslate();
  const { catalogContainer, previewContainer } = useStyle(VideoStyles);

  const sectionButton = useMemo(
    () => (
      <Button
        accessibilityLabel={translate('channel_video_create_section_button_label')}
        accessible
        onClick={(): void => undefined}
        size="m"
        appearance="lined"
        text={translate('channel_video_create_section_button_label')}
      />
    ),
    [translate]
  );
  const CatalogPreview = useMemo(
    () => (
      <div {...injectTestId('catalog-preview')} css={previewContainer}>
        <CatalogVideoSkeleton
          catalog={convertCatalogToCatalogPreview(eventCatalog)}
          showSections={false}
          accessibilityLabel={translate('channel_events_section_preview_aria_label')}
          maxElementPerRow={4}
          minHeight="28rem"
        />
      </div>
    ),
    [eventCatalog, previewContainer, translate]
  );

  return (
    <div css={catalogContainer}>
      <div css={{ width: 'stretch', overflow: 'auto', height: 'fit-content' }}>
        <CardContainer testID="banner-content" enabled={editMode} onEdit={onEdit} onSubmit={onSave} onCancel={onCancel}>
          <Row>
            {editMode ? (
              <Col width="fill">
                <h2 css={{ margin: 0 }}>{translate('channel_events_header')}</h2>
                <p>{translate('channel_events_text')}</p>
                {editMode && (
                  <Row>
                    <Col width="content" padding={{ paddingTop: 8, paddingLeft: 0 }}>
                      {sectionButton}
                    </Col>
                    <Col width="content" padding={{ paddingTop: 8, paddingLeft: 0 }}>
                      <Button
                        accessibilityLabel={translate('channel_events_add_events_button_text')}
                        accessible
                        onClick={(): void => undefined}
                        size="m"
                        appearance="filled"
                        text={translate('channel_events_add_events_button_text')}
                        testID="channel-events-add-events-button"
                      />
                    </Col>
                  </Row>
                )}
              </Col>
            ) : (
              <Col width="fill">
                <h2 css={{ margin: 0 }} {...injectTestId('channel_events_header')}>
                  {translate('channel_events_header')}
                </h2>
                <p>{translate('channel_events_text')}</p>
              </Col>
            )}
          </Row>
        </CardContainer>
      </div>
      {editMode && CatalogPreview}
    </div>
  );
}

export default Events;
