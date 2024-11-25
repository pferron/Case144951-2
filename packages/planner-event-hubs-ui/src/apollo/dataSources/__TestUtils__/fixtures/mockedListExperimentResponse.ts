export const testAccountId = '801492052';
export const testHubId = 'hubId';
export const mockedListResponse = [
  {
    // experiment with 100% weight on with no includes/excludes. All variants should be the same but the account
    // variant should be returned
    experimentName: 'test_experiment_1',
    variants: [
      {
        hashId: testAccountId,
        variant: {
          id: 1,
          description: 'On (test to verify account one is returned)',
          weight: 100.0,
          include: [],
          exclude: [],
          metadata: {
            version: 1
          }
        }
      },
      {
        hashId: testHubId,
        variant: {
          id: 1,
          description: 'On',
          weight: 0,
          include: [],
          exclude: [],
          metadata: {
            version: 1
          }
        }
      }
    ]
  },
  {
    // the On variant is excluding the hubId. The hub variant will be returned since the account variant is
    // explicitly excluding the hubId
    experimentName: 'test_experiment_2',
    variants: [
      {
        hashId: testAccountId,
        variant: {
          id: 1,
          description: 'On',
          weight: 50.0,
          include: [],
          exclude: [testHubId],
          metadata: {
            version: 1
          }
        }
      },
      {
        hashId: testHubId,
        variant: {
          id: 0,
          description: 'Off',
          weight: 50,
          include: [],
          exclude: [],
          metadata: {
            version: 5
          }
        }
      }
    ]
  },
  {
    // The hub variant to be returned since it is explicitly including the hubId
    experimentName: 'test_experiment_3',
    variants: [
      {
        hashId: testAccountId,
        variant: {
          id: 0,
          description: 'Off',
          weight: 100.0,
          include: [],
          exclude: [],
          metadata: {
            version: 1
          }
        }
      },
      {
        hashId: testHubId,
        variant: {
          id: 1,
          description: 'On',
          weight: 0,
          include: [testHubId],
          exclude: [],
          metadata: {
            version: 4
          }
        }
      }
    ]
  },
  {
    experimentName: 'test_experiment_4',
    variants: [
      {
        hashId: testAccountId,
        variant: {
          id: 0,
          description: 'Off',
          weight: 100.0,
          include: [],
          exclude: [],
          metadata: {
            version: 1
          }
        }
      },
      {
        hashId: testHubId,
        variant: {
          id: 0,
          description: 'Off',
          weight: 100.0,
          include: [],
          exclude: [],
          metadata: {
            version: 1
          }
        }
      }
    ]
  },
  {
    // experiment does not exist or is not deployed
    experimentName: 'test_experiment_5',
    variants: [
      {
        hashId: testAccountId,
        variant: {
          id: 0,
          include: [],
          exclude: []
        }
      },
      {
        hashId: testHubId,
        variant: {
          id: 0,
          include: [],
          exclude: []
        }
      }
    ]
  }
];
