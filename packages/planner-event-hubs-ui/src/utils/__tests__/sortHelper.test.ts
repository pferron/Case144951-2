import { sortObject } from '../sortHelper';
import textTrackListData from './fixtures/TextTrackListData.json';

describe('sort given object', (): void => {
  test('sort tracks alphabetically by label', async (): Promise<void> => {
    const mockedResult = [
      {
        id: '52a5da6e-82cc-4b34-86df-08dfdacd40a6',
        url: {
          href: 'mockUrl'
        },
        video: {
          id: 'a2d87aed-f1b2-4d4f-a804-19f31573ef5f'
        },
        label: 'Albania',
        language: 'sq-Al',
        kind: 'captions',
        default: false,
        status: 'Available',
        created: '2022-07-11T21:13:28.279Z',
        createdBy: null,
        lastModified: '2022-07-11T21:13:32.762Z',
        lastModifiedBy: null
      },
      {
        id: 'fe895aa8-32e9-11ed-a261-0242ac120002',
        url: {
          href: 'mockUrl'
        },
        video: {
          id: 'a2d87aed-f1b2-4d4f-a804-19f31573ef5f'
        },
        label: 'Chinese',
        language: 'zh-CN',
        kind: 'captions',
        default: false,
        status: 'Processing',
        created: '2022-07-11T21:59:35.355Z',
        createdBy: null,
        lastModified: '2022-07-11T21:59:40.174Z',
        lastModifiedBy: null
      },
      {
        id: '85c79c19-4001-46a5-bdd6-9de174de88d3',
        url: {
          href: 'mockUrl'
        },
        video: {
          id: 'a2d87aed-f1b2-4d4f-a804-19f31573ef5f'
        },
        label: 'Dutch',
        language: 'nl',
        kind: 'captions',
        default: false,
        status: 'Started',
        created: '2022-07-11T21:59:35.355Z',
        createdBy: null,
        lastModified: '2022-07-11T21:59:40.174Z',
        lastModifiedBy: null
      },
      {
        id: '958f5a24-2f33-49b8-83d9-ae04c33b6775',
        url: {
          href: 'mockUrl'
        },
        video: {
          id: 'a2d87aed-f1b2-4d4f-a804-19f31573ef5f'
        },
        label: 'English',
        language: 'en-US',
        kind: 'captions',
        default: false,
        status: 'Available',
        created: '2022-07-11T21:23:50.696Z',
        createdBy: null,
        lastModified: '2022-07-11T21:24:10.243Z',
        lastModifiedBy: null
      },
      {
        id: '7093acda-32e9-11ed-a261-0242ac120002',
        url: {
          href: 'mockUrl'
        },
        video: {
          id: 'a2d87aed-f1b2-4d4f-a804-19f31573ef5f'
        },
        label: 'German',
        language: 'de-DE',
        kind: 'captions',
        default: false,
        status: 'Uploaded',
        created: '2022-07-11T21:58:47.286Z',
        createdBy: null,
        lastModified: '2022-07-11T21:58:51.761Z',
        lastModifiedBy: null
      },
      {
        id: '4bbfc16f-b997-4eed-b06a-6733f9530db9',
        url: {
          href: 'mockUrl'
        },
        video: {
          id: 'a2d87aed-f1b2-4d4f-a804-19f31573ef5f'
        },
        label: 'Thai',
        language: 'th-TH',
        kind: 'captions',
        default: false,
        status: 'Available',
        created: '2022-07-11T21:23:25.334Z',
        createdBy: null,
        lastModified: '2022-07-11T21:23:30.139Z',
        lastModifiedBy: null
      }
    ];

    const sortedTracks = sortObject(textTrackListData.data, 'label');
    expect(sortedTracks).toBeTruthy();
    expect(sortedTracks).toEqual(mockedResult);
  });
});
