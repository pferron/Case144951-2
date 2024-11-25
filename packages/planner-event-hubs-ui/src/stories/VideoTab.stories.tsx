import Videos from '@components/channels/videos/Videos';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import { useRef } from 'react';
import CatalogDataWithSection from './fixtures/DummyCatalogDataFileWithSection.json';
import CatalogDataWithoutSection from './fixtures/DummyCatalogDataFileWithoutSection.json';
import { StoryWrapper } from './utils/StoryWrapper';

export default {
  title: 'Channel Videos',
  component: Videos
};

const onVideoCatalogUpdate = () => {
  /**/
};

export function EmptyView(): JSX.Element {
  const ref = useRef();

  return (
    <StoryWrapper>
      <ScrollViewWithBars forwardScrollViewRef={ref}>
        <Videos
          videoCatalog={null}
          onVideoCatalogUpdate={onVideoCatalogUpdate}
          containerRef={ref}
          setIsPageEdited={null}
          isSuccess
          setIsSuccess={() => {
            // Comment to remove ts warnings
          }}
          submitRef={null}
        />
      </ScrollViewWithBars>
    </StoryWrapper>
  );
}

export function VideosWithoutSections(): JSX.Element {
  const ref = useRef();

  return (
    <StoryWrapper>
      <ScrollViewWithBars forwardScrollViewRef={ref}>
        <Videos
          videoCatalog={CatalogDataWithoutSection}
          onVideoCatalogUpdate={onVideoCatalogUpdate}
          containerRef={ref}
          setIsPageEdited={null}
          isSuccess
          setIsSuccess={() => {
            // Comment to remove ts warnings
          }}
          submitRef={null}
        />
      </ScrollViewWithBars>
    </StoryWrapper>
  );
}

export function VideosWithSections(): JSX.Element {
  const ref = useRef();
  return (
    <StoryWrapper>
      <ScrollViewWithBars forwardScrollViewRef={ref}>
        <Videos
          videoCatalog={CatalogDataWithSection}
          onVideoCatalogUpdate={onVideoCatalogUpdate}
          containerRef={ref}
          setIsPageEdited={null}
          isSuccess
          setIsSuccess={() => {
            // Comment to remove ts warnings
          }}
          submitRef={null}
        />
      </ScrollViewWithBars>
    </StoryWrapper>
  );
}
