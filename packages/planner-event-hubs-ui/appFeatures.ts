/**
 * App feature versions based on the metadata of the events_plus_feature_version experiment.
 */
export const appFeatures = {
  // Features that are 100% enabled in all production environments
  // without any exclusions. This list of experiments should be
  // removed from the codebase whenever possible.
  generatedCaptionsFeature: true, // Vroom

  // Ready for release
  hubOverviewFeature: 24, // Mauve
  languageManagementFeature: 29, // Red
  cookieNotificationFeature: 33, // Mauve
  homepageCustomizationFeature: 35, // Red
  singleSignOnFeature: 38, // Mauve
  cookieListFeature: 41, // Mauve
  languageManagementImportFeature: 41, // Red
  memberListRemoveFeature: 42, // Mauve

  // Currently, in development
  analyticsFeature: 1001, // Vroom
  searchEngineVisibility: 1001, // Mauve
  coreTestFeature: 1001, // Vroom // To do: To be removed after core session work HUB-61261 is complete

  defaultLandingPageFeature: 1001, // Mauve
  videoCenterInformationFeature: 1001, // Mauve
  renovateHubOverviewFeature: 1001, // Mauve

  enableMultiLanguageFeature: {
    experimentName: 'events_plus_multi_language_management_feature',
    version: 1
  }, // Red
  videoAnalyticsMaterializedViewsPipeline: {
    experimentName: 'video_analytics_materialized_views_pipeline', // VRoom
    version: 1
  } // VRoom
};
