import {
  DefaultLandingPage,
  NavigationAlignment,
  NavigationLinkHighlightStyle,
  Settings
} from '@cvent/planner-event-hubs-model/types';

export interface CenterConfigs {
  privacySettings: Settings;
  features: Record<string, boolean>;
}

export interface S3PreSignedResponse {
  location: string;
  relativePath: string;
}

interface NavigationLink {
  url?: string;
  isEnabled: boolean;
}

/**
 * The variable names should be same as key defined below in 'customNavigationTableData', as it helps identifying
 * the key to update in the state.
 */
export interface BrandingCustomNavigation {
  defaultLandingPage?: DefaultLandingPage;
  logo?: NavigationLink;
  loginRegistration?: NavigationLink;
  homePage?: NavigationLink;
  upcomingEvents?: NavigationLink;
  channels?: NavigationLink;
  videos?: NavigationLink;
}

export interface BrandingAdvancedOptions {
  navigationAlignment?: NavigationAlignment;
  navigationLinkHighlightStyle?: NavigationLinkHighlightStyle;
  navigationLinkTextSize?: string;
  navigationHeaderLeftPadding?: string;
  navigationHeaderRightPadding?: string;
  navigationHeaderMaxWidth?: string;
}

export enum PreviewSize {
  s = 's',
  l = 'l',
  xl = 'xl'
}
