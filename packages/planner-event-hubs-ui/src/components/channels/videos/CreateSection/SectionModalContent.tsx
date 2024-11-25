import React, { useCallback, useMemo, useState } from 'react';
import Col from '@cvent/carina/components/Col';
import Row from '@cvent/carina/components/Row';
import { useTranslate } from 'nucleus-text';
import { Button } from '@cvent/carina/components/Button';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import { ExtendedItem, ExtendedSection } from '@components/channels/type/channelCatalog';
import VideoTable from '@components/channels/videos/CreateSection/VideoTable';
import { SECTION_NAME_MAX_LENGTH } from '@utils/constants';
import { Textbox, useWatchField } from '@cvent/carina/components/Forms';
import { CreateCatalogModalStyle } from '@components/channels/style';
import { useStyle } from '@hooks/useStyle';
import { FilterControlBar } from '@cvent/carina/components/FilterControlBar';
import useBreakpoints from '@hooks/useBreakpoints';

interface Props {
  setIsModalOpen: (isOpen: boolean) => void;
  videos: Array<ExtendedItem>;
  isEditMode?: boolean;
  onCreate: (sectionName: string, selectedVideos: Array<string>) => void;
  onUpdate: (section: ExtendedSection, title: string, selectedVideos: Array<string>) => void;
  section?: ExtendedSection;
}
function SectionModalContent({ setIsModalOpen, videos, onCreate, onUpdate, isEditMode, section }: Props): JSX.Element {
  const { translate } = useTranslate();
  const [selectedVideos, setSelectedVideos] = useState<Array<string>>(section?.items?.map(item => item.id) || []);
  const [searchText, setSearchText] = useState('');
  const sectionName = 'sectionName';
  const { [sectionName]: sectionNameValue = '' } = useWatchField([sectionName]);
  const {
    content,
    separator,
    sectionNameForm,
    gradientTop,
    FilterControlBarStyle,
    sectionTableTitleStyle,
    sectionTableHelpTextStyle
  } = useStyle(CreateCatalogModalStyle);

  const headerTitleLabel = isEditMode
    ? translate('channel_video_edit_section_label')
    : translate('channel_video_create_section_title_label');

  const footerCloseButtonLabel = translate('close_button_label');

  const footerSaveButtonLabel = isEditMode
    ? translate('channel_video_edit_section_save_button_label')
    : translate('add_button_label');

  const sectionHeaderTxt = isEditMode
    ? translate('channel_video_edit_section_table_title_label')
    : translate('channel_video_create_section_header_label');

  const sectionNameLabel = translate('channel_video_create_section_name_label');
  const sectionTableTitleLabel = translate('channel_video_create_section_table_title_label');

  const sectionTableHelpText = translate('channel_video_create_section_table_help_text');

  const onSaveOrUpdate = useCallback(() => {
    if (isEditMode) {
      onUpdate(section, sectionNameValue, selectedVideos);
    }
    onCreate(sectionNameValue, selectedVideos);
  }, [isEditMode, onCreate, onUpdate, section, sectionNameValue, selectedVideos]);

  const header = useMemo(
    () => (
      <>
        <div css={gradientTop} />
        <div style={{ padding: '1rem' }}>
          <Row>
            <Col width="fill" flex={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{headerTitleLabel}</h2>
            </Col>
          </Row>
        </div>
      </>
    ),
    [gradientTop, headerTitleLabel]
  );

  const { isMobile } = useBreakpoints();

  const footer = useMemo(
    () => (
      <>
        <div css={separator} />
        <div style={{ padding: '1rem' }}>
          <Row justifyContent="flex-end">
            <Col
              padding={0}
              flex={{ display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', justifyContent: 'flex-end' }}
            >
              <Col width={isMobile ? 1 : 'content'} padding={0}>
                <Button
                  appearance="ghost"
                  text={footerCloseButtonLabel}
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                  testID="create-section-modal-close-button"
                  isBlock={isMobile}
                />
              </Col>
              <Col width={isMobile ? 1 : 'content'}>
                <Button
                  appearance="filled"
                  disabled={selectedVideos.length === 0 || sectionNameValue.length === 0}
                  text={footerSaveButtonLabel}
                  onClick={() => {
                    setIsModalOpen(false);
                    onSaveOrUpdate();
                  }}
                  testID="create-section-modal-add-button"
                  isBlock={isMobile}
                />
              </Col>
            </Col>
          </Row>
        </div>
      </>
    ),
    [
      separator,
      isMobile,
      footerCloseButtonLabel,
      selectedVideos.length,
      sectionNameValue.length,
      footerSaveButtonLabel,
      setIsModalOpen,
      onSaveOrUpdate
    ]
  );

  const onTextChange = useCallback((text: string): void => {
    setSearchText(text);
  }, []);

  const handleOnSubmit = useCallback((text: string): void => {
    setSearchText(text);
  }, []);

  const handleClearSearchText = useCallback(() => {
    setSearchText('');
  }, []);

  const filteredVideos = (videoList: Array<ExtendedItem>, searchedText: string): Array<ExtendedItem> => {
    if (searchedText && searchedText !== '') {
      return videoList.filter(record => record.displayName.toLowerCase().includes(searchedText.toLowerCase()));
    }
    return videoList;
  };

  return (
    <div css={{ height: '100vh' }}>
      <ScrollViewWithBars id="create-section-modal-content" header={header} footer={footer} forceStickyFooter>
        <div css={separator} />
        <div css={content}>
          <h4>{sectionHeaderTxt}</h4>
          <div css={sectionNameForm}>
            <Textbox
              id="section-name-form-input"
              name={sectionName}
              label={sectionNameLabel}
              maxLength={SECTION_NAME_MAX_LENGTH}
              onUpdateTransform={(value: string): string => value.trimStart()}
              required
              messages={`${translate('characters_left_label', {
                characterCount: SECTION_NAME_MAX_LENGTH - sectionNameValue.length
              })}`}
            />
          </div>

          <h4 css={sectionTableTitleStyle}>{sectionTableTitleLabel}</h4>
          <p css={sectionTableHelpTextStyle}>{sectionTableHelpText}</p>
          <div css={FilterControlBarStyle}>
            <FilterControlBar
              testID="create-section-modal-filter-bar"
              hasSearchBar
              onSubmit={handleOnSubmit}
              clearSearchText={handleClearSearchText}
              searchText={searchText}
              onTextChange={onTextChange}
              clearSearchTextLabel={translate('select_video_modal_search_filter_clear_text_label')}
              submitSearchTextLabel={translate('select_video_modal_search_filter_submit_text_label')}
            />
          </div>
          <VideoTable
            videos={filteredVideos(videos, searchText)}
            selected={selectedVideos}
            setSelected={setSelectedVideos}
          />
        </div>
      </ScrollViewWithBars>
    </div>
  );
}

export default SectionModalContent;
