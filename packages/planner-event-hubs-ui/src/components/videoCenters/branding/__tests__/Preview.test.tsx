import React from 'react';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import { render } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { CustomFont } from '@cvent/planner-event-hubs-model/types';
import Preview from '../preview';

const headingCustomFont: CustomFont = {
  id: 'eabe1e7e-fd73-4b68-bf49-b6423f5d69da',
  fontFamily: 'FireballHeading',
  fallbackFontId: 4,
  fallbackFont: 'Arial',
  files: [
    {
      url: 'https://custom.t2.cvent.com/D3F4F6FF65B64E99A58CEF1D8F73A6E9/files/67ccc3a44045461ba2cbd1df6d7e7c5a.woff',
      fontStyle: 'normal',
      fontWeight: 900
    }
  ],
  isActive: true
};

const bodyTextCustomFont: CustomFont = {
  id: 'eabe1e7e-fd73-4b68-bf49-b6423f5d69da',
  fontFamily: 'FireballBodyText',
  fallbackFontId: 4,
  fallbackFont: 'Arial',
  files: [
    {
      url: 'https://custom.t2.cvent.com/D3F4F6FF65B64E99A58CEF1D8F73A6E9/files/67ccc3a44045461ba2cbd1df6d7e7c5a.woff',
      fontStyle: 'normal',
      fontWeight: 900
    }
  ],
  isActive: true
};

describe('Testing Preview', () => {
  it('Should render fine in light mood', async () => {
    const { container } = render(
      <TestWrapper>
        <Preview
          primary="#325289"
          secondary="#116ce1"
          background="#000000"
          mood="#FFFFFF"
          safeMode={false}
          testID="testing-preview"
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('testing-preview')).toBeInTheDocument();
    expect(await screen.findByTextKey('video_hub_branding_preview_light')).toBeInTheDocument();
    expect(await screen.findByTextKey('video_hub_branding_preview_subtitle_light')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
  it('Should render fine in night mood', async () => {
    const { container } = render(
      <TestWrapper>
        <Preview
          primary="#325289"
          secondary="#116ce1"
          background="#FFFFFF"
          mood="#212121"
          safeMode={false}
          testID="testing-preview"
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('testing-preview')).toBeInTheDocument();
    expect(await screen.findByTextKey('video_hub_branding_preview_night')).toBeInTheDocument();
    expect(await screen.findByTextKey('video_hub_branding_preview_subtitle_night')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
  it('Should render fine in color mood', async () => {
    const { container } = render(
      <TestWrapper>
        <Preview
          primary="#325289"
          secondary="#116ce1"
          background="#000000"
          mood="#F4F4F4"
          safeMode={false}
          testID="testing-preview"
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('testing-preview')).toBeInTheDocument();
    expect(await screen.findByTextKey('video_hub_branding_preview_color')).toBeInTheDocument();
    expect(await screen.findByTextKey('video_hub_branding_preview_subtitle_color')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should render preview with provided fonts when custom fonts provided', async () => {
    render(
      <TestWrapper>
        <Preview
          primary="#325289"
          secondary="#116ce1"
          background="#000000"
          mood="#F4F4F4"
          safeMode={false}
          testID="testing-preview"
          headingsFont={headingCustomFont}
          bodyTextFont={bodyTextCustomFont}
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('testing-preview')).toBeInTheDocument();
    const headingElement = await screen.findByTextKey('video_hub_branding_preview_color');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveStyle("font-family: FireballHeading,'Helvetica','Arial'");
    const bodyTextElement = await screen.findByTextKey('video_hub_branding_preview_subtitle_color');
    expect(bodyTextElement).toBeInTheDocument();
    expect(bodyTextElement).toHaveStyle("font-family: FireballBodyText,'Helvetica','Arial'");
  });

  it('Should render preview with default fonts when no custom font provided', async () => {
    render(
      <TestWrapper>
        <Preview
          primary="#325289"
          secondary="#116ce1"
          background="#000000"
          mood="#F4F4F4"
          safeMode={false}
          testID="testing-preview"
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('testing-preview')).toBeInTheDocument();
    const ele = await screen.findByTextKey('video_hub_branding_preview_color');
    expect(ele).toBeInTheDocument();
    expect(ele).toHaveStyle("font-family: 'Helvetica','Arial'");
    expect(await screen.findByTextKey('video_hub_branding_preview_subtitle_color')).toBeInTheDocument();
  });
});
