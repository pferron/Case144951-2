import gql from 'graphql-tag';

export default gql`
  extend type Query {
    getVideos(filterInput: VideoFilterInput): PaginatedVideos @auth(methods: [BEARER])
  }

  type Video {
    id: ID!
    title: String
    description: String
    catalogs: [VideoCatalog]
    sessions: [ID]
    exhibitors: [ID]
    speakers: [ID]
    sourceProvider: SourceProvider
    events: [ID]
    duration: Int
    thumbnail: Thumbnail
    generatedThumbnail: Thumbnail
    status: VideoStatus
    tags: [String]
    source: VideoSource
    created: String
    createdBy: String
    lastModified: String
    lastModifiedBy: String
    totalSize: String
    originalSize: String
  }

  type Url {
    href: String
  }
  type Link {
    url: Url
  }
  enum VideoStatus {
    Started
    Uploaded
    Scanning
    Scanned
    Syncing
    Rejected
    Error
    Available
    Upcoming
    ReSyncing
  }
  enum VideoSourceStatus {
    Active
    Inactive
    Pending
    Deleted
  }
  enum VideoType {
    mpg2
    mov
    mp2
    mp4
    mpe
    mpeg
    mpg
    mpv
    qt
    webm
    hls
  }
  type VideoSource {
    id: String
    status: VideoSourceStatus
  }
  type Instance {
    id: String!
  }
  type VideoPlaybackInfo {
    id: String!
    url: Url
    sessions: [String]
    exhibitors: [String]
    uploadStarted: String
    uploadCompleted: String
    created: String
    lastModified: String
    title: String!
    description: String
    type: VideoType
    event: Instance
    thumbnail: Link
    duration: Float
    generatedThumbnail: Link
    status: VideoStatus
    source: VideoSource
  }

  type VideoRenditionResponse {
    location: Url
    type: String
  }

  input VideoInput {
    videoId: ID!
  }

  input VideoFilterInput {
    filter: String
    sort: String
    limit: Int
    token: String
    after: String
    before: String
  }

  type VideoCatalog {
    id: String
    channel: VideoChannel
    section: VideoSection
    videoCenters: [ID]
  }

  type PaginatedVideos {
    paging: PagingResponse!
    data: [Video]!
  }

  type VideoChannel {
    id: String
    status: ChannelStatus
  }
  type VideoSection {
    id: String
  }
  type VideoCatalog {
    id: String
    channel: VideoChannel
    section: VideoSection
    videoCenters: [ID]
  }
  enum SourceProvider {
    BRIGHTCOVE
    CVENT_VIDEO
  }

  type Thumbnail {
    url: Url
  }

  type Video {
    id: ID!
    title: String
    description: String
    catalogs: [VideoCatalog]
    sessions: [ID]
    exhibitors: [ID]
    speakers: [ID]
    sourceProvider: SourceProvider
    events: [ID]
    duration: Int
    thumbnail: Thumbnail
    generatedThumbnail: Thumbnail
    status: VideoStatus
    tags: [String]
    source: VideoSource
    created: String
    createdBy: String
    lastModified: String
    lastModifiedBy: String
    totalSize: String
    originalSize: String
  }

  input RelatedVideoSearch {
    videoCenterId: ID!
    videoId: ID!
  }

  input RecentVideoSearch {
    videoCenterId: ID!
    token: String
  }

  type PaginatedVideos {
    paging: PagingResponse!
    data: [Video]!
  }
`;
