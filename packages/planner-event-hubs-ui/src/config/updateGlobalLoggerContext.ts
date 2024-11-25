import { datadogLogs } from '@datadog/browser-logs';

interface LoggerContext {
  httpLogPageLoadId: string;
  httpLogRequestId?: string;

  environment?: string;
  accountMappingId?: string;
  videoCenterId?: string;
  memberId?: string;
}

export function updateGlobalLoggerContext(loggerContext: LoggerContext): void {
  datadogLogs.setGlobalContextProperty('account_mapping.id', loggerContext?.accountMappingId);
  datadogLogs.setGlobalContextProperty('video_center.id', loggerContext?.videoCenterId);
  datadogLogs.setGlobalContextProperty('video_center.member.id', loggerContext?.memberId);
  datadogLogs.setGlobalContextProperty('httpLogPageLoadId', loggerContext?.httpLogPageLoadId);
  datadogLogs.setGlobalContextProperty('httpLogRequestId', loggerContext?.httpLogRequestId);
}
