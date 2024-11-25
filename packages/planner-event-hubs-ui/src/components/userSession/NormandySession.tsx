import React, { useMemo } from 'react';
import { useTranslate } from 'nucleus-text';
import { resolveTemplateUrl } from '@utils/environmentUtil';
import { getEnvironment, isDevEnvironment, isStagingEnvironment } from '@utils/appConfig';
import { SessionHandler } from './SessionHandler';

interface Props {
  normandyBaseUrl: string;
  keepAliveInterval?: number;
  showNoticeWhenUnder?: number;
}

export function NormandySession({
  keepAliveInterval = 5 * 60,
  showNoticeWhenUnder = 5 * 60,
  normandyBaseUrl
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const normandyEndpoint = useMemo(() => resolveTemplateUrl(normandyBaseUrl, getEnvironment()), [normandyBaseUrl]);

  return (
    <SessionHandler
      normandyEndpoint={(!isDevEnvironment() && !isStagingEnvironment() && normandyEndpoint) || ''}
      stillThereText={translate('video_library_session_still_there')}
      noticeText={translate('video_library_session_notice')}
      timeLeftText={(time): string => translate('video_library_session_time_left', { time })}
      logOutText={translate('video_library_session_log_out')}
      keepWorkingText={translate('video_library_session_keep_working')}
      refreshErrorText={translate('video_library_session_refresh_error')}
      keepAliveInterval={keepAliveInterval} // defaults to 5 minutes
      showNoticeWhenUnder={showNoticeWhenUnder}
    />
  );
}
