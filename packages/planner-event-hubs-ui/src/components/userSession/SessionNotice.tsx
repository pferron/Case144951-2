import React, { useContext } from 'react';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Modal } from '@cvent/carina/components/Modal';
import { Button } from '@cvent/carina/components/Button';
import ThemeContext from '@cvent/carina/components/ThemeProvider/ThemeContext';
import { injectTestId } from '@cvent/nucleus-test-automation';

/*
 * This is the SVG for the Carina clock icon
 * The largest icon size (xl) is much smaller than the clock icon used in site editor
 * This is a temporary solution, until we discuss better options
 */

function ClockIcon(): JSX.Element {
  return (
    <svg
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      css={{ width: '5rem', height: '5rem' }}
    >
      <g css={{ fill: 'rgb(0, 0, 0)' }}>
        <svg viewBox="0 0 24 24">
          <path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm0 20c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9z" />
          <path d="M16.4 13.1L13 11.4V6c0-.6-.4-1-1-1s-1 .4-1 1v6c0 .4.2.7.6.9l4 2c.1.1.2.1.4.1.4 0 .7-.2.9-.6.2-.4 0-1-.5-1.3z" />
        </svg>
      </g>
    </svg>
  );
}
interface Props {
  isOpen: boolean;
  timeLeft: number;
  onKeepWorking: () => void;
  onLogout: () => void;
  stillThereText?: string;
  noticeText?: string;
  timeLeftText?: (val: string) => string;
  logOutText?: string;
  keepWorkingText?: string;
  refreshErrorText?: string;
  hasRefreshError?: boolean;
}

export function SessionNotice({
  isOpen,
  timeLeft,
  onKeepWorking,
  onLogout,
  stillThereText = 'Still there?',
  noticeText = "You're about to be logged out due to inactivity",
  timeLeftText = (time): string => `${time} remaining`,
  logOutText = 'Log out',
  keepWorkingText = 'Keep working',
  refreshErrorText = 'Failed to refresh your session; try again',
  hasRefreshError
}: Props): JSX.Element {
  const theme = useContext(ThemeContext);

  const minsLeft = Math.floor(timeLeft / 60);
  let secondsLeft: string | number = timeLeft - minsLeft * 60;
  if (secondsLeft < 10) secondsLeft = `0${secondsLeft}`;
  const timeLeftString = `${minsLeft}:${secondsLeft}`;

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} testID="session-notice-expiration-modal-container">
      <div>
        <Row margin={{ top: 60, bottom: 32, start: 64, end: 64 }} justifyContent="center">
          <Col width="content">
            <ClockIcon />
          </Col>
        </Row>
        <Row margin={{ top: 16, bottom: 32, start: 64, end: 64 }} justifyContent="center">
          <Col width="content">
            <div
              css={{
                fontSize: theme.font.base.size.h1
              }}
              {...injectTestId('session-notice-expiration-modal-header')}
            >
              {stillThereText}
            </div>
          </Col>
        </Row>
        <Row margin={{ top: 16, bottom: 48, start: 64, end: 64 }} justifyContent="center">
          <Col width="content">
            <div
              css={{
                color: theme.font.color.active,
                fontSize: theme.font.base.size.m,
                fontWeight: theme.font.base.weight.light
              }}
              {...injectTestId('session-notice-expiration-modal-message')}
            >
              {noticeText}
              <br />
              <br />
              <div
                css={{
                  color: theme.font.color.danger.base,
                  fontSize: theme.font.base.size.s,
                  fontWeight: theme.font.base.weight.bold,
                  textAlign: 'center'
                }}
                {...injectTestId('session-notice-expiration-modal-time-left')}
              >
                {timeLeftText(timeLeftString)}
                {hasRefreshError && (
                  <>
                    <br />
                    <br />
                    {refreshErrorText}
                  </>
                )}
              </div>
            </div>
          </Col>
        </Row>
        <Row margin={{ top: 16, bottom: 64, start: 64, end: 64 }} justifyContent="center">
          <Col width="content">
            <Button
              appearance="lined"
              text={logOutText}
              onClick={onLogout}
              testID="session-notice-expiration-modal-log-out-button"
            />
          </Col>
          <Col width="content">
            <Button
              appearance="filled"
              text={keepWorkingText}
              onClick={onKeepWorking}
              testID="session-notice-expiration-modal-keep-working-button"
            />
          </Col>
        </Row>
      </div>
    </Modal>
  );
}
