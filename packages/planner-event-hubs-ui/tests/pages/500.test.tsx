import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getDefaultTheme } from '@cvent/carina/utils/tokens';
import ThemeProvider from '@cvent/carina/components/ThemeProvider';
import { InternalServerErrorPage } from '../../src/pages/500';

jest.mock('nucleus-text', () => {
  const actualMethods = jest.requireActual('nucleus-text');
  return {
    __esModule: true,
    ...actualMethods,
    useTranslate: jest.fn(() => {
      return {
        translate: jest.fn(param => param)
      };
    })
  };
});

const mockedPush = jest.fn();
const mockedBack = jest.fn();

jest.mock('next/router', () => {
  const originalRouter = jest.requireActual('next/router');
  return {
    __esModule: true,
    ...originalRouter,
    useRouter: () => {
      return {
        route: '/',
        pathname: '',
        asPath: '',
        back: mockedBack,
        push: mockedPush,
        query: {
          requestId: '111',
          pageLoadId: '111',
          date: '2014-04-03'
        }
      };
    }
  };
});

let mockRefValue = { current: '' };
jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useRef: () => {
      return mockRefValue;
    }
  };
});

describe('<InternalServerErrorPage>', () => {
  const theme = getDefaultTheme();

  beforeEach(() => {
    jest.clearAllMocks();
    mockRefValue = { current: '' };
  });

  it('Render InternalServerErrorPage', () => {
    render(
      <ThemeProvider theme={theme}>
        <InternalServerErrorPage />
      </ThemeProvider>
    );
    expect(screen.getByText('error_title')).toBeInTheDocument();
    expect(screen.getByText('500_error_content')).toBeInTheDocument();
    expect(screen.getByText('error_heading')).toBeInTheDocument();
    expect(screen.getByText('error_date_heading')).toBeInTheDocument();
  });
  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Go back if no current returnUrl', () => {
    render(
      <ThemeProvider theme={theme}>
        <InternalServerErrorPage />
      </ThemeProvider>
    );

    const errorItem = screen.getByText('error_go_back');
    userEvent.click(errorItem);
    expect(mockedBack).toHaveBeenCalled();
  });
  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Go returnUrl.current if returnUrl present', () => {
    mockRefValue = { current: 'cvent.com' };
    render(
      <ThemeProvider theme={theme}>
        <InternalServerErrorPage />
      </ThemeProvider>
    );

    const errorItem = screen.getByText('error_go_back');
    userEvent.click(errorItem);
    expect(mockedPush).toHaveBeenCalled();
  });
});
