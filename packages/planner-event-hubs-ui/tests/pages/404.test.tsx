import React, { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { getDefaultTheme } from '@cvent/carina/utils/tokens';
import ThemeProvider from '@cvent/carina/components/ThemeProvider';
import { NotFound } from '../../src/pages/404';

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useRef: jest.fn()
  };
});

const mockedUseRef = useRef as jest.MockedFunction<typeof useRef>;

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

jest.mock('next/router', () => ({
  useRouter() {
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
}));

describe('<NotFound>', () => {
  const theme = getDefaultTheme();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Render NotFound', () => {
    mockedUseRef.mockReturnValue({ current: null });
    render(
      <ThemeProvider theme={theme}>
        <NotFound />
      </ThemeProvider>
    );
    expect(screen.getByText('404_error_title')).toBeInTheDocument();
    expect(screen.getByText('404_error_content')).toBeInTheDocument();
    expect(screen.getByText('error_heading')).toBeInTheDocument();
    expect(screen.getByText('error_date_heading')).toBeInTheDocument();
  });

  it('Go back if no current returnUrl', async () => {
    mockedUseRef.mockReturnValue({ current: null });

    render(
      <ThemeProvider theme={theme}>
        <NotFound />
      </ThemeProvider>
    );

    const backBtn = await screen.findByRole('button');
    fireEvent.click(backBtn);
    expect(mockedPush).toHaveBeenCalled();
  });

  it('Go returnUrl.current if returnUrl present', async () => {
    mockedUseRef.mockReturnValue({ current: 'cvent.com' });
    render(
      <ThemeProvider theme={theme}>
        <NotFound />
      </ThemeProvider>
    );

    const backBtn = await screen.findByRole('button');
    fireEvent.click(backBtn);
    expect(mockedPush).toHaveBeenCalled();
  });
});
