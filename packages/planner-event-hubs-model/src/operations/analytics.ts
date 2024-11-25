import { gql } from '@apollo/client';

export const getTotalViewsQuery = gql`
  query getTotalViews($input: AnalyticsInput!) {
    totalViewsByHubId(input: $input) {
      perDay {
        date
        value
      }
      perWeek {
        date
        value
      }
      perMonth {
        date
        value
      }
      total
      serverError
    }
  }
`;

export const averageViewDurationByHubId = gql`
  query averageViewDurationByHubId($input: AnalyticsInput!) {
    averageViewDurationByHubId(input: $input) {
      perDay {
        date
        value
      }
      perWeek {
        date
        value
      }
      perMonth {
        date
        value
      }
      total
      serverError
    }
  }
`;

export const topFiveVideosViewedByHubId = gql`
  query topFiveVideosViewedByHubId($input: AnalyticsInput!) {
    topFiveVideosViewedByHubId(input: $input) {
      topVideos {
        videoId
        videoName
        totalViews
        currentPosition
        previousPosition
      }
      serverError
    }
  }
`;

export const getRegistrationCount = gql`
  query getRegistrationCount($input: RegistrationCountRequest!) {
    getRegistrationCount(input: $input) {
      perDay {
        date
        value
      }
      perWeek {
        date
        value
      }
      perMonth {
        date
        value
      }
      total
      serverError
    }
  }
`;

export const viewsByDeviceType = gql`
  query viewsByDeviceType($input: AnalyticsInput!) {
    viewsByDeviceType(input: $input) {
      desktopViews
      tabletViews
      mobileViews
      totalViews
      serverError
    }
  }
`;

export const videosViewDetailsByHubId = gql`
  query videosViewDetailsByHubId($input: AnalyticsInput!) {
    videosViewDetailsByHubId(input: $input) {
      data {
        videoId
        videoTitle
        thumbnail
        views
        videoDuration
      }
      serverError
    }
  }
`;

export const memberVideoWatchDurationByHubId = gql`
  query memberVideoWatchDurationByHubId($input: MemberWatchInput!) {
    memberVideoWatchDurationByHubId(input: $input) {
      data {
        id
        duration
        percentage
        firstName
        lastName
        email
      }
      serverError
    }
  }
`;
