// MAUVE
/* eslint-disable */
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { RadioGroup } from '@cvent/carina/components/RadioGroup';
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
import { Tooltip } from '@cvent/carina/components/Tooltip';
import SnippetSettingsConfirmationModal from '@components/tracking-codes/SnippetsSettingsConfirmatonModal';
import { ApplicableOn, CodeSnippet } from '@cvent/planner-event-hubs-model/types';
import { ConFigureSettingsProp } from '@components/tracking-codes/SelectCodeSnippetsModal';
import FormElement from '@cvent/carina/components/FormElement/FormElement';

interface Props {
  isNewSnippetAdded: boolean;
  snippetSettingsModalIsOpen: boolean;
  setSelected?: any;
  setSnippetSettingsModalIsOpen: (isOpen: boolean) => void;
  testId: string;
  selectedSnippet?: string;
  codeSnippetName: string;
  setSelectCodeSnippetModelOpen?: (isOpen: boolean) => void;
  onSave: (val: CodeSnippet) => void;
  setConfigureSnippetSetting: Dispatch<SetStateAction<ConFigureSettingsProp>>;
  configureSnippetSetting: ConFigureSettingsProp;
}
function SnippetSettingsModal({
  isNewSnippetAdded,
  setSelected,
  snippetSettingsModalIsOpen,
  setSnippetSettingsModalIsOpen,
  testId,
  selectedSnippet,
  codeSnippetName,
  setSelectCodeSnippetModelOpen,
  onSave,
  setConfigureSnippetSetting,
  configureSnippetSetting
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const styles = useStyle(SnippetsSettingsModalStyles);
  const [isSnippetSettingsConfirmationModalOpen, setSnippetSettingsConfirmationModalOpen] = useState(false);

  const isAtLeastOnePageSelected =
    configureSnippetSetting.addToAllPages || configureSnippetSetting.addToSingleVideoPage;
  const prevConfigureSnippetSetting = useRef({ ...configureSnippetSetting, codeSnippetId: selectedSnippet });
  const isTooltipEnabled = !isAtLeastOnePageSelected;

  const onSaveSnippet = (): void => {
    onSave({ ...configureSnippetSetting, codeSnippetId: selectedSnippet });
    setSnippetSettingsModalIsOpen(false);
    if (isNewSnippetAdded) {
      setSelectCodeSnippetModelOpen(false);
    }
  };

  const onModalClose = (): void => {
    const isChanged = JSON.stringify(prevConfigureSnippetSetting.current) !== JSON.stringify(configureSnippetSetting);

    if (isChanged && isAtLeastOnePageSelected) {
      setSnippetSettingsConfirmationModalOpen(true);
    } else {
      setSnippetSettingsModalIsOpen(false);
    }
  };

  const header = (
    <div css={styles.headerStyle}>
      <span css={styles.modalTitle}>{translate('tracking_code_configure_code_snippet_modal_title')}</span>
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
      <div>
        <Tooltip
          portal
          text={translate('tracking_code_configure_code_snippet_done_button_tooltip')}
          trigger={(handleOpen, handleClose) => (
            <div
              onMouseOver={isTooltipEnabled ? handleOpen : null}
              onMouseLeave={isTooltipEnabled ? handleClose : null}
              onMouseOutCapture={isTooltipEnabled ? handleClose : null}
              onFocus={isTooltipEnabled ? handleOpen : null}
              onBlur={isTooltipEnabled ? handleClose : null}
              onTouchStart={isTooltipEnabled && !snippetSettingsModalIsOpen ? handleOpen : handleClose}
              tabIndex={isTooltipEnabled ? 0 : -1}
              aria-label={translate('tracking_code_configure_code_snippet_done_button_tooltip')}
            >
              <Button
                css={styles.saveButton}
                appearance="filled"
                onClick={onSaveSnippet}
                aria-label={translate('tracking_code_configure_code_snippet_done_button')}
                text={translate('tracking_code_configure_code_snippet_done_button')}
                testID={`${testId}-save-button`}
              />
            </div>
          )}
          preventOverflow={false}
        />
      </div>
      <Button
        appearance="ghost"
        onClick={onModalClose}
        aria-label={translate('tracking_code_configure_code_snippet_cancel_button')}
        text={translate('tracking_code_configure_code_snippet_cancel_button')}
        testID={`${testId}-cancel-button`}
      />
    </div>
  );

  return (
    <div>
      <SnippetSettingsConfirmationModal
        isNewSnippetAdded={isNewSnippetAdded}
        isOpen={isSnippetSettingsConfirmationModalOpen}
        setIsModalOpen={setSnippetSettingsConfirmationModalOpen}
        setSelectCodeSnippetModelOpen={setSelectCodeSnippetModelOpen}
        setSnippetSettingsModalIsOpen={setSnippetSettingsModalIsOpen}
        setSelected={setSelected}
        setConfigureSnippetSetting={setConfigureSnippetSetting}
      />
      <Modal
        format="s"
        isOpen={snippetSettingsModalIsOpen && !isSnippetSettingsConfirmationModalOpen}
        testID={testId}
        onDismiss={onModalClose}
        zIndex={MODAL_ZINDEX}
        aria-label={translate('tracking_code_configure_code_snippet_modal_title')}
      >
        <div css={styles.bodyStyle}>
          <ScrollViewWithBars forceStickyFooter header={header} footer={footer}>
            <Row>
              <Col css={styles.columnStyle}>
                <div css={{ display: 'flex' }}>
                  <p css={styles.labelStyle}>{translate('tracking_code_configure_code_snippet_name_label')}</p>
                  <div css={styles.popoverStyle}>
                    <Popover
                      placement="start-top"
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
                          aria-label={translate('tracking_code_configure_code_snippet_name_label')}
                        >
                          <HelpCircleIcon size="s" />
                        </div>
                      )}
                    >
                      <div css={{ maxWidth: '8rem' }}>
                        {translate('tracking_code_configure_code_snippet_name_label_popover')}
                      </div>
                    </Popover>
                  </div>
                </div>
                <div>
                  <div>{codeSnippetName}</div>
                </div>
              </Col>
              <Col css={styles.columnStyle}>
                <FormElement>
                  <FormElement.Label
                    label={translate('tracking_code_configure_code_snippet_all_pages_label')}
                    labelFor="whereDoesItRun_radio_button"
                  />
                  <RadioGroup
                    name="whereDoesItRun"
                    options={[
                      {
                        label: translate('view_code_snippet_add_to_all_pages_yes_text'),
                        value: 1
                      },
                      {
                        label: translate('view_code_snippet_add_to_all_pages_no_text'),
                        value: 0
                      }
                    ]}
                    selected={configureSnippetSetting.addToAllPages ? 1 : 0}
                    onUpdate={selectedOption => {
                      if (selectedOption === 1) {
                        setConfigureSnippetSetting(prev => ({
                          ...prev,
                          addToAllPages: true,
                          addToSingleVideoPage: false
                        }));
                      } else {
                        setConfigureSnippetSetting(prev => ({
                          ...prev,
                          addToSingleVideoPage: true,
                          addToAllPages: false,
                          // Update the snippet type to `track on launch` if single page is 'yes'
                          applicableOn: ApplicableOn.Initialization
                        }));
                      }
                    }}
                    testID="where_does_it_run-radio"
                  />
                </FormElement>
                {configureSnippetSetting.addToAllPages && (
                  <>
                    <div css={{ display: 'flex' }}>
                      <p css={styles.labelStyle}>
                        {translate('tracking_code_configure_code_snippet_add_snippet_type_label')}
                      </p>
                      <div css={styles.popoverStyle}>
                        <Popover
                          placement="bottom-start"
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
                          <div css={{ maxWidth: '14rem' }}>
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
                    <RadioGroup
                      name="snippetType"
                      options={[
                        {
                          label: translate(
                            'tracking_code_configure_code_snippet_add_snippet_type_track_on_launch_label'
                          ),
                          value: ApplicableOn.Initialization
                        },
                        {
                          label: translate(
                            'tracking_code_configure_code_snippet_add_snippet_type_track_all_launch_label'
                          ),
                          value: ApplicableOn.AllPages,
                          disabled:
                            configureSnippetSetting.addToSingleVideoPage && !configureSnippetSetting.addToAllPages
                        }
                      ]}
                      selected={configureSnippetSetting.applicableOn}
                      onUpdate={(selectedOption: ApplicableOn) => {
                        setConfigureSnippetSetting(prev => ({
                          ...prev,
                          applicableOn: selectedOption
                        }));
                      }}
                      testID="snippet-type-radio"
                    />
                  </>
                )}
              </Col>
            </Row>
          </ScrollViewWithBars>
        </div>
      </Modal>
    </div>
  );
}

export default SnippetSettingsModal;
