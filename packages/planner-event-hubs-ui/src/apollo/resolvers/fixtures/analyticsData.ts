import { AnalyticsResponseData } from '@dataSources/analyticsService/client';

export const totalViewsData = {
  total: 4,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'timestamp',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
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
      values: [
        '2023-07-22T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '3'
      ]
    },
    {
      values: [
        '2023-07-19T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '5'
      ]
    },
    {
      values: [
        '2023-07-18T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '2'
      ]
    },
    {
      values: [
        '2023-07-18T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Live',
        '8'
      ]
    }
  ]
};

export const averageViewDurationPerDayData = {
  total: 209,
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
      fieldKey: 'average_view_duration',
      fieldType: 'float',
      encrypt: false
    }
  ],
  rows: [
    {
      values: ['2023-08-10T00:00:00Z', '474469db-abbb-4a50-bfb0-fb2c34b26f02', '961.1818181818181']
    }
  ]
};

export const uniqueViewsData = {
  total: 4,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'timestamp',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'unique_id',
      fieldType: 'string',
      encrypt: false
    }
  ],
  rows: [
    {
      values: [
        '2023-07-22T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '3'
      ]
    },
    {
      values: [
        '2023-07-19T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '0426350a-0112-4367-8af2-88c959b70d83'
      ]
    },
    {
      values: [
        '2023-07-18T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        'baa1deee-289a-452b-9c95-190ba185775f'
      ]
    },
    {
      values: [
        '2023-07-18T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Live',
        'baa1deee-289a-452b-9c95-190ba185775f'
      ]
    }
  ]
};

export const totalViewsDataPerWeek = {
  total: 4,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'timestamp',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
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
      values: [
        '2023-07-24T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '3'
      ]
    },
    {
      values: [
        '2023-07-27T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '5'
      ]
    },
    {
      values: [
        '2023-06-20T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '8'
      ]
    },
    {
      values: [
        '2023-06-19T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Live',
        '8'
      ]
    }
  ]
};

export const totalViewsDataPerMonth = {
  total: 5,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'timestamp',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
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
      values: [
        '2023-07-22T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '3'
      ]
    },
    {
      values: [
        '2023-07-19T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '5'
      ]
    },
    {
      values: [
        '2023-06-18T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '8'
      ]
    },
    {
      values: [
        '2023-05-30T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '8'
      ]
    },
    {
      values: [
        '2023-05-29T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Live',
        '10'
      ]
    }
  ]
};

export const viewsByDeviceTypePerDay: AnalyticsResponseData = {
  total: 5,
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
      fieldKey: 'device_type',
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
      values: ['2023-08-11T00:00:00Z', '01d33734-0105-4d98-b41b-71cdde80ca03', 'desktop', '4']
    },
    {
      values: ['2023-08-12T00:00:00Z', '01d33734-0105-4d98-b41b-71cdde80ca03', 'desktop', '9']
    },
    {
      values: ['2023-08-13T00:00:00Z', '01d33734-0105-4d98-b41b-71cdde80ca03', 'desktop', '10']
    },
    {
      values: ['2023-08-11T00:00:00Z', '01d33734-0105-4d98-b41b-71cdde80ca03', 'mobile', '111']
    },
    {
      values: ['2023-09-12T00:00:00Z', '01d33734-0105-4d98-b41b-71cdde80ca03', 'tablet', '99']
    }
  ]
};

export const uniqueViewsDataPerMonth = {
  total: 5,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'timestamp',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
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
      values: [
        '2023-07-22T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '3'
      ]
    },
    {
      values: [
        '2023-07-19T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '5'
      ]
    },
    {
      values: [
        '2023-06-18T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '8'
      ]
    },
    {
      values: [
        '2023-05-30T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '8'
      ]
    },
    {
      values: [
        '2023-05-29T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Live',
        '10'
      ]
    }
  ]
};

export const totalWatchDurationDataPerMonth = {
  total: 5,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'timestamp',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
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
      values: [
        '2023-07-22T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '3'
      ]
    },
    {
      values: [
        '2023-07-19T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '5'
      ]
    },
    {
      values: [
        '2023-06-18T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '8'
      ]
    },
    {
      values: [
        '2023-05-30T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '8'
      ]
    },
    {
      values: [
        '2023-05-29T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Live',
        '10'
      ]
    }
  ]
};

export const totalViewsEmptyData = {
  total: 0,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'int',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'total_views',
      fieldType: 'int',
      encrypt: false
    }
  ],
  rows: []
};

export const uniqueViewsEmptyData = {
  total: 0,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'int',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'unique_id',
      fieldType: 'string',
      encrypt: false
    }
  ],
  rows: []
};

export const totalWatchDurationEmptyData = {
  total: 0,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'int',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'total_duration',
      fieldType: 'string',
      encrypt: false
    }
  ],
  rows: []
};

export const totalWatchDurationData = {
  total: 5,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'timestamp',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'total_duration',
      fieldType: 'int',
      encrypt: false
    }
  ],
  rows: [
    {
      values: [
        '2023-07-22T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '3'
      ]
    },
    {
      values: [
        '2023-07-19T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '5'
      ]
    },
    {
      values: [
        '2023-06-18T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '8'
      ]
    },
    {
      values: [
        '2023-05-30T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '8'
      ]
    },
    {
      values: [
        '2023-05-29T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Live',
        '10'
      ]
    }
  ]
};

export const uniqueViewsDataPerWeek = {
  total: 4,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'timestamp',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'unique_id',
      fieldType: 'int',
      encrypt: false
    }
  ],
  rows: [
    {
      values: [
        '2023-07-24T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '3'
      ]
    },
    {
      values: [
        '2023-07-27T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '5'
      ]
    },
    {
      values: [
        '2023-06-20T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '8'
      ]
    },
    {
      values: [
        '2023-06-19T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Live',
        '8'
      ]
    }
  ]
};

export const totalWatchDurationDataPerWeek = {
  total: 4,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'timestamp',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'total_duration',
      fieldType: 'int',
      encrypt: false
    }
  ],
  rows: [
    {
      values: [
        '2023-07-24T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '3'
      ]
    },
    {
      values: [
        '2023-07-27T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '5'
      ]
    },
    {
      values: [
        '2023-06-20T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '8'
      ]
    },
    {
      values: [
        '2023-06-19T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Live',
        '8'
      ]
    }
  ]
};

export const audienceRetentionEmptyData = {
  rows: []
};

export const audienceRetentionUnorderData = {
  rows: [
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        39,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        1,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        19,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        41,
        4
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        15,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        35,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        36,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        28,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        9,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        21,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        43,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        40,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        45,
        3
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        52,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        2,
        4
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        47,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        44,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        27,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        3,
        4
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        49,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        12,
        3
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        25,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        59,
        3
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        16,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        26,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        18,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        11,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        8,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        17,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        30,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        23,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        20,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        29,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        33,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        6,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        58,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        32,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        50,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        0,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        7,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        57,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        48,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        5,
        3
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        54,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        46,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        55,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        56,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        4,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        34,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        13,
        1
      ]
    }
  ]
};

export const audienceRetentionLiveData = {
  rows: [
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        39,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        16,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        26,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        18,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        11,
        1
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        12,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        8,
        2
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        11,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        1,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        19,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        17,
        1
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        15,
        1
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        2,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        30,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        41,
        4
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        23,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        20,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        29,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        15,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        35,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        36,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        33,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        6,
        1
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        14,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        28,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        9,
        2
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        3,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        21,
        1
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        1,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        43,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        40,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        58,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        32,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        45,
        3
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        52,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        2,
        4
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        47,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        50,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        44,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        27,
        2
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        13,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        7,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        3,
        4
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        49,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        57,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        48,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        5,
        3
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        54,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        12,
        3
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        46,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        55,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        25,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        56,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        4,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        34,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        59,
        3
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        13,
        1
      ]
    }
  ]
};

export const audienceRetentionData = {
  rows: [
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        39,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        16,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        26,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        18,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        11,
        1
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        12,
        1
      ]
    },
    {
      values: [
        '2023-08-03T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Recording',
        0,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        8,
        2
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        11,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        1,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        19,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        17,
        1
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        15,
        1
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        2,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        30,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        41,
        4
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        23,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        20,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        29,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        15,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        35,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        36,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        33,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        6,
        1
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        14,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        28,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        9,
        2
      ]
    },
    {
      values: [
        '2023-08-14T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Recording',
        1,
        1
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        3,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        21,
        1
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        1,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        43,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        40,
        2
      ]
    },
    {
      values: [
        '2023-08-14T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Recording',
        0,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        58,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        32,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        45,
        3
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        52,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        2,
        4
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        47,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        50,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        44,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        27,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        0,
        2
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        13,
        1
      ]
    },
    {
      values: [
        '2023-08-14T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Recording',
        3,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        7,
        1
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        0,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        3,
        4
      ]
    },
    {
      values: [
        '2023-08-02T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Recording',
        0,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        49,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        57,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        48,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        5,
        3
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        54,
        1
      ]
    },
    {
      values: [
        '2023-08-14T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Recording',
        2,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        12,
        3
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        46,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        55,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        25,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        56,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        4,
        2
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        34,
        1
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        59,
        3
      ]
    },
    {
      values: [
        '2023-08-01T00:00:00Z',
        'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        'fac444ac-cdee-461e-90c4-4bafb28b7f6a',
        'Live',
        13,
        1
      ]
    }
  ]
};

export const averageViewDurationData = {
  total: 4,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'timestamp',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'average_view_duration',
      fieldType: 'int',
      encrypt: false
    }
  ],
  rows: [
    {
      values: [
        '2023-07-22T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '10'
      ]
    },
    {
      values: [
        '2023-07-19T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '8'
      ]
    },
    {
      values: [
        '2023-07-18T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '2'
      ]
    },
    {
      values: [
        '2023-07-18T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Live',
        '20'
      ]
    }
  ]
};

export const averageViewDurationDataPerWeek = {
  total: 4,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'timestamp',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'average_view_duration',
      fieldType: 'int',
      encrypt: false
    }
  ],
  rows: [
    {
      values: [
        '2023-07-24T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '24'
      ]
    },
    {
      values: [
        '2023-07-27T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '6'
      ]
    },
    {
      values: [
        '2023-06-20T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '12'
      ]
    },
    {
      values: [
        '2023-06-19T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Live',
        '15'
      ]
    }
  ]
};

export const averageViewDurationDataPerMonth = {
  total: 5,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'timestamp',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'average_view_duration',
      fieldType: 'int',
      encrypt: false
    }
  ],
  rows: [
    {
      values: [
        '2023-07-22T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '23'
      ]
    },
    {
      values: [
        '2023-07-19T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '6'
      ]
    },
    {
      values: [
        '2023-06-18T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '8'
      ]
    },
    {
      values: [
        '2023-05-30T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Recording',
        '16'
      ]
    },
    {
      values: [
        '2023-05-29T00:00:00Z',
        '0426350a-0112-4367-8af2-88c959b70d83',
        'baa1deee-289a-452b-9c95-190ba185775f',
        'Live',
        '12'
      ]
    }
  ]
};

export const averageViewDurationEmptyData = {
  total: 0,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'int',
      encrypt: false
    },
    {
      fieldKey: 'mapping_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'video_id',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'view_type',
      fieldType: 'string',
      encrypt: false
    },
    {
      fieldKey: 'average_view_duration',
      fieldType: 'int',
      encrypt: false
    }
  ],
  rows: []
};

export const viewsBySourceData = {
  total: 2041,
  fields: [
    {
      fieldKey: 'time_window_per_day',
      fieldType: 'timestamp',
      encrypt: false
    },
    { fieldKey: 'total_views', fieldType: 'int', encrypt: false },
    { fieldKey: 'entity_type', fieldType: 'string', encrypt: false },
    { fieldKey: 'entity_id', fieldType: 'string', encrypt: false },
    { fieldKey: 'view_type', fieldType: 'string', encrypt: false }
  ],
  rows: [
    {
      values: ['2023-08-14T00:00:00Z', 1, 'Events+', 'f441d970-c0db-4f7c-bf9c-eb819780db51', 'Recording']
    },
    {
      values: ['2023-08-02T00:00:00Z', 2, 'session', '85dd9f44-fce1-4d40-bc60-a4192b5f3229', 'Live']
    },
    {
      values: ['2023-08-01T00:00:00Z', 10, 'session', '71dbb3cb-fb37-4c26-8557-b5fa65dc7ab9', 'Live']
    },
    {
      values: ['2023-08-02T00:00:00Z', 1, 'session', '71dbb3cb-fb37-4c26-8557-b5fa65dc7ab9', 'Recording']
    }
  ]
};
