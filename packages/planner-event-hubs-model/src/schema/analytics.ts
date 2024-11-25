import gql from 'graphql-tag';

export default gql`
  scalar DateTime

  type Query {
    totalViewsByHubId(input: AnalyticsInput!): AnalyticsData @auth(methods: [BEARER], roles: ["video-center:read"])

    topFiveVideosViewedByHubId(input: AnalyticsInput!): TopVideosResponse
      @auth(methods: [BEARER], roles: ["video-center:read"])

    averageViewDurationByHubId(input: AnalyticsInput!): AnalyticsData
      @auth(methods: [BEARER], roles: ["video-center:read"])

    viewsByDeviceType(input: AnalyticsInput!): ViewsBySourceResponse
      @auth(methods: [BEARER], roles: ["video-center:read"])

    videosViewDetailsByHubId(input: AnalyticsInput!): VideoCountData
      @auth(methods: [BEARER], roles: ["video-center:read"])

    memberVideoWatchDurationByHubId(input: MemberWatchInput!): MemberWatchDurationData
      @auth(methods: [BEARER], roles: ["video-center:read"])
  }

  input AnalyticsInput {
    hubId: ID!
    startDate: DateTime!
    endDate: DateTime!
    pipeline: String
  }

  type AnalyticsDataItem {
    date: DateTime!
    value: Float!
  }

  type AnalyticsData {
    perDay: [AnalyticsDataItem!]
    perWeek: [AnalyticsDataItem!]
    perMonth: [AnalyticsDataItem!]
    total: Float
    serverError: Boolean
  }

  type ViewsBySourceResponse {
    desktopViews: Int
    tabletViews: Int
    mobileViews: Int
    totalViews: Float
    serverError: Boolean
  }
  type TopVideos {
    videoId: String!
    videoName: String
    totalViews: Int
    previousPosition: Int
    currentPosition: Int
  }

  type TopVideosResponse {
    topVideos: [TopVideos]
    serverError: Boolean
  }

  type VideoAnalyticsItem {
    videoId: ID
    videoTitle: String
    thumbnail: String
    views: Int
    videoDuration: Int
  }

  type VideoCountData {
    data: [VideoAnalyticsItem]
    serverError: Boolean
  }

  input MemberWatchInput {
    videoId: ID!
    videoDuration: Int!
    filter: AnalyticsInput!
  }

  type MemberVideoWatchData {
    id: ID
    firstName: String
    lastName: String
    email: String
    duration: Int
    percentage: Float
  }

  type MemberWatchDurationData {
    data: [MemberVideoWatchData]
    serverError: Boolean
  }
`;
