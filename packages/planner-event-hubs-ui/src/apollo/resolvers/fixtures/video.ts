import { VideoSourceStatus, VideoStatus, VideoType } from '@cvent/planner-event-hubs-model/types';

export default {
  id: '5b05a24c-ae9f-40ca-99cb-2f64f8c17391',
  url: {
    href: 'b45fd6ef-989d-4890-ae48-a7d0ed5e3f03/ec494bd9-a3b2-4fbe-a0e2-261a77bc9048/5b05a24c-ae9f-40ca-99cb-2f64f8c17391/video.mp4'
  },
  sessions: ['aa687534-bad0-4972-bd19-355fa5520536'],
  exhibitors: [],
  speakers: [],
  uploadStarted: '2022-03-10T19:24:09.102Z',
  uploadCompleted: '2022-03-10T19:29:56.857Z',
  created: '2022-03-10T19:24:09.102Z',
  lastModified: '2022-03-10T19:29:56.858Z',
  title: 's s s.mp4',
  type: VideoType.Mp4,
  event: {
    id: 'ec494bd9-a3b2-4fbe-a0e2-261a77bc9048'
  },
  events: ['ec494bd9-a3b2-4fbe-a0e2-261a77bc9048'],
  duration: 145519,
  generatedThumbnail: {
    url: {
      href: 'https://cf-images.us-east-1.prod.boltdns.net/v1/jit/6178828595001/e3dc3155-c32a-4e29-bb95-c55098e8b471/main/1280x720/1m12s759ms/match/image.jpg'
    }
  },
  status: VideoStatus.Available,
  source: {
    id: '6300260194001',
    status: VideoSourceStatus.Active
  },
  encodingProfile: 'Planner'
};
