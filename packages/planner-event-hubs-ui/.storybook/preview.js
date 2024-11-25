import { addDecorator } from '@storybook/react';
import { withTheme } from './addons/theme-switcher/register';
import StoryView from './StoryView';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { MockedProvider } from '@apollo/client/testing';

export const parameters = {
  nextRouter: {
    Provider: RouterContext.Provider
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  apolloClient: {
    MockedProvider
  }
};

addDecorator(withTheme());
addDecorator(renderStory => <StoryView>{renderStory()}</StoryView>);
