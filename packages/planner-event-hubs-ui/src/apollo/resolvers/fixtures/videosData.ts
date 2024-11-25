import { ChannelStatus, PaginatedVideos, SourceProvider, VideoStatus } from '@cvent/planner-event-hubs-model/types';

export const videosResponseData: PaginatedVideos = {
  paging: {
    limit: 100,
    totalCount: 1,
    currentToken: '4cb17e75-f492-4e1a-a952-a47e02415ec7'
  },
  data: [
    {
      catalogs: [
        {
          id: '8b730bc8-b719-11ec-aa51-d3b5d2be1a39',
          section: {
            id: '15beff7a-b711-11ec-ab03-f7e2c8ea09c5'
          },
          channel: {
            id: 'ba0095a2-b712-11ec-9845-4797fe0d5459',
            status: ChannelStatus.Active
          },
          videoCenters: ['407d31fa-b711-11ec-9e96-dbbf315602d1']
        },
        {
          id: '8b730c72-b719-11ec-aa55-2361b651ab1c',
          section: {
            id: '15bf0060-b711-11ec-ab09-f3dae5b58d2b'
          },
          channel: {
            id: 'ba009778-b712-11ec-9849-e370ef119d7b',
            status: ChannelStatus.Active
          },
          videoCenters: ['407d33d0-b711-11ec-9e98-bfe14d96ad7a']
        }
      ],
      created: '2015-03-08T23:59:59.000Z',
      lastModified: '2015-10-13T12:10:30.000Z',
      title: 'all-powerful Pointing',
      description:
        'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar. The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane. Pityful a rethoric question ran over her cheek, then',
      events: ['738cbd80-b712-11ec-be78-7b5cdcbc9bee'],
      duration: 2334,
      thumbnail: {
        url: {
          href: 'https://video-sync-upload-bucket-sandbox.s3.amazonaws.com/T2/https%3A//picsum.photos/200/306'
        }
      },
      generatedThumbnail: {
        url: {
          href: 'https://picsum.photos/200/306/'
        }
      },
      status: VideoStatus.Available,
      tags: ['amazing'],
      totalSize: '3820206',
      id: 'fa05c0a2-b710-11ec-9cf6-4fcef4e44b4e',
      sessions: ['738cbd80-b712-11ec-be78-7b5cdcbc9bee'],
      exhibitors: ['738cbd80-b712-11ec-be78-7b5cdcbc9bee'],
      speakers: ['738cbd80-b712-11ec-be78-7b5cdcbc9bee'],
      sourceProvider: SourceProvider.CventVideo
    }
  ]
};
