// MAUVE
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import BrandingLogoIcon from '@cvent/multi-dimensional-profile/icons/BrandingLogoIcon';
import BrandingNoneIcon from '@cvent/multi-dimensional-profile/icons/BrandingNoneIcon';
import BorderStraightIcon from '@cvent/multi-dimensional-profile/icons/BorderStraightIcon';
import AlignmentCenterIcon from '@cvent/multi-dimensional-profile/icons/AlignmentCenterIcon';
import AlignmentLeftIcon from '@cvent/multi-dimensional-profile/icons/AlignmentLeftIcon';
import BorderSlantedIcon from '@cvent/multi-dimensional-profile/icons/BorderSlantedIcon';
import { OptionItems } from '@components/member-profile/MemberProfileContainer';
import { Theme } from '@cvent/carina/components/ThemeProvider';

export {
  BorderSlantedIcon,
  BorderStraightIcon,
  AlignmentLeftIcon,
  AlignmentCenterIcon,
  BrandingNoneIcon,
  BrandingLogoIcon
};
export const FULL_NAME = 'Mrs. Ranae Carter Monroe, PhD';
export const DESKTOP_SCREEN_WIDTH = 1079;

export const getBorderOptionsArray = (
  theme: Theme,
  translate: any,
  includeHeader = false,
  viewOnly = false
): Array<OptionItems> => [
  {
    label: translate('profile_design_slanted_label'),
    value: 'slanted',
    disabled: viewOnly,
    testID: 'border-slanted-design-card',
    icon: <BorderSlantedIcon color={theme.colors.interactive['45']} />,
    headerText: includeHeader ? translate('profile_card_border') : null
  },
  {
    label: translate('profile_design_straight_label'),
    value: 'straight',
    disabled: viewOnly,
    testID: 'border-straight-design-card',
    icon: <BorderStraightIcon color={theme.colors.interactive['45']} />,
    headerText: includeHeader ? translate('profile_card_border') : null
  }
];

export const getBorderOptionSlanted = (
  theme: Theme,
  translate: any,
  includeHeader = false,
  viewOnly = false
): Array<OptionItems> => [
  {
    label: '',
    value: 'slanted',
    disabled: viewOnly,
    testID: 'border-slanted-design-card',
    icon: <BorderSlantedIcon color={theme.colors.interactive['45']} />,
    headerText: includeHeader ? translate('profile_card_border') : null
  }
];

export const getBorderOptionStraight = (
  theme: Theme,
  translate: any,
  includeHeader = false,
  viewOnly = false
): Array<OptionItems> => [
  {
    label: '',
    value: 'straight',
    disabled: viewOnly,
    testID: 'border-straight-design-card',
    icon: <BorderStraightIcon color={theme.colors.interactive['45']} />,
    headerText: includeHeader ? translate('profile_card_border') : null
  }
];

export const getBrandingOptionsArray = (
  theme: Theme,
  translate: any,
  includeHeader = false,
  viewOnly = false
): Array<OptionItems> => [
  {
    label: translate('profile_design_logo_label'),
    value: 'logo',
    disabled: viewOnly,
    testID: 'branding-logo-design-card',
    icon: <BrandingLogoIcon color={theme.colors.interactive['45']} />,
    headerText: includeHeader ? translate('profile_card_branding') : null
  },
  {
    label: translate('profile_design_none_label'),
    value: 'none',
    disabled: viewOnly,
    testID: 'branding-none-design-card',
    icon: <BrandingNoneIcon />,
    headerText: includeHeader ? translate('profile_card_branding') : null
  }
];

export const getBrandingOptionLogo = (
  theme: Theme,
  translate: any,
  includeHeader = false,
  viewOnly = false
): Array<OptionItems> => [
  {
    label: '',
    value: 'logo',
    disabled: viewOnly,
    testID: 'branding-logo-design-card',
    icon: <BrandingLogoIcon color={theme.colors.interactive['45']} />,
    headerText: includeHeader ? translate('profile_card_branding') : null
  }
];

export const getBrandingOptionNone = (
  theme: Theme,
  translate: any,
  includeHeader = false,
  viewOnly = false
): Array<OptionItems> => [
  {
    label: '',
    value: 'none',
    disabled: viewOnly,
    testID: 'branding-none-design-card',
    icon: <BrandingNoneIcon />,
    headerText: includeHeader ? translate('profile_card_branding') : null
  }
];

export const getAlignmentOptionsArray = (
  theme: Theme,
  translate: any,
  includeHeader = false,
  viewOnly = false
): Array<OptionItems> => [
  {
    label: translate('profile_design_center_label'),
    value: 'center',
    disabled: viewOnly,
    testID: 'alignment-center-design-card',
    icon: <AlignmentCenterIcon color={theme.colors.interactive['45']} />,
    headerText: includeHeader ? translate('profile_card_alignment') : null
  },
  {
    label: translate('profile_design_left_label'),
    value: 'left',
    disabled: viewOnly,
    testID: 'alignment-left-design-card',
    icon: <AlignmentLeftIcon color={theme.colors.interactive['45']} />,
    headerText: includeHeader ? translate('profile_card_alignment') : null
  }
];

export const getAlignmentOptionCenter = (
  theme: Theme,
  translate: any,
  includeHeader = false,
  viewOnly = false
): Array<OptionItems> => [
  {
    label: '',
    value: 'center',
    disabled: viewOnly,
    testID: 'alignment-center-design-card',
    icon: <AlignmentCenterIcon color={theme.colors.interactive['45']} />,
    headerText: includeHeader ? translate('profile_card_alignment') : null
  }
];

export const getAlignmentOptionLeft = (
  theme: Theme,
  translate: any,
  includeHeader = false,
  viewOnly = false
): Array<OptionItems> => [
  {
    label: '',
    value: 'left',
    disabled: viewOnly,
    testID: 'alignment-left-design-card',
    icon: <AlignmentLeftIcon color={theme.colors.interactive['45']} />,
    headerText: includeHeader ? translate('profile_card_alignment') : null
  }
];

export const getCardContent = (translate: any) => [
  {
    title: translate('member_profile_name_card'),
    body: translate('member_profile_name_text'),
    testID: 'name-card',
    required: true,
    switchValue: 'showName',
    allowCardValue: 'allowNameEdit'
  },
  {
    title: translate('member_profile_job_card'),
    body: translate('member_profile_job_text'),
    testID: 'job-card',
    switchValue: 'showJobTitle',
    responseAction: 'responseAction',
    radioAction: 'radioAction',
    allowCardValue: 'allowJobTitleEdit'
  },
  {
    title: translate('member_profile_company_card'),
    body: translate('member_profile_company_text'),
    testID: 'company-card',
    switchValue: 'showCompany',
    responseAction: 'responseAction',
    radioAction: 'radioAction',
    allowCardValue: 'allowCompanyEdit'
  },
  {
    title: translate('member_profile_social_media_card'),
    body: translate('member_profile_social_media_text'),
    testID: 'social-media-card',
    switchValue: 'showSocialMediaLinks',
    responseAction: 'responseAction',
    radioAction: 'radioAction',
    allowCardValue: 'allowSocialMediaEdit'
  }
];

// some text is intentionally kept blank since not being used in preview
export const getPreviewContent = (translate: any) => ({
  visibility: {
    testID: 'member-visibility',
    visibleContent: {
      title: translate('member_visibility_visible_title'),
      description: translate('member_visibility_visible_description')
    },
    hiddenContent: {
      title: translate('member_visibility_hidden_title'),
      description: translate('member_visibility_hidden_description')
    },
    visibleSwitchText: translate('member_visibility_visible_switch_text'),
    hiddenSwitchText: translate('member_visibility_hidden_switch_text'),
    accessibilityLabel: translate('member_visibility_visible_title'),
    memberVisibilityTitle: translate('member_visibility_settings')
  },
  memberProfileModal: {
    modalAriaLabel: '',
    dismissButtonLabel: ''
  },
  profileCard: {
    testId: '',
    hiddenMemberContent: { header: '', body: '', iconColor: '' }
  },
  socialLinksEdit: {
    translatedContent: {
      profileHttpsAlert: '',
      profileRequiredFieldsAlert: '',
      profileIncorrectUrlAlert: '',
      profileSocialMedia: '',
      socialLinksPlaceholderText: '',
      profileFormFacebookLabel: '',
      profileFormTwitterLabel: '',
      profileFormLinkedinLabel: '',
      profileFormWebsiteLabel: '',
      remainingLengthMessage: ''
    }
  },
  socialLinks: {
    testID: '',
    title: '',
    socialAccessibilityLabels: {
      facebookIcon: translate('member_profile_facebook_icon'),
      twitterIcon: translate('member_profile_twitter_icon'),
      linkedInIcon: translate('member_profile_linkedin_icon'),
      websiteIcon: translate('member_profile_website_icon')
    },
    noSocialLinksText: ''
  },
  previewButton: {
    text: translate('member_profile_preview_button'),
    accessibilityLabel: translate('member_profile_preview_button')
  },
  editButton: {
    text: translate('member_profile_edit_button'),
    accessibilityLabel: translate('member_profile_edit_button')
  },
  onSaveButton: {
    text: '',
    accessibilityLabel: ''
  },
  onCancelButton: {
    text: '',
    accessibilityLabel: ''
  },
  messageTemplate: {
    message: translate('member_profile_restricted_edit_message')
  }
});
