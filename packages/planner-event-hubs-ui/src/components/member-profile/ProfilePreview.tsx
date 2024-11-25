import React, { useMemo, useState } from 'react';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { useTranslate } from 'nucleus-text';
import { HELVETICA_BLOCKS_FONT, VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import useQueryParams from '@hooks/useQueryParam';
import { useQuery } from '@apollo/client';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { Visibility } from '@cvent/multi-dimensional-profile';
import { getProfileDetails } from '@utils/getProfileDetails';
import ViewProfileHeader from '@components/member-profile/ViewProfileHeader';
import { CardDesign } from '@cvent/multi-dimensional-profile/types/Profile';
import {
  EventBrandingOptions,
  ValidProfileCardBorder,
  ValidProfileCardContentAlignments
} from '@cvent/multi-dimensional-profile/utils/cardDesignUtils';
import {
  GET_HUB_SETTINGS,
  GET_VIDEO_HUB,
  getAccountAndCustomFontInformation,
  getHubCodeSnippets
} from '@cvent/planner-event-hubs-model/operations/hub';
import BlockThemeProvider, {
  BackgroundThemeProvider,
  MoodThemeProvider,
  PrimaryThemeProvider
} from '@cvent/blocks/components/BlockThemeProvider';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { convertFont, CustomFont } from '@utils/fontUtils';
import { AccountCodeSnippet } from '@cvent/planner-event-hubs-model/types';
import MemberProfileView from '@components/member-profile/MemberProfileView';
import { useStyle } from '@hooks/useStyle';
import { ProfileStyles } from '@components/member-profile/style';
import Footer from '@components/customRegistration/Footer';
import { TargetWebPages } from '@components/tracking-codes/TrackingCodes';
import { getAccountCodeSnippets } from '@cvent/planner-event-hubs-model/operations/snapshot';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars';

const LOG = LoggerFactory.create('ProfilePreview');

interface Props {
  accountId: string;
}

function ProfilePreview({ accountId }: Props): React.JSX.Element {
  const query = useQueryParams();
  const hubId = query[VIDEO_HUB_PATH_PARAM] as string;
  const { cookieNotificationFeature } = useAppFeatures();
  const [isVisible, setIsVisible] = useState(false);
  const { translate } = useTranslate();
  const [headingsFont, setHeadingsFont] = useState<CustomFont>({
    fallbackFont: null,
    name: null,
    styles: []
  });
  const [bodyFont, setBodyFont] = useState<CustomFont>({
    fallbackFont: null,
    name: null,
    styles: []
  });
  const styles = useStyle(ProfileStyles);
  const [accountCodeSnippets, setAccountCodeSnippets] = useState([]);
  const [codeSnippets, setCodeSnippets] = useState([]);

  // settings call
  const {
    data,
    loading: fetchingData,
    error: getHubSettingsError
  } = useQuery(GET_HUB_SETTINGS, {
    variables: {
      id: {
        id: hubId
      }
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to get video-center settings');
    }
  });

  const { data: customFontInformation, loading: customFontsLoading } = useQuery(getAccountAndCustomFontInformation, {
    onCompleted: () => {
      const activeFonts =
        (customFontInformation?.accountConfig?.AccountFeatures?.GeneralFeatures?.AllowCustomFonts &&
          customFontInformation?.getAccountSnapshot?.customFonts?.filter(customFont => customFont.isActive)) ||
        [];
      const activeHeadingFont = activeFonts.find(customFont => customFont.id === centerTheme?.headingsFont);
      const activeBodyFont = activeFonts.find(customFont => customFont.id === centerTheme?.bodyFont);
      setBodyFont(convertFont(activeBodyFont));
      setHeadingsFont(convertFont(activeHeadingFont));
    }
  });

  const { loading: fetchingAccountSnippets } = useQuery(getAccountCodeSnippets, {
    fetchPolicy: 'cache-and-network',
    variables: {
      accountID: `${accountId}`
    },
    onCompleted: snippetData => {
      setAccountCodeSnippets(snippetData?.getAccountCodeSnippets?.accountCodeSnippets);
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to account code snippets for hub and account', hubId, accountId);
    }
  });

  const { loading: fetchingHubCodeSnippets } = useQuery(getHubCodeSnippets, {
    fetchPolicy: 'cache-and-network',
    skip: fetchingData,
    variables: {
      hubId
    },
    onCompleted: hubSnippetData => {
      const hubCodeSnippet = hubSnippetData?.getHubCodeSnippets;

      const accountCodeSnippetMap = new Map<string, AccountCodeSnippet>();
      accountCodeSnippets.forEach(accountSnippet =>
        accountCodeSnippetMap.set(accountSnippet.codeSnippetId, accountSnippet)
      );
      const hubAssociatedSnippets = hubCodeSnippet
        .filter(codeSnippet => accountCodeSnippets.some(element => codeSnippet.codeSnippetId === element.codeSnippetId))
        .map(codeSnippet => ({
          ...codeSnippet,
          applicableOn: codeSnippet.applicableOn,
          addToAllPages: codeSnippet.targetWebPages.includes(TargetWebPages.AllVcPages),
          addToLoginPage: codeSnippet.targetWebPages.includes(TargetWebPages.Login),
          addToSingleVideoPage: codeSnippet.targetWebPages.includes(TargetWebPages.SingleVideosPage),
          name: accountCodeSnippetMap.get(codeSnippet.codeSnippetId).codeSnippetName,
          dataTagCode: accountCodeSnippetMap.get(codeSnippet.codeSnippetId).codeSnippetDataTagCode,
          status: accountCodeSnippetMap.get(codeSnippet.codeSnippetId).codeSnippetStatus,
          disableCodeSnippets: accountCodeSnippetMap.get(codeSnippet.codeSnippetId).isDropCodeSnippetToCookieBannerTied
        }));
      setCodeSnippets(hubAssociatedSnippets);
    },
    onError: apolloError => {
      LOG.error(apolloError, `Failed to get code snippets associated with hub ${hubId}`);
    }
  });

  // logo call
  const {
    data: centerData,
    loading: fetchingCenterData,
    error: getPlannerEventHubError
  } = useQuery(GET_VIDEO_HUB, {
    variables: { hubID: { id: hubId } },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to get video center details ');
    }
  });

  const centerTheme = centerData?.hub.theme;
  const logoImageUrl = centerTheme?.logoImageUrl;
  const logoAltText = centerTheme?.logoAltText;
  const profileSettings = useMemo(() => data?.getHubSettings ?? {}, [data]);
  const profileData = useMemo(() => getProfileDetails(profileSettings), [profileSettings]);
  const isAllowTurnOffCodeSnippets = useMemo(
    () => codeSnippets.filter(snippet => snippet.disableCodeSnippets).length > 0,
    [codeSnippets]
  );
  const displayManagePreferencesModal =
    profileSettings.allowTurnOffCookies || profileSettings.allowTurnOffGoogleAnalytics || isAllowTurnOffCodeSnippets;
  const displayCcpaLinkText =
    cookieNotificationFeature && profileSettings.ccpaEnableDoNotSell && profileSettings.ccpaDoNotSellUrlEnabled;
  let socialMediaLinks = {
    facebookUrl: '',
    linkedInUrl: '',
    twitterUrl: '',
    websiteUrl: ''
  };
  if (profileSettings?.profileCard?.showSocialMediaLinks) {
    socialMediaLinks = {
      facebookUrl: 'https://www.facebook.com',
      linkedInUrl: 'https://www.linkedin.com',
      twitterUrl: 'https://www.twitter.com',
      websiteUrl: 'https://www.website.com'
    };
  }
  const cardDesign: CardDesign = {
    eventBranding: profileSettings?.profileCard?.branding.toLowerCase() as EventBrandingOptions,
    border: profileSettings?.profileCard?.border.toLowerCase() as ValidProfileCardBorder,
    alignment: profileSettings?.profileCard?.alignment.toLowerCase() as ValidProfileCardContentAlignments
  };
  const visibilityContent = {
    hiddenContent: {
      title: translate('privacy_visibility_hidden_title'),
      description: translate('privacy_visibility_hidden_description')
    },
    visibleContent: {
      title: translate('privacy_visibility_visible_title'),
      description: translate('privacy_visibility_visible_description')
    }
  };

  const profileHeader = (
    <BlockThemeProvider
      primary={centerTheme?.mainColor}
      secondary={centerTheme?.actionColor}
      background={centerTheme?.backgroundColor}
      mood={centerTheme?.moodColor}
      safeMode={centerTheme?.safeMode}
      headingFont={headingsFont ?? HELVETICA_BLOCKS_FONT}
      bodyFont={bodyFont ?? HELVETICA_BLOCKS_FONT}
    >
      <PrimaryThemeProvider>
        <ViewProfileHeader logoImageUrl={logoImageUrl} logoAltText={logoAltText} />
      </PrimaryThemeProvider>
    </BlockThemeProvider>
  );

  const profileFooter = (
    <BlockThemeProvider
      primary={centerTheme?.mainColor}
      secondary={centerTheme?.actionColor}
      background={centerTheme?.backgroundColor}
      mood={centerTheme?.moodColor}
      safeMode={centerTheme?.safeMode}
      headingFont={headingsFont ?? HELVETICA_BLOCKS_FONT}
      bodyFont={bodyFont ?? HELVETICA_BLOCKS_FONT}
      {...injectTestId('member-profile-preview-footer')}
    >
      <MoodThemeProvider>
        <Footer
          termsOfUseText={profileSettings?.termsLinkText}
          cventPrivacyPolicyText={
            profileSettings.displayCventPrivacyPolicy ? profileSettings.cventPrivacyPolicyLinkText : null
          }
          customPrivacyPolicyText={profileSettings.privacyPolicyLinkText}
          displayManagePreferencesModal={displayManagePreferencesModal}
          ccpaLinkText={profileSettings.ccpaLinkText}
          displayCcpaLinkText={displayCcpaLinkText}
        />
      </MoodThemeProvider>
    </BlockThemeProvider>
  );

  const memberProfilePreview = () => (
    <BlockThemeProvider
      primary={centerTheme?.mainColor}
      secondary={centerTheme?.actionColor}
      background={centerTheme?.backgroundColor}
      mood={centerTheme?.moodColor}
      safeMode={centerTheme?.safeMode}
      headingFont={headingsFont ?? HELVETICA_BLOCKS_FONT}
      bodyFont={bodyFont ?? HELVETICA_BLOCKS_FONT}
    >
      <BackgroundThemeProvider>
        <ScrollViewWithBars css={{ height: '100vh' }} forceStickyFooter header={profileHeader} footer={profileFooter}>
          <BackgroundThemeProvider>
            <div css={styles.privacyContainer}>
              <Visibility
                userIsVisible={isVisible}
                handleVisibilityToggle={(): void => setIsVisible(!isVisible)}
                testID="privacy-toggle"
                visibleContent={visibilityContent.visibleContent}
                hiddenContent={visibilityContent.hiddenContent}
                title=""
                visibilityOptionText=""
                accessibilityLabel={translate('privacy_visibility_toggle_accessibility_label')}
                isLeftAligned
                data-dd-privacy="mask"
              />
            </div>
          </BackgroundThemeProvider>
          <MoodThemeProvider>
            <div css={styles.bottomContainer}>
              <MemberProfileView
                cardDesign={cardDesign}
                profileData={profileData}
                logoImageUrl={logoImageUrl}
                hubSettings={profileSettings}
                socialMediaLinks={socialMediaLinks}
              />
            </div>
          </MoodThemeProvider>
        </ScrollViewWithBars>
      </BackgroundThemeProvider>
    </BlockThemeProvider>
  );

  return (
    <LoadingWrapper
      loading={
        fetchingData || fetchingCenterData || customFontsLoading || fetchingAccountSnippets || fetchingHubCodeSnippets
      }
      renderer={memberProfilePreview}
      errors={[getHubSettingsError, getPlannerEventHubError]}
    />
  );
}

export default ProfilePreview;
