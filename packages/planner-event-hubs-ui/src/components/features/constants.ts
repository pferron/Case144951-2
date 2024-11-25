export const FEATURES = Object.freeze({
  MEMBER: 'PROFILE_SETUP',
  YOUR_EVENTS: 'YOUR_EVENTS',
  UPCOMING_EVENTS: 'UPCOMING_EVENTS',
  CONNECTIONS: 'CONNECTIONS'
});

export const MEMBER_PROFILE_URL = '/features/member-profile';
export const UPCOMING_EVENTS_URL = '/features/upcoming-events';
export const FEATURE_CARD_DESIGN_ARRAY = [
  // title, description, buttonText/buttonAccessibilityLabel should be updated according phrase keys
  {
    title: 'feature_member_card_title',
    description: 'feature_member_card_description',
    featureCardTestID: 'member-feature-card',
    featureCardName: FEATURES.MEMBER,
    featureCardButtonStatus: true,
    featureCardButtonDisabled: true,
    route: MEMBER_PROFILE_URL
  },
  {
    title: 'your_events_title',
    description: 'your_events_description',
    featureCardTestID: 'your-events-feature-card',
    featureCardName: FEATURES.YOUR_EVENTS,
    featureCardButtonDisabled: false,
    featureCardButtonStatus: false
  },
  {
    title: 'connections_title',
    description: 'connections_description',
    featureCardTestID: 'connections-feature-card',
    featureCardName: FEATURES.CONNECTIONS,
    featureCardButtonDisabled: false,
    featureCardButtonStatus: false
  },
  {
    title: 'upcoming_events_title',
    description: 'upcoming_events_description',
    featureCardTestID: 'upcoming-events-feature-card',
    featureCardName: FEATURES.UPCOMING_EVENTS,
    featureCardButtonStatus: true,
    featureCardButtonDisabled: false,
    route: UPCOMING_EVENTS_URL
  }
];
