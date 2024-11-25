export const variantSearchResponse = [
  {
    experimentName: 'test_experiment_1',
    variants: [
      {
        hashId: 'testHubId',
        variant: {
          id: 0,
          include: [],
          exclude: []
        }
      },
      {
        hashId: 1234,
        variant: {
          id: 1,
          description: 'On',
          weight: 100.0,
          include: [1234],
          exclude: [],
          metadata: {
            version: 1
          }
        }
      }
    ]
  },
  {
    experimentName: 'test_experiment_2',
    variants: [
      {
        hashId: 'testHubId',
        variant: {
          id: 0,
          include: [],
          exclude: []
        }
      },
      {
        hashId: 1234,
        variant: {
          id: 0,
          include: [],
          exclude: []
        }
      }
    ]
  }
];
