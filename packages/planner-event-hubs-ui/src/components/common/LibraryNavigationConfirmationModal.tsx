import React, { useEffect, useState } from 'react';
import { Modal } from '@cvent/carina/components/Modal';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Button } from '@cvent/carina/components/Button';
import { useTheme } from '@cvent/carina/components/ThemeProvider';
import { useTranslate } from 'nucleus-text';
import { injectTestId } from '@cvent/nucleus-test-automation';
import useLeavePrevention from '@hooks/useLeavePrevention';
import { CSSObject } from '@emotion/react';

type LibraryNavigationConfirmationModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  bodyText: string;
  preventLeave: boolean;
  onPreventRouteChange?: () => void;
  onClickLeave?: () => void;
  testID: string;
};

const useStyles = (): Record<string, CSSObject> => {
  const { font } = useTheme();
  return {
    title: {
      fontSize: font.base.size.h2,
      marginLeft: -8,
      marginRight: -8
    },
    container: {
      marginLeft: 24,
      marginRight: 24
    },
    bodyContent: {
      fontSize: font.base.size.m,
      color: font.color.soft,
      paddingBottom: 25
    }
  };
};

function LibraryNavigationConfirmationModal({
  isOpen,
  setIsOpen,
  bodyText,
  preventLeave,
  onPreventRouteChange,
  testID,
  onClickLeave
}: LibraryNavigationConfirmationModalProps): JSX.Element {
  const [actionsDisabled, setActionsDisabled] = useState(false);
  const { leavePage } = useLeavePrevention({
    preventLeave,
    onPreventRouteChange: () => {
      setIsOpen(true);
      onPreventRouteChange?.();
    }
  });
  const { title, container, bodyContent } = useStyles();
  const { translate } = useTranslate();

  useEffect(() => {
    if (!isOpen) {
      setActionsDisabled(false);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      format="s"
      zIndex={1000}
      onDismiss={() => setIsOpen(false)}
      testID={`${testID}-navigation-confirmation-modal-container`}
      portal
    >
      <div css={container}>
        <Row margin={{ top: 24, bottom: 20 }}>
          <Col width="fill" flex={{ display: 'flex', alignItems: 'center' }}>
            <div css={title} {...injectTestId(`${testID}-navigation-confirmation-modal-header`)}>
              {translate('Navigation-Confirmation-Modal-Header')}
            </div>
          </Col>
        </Row>

        {bodyText && (
          <Row>
            <Col>
              <div css={bodyContent} {...injectTestId(`${testID}-navigation-confirmation-modal-body`)}>
                {bodyText}
              </div>
            </Col>
          </Row>
        )}

        <Row margin={{ top: 10, bottom: 24 }} justifyContent="flex-end">
          <Col width="content">
            <Button
              appearance="filled"
              text={translate('Navigation-Confirmation-Modal-Leave-Button-Text')}
              onClick={() => {
                setActionsDisabled(true);
                leavePage();
                onClickLeave?.();
              }}
              testID={`${testID}-navigation-confirmation-modal-leave-button`}
              disabled={actionsDisabled}
            />
          </Col>
          <Col width="content">
            <Button
              appearance="lined"
              text={translate('Navigation-Confirmation-Modal-Stay-Button-Text')}
              onClick={() => {
                setIsOpen(false);
              }}
              testID={`${testID}-navigation-confirmation-modal-stay-button`}
              disabled={actionsDisabled}
            />
          </Col>
        </Row>
      </div>
    </Modal>
  );
}

export default LibraryNavigationConfirmationModal;
