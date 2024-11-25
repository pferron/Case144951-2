import { Breakpoints } from '@cvent/carina/components/Breakpoints';
import { ThemeProvider as V1ThemeProvider } from '@cvent/carina/components/ThemeProvider';
import { ThemeProvider as V0ThemeProvider } from '@cvent/carina/components/ThemeProvider/ThemeProvider';
import { LocalizationProvider } from 'nucleus-text';
import locales, { defaultLocale } from '../../../locales';
import { GlobalStyles } from '../../utils/GlobalStyles';
import { getDefaultTheme } from './index';

export function StoryWrapper({ children }: Props): JSX.Element {
  return (
    <V0ThemeProvider theme={getDefaultTheme()}>
      <V1ThemeProvider theme={getDefaultTheme()}>
        <LocalizationProvider locale={defaultLocale} clientSideLocales={locales} serverSideLocales={locales}>
          <GlobalStyles />
          <Breakpoints ssrSize="m" key={typeof window === 'undefined' ? 'ssr' : 'csr'}>
            {children}
          </Breakpoints>
        </LocalizationProvider>
      </V1ThemeProvider>
    </V0ThemeProvider>
  );
}

interface Props {
  children: JSX.Element;
}
