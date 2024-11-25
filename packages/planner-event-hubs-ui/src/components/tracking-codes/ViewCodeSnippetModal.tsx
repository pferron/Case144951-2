// MAUVE
/* eslint-disable */
import React, { Dispatch, SetStateAction } from 'react';
import Modal from '@cvent/carina/components/Modal';
import { Button } from '@cvent/carina/components/Button';
import { XIcon } from '@cvent/carina/components/Icon';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars';
import { SnippetsSettingsModalStyles } from '@components/tracking-codes/styles';
import Col from '@cvent/carina/components/Col';
import Row from '@cvent/carina/components/Row';
import { Popover } from '@cvent/carina/components/Popover';
import HelpCircleIcon from '@cvent/carina/components/Icon/HelpCircle';
import { MODAL_ZINDEX } from '@components/constants';
import { HubCodeSnippet } from '@components/tracking-codes/TrackingCodes';
import { ApplicableOn } from '@cvent/planner-event-hubs-model/types';
import { ConFigureSettingsProp } from '@components/tracking-codes/SelectCodeSnippetsModal';

interface Props {
  codeSnippetId: string;
  codeSnippets: HubCodeSnippet[];
  viewCodeSnippetModalOpen: boolean;
  setViewCodeSnippetModalOpen: Dispatch<SetStateAction<{ codeSnippetId: string; isViewModalOpen: boolean }>>;
  testId: string;
  setSnippetSettingsModalIsOpen: (isOpen: boolean) => void;
  setConfigureSnippetSetting: Dispatch<SetStateAction<ConFigureSettingsProp>>;
}
function ViewCodeSnippetModal({
  codeSnippetId,
  codeSnippets,
  viewCodeSnippetModalOpen,
  setViewCodeSnippetModalOpen,
  testId,
  setSnippetSettingsModalIsOpen,
  setConfigureSnippetSetting
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const styles = useStyle(SnippetsSettingsModalStyles);

  const onModalClose = (): void => {
    setViewCodeSnippetModalOpen({
      isViewModalOpen: false,
      codeSnippetId
    });
  };

  const codeSnippetMap = new Map<string, HubCodeSnippet>();
  codeSnippets.forEach(codeSnippet => codeSnippetMap.set(codeSnippet.codeSnippetId, codeSnippet));

  const header = (
    <div css={styles.headerStyle}>
      <span css={styles.modalTitle}>{translate('view_code_snippet_modal_heading')}</span>
      <Button
        css={styles.dismissButtonStyle}
        appearance="ghost"
        icon={XIcon}
        aria-label={translate('close_modal_button_label')}
        onClick={onModalClose}
        variant="neutral"
        testID={`${testId}-cross-button`}
      />
    </div>
  );

  const footer = (
    <div css={styles.buttonContainer}>
      <Button
        appearance="filled"
        aria-label={translate('view_code_snippet_edit_button')}
        text={translate('view_code_snippet_edit_button')}
        testID={`${testId}-edit-button`}
        onClick={() => {
          setConfigureSnippetSetting({
            codeSnippetId,
            addToAllPages: codeSnippetMap.get(codeSnippetId).addToAllPages,
            addToSingleVideoPage: codeSnippetMap.get(codeSnippetId).addToSingleVideoPage,
            applicableOn:
              codeSnippetMap.get(codeSnippetId).applicableOn === ApplicableOn.Initialization
                ? ApplicableOn.Initialization
                : ApplicableOn.AllPages
          });
          setViewCodeSnippetModalOpen(prev => ({
            ...prev,
            isViewModalOpen: false
          }));
          setSnippetSettingsModalIsOpen(true);
        }}
      />
      <Button
        appearance="ghost"
        onClick={onModalClose}
        aria-label={translate('view_code_snippet_close_button')}
        text={translate('view_code_snippet_close_button')}
        testID={`${testId}-cancel-button`}
      />
    </div>
  );

  return (
    <div>
      <Modal
        format="s"
        isOpen={viewCodeSnippetModalOpen}
        testID={testId}
        onDismiss={onModalClose}
        zIndex={MODAL_ZINDEX}
        aria-label={translate('view_code_snippet_modal_heading')}
      >
        <div css={styles.bodyStyle}>
          <ScrollViewWithBars forceStickyFooter header={header} footer={footer}>
            <Row>
              <Col css={styles.columnStyle}>
                <div css={{ display: 'flex' }}>
                  <p css={styles.labelStyle}>{translate('tracking_code_configure_code_snippet_name_label')}</p>
                </div>
                <div>
                  <div>{codeSnippetMap.get(codeSnippetId)?.name}</div>
                </div>
              </Col>
              <Col css={styles.columnStyle}>
                <p css={styles.labelStyle}>{translate('tracking_code_configure_code_snippet_all_pages_label')}</p>
                {codeSnippetMap.get(codeSnippetId)?.addToAllPages && (
                  <div>{translate('view_code_snippet_add_to_all_pages_yes_text')}</div>
                )}
                {codeSnippetMap.get(codeSnippetId)?.addToSingleVideoPage &&
                  !codeSnippetMap.get(codeSnippetId)?.addToAllPages && (
                    <div>{translate('view_code_snippet_add_to_all_pages_no_text')}</div>
                  )}
              </Col>
              {codeSnippetMap.get(codeSnippetId)?.addToAllPages && (
                <Col css={styles.columnStyle}>
                  <div css={{ display: 'flex' }}>
                    <p css={styles.labelStyle}>
                      {translate('tracking_code_configure_code_snippet_add_snippet_type_label')}
                    </p>
                    <div css={styles.popoverStyle}>
                      <Popover
                        testID={`${testId}-popover`}
                        placement="bottom"
                        portal
                        accessible
                        zIndex={MODAL_ZINDEX}
                        trigger={({ toggleOpen, isOpen, closePopover }) => (
                          <div
                            role="tooltip"
                            tabIndex={0}
                            onMouseOver={isOpen ? null : toggleOpen}
                            onMouseLeave={isOpen ? closePopover : null}
                            onFocus={isOpen ? undefined : toggleOpen}
                            onBlur={isOpen ? closePopover : undefined}
                            onClick={toggleOpen}
                            aria-label={translate('tracking_code_configure_code_snippet_add_snippet_type_label')}
                          >
                            <HelpCircleIcon size="s" />
                          </div>
                        )}
                      >
                        <div css={{ maxWidth: '20rem' }}>
                          <div css={styles.popoverBoldStyle}>
                            {translate('tracking_code_configure_code_snippet_add_snippet_type_label_popover_t1')}
                          </div>
                          <div>
                            {translate('tracking_code_configure_code_snippet_add_snippet_type_label_popover_t2')}
                          </div>
                          <div css={styles.popoverBoldStyle}>
                            {translate('tracking_code_configure_code_snippet_add_snippet_type_label_popover_t3')}
                          </div>
                          <div>
                            {translate('tracking_code_configure_code_snippet_add_snippet_type_label_popover_t4')}
                          </div>
                        </div>
                      </Popover>
                    </div>
                  </div>
                  <div>
                    {codeSnippetMap.get(codeSnippetId)?.applicableOn === ApplicableOn.Initialization
                      ? translate('view_code_snippet_track_on_launch_text')
                      : translate('view_code_snippet_always_track_text')}
                  </div>
                </Col>
              )}
            </Row>
          </ScrollViewWithBars>
        </div>
      </Modal>
    </div>
  );
}

export default ViewCodeSnippetModal;
