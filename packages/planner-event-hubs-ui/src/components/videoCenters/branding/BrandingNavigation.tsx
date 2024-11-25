import { useBrandingNavigationStyles } from '@components/videoCenters/branding/styles';
import { Button } from '@cvent/carina/components/Button';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Table, TableColumn } from '@cvent/carina/components/Table';
import { Switch } from '@cvent/carina/components/Switch';
import { cloneDeep, isEqual, isUndefined } from 'lodash';
import { Accordion, AccordionHeader, AccordionSection } from '@cvent/carina/components/Accordion_NEXT';
import { useTranslate } from 'nucleus-text';
import CopyLinkButton from '@components/common/CopyLinkButton';
import { BrandingAdvancedOptions, BrandingCustomNavigation } from '@utils/types';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import NavigationHeader from '@components/videoCenters/branding/preview/NavigationHeader';
import {
  CustomizationsInput,
  DefaultLandingPage,
  NavigationAlignment,
  NavigationLinkHighlightStyle
} from '@cvent/planner-event-hubs-model/types';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { TopNavItems } from '@components/videoCenters/branding/constants';
import { useMutation } from '@apollo/client';
import {
  getHubCustomizationsQuery,
  upsertHubCustomizationsMutation
} from '@cvent/planner-event-hubs-model/src/operations/hub';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { Dropdown } from '@cvent/carina/components/Dropdown';

import { RadioGroup } from '@cvent/carina/components/RadioGroup';
import { Textbox } from '@cvent/carina/components/Textbox';
import { TextLink } from '@cvent/carina/components/TextLink';
import { HelpCirclePopper } from '@components/tracking-codes/HelpCirclePopper';

export interface BrandingNavigationProps {
  hubId: string;
  customNavigation: BrandingCustomNavigation;
  advancedOptions: BrandingAdvancedOptions;
  setIsPageEdited: (isPageEdited: boolean) => void;
}

interface ToggleSwitchProps {
  onUpdate: (value: boolean) => void;
  initialValue: boolean;
  title: string;
}

const DEFAULT_PADDING = '16';
const MIN_VAL_MAX_WIDTH = 1079;
const MAX_VALUE_MAX_WIDTH = 3840;
const MIN_VAL_PADDING = 0;
const MAX_VAL_PADDING = 100;

interface CustomSectionWithHeaderProps {
  title: string;
  children: ReactNode;
}
function ToggleSwitch(props: ToggleSwitchProps) {
  const { initialValue, onUpdate, title } = props;
  const [value, setValue] = useState(initialValue);
  const { translate } = useTranslate();

  return (
    <Switch
      aria-label={translate('custom_navigation_toggle', { title })}
      value={!!value}
      onUpdate={() => {
        setValue(!value);
        onUpdate(!value);
      }}
    />
  );
}

function CustomSectionWithHeader({ title, children, ...rest }: CustomSectionWithHeaderProps) {
  return (
    <AccordionSection
      {...rest}
      title={
        <AccordionHeader chevronPlacement="start">
          <h3 css={{ margin: 0, marginLeft: 0 }}>{title}</h3>
        </AccordionHeader>
      }
      isOpen
    >
      {children}
    </AccordionSection>
  );
}

function BrandingNavigation(props: BrandingNavigationProps): React.JSX.Element {
  const {
    container,
    bodyContainer,
    customNavigationHeader,
    customNavigationSubHeader,
    previewHeader,
    customNavigationHeaderContent,
    customNavigationAppearanceSubHeader,
    advancedOptionsHeaderContent,
    advancedOptionsSpacingHeaderContent,
    defaultLandingPageContainer,
    landingPageHelpIconStyle,
    landingPageHeaderStyle
  } = useBrandingNavigationStyles();
  const { translate } = useTranslate();
  const { customNavigation, advancedOptions, hubId, setIsPageEdited } = props;
  const [brandingCustomNavigation, setBrandingCustomNavigation] = useState<BrandingCustomNavigation>(
    cloneDeep(customNavigation)
  );
  const [selectedBrandingAdvancedOptions, setSelectedBrandingAdvancedOptions] = useState<BrandingAdvancedOptions>(
    cloneDeep(advancedOptions)
  );
  const { defaultLandingPageFeature } = useAppFeatures();

  const { defaultLandingPage } = brandingCustomNavigation;
  const isHomePageEnabled = brandingCustomNavigation.homePage.isEnabled;
  const isError = defaultLandingPageFeature && !brandingCustomNavigation.homePage.isEnabled && !defaultLandingPage;
  const [selected, setSelected] = useState(defaultLandingPage);

  const isNavigationUpdated = useMemo(() => {
    if (isHomePageEnabled) {
      brandingCustomNavigation.defaultLandingPage = customNavigation.defaultLandingPage;
      setSelected(customNavigation.defaultLandingPage);
    }
    const updated =
      !isEqual(advancedOptions, selectedBrandingAdvancedOptions) ||
      !isEqual(customNavigation, brandingCustomNavigation);
    return updated;
  }, [brandingCustomNavigation, customNavigation, advancedOptions, selectedBrandingAdvancedOptions, isHomePageEnabled]);

  useEffect(() => {
    setIsPageEdited(isNavigationUpdated);
  }, [isNavigationUpdated, setIsPageEdited]);

  const isFormValid = useMemo(() => {
    const spacingMaxWidth = Number(selectedBrandingAdvancedOptions.navigationHeaderMaxWidth);
    const validPadding = Number(selectedBrandingAdvancedOptions.navigationHeaderLeftPadding);

    const isValidMaxWidth =
      isBlank(selectedBrandingAdvancedOptions.navigationHeaderMaxWidth) ||
      (spacingMaxWidth >= MIN_VAL_MAX_WIDTH && spacingMaxWidth <= MAX_VALUE_MAX_WIDTH);
    const isValidPadding =
      selectedBrandingAdvancedOptions?.navigationHeaderLeftPadding?.length !== 0 &&
      validPadding >= MIN_VAL_PADDING &&
      validPadding <= MAX_VAL_PADDING;
    return isValidMaxWidth && isValidPadding;
  }, [
    selectedBrandingAdvancedOptions.navigationHeaderLeftPadding,
    selectedBrandingAdvancedOptions.navigationHeaderMaxWidth
  ]);

  const isHeaderPaddingDefault = useMemo(() => {
    const updated =
      !isEqual('16', selectedBrandingAdvancedOptions.navigationHeaderLeftPadding) ||
      !isEqual('16', selectedBrandingAdvancedOptions.navigationHeaderRightPadding);
    return updated;
  }, [selectedBrandingAdvancedOptions]);

  const isHeaderMaxWidthDefault = useMemo(() => {
    const updated = !isEqual('', selectedBrandingAdvancedOptions.navigationHeaderMaxWidth);
    return updated;
  }, [selectedBrandingAdvancedOptions]);

  const [upsertHubCustomization, { loading: upserting }] = useMutation(upsertHubCustomizationsMutation, {
    update: (cache, result) => {
      cache.writeQuery({
        query: getHubCustomizationsQuery,
        variables: {
          id: {
            id: hubId
          }
        },
        data: {
          getHubCustomizations: result?.data?.upsertHubCustomizations
        }
      });
    }
  });
  const saveCustomNavigation = useCallback(() => {
    const input: CustomizationsInput = {
      defaultLandingPage: brandingCustomNavigation.defaultLandingPage,
      navigationAlignment: selectedBrandingAdvancedOptions.navigationAlignment,
      showLogin: brandingCustomNavigation.loginRegistration.isEnabled,
      showLogo: brandingCustomNavigation.logo.isEnabled,
      showChannels: brandingCustomNavigation.channels.isEnabled,
      showHomePage: brandingCustomNavigation.homePage.isEnabled,
      showVideos: brandingCustomNavigation.videos.isEnabled,
      navigationLinkHighlightStyle: selectedBrandingAdvancedOptions.navigationLinkHighlightStyle,
      navigationLinkTextSize: Number(selectedBrandingAdvancedOptions.navigationLinkTextSize),
      navigationHeaderLeftPadding: Number(selectedBrandingAdvancedOptions.navigationHeaderLeftPadding),
      navigationHeaderRightPadding: Number(selectedBrandingAdvancedOptions.navigationHeaderRightPadding),
      navigationHeaderMaxWidth:
        Number(selectedBrandingAdvancedOptions.navigationHeaderMaxWidth) === 0
          ? null
          : Number(selectedBrandingAdvancedOptions.navigationHeaderMaxWidth)
    };
    if (brandingCustomNavigation?.upcomingEvents) {
      input.showUpcomingEvents = brandingCustomNavigation.upcomingEvents.isEnabled;
    }
    upsertHubCustomization({
      variables: {
        id: {
          id: hubId
        },
        input
      }
    });
  }, [
    brandingCustomNavigation.defaultLandingPage,
    brandingCustomNavigation.channels.isEnabled,
    brandingCustomNavigation.homePage.isEnabled,
    brandingCustomNavigation.loginRegistration.isEnabled,
    brandingCustomNavigation.logo.isEnabled,
    brandingCustomNavigation.upcomingEvents,
    brandingCustomNavigation.videos.isEnabled,
    hubId,
    selectedBrandingAdvancedOptions.navigationAlignment,
    selectedBrandingAdvancedOptions.navigationHeaderLeftPadding,
    selectedBrandingAdvancedOptions.navigationHeaderMaxWidth,
    selectedBrandingAdvancedOptions.navigationHeaderRightPadding,
    selectedBrandingAdvancedOptions.navigationLinkHighlightStyle,
    selectedBrandingAdvancedOptions.navigationLinkTextSize,
    upsertHubCustomization
  ]);

  const preview: React.JSX.Element = useMemo(
    () => (
      <div>
        <h2 css={previewHeader}>{translate('custom_navigation_preview')}</h2>
        <NavigationHeader
          customNavigation={brandingCustomNavigation}
          advancedOptions={selectedBrandingAdvancedOptions}
        />
      </div>
    ),
    [selectedBrandingAdvancedOptions, brandingCustomNavigation, previewHeader, translate]
  );

  const customNavigationTableData2 = useMemo(
    () =>
      TopNavItems.map(
        item =>
          brandingCustomNavigation[item.name] && {
            isEnabled: brandingCustomNavigation[item.name].isEnabled,
            title: translate(item.label),
            url: brandingCustomNavigation[item.name].url,
            key: item.name,
            rowName: item.name
          }
      ).filter(item => !!item),
    [brandingCustomNavigation, translate]
  );

  function isBlank(value: string): boolean {
    return (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    );
  }

  const linkCellRenderer = (rowData, cellData) =>
    !isUndefined(cellData) && <CopyLinkButton url={cellData} title={rowData.title} testID="custom-navigation" />;

  const toggleCellRenderer = useCallback(
    (cellData, rowData) => (
      <ToggleSwitch
        onUpdate={(value: boolean) => {
          setBrandingCustomNavigation({
            ...brandingCustomNavigation,
            [rowData.rowName]: { ...brandingCustomNavigation[rowData.rowName], isEnabled: value }
          });
        }}
        initialValue={!!cellData}
        title={rowData.title}
      />
    ),
    [brandingCustomNavigation]
  );

  const customNavigationTable: React.JSX.Element = (
    <>
      <p css={customNavigationSubHeader}>{translate('custom_navigation_sub_header')}</p>
      <Table data={customNavigationTableData2} striped testID="custom-navigation-table">
        <TableColumn
          name="isEnabled"
          heading=""
          width={80}
          cellRenderer={(cellData, data) => toggleCellRenderer(cellData, data.rowData)}
        />
        <TableColumn name="title" heading={translate('custom_navigation_table_header_element')} />
        <TableColumn
          name="url"
          heading={translate('custom_navigation_table_header_link')}
          cellRenderer={(cellData, data) => linkCellRenderer(data.rowData, cellData)}
          width={59}
          hideWhenCollapsed
        />
      </Table>
    </>
  );

  const landingPageDropDownOptions = [
    { label: translate('landing_page_dropdown_channel_option'), value: DefaultLandingPage.Channels },
    { label: translate('landing_page_dropdown_videos_option'), value: DefaultLandingPage.Videos }
  ];
  if (customNavigation.upcomingEvents) {
    landingPageDropDownOptions.push({
      label: translate('landing_page_dropdown_upcoming_events_option'),
      value: DefaultLandingPage.UpcomingEvents
    });
  }
  const defaultLandingPgeDropDown = defaultLandingPageFeature && !isHomePageEnabled && (
    <>
      <div css={landingPageHeaderStyle}>
        <div>{translate('select_default_landing_page_text')}</div>
        <div css={landingPageHelpIconStyle}>
          <HelpCirclePopper
            testID="landing-page-help-icon"
            helpText={translate('landing_page_dropdown_help_icon_text')}
            accessibilityLabel={translate('landing_page_dropdown_help_icon_text')}
          />
        </div>
      </div>
      <div css={defaultLandingPageContainer}>
        <Dropdown
          id="default-landing-page-dropDown"
          testID="default-landing-page-dropDown"
          accessibilityLabel={translate('landing_page_dropdown_label_text')}
          labelText={translate('landing_page_dropdown_label_text')}
          options={landingPageDropDownOptions}
          selected={selected}
          onUpdate={value => {
            setSelected(value as DefaultLandingPage);
            setBrandingCustomNavigation({
              ...brandingCustomNavigation,
              defaultLandingPage: value as DefaultLandingPage
            });
          }}
          isRequired
          hasError={isError}
          maxHeight={130}
        />
      </div>
    </>
  );

  const customNavigationHeaderBody = useMemo(
    () => (
      <div css={customNavigationHeader}>
        <h3 css={customNavigationHeaderContent}>{translate('custom_navigation_header')}</h3>
        <Button
          text={translate('custom_navigation_publish')}
          appearance="filled"
          size="s"
          disabled={!isNavigationUpdated || !isFormValid || isError}
          onClick={saveCustomNavigation}
          aria-label={translate('custom_navigation_publish')}
        />
      </div>
    ),
    [
      customNavigationHeader,
      customNavigationHeaderContent,
      isFormValid,
      isNavigationUpdated,
      saveCustomNavigation,
      translate,
      isError
    ]
  );

  const linkSizeOptions = [
    { label: '10pt', value: '10' },
    { label: '11pt', value: '11' },
    { label: '12pt', value: '12' },
    { label: '13pt', value: '13' },
    { label: '14pt', value: '14' },
    { label: '15pt', value: '15' },
    { label: '16pt', value: '16' },
    { label: '17pt', value: '17' },
    { label: '18pt', value: '18' },
    { label: '19pt', value: '19' },
    { label: '20pt', value: '20' },
    { label: '21pt', value: '21' },
    { label: '22pt', value: '22' },
    { label: '23pt', value: '23' },
    { label: '24pt', value: '24' }
  ];

  const navigationAlignmentOptions = [
    { label: translate('custom_navigation_alignment_left'), value: 'Left' },
    { label: translate('custom_navigation_alignment_center'), value: 'Center' },
    { label: translate('custom_navigation_alignment_right'), value: 'Right' }
  ];

  const navigationHighlightStyleOptions = [
    { label: translate('custom_navigation_highlight_style_filled'), value: 'Filled' },
    { label: translate('custom_navigation_highlight_style_underline'), value: 'Underline' },
    { label: translate('custom_navigation_highlight_style_none'), value: 'None' }
  ];

  const isValidPaddingValue = value => {
    const numValue = parseInt(value, 10);
    return numValue >= MIN_VAL_PADDING && numValue <= MAX_VAL_PADDING;
  };

  const isValidMaxWidthValue = value => {
    const numValue = parseInt(value, 10);
    return numValue <= MAX_VALUE_MAX_WIDTH;
  };

  const paddingTextBox = useMemo(
    () => (
      <>
        <FormElement.Label
          label={translate('events_plus_advance_options_horizontal_padding_text_label')}
          labelFor="branding-horizontal-padding-text-box"
        />
        <Textbox
          helperText={translate('events_plus_advance_options_horizontal_padding_text_constraints')}
          id="branding-horizontal-padding-text-box"
          testID="branding-horizontal-padding-text-box"
          maxLength={3}
          onChange={({ target }) => {
            let { value } = target;
            value = value.replace(/\D/g, '');
            const finalValue = value.replace(/^0+(?!$)/, '');
            if (finalValue === '' || isValidPaddingValue(finalValue)) {
              setSelectedBrandingAdvancedOptions(prevState => ({
                ...prevState,
                navigationHeaderLeftPadding: finalValue,
                navigationHeaderRightPadding: finalValue
              }));
            }
          }}
          value={
            selectedBrandingAdvancedOptions.navigationHeaderLeftPadding === null
              ? selectedBrandingAdvancedOptions.navigationHeaderLeftPadding
              : selectedBrandingAdvancedOptions.navigationHeaderRightPadding
          }
          hasError={
            selectedBrandingAdvancedOptions?.navigationHeaderLeftPadding.length === 0 ||
            Number(selectedBrandingAdvancedOptions?.navigationHeaderLeftPadding) < MIN_VAL_PADDING ||
            Number(selectedBrandingAdvancedOptions?.navigationHeaderLeftPadding) > MAX_VAL_PADDING
          }
        />
      </>
    ),
    [
      selectedBrandingAdvancedOptions.navigationHeaderLeftPadding,
      selectedBrandingAdvancedOptions.navigationHeaderRightPadding,
      translate
    ]
  );

  const maxWidthTextBox = useMemo(
    () => (
      <>
        <FormElement.Label
          label={translate('events_plus_advance_options_max_width_text_label')}
          labelFor="branding-max-width-text-box"
        />
        <Textbox
          helperText={translate('events_plus_advance_options_max_width_text_constraints')}
          id="branding-max-width-text-box"
          testID="branding-max-width-text-box"
          maxLength={4}
          onChange={({ target }) => {
            let { value } = target;
            value = value.replace(/\D/g, '');
            if (value === '' || isValidMaxWidthValue(value)) {
              setSelectedBrandingAdvancedOptions(prevState => ({
                ...prevState,
                navigationHeaderMaxWidth: value === '' || value === null ? null : Number(value).toString()
              }));
            }
          }}
          value={
            selectedBrandingAdvancedOptions?.navigationHeaderMaxWidth === null
              ? ''
              : selectedBrandingAdvancedOptions?.navigationHeaderMaxWidth
          }
          hasError={
            (!isBlank(selectedBrandingAdvancedOptions?.navigationHeaderMaxWidth) &&
              Number(selectedBrandingAdvancedOptions?.navigationHeaderMaxWidth) < MIN_VAL_MAX_WIDTH) ||
            Number(selectedBrandingAdvancedOptions?.navigationHeaderMaxWidth) > MAX_VALUE_MAX_WIDTH
          }
        />
      </>
    ),
    [selectedBrandingAdvancedOptions?.navigationHeaderMaxWidth, translate]
  );

  const navigationAdvancedOptions: React.JSX.Element = (
    <div css={{ paddingTop: '2rem' }}>
      <Accordion chevronPlacement="end" borderStyle="insideOnly">
        <CustomSectionWithHeader title={translate('events_plus_navigation_page_advanced_options_text')}>
          <h3 css={advancedOptionsHeaderContent}>{translate('events_plus_advance_options_info_header')}</h3>
          <h4 css={customNavigationAppearanceSubHeader}>{translate('events_plus_navigation_settings_info_text')}</h4>
          <FormElement.Label
            label={translate('events_plus_navigation_alignment')}
            labelFor="radio-navigation-alignment"
            css={{ marginTop: '1rem' }}
          />
          <RadioGroup
            id="radio-navigation-alignment"
            name="radioGroupNavigationAlignment"
            testID="radio-navigation-alignment"
            options={navigationAlignmentOptions}
            selected={selectedBrandingAdvancedOptions?.navigationAlignment}
            inline
            onUpdate={value => {
              setSelectedBrandingAdvancedOptions(prevState => ({
                ...prevState,
                navigationAlignment: NavigationAlignment[value]
              }));
            }}
          />
          <FormElement.Label
            label={translate('events_plus_navigation_active_link_style')}
            labelFor="radio-navigation-link-highlight-style"
            css={{ marginTop: '1rem' }}
          />
          <RadioGroup
            id="radio-navigation-link-highlight-style"
            name="radioGroupNavigationLinkHighlightStyle"
            testID="radio-navigation-link-highlight-style"
            options={navigationHighlightStyleOptions}
            selected={selectedBrandingAdvancedOptions?.navigationLinkHighlightStyle}
            inline
            onUpdate={value => {
              setSelectedBrandingAdvancedOptions(prevState => ({
                ...prevState,
                navigationLinkHighlightStyle: NavigationLinkHighlightStyle[value]
              }));
            }}
          />

          <h3 css={advancedOptionsHeaderContent}>{translate('events_plus_advance_options_text_style_header')}</h3>
          <h4 css={customNavigationAppearanceSubHeader}>{translate('events_plus_navigation_text_syle_info_label')}</h4>
          <div css={{ width: '21.875rem', marginTop: 16 }}>
            <Dropdown
              accessibilityLabel={translate('events_plus_navigation_font_size_headings_dropdown_label')}
              id="navigation-font-size-dropdown"
              testID="navigation-font-size-dropdown"
              labelText={translate('events_plus_navigation_font_size_headings_dropdown_label')}
              selected={selectedBrandingAdvancedOptions.navigationLinkTextSize}
              options={linkSizeOptions}
              onUpdate={value => {
                setSelectedBrandingAdvancedOptions(prevState => ({
                  ...prevState,
                  navigationLinkTextSize: value
                }));
              }}
              maxHeight={152}
            />
          </div>
          <div>
            <div>
              <h3 css={advancedOptionsSpacingHeaderContent}>
                {translate('events_plus_advance_options_horizontal_padding_header')}
              </h3>
              <h4 css={customNavigationAppearanceSubHeader}>
                {translate('events_plus_advance_options_horizontal_padding_info_label')}
              </h4>
              <div css={{ display: 'flex', marginTop: 16 }}>
                <div css={{ maxWidth: '16.25rem' }}>{paddingTextBox}</div>
                {isHeaderPaddingDefault && (
                  <div css={{ margin: '2rem 2rem', justifyContent: 'center' }}>
                    <TextLink
                      element="button"
                      size="l"
                      onClick={() => {
                        setSelectedBrandingAdvancedOptions({
                          ...selectedBrandingAdvancedOptions,
                          navigationHeaderLeftPadding: DEFAULT_PADDING,
                          navigationHeaderRightPadding: DEFAULT_PADDING
                        });
                      }}
                    >
                      {translate('events_plus_advance_options_restore_defaults')}
                    </TextLink>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 css={advancedOptionsSpacingHeaderContent}>
                {translate('events_plus_advance_options_max_width_header')}
              </h3>
              <h4 css={customNavigationAppearanceSubHeader}>
                {translate('events_plus_advance_options_max_width_info_label')}
              </h4>
              <div css={{ display: 'flex', marginTop: 16 }}>
                <div css={{ width: '16.25rem' }}>{maxWidthTextBox}</div>
                {isHeaderMaxWidthDefault && (
                  <div css={{ margin: '2rem 2rem', justifyContent: 'center' }}>
                    <TextLink
                      element="button"
                      size="l"
                      onClick={() => {
                        setSelectedBrandingAdvancedOptions({
                          ...selectedBrandingAdvancedOptions,
                          navigationHeaderMaxWidth: ''
                        });
                      }}
                    >
                      {translate('events_plus_advance_options_restore_defaults')}
                    </TextLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CustomSectionWithHeader>
      </Accordion>
    </div>
  );

  return (
    <div css={container}>
      {upserting ? (
        <LoadingSpinner size="m" testID="loading-branding-image-spinner" />
      ) : (
        <>
          {preview}

          <div css={{ width: '100%', paddingBottom: '2rem' }}>
            <div css={bodyContainer}>
              {customNavigationHeaderBody}
              {customNavigationTable}
              {defaultLandingPgeDropDown}
              {navigationAdvancedOptions}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BrandingNavigation;
