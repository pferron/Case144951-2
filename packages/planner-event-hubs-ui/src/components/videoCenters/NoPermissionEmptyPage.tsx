import React from 'react';
import { IllustrationContent, IllustrationHeader, IllustrationNotice } from '@cvent/carina/components/Templates';
import { useTranslate } from 'nucleus-text';
import EmptyBoxes from '@cvent/carina/components/Illustrations/EmptyBoxes';

function NoPermissionEmptyPage(): JSX.Element {
  const { translate } = useTranslate();

  return (
    <IllustrationNotice testID="select-video-modal-empty-page-container" illustration={EmptyBoxes}>
      <IllustrationHeader>{translate('video_library_no_permission_empty_page_message_header')}</IllustrationHeader>
      <IllustrationContent>{translate('no_permission_empty_video_center_page')}</IllustrationContent>
    </IllustrationNotice>
  );
}
export default NoPermissionEmptyPage;
