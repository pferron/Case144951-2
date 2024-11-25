import Header from '@components/Header';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import Tabs from '@cvent/carina/components/Tabs/Tabs';
import { CHANNELS_URL, VIDEO_HUBS_URL, VIDEO_HUB_URL } from '@utils/constants';
import { useState } from 'react';
import { StoryWrapper } from './utils/StoryWrapper';

export default {
  title: 'Header'
};

interface HeaderArguments {
  showActions: boolean;
  showBreadCrumbs: boolean;
  showTabs: boolean;
  moreThanTwoButton: boolean;
}

function Template({ moreThanTwoButton, showActions, showBreadCrumbs, showTabs }: HeaderArguments): JSX.Element {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const updateTab = (_value, _option): void => {
    setSelectedTab(_value);
  };

  const moreThanTwoHeaderActions = showActions && [
    {
      value: 'Delete channel'
    },
    {
      value: 'View channel'
    },

    {
      value: 'Test button 1'
    },
    {
      value: 'Test Button 2'
    }
  ];

  const headerActions = showActions && [
    {
      value: 'Delete channel'
    },
    {
      value: 'View channel'
    }
  ];

  const headerBreadCrumbs = showBreadCrumbs && (
    <Breadcrumbs>
      <Crumb href={VIDEO_HUBS_URL}>video_hubs_header_title</Crumb>
      <Crumb href={VIDEO_HUB_URL.replace('[video-center]', 'testVideoHub')}>test video</Crumb>
      <Crumb href={CHANNELS_URL.replace('[video-center]', 'testVideoHub')}>Channels</Crumb>
      <Crumb>Channel</Crumb>
    </Breadcrumbs>
  );

  const tabs = showTabs && (
    <Tabs
      options={[
        { label: 'Channel Information', value: 0 },
        { label: 'Video', value: 1 }
      ]}
      selected={selectedTab}
      onUpdate={updateTab}
      removeBottomBorder
    />
  );

  const title = 'Dummy Header';

  return (
    <StoryWrapper>
      <div
        css={{
          flexGrow: 1,
          overflowY: 'auto',
          width: '100%'
        }}
      >
        <Header
          title={title}
          actions={moreThanTwoButton ? moreThanTwoHeaderActions : headerActions}
          breadCrumbs={headerBreadCrumbs}
          tabs={tabs}
        />
      </div>
    </StoryWrapper>
  );
}

export const FullHeader = Template.bind({});
FullHeader.args = {
  showActions: true,
  showBreadCrumbs: true,
  showTabs: true,
  moreThanTwoButton: false
};
