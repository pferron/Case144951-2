import { injectTestId } from '@cvent/nucleus-test-automation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { InformationStyles } from '@components/videoCenters/style';
import CardContainer from '@components/common/CardContainer';
import { Textarea } from '@cvent/carina/components/Textarea';
import Button from '@cvent/carina/components/Button';
import { useMutation } from '@apollo/client';
import {
  getHubCustomizationsQuery,
  upsertHubCustomizationsMutation
} from '@cvent/planner-event-hubs-model/src/operations/hub';
import {
  Customizations,
  NavigationAlignment,
  NavigationLinkHighlightStyle
} from '@cvent/planner-event-hubs-model/types';
import { isEqual, isUndefined, omit } from 'lodash';
import { useBrandContentStyles } from '@components/videoCenters/branding/styles';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { Switch } from '@cvent/carina/components/Switch';
import { Table, TableColumn } from '@cvent/carina/components/Table';
import CopyLinkButton from '@components/common/CopyLinkButton';
import { BrandingAdvancedOptions, BrandingCustomNavigation } from '@utils/types';
import { Textbox } from '@cvent/carina/components/Textbox';
import Card from '@cvent/carina/components/Card';
import { TopNavItems } from '@components/videoCenters/branding/constants';
import { ExternalLinkIcon } from '@cvent/carina/components/Icon';
import BrandingCustomHeaderPreviewModal from '@components/videoCenters/branding/preview/BrandingCustomHeaderPreviewModal';
import { SanitizeHTML } from '@utils/SanitizeHTML';
import { TextLink } from '@cvent/carina/components/TextLink';
import { PageAlert } from '@cvent/carina/components/Alert';

interface Props {
  hubId: string;
  hubCustomizationData: Customizations;
  customNavigation: BrandingCustomNavigation;
  setNavigationDisabled: (boolean) => void;
  advancedOptions?: BrandingAdvancedOptions;
  setIsPageEdited: (isPageEdited: boolean) => void;
}

function BrandingCustomHeader({
  hubId,
  hubCustomizationData,
  customNavigation,
  setNavigationDisabled,
  advancedOptions = {
    navigationAlignment: NavigationAlignment.Center,
    navigationLinkHighlightStyle: NavigationLinkHighlightStyle.Filled,
    navigationLinkTextSize: '12'
  },
  setIsPageEdited
}: Props): JSX.Element {
  const { translate: t } = useTranslate();
  const { alertContainer, bodyContainer } = useStyle(InformationStyles);
  const theme = useTheme();
  const { headerContainer } = useBrandContentStyles();
  const initialHubCustomization = hubCustomizationData;
  const [hubCustomization, setHubCustomization] = useState<Customizations>(hubCustomizationData);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  useEffect(() => {
    const updated = !isEqual(initialHubCustomization, hubCustomization);
    setIsPageEdited(updated);
  }, [hubCustomization, initialHubCustomization, setIsPageEdited]);

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
      setHubCustomization(result?.data?.upsertHubCustomizations);
    }
  });
  const eventsPlusNavigationTableData = useMemo(
    () =>
      TopNavItems.map(
        item =>
          customNavigation[item.name] &&
          customNavigation[item.name].url && {
            title: t(item.label),
            link: customNavigation[item.name].url,
            url: customNavigation[item.name].url,
            key: item.name,
            rowName: item.name
          }
      ).filter(item => !!item),
    [customNavigation, t]
  );

  const linkCellRenderer = (rowData, cellData) =>
    !isUndefined(cellData) && <CopyLinkButton url={cellData} title={rowData.title} testID="events-plus-navigation" />;

  const customLinkCellRenderer = (rowData, cellData) => !isUndefined(cellData) && <Textbox value={cellData} />;

  const getPageAlertContent = useMemo(
    () => (
      <>
        <b>{t('events_plus_custom_header_page_alert_heading')}</b>
        <p css={{ marginTop: '0.5rem', fontSize: theme.font.base.size['3'] }}>
          {t('events_plus_custom_header_page_alert_info_text')}
          <br />
          <TextLink
            target="_blank"
            rel="noopener noreferrer"
            href={t('events_plus_custom_header_page_alert_link_text_link')}
          >
            {t('events_plus_custom_header_page_alert_link_text')}
          </TextLink>
        </p>
      </>
    ),
    [t, theme.font.base.size]
  );

  const upsertCustomization = () => {
    if (!isEqual(initialHubCustomization, hubCustomization)) {
      upsertHubCustomization({
        variables: {
          id: {
            id: hubId
          },
          input: {
            headerHtml: SanitizeHTML(hubCustomization.headerHtml),
            headerCss: hubCustomization.headerCss,
            headerJavascript: hubCustomization.headerJavascript
          }
        }
      });
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setHubCustomization(prev => ({ ...prev, [id]: value }));
  };

  const updateNavigationVisibility = useCallback(() => {
    setNavigationDisabled(!hubCustomization?.showNavigation);
    upsertHubCustomization({
      variables: {
        id: {
          id: hubId
        },
        input: {
          showNavigation: hubCustomization?.showNavigation
        }
      }
    });
  }, [hubCustomization?.showNavigation, hubId, setNavigationDisabled, upsertHubCustomization]);

  const brandingCustomHeader = (): JSX.Element => (
    <div css={bodyContainer} {...injectTestId('custom-header-container')}>
      <div css={alertContainer}>
        <PageAlert
          appearance="warning"
          id="custom-header-id"
          dismissible={false}
          content={getPageAlertContent}
          testID="custom-header-warning-alert"
        />
      </div>
      <div css={{ paddingBottom: '1.5rem' }}>
        <Card
          elevation={0}
          {...injectTestId('hide-navigation-card')}
          height="100%"
          bodyContent={
            <div css={{ padding: '2rem', height: '100%', flex: 'auto', minHeight: '8.625rem' }}>
              <div
                css={{
                  ...headerContainer,
                  alignItems: 'baseline'
                }}
              >
                <div
                  css={{
                    width: '70%',
                    display: 'flex'
                  }}
                >
                  <Switch
                    testID="custom_header_hide_navigation_toggle"
                    css={{ paddingTop: '0.625rem' }}
                    aria-label={t('events_plus_custom_header_hide_navigation_toggle')}
                    value={!hubCustomization?.showNavigation}
                    onUpdate={value => {
                      setHubCustomization(prev => ({ ...prev, showNavigation: !value }));
                    }}
                  />
                  <div css={{ marginLeft: '0.625rem' }}>
                    <h2 css={{ marginTop: '-0.313rem', marginBottom: '0.25rem', fontSize: theme.font.base.size.h2 }}>
                      {t('events_plus_custom_header_hide_navigation_heading')}
                    </h2>
                    <p css={{ margin: '0rem', color: theme.font.color.soft, fontSize: theme.font.base.size['3'] }}>
                      {t('events_plus_custom_header_hide_navigation_info_text')}
                    </p>
                  </div>
                </div>
                <Button
                  text={t('events_plus_custom_header_hide_navigation_save_button')}
                  testID="custom-header-hide-navigation-btn"
                  appearance="filled"
                  size="s"
                  onClick={updateNavigationVisibility}
                  disabled={isEqual(initialHubCustomization?.showNavigation, hubCustomization?.showNavigation)}
                />
              </div>
              {!hubCustomization?.showNavigation && (
                <>
                  <h3 css={{ marginTop: '2rem' }}>Link</h3>
                  <Table data={eventsPlusNavigationTableData} striped testID="events-plus-navigation-table">
                    <TableColumn
                      name="title"
                      heading={t('events_plus_custom_header_navigation_table_element_column_heading')}
                      minWidth={300}
                    />
                    <TableColumn
                      name="link"
                      heading={t('events_plus_custom_header_navigation_table_link_column_heading')}
                      minWidth={300}
                      cellRenderer={(cellData, allData) => customLinkCellRenderer(allData.rowData, cellData)}
                    />
                    <TableColumn
                      name="url"
                      heading={t('events_plus_custom_header_navigation_table_url_column_heading')}
                      cellRenderer={(cellData, allData) => linkCellRenderer(allData.rowData, cellData)}
                      width={59}
                    />
                  </Table>
                </>
              )}
            </div>
          }
        />
      </div>
      <CardContainer testID="custom-header-settings">
        <div
          css={{
            ...headerContainer,
            alignItems: 'baseline'
          }}
        >
          <div css={{ width: '70%' }}>
            <h2 css={{ marginTop: '0rem', marginBottom: '0.25rem', fontSize: theme.font.base.size.h2 }}>
              {t('events_plus_custom_header_heading')}
            </h2>
            <p
              css={{
                margin: '0rem',
                paddingBottom: '1rem',
                color: theme.font.color.soft,
                fontSize: theme.font.base.size['3']
              }}
            >
              {t('events_plus_custom_header_info_text')}
            </p>
          </div>
          <div css={{ display: 'flex' }}>
            <Button
              text={t('events_plus_custom_header_preview_button')}
              testID="custom-header-preview-btn"
              appearance="lined"
              size="s"
              onClick={() => {
                setHubCustomization(hc => ({
                  ...hc,
                  headerHtml: SanitizeHTML(hc.headerHtml)
                }));
                setShowPreviewModal(true);
              }}
              icon={ExternalLinkIcon}
            />
            <div css={{ paddingLeft: '0.625rem' }}>
              <Button
                text={t('events_plus_custom_header_publish_button')}
                testID="custom-header-publish-btn"
                appearance="filled"
                size="s"
                onClick={upsertCustomization}
                disabled={isEqual(
                  omit(initialHubCustomization, ['showNavigation']),
                  omit(hubCustomization, ['showNavigation'])
                )}
              />
            </div>
          </div>
        </div>
        <h3 css={{ marginTop: '1.5rem', marginBottom: '0.25rem', fontSize: theme.font.base.size.h3 }}>
          {t('events_plus_custom_header_html_heading')}
        </h3>
        <FormElement.Label
          css={{ marginBottom: '0.5rem' }}
          label={t('events_plus_custom_header_html_info_text')}
          labelFor="headerHtml"
        />
        <Textarea
          id="headerHtml"
          testID="headerHtml"
          minHeight="l"
          value={hubCustomization?.headerHtml}
          onChange={onChange}
        />
        <h3 css={{ marginTop: '2rem', marginBottom: '0.25rem', fontSize: theme.font.base.size.h3 }}>
          {t('events_plus_custom_header_css_heading')}
        </h3>
        <FormElement.Label
          css={{ marginBottom: '0.5rem' }}
          label={t('events_plus_custom_header_css_info_text')}
          labelFor="headerCss"
        />
        <Textarea
          id="headerCss"
          testID="headerCss"
          minHeight="l"
          value={hubCustomization?.headerCss}
          onChange={onChange}
        />
        <h3 css={{ marginTop: '2rem', marginBottom: '0.25rem', fontSize: theme.font.base.size.h3 }}>
          {t('events_plus_custom_header_script_heading')}
        </h3>
        <FormElement.Label
          css={{ marginBottom: '0.5rem' }}
          label={t('events_plus_custom_header_script_info_text')}
          labelFor="headerJavascript"
        />
        <Textarea
          id="headerJavascript"
          testID="headerJavascript"
          minHeight="l"
          value={hubCustomization?.headerJavascript}
          onChange={onChange}
        />
      </CardContainer>
      {showPreviewModal && (
        <BrandingCustomHeaderPreviewModal
          isOpen={showPreviewModal}
          setIsOpen={setShowPreviewModal}
          customNavigation={customNavigation}
          advancedOptions={advancedOptions}
          customizations={{
            headerHtml: hubCustomization.headerHtml,
            headerCss: hubCustomization.headerCss,
            headerJavascript: hubCustomization.headerJavascript
          }}
          showNavigation={hubCustomization.showNavigation}
        />
      )}
    </div>
  );

  return (
    <div>
      {upserting ? <LoadingSpinner size="m" testID="loading-branding-image-spinner" /> : brandingCustomHeader()}
    </div>
  );
}

export default BrandingCustomHeader;
