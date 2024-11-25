import { CvestDataSource } from '@dataSources/CvestDataSource';
import { LoggerFactory } from '@cvent/auth-client';

const APPLICATION_NAME = 'Planner Event Hubs';

const LOG = LoggerFactory.create('analytics-api-client');
export interface AnalyticsField {
  fieldKey: string;
  fieldType: string;
  encrypt: boolean;
}

export interface AnalyticsRowData {
  values: Array<string>;
}

export interface VideoViewsAndPosition {
  videoId: string;
  totalViews: number;
  position: number;
}

export interface AnalyticsResponseData {
  total: number;
  fields: Array<AnalyticsField>;
  rows: Array<AnalyticsRowData>;
}

export class AnalyticsClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.ANALYTICS_DATASOURCE_URL}`;
  }

  getTotalViewsByHubId = async (
    hubId: string,
    startDate: string,
    endDate: string,
    pipeline?: string
  ): Promise<AnalyticsResponseData> => {
    LOG.debug('getTotalViewsByHubId()', hubId);

    const params = [
      {
        name: 'startTime',
        value: startDate
      },
      {
        name: 'endTime',
        value: endDate
      }
    ];

    const requestBody = {
      context: {
        application: APPLICATION_NAME
      },
      criteria: {
        columns: ['time_window_per_day', 'entity_id', 'total_views'],
        expression: `entity_id = '${hubId}'`,
        params
      }
    };

    const dataSource = pipeline === 'v2' ? 'total_views_per_hub_per_day_agg_v2' : 'total_views_per_hub_per_day_agg';
    const data = (await this.post(`/v1/analytics_data_source/requestData/${dataSource}`, requestBody, {
      headers: { authorization: `API_KEY ${process.env.API_KEY}` }
    })) as AnalyticsResponseData;

    return data;
  };

  averageViewDurationByHubId = async (
    hubId: string,
    startDate: string,
    endDate: string,
    pipeline?: string
  ): Promise<AnalyticsResponseData> => {
    LOG.debug('averageViewDurationByHubId()', hubId);

    const params = [
      {
        name: 'startTime',
        value: startDate
      },
      {
        name: 'endTime',
        value: endDate
      }
    ];

    const requestBody = {
      context: {
        application: APPLICATION_NAME
      },
      criteria: {
        columns: ['time_window_per_day', 'entity_id', 'average_view_duration'],
        expression: `entity_id = '${hubId}'`,
        params
      }
    };

    const dataSource =
      pipeline === 'v2' ? 'average_view_duration_per_hub_per_day_agg_v2' : 'average_view_duration_per_hub_per_day_agg';
    const data = (await this.post(`/v1/analytics_data_source/requestData/${dataSource}`, requestBody, {
      headers: { authorization: `API_KEY ${process.env.API_KEY}` }
    })) as AnalyticsResponseData;

    return data;
  };

  getTotalVideosViewedByHubId = async (
    mappingId: string,
    hubId: string,
    startDate: string,
    endDate: string,
    pipeline?: string
  ): Promise<AnalyticsResponseData> => {
    LOG.debug('getTotalVideosViewedByHubId()', hubId, startDate, endDate);
    const params = [
      {
        name: 'mapping_id',
        value: mappingId
      },
      {
        name: 'startTime',
        value: startDate
      },
      {
        name: 'endTime',
        value: endDate
      }
    ];

    const requestBody = {
      context: {
        application: APPLICATION_NAME
      },
      criteria: {
        columns: ['time_window_per_day', 'video_id', 'entity_id', 'total_views'],
        expression: `entity_id = '${hubId}' AND view_type='Recording'`,
        params
      }
    };

    const dataSource =
      pipeline === 'v2' ? 'total_views_per_source_per_day_agg_v2' : 'total_views_per_source_per_day_agg';
    const data = await this.post(`/v1/analytics_data_source/requestData/${dataSource}`, requestBody, {
      headers: { authorization: `API_KEY ${process.env.API_KEY}` }
    });
    return data;
  };

  viewsByDeviceType = async (
    hubId: string,
    startDate: string,
    endDate: string,
    pipeline?: string
  ): Promise<AnalyticsResponseData> => {
    LOG.debug('viewsByDeviceType()', hubId);

    const params = [
      {
        name: 'startTime',
        value: startDate
      },
      {
        name: 'endTime',
        value: endDate
      }
    ];

    const requestBody = {
      context: {
        application: APPLICATION_NAME
      },
      criteria: {
        columns: ['time_window_per_day', 'entity_id', 'device_type', 'total_views'],
        expression: `entity_id = '${hubId}'`,
        params
      }
    };

    const dataSource =
      pipeline === 'v2'
        ? 'total_views_by_device_type_per_hub_per_day_agg_v2'
        : 'total_views_by_device_type_per_hub_per_day_agg';
    const data = (await this.post(`/v1/analytics_data_source/requestData/${dataSource}`, requestBody, {
      headers: { authorization: `API_KEY ${process.env.API_KEY}` }
    })) as AnalyticsResponseData;

    return data;
  };

  getAllVideosViewedByHubId = async (
    mappingId: string,
    hubId: string,
    startDate: string,
    endDate: string,
    limit: number,
    offset: number
  ): Promise<AnalyticsResponseData> => {
    LOG.debug('getAllVideosViewedByHubId()', hubId, startDate, endDate);
    const params = [
      {
        name: 'mapping_id',
        value: mappingId
      },
      {
        name: 'startTime',
        value: startDate
      },
      {
        name: 'endTime',
        value: endDate
      },
      {
        name: 'limit',
        value: limit
      },
      {
        name: 'offset',
        value: offset
      }
    ];

    const requestBody = {
      context: {
        application: APPLICATION_NAME
      },
      criteria: {
        columns: ['video_id', 'total_views'],
        expression: `entity_id = '${hubId}'`,
        params
      }
    };

    return this.post(`/v1/analytics_data_source/requestData/total_views_per_hub_per_video_agg_v2`, requestBody, {
      headers: { authorization: `API_KEY ${process.env.API_KEY}` }
    });
  };

  getMemberVideoWatchDurationByHubId = async (
    mappingId: string,
    hubId: string,
    videoId: string,
    startDate: string,
    endDate: string,
    limit: number,
    offset: number
  ): Promise<AnalyticsResponseData> => {
    LOG.debug('getMemberVideoWatchDurationByHubId()', hubId, videoId, startDate, endDate);
    const params = [
      {
        name: 'mapping_id',
        value: mappingId
      },
      {
        name: 'startTime',
        value: startDate
      },
      {
        name: 'endTime',
        value: endDate
      },
      {
        name: 'limit',
        value: limit
      },
      {
        name: 'offset',
        value: offset
      }
    ];

    const requestBody = {
      context: {
        application: APPLICATION_NAME
      },
      criteria: {
        columns: ['unique_id', 'total_duration'],
        expression: `entity_id = '${hubId}' AND video_id = '${videoId}'`,
        params
      }
    };

    return this.post(`/v1/analytics_data_source/requestData/total_watch_duration_per_member_agg_v2`, requestBody, {
      headers: { authorization: `API_KEY ${process.env.API_KEY}` }
    });
  };
}
