import React from 'react';
import { CSSObject } from '@emotion/react';
import Skeleton from '@cvent/carina/components/Skeleton';
import { injectTestId } from '@cvent/nucleus-test-automation';
import Row from '@cvent/carina/components/Row';
import Col from '@cvent/carina/components/Col';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { alignmentStyles } from '../HomePageSectionMeta';

const useStyles = (): Record<string, CSSObject> => {
  const theme = useTheme();

  return {
    formHeaderSkeleton: {
      backgroundColor: theme.backgroundColor.active,
      opacity: '50%'
    },
    textSkeleton: { backgroundColor: theme.backgroundColor.neutral.surface, opacity: '100%', marginLeft: 0 },
    blueTextSkeleton: { backgroundColor: theme.backgroundColor.brand.fill.base, opacity: '100%', marginLeft: 0 },
    cardSkeleton: {
      backgroundColor: theme.backgroundColor.active,
      opacity: '50%'
    }
  };
};
type Props = {
  alignment: string;
  visibleFields: string[];
};

function SingleChannelSectionPreviewer({ alignment, visibleFields }: Props): JSX.Element {
  const { textSkeleton, cardSkeleton, formHeaderSkeleton, blueTextSkeleton } = useStyles();
  const channelDesc = visibleFields?.includes('channel.description');
  const videoDesc = visibleFields?.includes('video.description');
  const videoCount = visibleFields?.includes('channel.video_count');

  return (
    <div {...injectTestId('single-channel-section-previewer')}>
      <Skeleton
        height="100%"
        width="800px"
        css={formHeaderSkeleton}
        {...injectTestId('SingleChannel-form-skeleton-loader-form-title')}
      >
        {alignment === alignmentStyles.TOP ? (
          <Skeleton css={cardSkeleton} borderRadius="fiveX">
            <Row>
              <Col width="content" padding={{ start: 0 }}>
                <Skeleton css={textSkeleton} width="3rem" height="0.75rem" />
                <Skeleton css={formHeaderSkeleton} width="1rem" height="0.75rem" />
                <Skeleton css={textSkeleton} width="7rem" height="0.75rem" />
                <Skeleton css={formHeaderSkeleton} width="3rem" height="0.5rem" />
                {videoCount && <Skeleton css={textSkeleton} width="2rem" height="0.5rem" />}
                <Skeleton css={formHeaderSkeleton} width="1rem" height="0.5rem" />
                {videoCount && <Skeleton css={textSkeleton} width="3rem" height="0.5rem" />}
              </Col>
              <Col width="content" padding={{ start: 620 }}>
                <Skeleton css={blueTextSkeleton} width="5rem" height="1rem" borderRadius="fiveX" />
              </Col>
            </Row>
            {channelDesc && (
              <Row>
                <Col width="content" padding={{ start: 0 }}>
                  <Skeleton css={textSkeleton} width="6rem" height="0.5rem" />
                  <Skeleton css={formHeaderSkeleton} width="1rem" height="0.5rem" />
                  <Skeleton css={textSkeleton} width="7rem" height="0.5rem" />
                  <Skeleton css={formHeaderSkeleton} width="3rem" height="0.5rem" />
                  <Skeleton css={textSkeleton} width="2rem" height="0.5rem" />
                </Col>
              </Row>
            )}
            <Row>
              <Col width="content" padding={{ start: 0 }}>
                <Skeleton css={textSkeleton} width="10rem" height="0rem" borderRadius="fiveX" />
              </Col>
            </Row>
            <Row>
              <Col width="content" padding={{ start: 0 }}>
                <Skeleton css={textSkeleton} width="14.5rem" height="8rem" borderRadius="fiveX" />
                <Skeleton css={blueTextSkeleton} lines={0.8} height="0.5rem" />
                {videoDesc && <Skeleton css={textSkeleton} lines={0.3} height="0.5rem" />}
                {videoDesc && <Skeleton css={formHeaderSkeleton} lines={0.1} height="0.5rem" />}
                {videoDesc && <Skeleton css={textSkeleton} lines={0.5} height="0.5rem" />}
                {videoDesc && <Skeleton css={textSkeleton} lines={0.9} height="0.5rem" />}
              </Col>
              <Col width="content" padding={{ start: 0 }}>
                <Skeleton css={textSkeleton} width="14.5rem" height="8rem" borderRadius="fiveX" />
                <Skeleton css={blueTextSkeleton} lines={0.5} height="0.5rem" />
                <Skeleton css={formHeaderSkeleton} lines={0.1} height="0.5rem" />
                <Skeleton css={blueTextSkeleton} lines={0.3} height="0.5rem" />
                {videoDesc && <Skeleton css={textSkeleton} lines={0.6} height="0.5rem" />}
                {videoDesc && <Skeleton css={textSkeleton} lines={0.9} height="0.5rem" />}
              </Col>
              <Col width="content" padding={{ start: 0 }}>
                <Skeleton css={textSkeleton} width="14.5rem" height="8rem" borderRadius="fiveX" />
                <Skeleton css={blueTextSkeleton} lines={0.8} height="0.5rem" />
                {videoDesc && <Skeleton css={textSkeleton} lines={0.3} height="0.5rem" />}
                {videoDesc && <Skeleton css={formHeaderSkeleton} lines={0.1} height="0.5rem" />}
                {videoDesc && <Skeleton css={textSkeleton} lines={0.5} height="0.5rem" />}
                {videoDesc && <Skeleton css={textSkeleton} lines={0.9} height="0.5rem" />}
              </Col>
            </Row>
          </Skeleton>
        ) : (
          <Skeleton css={cardSkeleton} borderRadius="fiveX">
            <Row>
              <Col width="content" padding={{ start: 0 }}>
                <Skeleton css={textSkeleton} width="11.5rem" lines={0.2} height="0.75rem" />
                <Skeleton css={formHeaderSkeleton} width="11.5rem" lines={0.1} height="0.75rem" />
                <Skeleton css={textSkeleton} width="11.5rem" lines={0.5} height="0.75rem" />
                <br />
                {videoCount && <Skeleton css={textSkeleton} lines={0.1} height="0.25rem" />}
                {videoCount && <Skeleton css={formHeaderSkeleton} lines={0.1} height="0.25rem" />}
                {videoCount && <Skeleton css={textSkeleton} lines={0.4} height="0.25rem" />}
                <br />
                {channelDesc && <Skeleton css={textSkeleton} lines={0.8} height="0.25rem" />}
                {channelDesc && <Skeleton css={formHeaderSkeleton} lines={0.2} height="0.25rem" />}
                {channelDesc && <Skeleton css={textSkeleton} lines={0.5} height="0.25rem" />}
                <br />
                <br />
                <Skeleton css={blueTextSkeleton} width="5rem" height="1rem" borderRadius="fiveX" />
              </Col>
              <Col width="content" padding={{ start: 0 }}>
                <Skeleton css={formHeaderSkeleton} width="1rem" height="8rem" borderRadius="fiveX" />
              </Col>
              <Col width="content" padding={{ start: 0 }}>
                <Skeleton css={textSkeleton} width="10.5rem" height="8rem" borderRadius="fiveX" />
                <Skeleton css={blueTextSkeleton} lines={0.8} height="0.5rem" />
                {videoDesc && <Skeleton css={textSkeleton} lines={0.3} height="0.5rem" />}
                {videoDesc && <Skeleton css={formHeaderSkeleton} lines={0.1} height="0.5rem" />}
                {videoDesc && <Skeleton css={textSkeleton} lines={0.5} height="0.5rem" />}
                {videoDesc && <Skeleton css={textSkeleton} lines={0.9} height="0.5rem" />}
              </Col>
              <Col width="content" padding={{ start: 0 }}>
                <Skeleton css={textSkeleton} width="10.5rem" height="8rem" borderRadius="fiveX" />
                <Skeleton css={blueTextSkeleton} lines={0.5} height="0.5rem" />
                <Skeleton css={formHeaderSkeleton} lines={0.1} height="0.5rem" />
                <Skeleton css={blueTextSkeleton} lines={0.3} height="0.5rem" />
                {videoDesc && <Skeleton css={textSkeleton} lines={0.6} height="0.5rem" />}
                {videoDesc && <Skeleton css={textSkeleton} lines={0.9} height="0.5rem" />}
              </Col>
              <Col width="content" padding={{ start: 0 }}>
                <Skeleton css={textSkeleton} width="10.5rem" height="8rem" borderRadius="fiveX" />
                <Skeleton css={blueTextSkeleton} lines={0.8} height="0.5rem" />
                {videoDesc && <Skeleton css={textSkeleton} lines={0.3} height="0.5rem" />}
                {videoDesc && <Skeleton css={formHeaderSkeleton} lines={0.1} height="0.5rem" />}
                {videoDesc && <Skeleton css={textSkeleton} lines={0.5} height="0.5rem" />}
                {videoDesc && <Skeleton css={textSkeleton} lines={0.9} height="0.5rem" />}
              </Col>
            </Row>
          </Skeleton>
        )}
      </Skeleton>
    </div>
  );
}

export default SingleChannelSectionPreviewer;
