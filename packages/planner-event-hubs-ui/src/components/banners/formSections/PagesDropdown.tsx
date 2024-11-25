import React from 'react';
import { useTranslate } from 'nucleus-text';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Button } from '@cvent/carina/components/Button';
import { Dropdown, useWatchDirty } from '@cvent/carina/components/Forms';
import { HubPage } from '@cvent/planner-event-hubs-model/types';

export function PagesDropdown({ pagesData, onCancel }: Props): JSX.Element {
  const { translate } = useTranslate();
  const isDirty = useWatchDirty();

  return (
    <div>
      <Row margin={-8} justifyContent="flex-end">
        <Col>
          <Dropdown
            id="banner_placement"
            accessibilityLabel={translate('banner_placement_label')}
            name="entity"
            label={translate('banner_placement_label')}
            options={pagesData?.map(q => ({
              value: q.entityId,
              label: q.name
            }))}
          />
        </Col>

        <Col width="content">
          <Button
            type="reset"
            text={translate('cancel_button_label')}
            appearance="ghost"
            accessibilityLabel={translate('cancel_button_label')}
            testID="banner-pages-cancel-channel-button"
            onClick={onCancel}
          />
        </Col>
        <Col width="content">
          <Button
            type="submit"
            text={translate('assign_button_label')}
            accessibilityLabel={translate('assign_button_label')}
            appearance="filled"
            disabled={!isDirty}
            testID="banner-pages-save-pages-button"
          />
        </Col>
      </Row>
    </div>
  );
}

interface Props {
  onCancel: () => void;
  pagesData: Array<HubPage>;
}
