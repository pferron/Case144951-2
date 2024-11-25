import { PaginatedVideos } from '@cvent/planner-event-hubs-model/types';
import { AnalyticsResponseData } from '@dataSources/analyticsService/client';

export const totalHubViewDataClientRequest = {
  context: {
    application: 'Planner Event Hubs'
  },
  criteria: {
    columns: ['time_window_per_day', 'entity_id', 'total_views'],
    expression: "entity_id = 'baa1deee-289a-452b-9c95-190ba185775f'",
    params: [
      {
        name: 'startTime',
        value: '2021-08-15T00:00:00Z'
      },
      {
        name: 'endTime',
        value: '2023-08-15T00:00:00Z'
      }
    ]
  }
};

export const averageViewDurationByHubIdClientRequest = {
  context: {
    application: 'Planner Event Hubs'
  },
  criteria: {
    columns: ['time_window_per_day', 'entity_id', 'average_view_duration'],
    expression: "entity_id = 'baa1deee-289a-452b-9c95-190ba185775f'",
    params: [
      {
        name: 'startTime',
        value: '2021-08-15T00:00:00Z'
      },
      {
        name: 'endTime',
        value: '2023-08-15T00:00:00Z'
      }
    ]
  }
};

export const totalViewsPerDayPerVideoClientRequest = {
  context: {
    application: 'Planner Event Hubs'
  },
  criteria: {
    columns: ['time_window_per_day', 'video_id', 'entity_id', 'total_views'],
    expression: "entity_id = 'baa1deee-289a-452b-9c95-190ba185775f' AND view_type='Recording'",
    params: [
      {
        name: 'mapping_id',
        value: 'baa1deee-289a-452b-9c95-190ba185775f'
      },
      {
        name: 'startTime',
        value: '2021-08-15T00:00:00Z'
      },
      {
        name: 'endTime',
        value: '2023-08-15T00:00:00Z'
      }
    ]
  }
};

export const totalVideosViewCountRequest = {
  context: {
    application: 'Planner Event Hubs'
  },
  criteria: {
    columns: ['video_id', 'total_views'],
    expression: "entity_id = 'baa1deee-289a-452b-9c95-190ba185775f'",
    params: [
      {
        name: 'mapping_id',
        value: 'baa1deee-289a-452b-9c95-190ba185775f'
      },
      {
        name: 'startTime',
        value: '2021-08-15T00:00:00Z'
      },
      {
        name: 'endTime',
        value: '2023-08-15T00:00:00Z'
      },
      {
        name: 'limit',
        value: 2500
      },
      {
        name: 'offset',
        value: 0
      }
    ]
  }
};

export const totalWatchDurationPerMember = {
  context: {
    application: 'Planner Event Hubs'
  },
  criteria: {
    columns: ['unique_id', 'total_duration'],
    expression:
      "entity_id = 'baa1deee-289a-452b-9c95-190ba185775f' AND video_id = '467788fc-bd41-48bd-b6c4-cd6c164478db'",
    params: [
      {
        name: 'mapping_id',
        value: 'baa1deee-289a-452b-9c95-190ba185775f'
      },
      {
        name: 'startTime',
        value: '2021-08-15T00:00:00Z'
      },
      {
        name: 'endTime',
        value: '2023-08-15T00:00:00Z'
      },
      {
        name: 'limit',
        value: 2500
      },
      {
        name: 'offset',
        value: 0
      }
    ]
  }
};

export const totalViewsPerDayPerVideoResponse = {
  fields: [
    { encrypt: false, fieldKey: 'time_window_per_day', fieldType: 'timestamp' },
    { encrypt: false, fieldKey: 'video_id', fieldType: 'string' },
    { encrypt: false, fieldKey: 'entity_id', fieldType: 'string' },
    { encrypt: false, fieldKey: 'total_views', fieldType: 'int' }
  ],
  rows: [
    {
      values: [
        '2023-08-01T00:00:00Z',
        '12345678-1234-1234-1234-12345678901A',
        '474469db-abbb-4a50-bfb0-fb2c34b26f02',
        '100'
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        '12345678-1234-1234-1234-12345678901A',
        '474469db-abbb-4a50-bfb0-fb2c34b26f02',
        '100'
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        '12345678-1234-1234-1234-12345678901B',
        '474469db-abbb-4a50-bfb0-fb2c34b26f02',
        '80'
      ]
    },
    {
      values: [
        '2023-08-03T00:00:00Z',
        '12345678-1234-1234-1234-12345678901C',
        '474469db-abbb-4a50-bfb0-fb2c34b26f02',
        '60'
      ]
    }
  ],
  total: 117
};

export const totalHubViewDataResponse = {
  fields: [
    { encrypt: false, fieldKey: 'time_window_per_day', fieldType: 'timestamp' },
    { encrypt: false, fieldKey: 'entity_id', fieldType: 'string' },
    { encrypt: false, fieldKey: 'total_views', fieldType: 'int' }
  ],
  rows: [
    { values: ['2023-08-10T00:00:00Z', '474469db-abbb-4a50-bfb0-fb2c34b26f02', 22] },
    { values: ['2023-08-09T00:00:00Z', '474469db-abbb-4a50-bfb0-fb2c34b26f02', 3] }
  ],
  total: 117
};

export const totalVideoViewDataResponseWeek1: AnalyticsResponseData = {
  fields: [
    { encrypt: false, fieldKey: 'time_window_per_day', fieldType: 'timestamp' },
    { encrypt: false, fieldKey: 'video_id', fieldType: 'string' },
    { encrypt: false, fieldKey: 'entity_id', fieldType: 'string' },
    { encrypt: false, fieldKey: 'total_views', fieldType: 'int' }
  ],
  rows: [
    {
      values: [
        '2023-08-01T00:00:00Z',
        '12345678-1234-1234-1234-12345678901A',
        '474469db-abbb-4a50-bfb0-fb2c34b26f02',
        '100'
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        '12345678-1234-1234-1234-12345678901A',
        '474469db-abbb-4a50-bfb0-fb2c34b26f02',
        '100'
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        '12345678-1234-1234-1234-12345678901B',
        '474469db-abbb-4a50-bfb0-fb2c34b26f02',
        '80'
      ]
    },
    {
      values: [
        '2023-08-03T00:00:00Z',
        '12345678-1234-1234-1234-12345678901C',
        '474469db-abbb-4a50-bfb0-fb2c34b26f02',
        '60'
      ]
    }
  ],
  total: 117
};

export const totalVideoViewDataResponseWeek2 = {
  fields: [
    { encrypt: false, fieldKey: 'time_window_per_day', fieldType: 'timestamp' },
    { encrypt: false, fieldKey: 'video_id', fieldType: 'string' },
    { encrypt: false, fieldKey: 'entity_id', fieldType: 'string' },
    { encrypt: false, fieldKey: 'total_views', fieldType: 'int' }
  ],
  rows: [
    {
      values: [
        '2023-08-10T00:00:00Z',
        '12345678-1234-1234-1234-12345678901A',
        '474469db-abbb-4a50-bfb0-fb2c34b26f02',
        80
      ]
    },
    {
      values: [
        '2023-08-11T00:00:00Z',
        '12345678-1234-1234-1234-12345678901B',
        '474469db-abbb-4a50-bfb0-fb2c34b26f02',
        40
      ]
    },
    {
      values: [
        '2023-08-12T00:00:00Z',
        '12345678-1234-1234-1234-12345678901C',
        '474469db-abbb-4a50-bfb0-fb2c34b26f02',
        20
      ]
    },
    {
      values: [
        '2023-08-13T00:00:00Z',
        '12345678-1234-1234-1234-12345678901D',
        '474469db-abbb-4a50-bfb0-fb2c34b26f02',
        100
      ]
    }
  ],
  total: 117
};

export const videosViewDataResponse = {
  fields: [
    { encrypt: false, fieldKey: 'video_id', fieldType: 'string' },
    { encrypt: false, fieldKey: 'total_views', fieldType: 'int' }
  ],
  rows: [
    {
      values: ['12345678-1234-1234-1234-12345678901a', 80]
    },
    {
      values: ['12345678-1234-1234-1234-12345678901e', 120]
    },
    {
      values: ['12345678-1234-1234-1234-12345678901b', 40]
    },
    {
      values: ['12345678-1234-1234-1234-12345678901c', 20]
    },
    {
      values: ['12345678-1234-1234-1234-12345678901a', 5]
    },
    {
      values: ['12345678-1234-1234-1234-12345678901d', 100]
    }
  ],
  total: 117
};

export const watchDurationDataResponse = {
  fields: [
    { encrypt: false, fieldKey: 'unique_id', fieldType: 'string' },
    { encrypt: false, fieldKey: 'total_duration', fieldType: 'int' }
  ],
  rows: [
    {
      values: ['12345678-1234-1234-1234-12345678901a', 80]
    },
    {
      values: ['12345678-1234-1234-1234-12345678901e', 120]
    },
    {
      values: ['12345678-1234-1234-1234-12345678901b', 40]
    },
    {
      values: ['12345678-1234-1234-1234-12345678901c', 20]
    },
    {
      values: ['12345678-1234-1234-1234-12345678901d', 100]
    }
  ],
  total: 117
};

export const videosResponseData: PaginatedVideos = {
  paging: {
    limit: 100,
    totalCount: 1,
    currentToken: '4cb17e75-f492-4e1a-a952-a47e02415ec7'
  },
  data: [
    {
      title: 'Video A',
      id: '12345678-1234-1234-1234-12345678901A',
      duration: 20000,
      generatedThumbnail: { url: { href: 'videoa.png' } }
    },
    {
      title: 'Video B',
      id: '12345678-1234-1234-1234-12345678901B',
      duration: 30000,
      generatedThumbnail: { url: { href: 'videob.png' } }
    },
    {
      title: 'Video C',
      id: '12345678-1234-1234-1234-12345678901C',
      generatedThumbnail: { url: { href: 'videoc.png' } }
    },
    {
      title: 'Video D',
      id: '12345678-1234-1234-1234-12345678901D',
      duration: 50000,
      generatedThumbnail: { url: { href: 'videod.png' } }
    }
  ]
};

export const contactsResponseData = {
  data: [
    {
      id: '12345678-1234-1234-1234-12345678901A',
      firstName: 'A_First',
      lastName: 'A_Last',
      email: 'A@mail.com'
    },
    {
      id: '12345678-1234-1234-1234-12345678901B',
      firstName: 'B_First',
      lastName: 'B_Last',
      email: 'B@mail.com'
    },
    {
      id: '12345678-1234-1234-1234-12345678901C',
      firstName: 'C_First',
      lastName: 'C_Last',
      email: 'C@mail.com'
    },
    {
      id: '12345678-1234-1234-1234-12345678901D',
      firstName: 'D_First',
      lastName: 'D_Last',
      email: 'D@mail.com'
    },
    {
      id: '12345678-1234-1234-1234-12345678901E',
      firstName: 'E_First',
      lastName: 'E_Last',
      email: 'E@mail.com'
    }
  ]
};

export const averageWatchTimeDataResponse = {
  fields: [
    { encrypt: false, fieldKey: 'time_window_per_day', fieldType: 'timestamp' },
    { encrypt: false, fieldKey: 'entity_id', fieldType: 'string' },
    { encrypt: false, fieldKey: 'average_view_duration', fieldType: 'float' }
  ],
  rows: [
    { values: ['2023-08-10T00:00:00Z', '474469db-abbb-4a50-bfb0-fb2c34b26f02', 961.1818181818181] },
    { values: ['2023-08-09T00:00:00Z', '474469db-abbb-4a50-bfb0-fb2c34b26f02', 1461.3333333333333] }
  ],
  total: 1822.5151
};

export const totalVideoViewDataResponse = {
  fields: [
    { encrypt: false, fieldKey: 'video_id', fieldType: 'string' },
    { encrypt: false, fieldKey: 'total_views', fieldType: 'int' }
  ],
  rows: [
    {
      values: ['124469db-abbb-4a50-bfb0-fb2c34b26122', 22]
    },
    {
      values: ['124469db-abbb-4a50-bfb0-fb2c34b26122', 3]
    }
  ],
  total: 117
};

export const totalHubViewData = {
  total: 117,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'timestamp',
      encrypt: false
    },
    {
      fieldKey: 'entity_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'total_views',
      fieldType: 'int',
      encrypt: false
    }
  ],
  rows: [
    {
      values: ['2023-08-10T00:00:00Z', '474469db-abbb-4a50-bfb0-fb2c34b26f02', 22]
    },
    {
      values: ['2023-08-09T00:00:00Z', '474469db-abbb-4a50-bfb0-fb2c34b26f02', 3]
    }
  ]
};

export const top5VideosResponse = {
  topVideos: [
    {
      videoId: '12345678-1234-1234-1234-12345678901A',
      totalViews: 200,
      videoName: 'Video A',
      currentPosition: 1,
      previousPosition: 2
    },
    {
      videoId: '12345678-1234-1234-1234-12345678901B',
      totalViews: 80,
      videoName: 'Video B',
      currentPosition: 2,
      previousPosition: 3
    },
    {
      videoId: '12345678-1234-1234-1234-12345678901C',
      totalViews: 60,
      videoName: 'Video C',
      currentPosition: 3,
      previousPosition: 4
    }
  ]
};
