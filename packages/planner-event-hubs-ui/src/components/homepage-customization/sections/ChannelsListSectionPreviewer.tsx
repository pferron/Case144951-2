import React from 'react';
import { CSSObject } from '@emotion/react';
import Skeleton from '@cvent/carina/components/Skeleton';
import { injectTestId } from '@cvent/nucleus-test-automation';
import Row from '@cvent/carina/components/Row';
import Col from '@cvent/carina/components/Col';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';

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
  numberOfChannels: number;
  visibleFields: string[];
};

function ChannelsListSectionPreviewer({ numberOfChannels, visibleFields }: Props): JSX.Element {
  const { textSkeleton, cardSkeleton, formHeaderSkeleton, blueTextSkeleton } = useStyles();
  const image = visibleFields.includes('image');
  const videosNumber = visibleFields.includes('videos');
  const description = visibleFields.includes('description');

  return (
    <div {...injectTestId('channels-list-section-previewer')}>
      <Skeleton
        height="100%"
        width="800px"
        css={formHeaderSkeleton}
        {...injectTestId('channelsList-form-skeleton-loader-form-title')}
      >
        <Skeleton css={cardSkeleton} borderRadius="fiveX">
          <Row>
            <Col width="content" padding={{ start: 0 }}>
              <Skeleton css={textSkeleton} width="5rem" height="0.75rem" />
            </Col>
            <Col width="content" padding={{ start: 540 }}>
              <Skeleton css={blueTextSkeleton} width="5rem" height="1rem" borderRadius="fiveX" />
            </Col>
          </Row>
          {numberOfChannels === 4 ? (
            <>
              <Row>
                <Col width="content" padding={{ start: 0 }}>
                  <Skeleton css={textSkeleton} width="10rem" height="0rem" borderRadius="fiveX" />
                </Col>
              </Row>
              <Row>
                <Col width="content" padding={{ start: 0 }}>
                  {image ? (
                    <Skeleton css={textSkeleton} width="10.5rem" height="7rem" borderRadius="fiveX" />
                  ) : (
                    <Skeleton css={textSkeleton} width="10.5rem" height="0rem" borderRadius="fiveX" />
                  )}
                  <Skeleton css={blueTextSkeleton} lines={0.8} height="0.5rem" borderRadius="twoX" />
                  {description && <Skeleton css={textSkeleton} lines={0.9} height="0.5rem" borderRadius="twoX" />}
                  {videosNumber && <Skeleton css={textSkeleton} lines={0.3} height="0.5rem" borderRadius="twoX" />}
                </Col>
                <Col width="content" padding={{ start: 0 }}>
                  {image ? (
                    <Skeleton css={textSkeleton} width="10.5rem" height="7rem" borderRadius="fiveX" />
                  ) : (
                    <Skeleton css={textSkeleton} width="10.5rem" height="0rem" borderRadius="fiveX" />
                  )}
                  <Skeleton css={blueTextSkeleton} lines={0.6} height="0.5rem" borderRadius="twoX" />
                  <Skeleton css={formHeaderSkeleton} lines={0.1} height="0.5rem" borderRadius="twoX" />
                  <Skeleton css={blueTextSkeleton} lines={0.2} height="0.5rem" borderRadius="twoX" />
                  {description && <Skeleton css={textSkeleton} lines={0.9} height="0.5rem" borderRadius="twoX" />}
                  {videosNumber && <Skeleton css={textSkeleton} lines={0.3} height="0.5rem" borderRadius="twoX" />}
                </Col>
                <Col width="content" padding={{ start: 0 }}>
                  {image ? (
                    <Skeleton css={textSkeleton} width="10.5rem" height="7rem" borderRadius="fiveX" />
                  ) : (
                    <Skeleton css={textSkeleton} width="10.5rem" height="0rem" borderRadius="fiveX" />
                  )}
                  <Skeleton css={blueTextSkeleton} lines={0.8} height="0.5rem" borderRadius="twoX" />
                  {description && <Skeleton css={textSkeleton} lines={0.9} height="0.5rem" borderRadius="twoX" />}
                  {videosNumber && <Skeleton css={textSkeleton} lines={0.3} height="0.5rem" borderRadius="twoX" />}
                </Col>
                <Col width="content" padding={{ start: 0 }}>
                  {image ? (
                    <Skeleton css={textSkeleton} width="10.5rem" height="7rem" borderRadius="fiveX" />
                  ) : (
                    <Skeleton css={textSkeleton} width="10.5rem" height="0rem" borderRadius="fiveX" />
                  )}
                  <Skeleton css={blueTextSkeleton} lines={0.6} height="0.5rem" borderRadius="twoX" />
                  <Skeleton css={formHeaderSkeleton} lines={0.1} height="0.5rem" borderRadius="twoX" />
                  <Skeleton css={blueTextSkeleton} lines={0.2} height="0.5rem" borderRadius="twoX" />
                  {description && <Skeleton css={textSkeleton} lines={0.9} height="0.5rem" borderRadius="twoX" />}
                  {videosNumber && <Skeleton css={textSkeleton} lines={0.3} height="0.5rem" borderRadius="twoX" />}
                </Col>
              </Row>
            </>
          ) : (
            <>
              {Array(2).fill(
                <>
                  <Row>
                    <Col width="content" padding={{ start: 0 }}>
                      <Skeleton css={textSkeleton} width="10rem" height="0rem" borderRadius="fiveX" />
                    </Col>
                  </Row>
                  <Row>
                    <Col width="content" padding={{ start: 0 }}>
                      {image ? (
                        <Skeleton css={textSkeleton} width="10.5rem" height="7rem" borderRadius="fiveX" />
                      ) : (
                        <Skeleton css={textSkeleton} width="10.5rem" height="0rem" borderRadius="fiveX" />
                      )}
                      <Skeleton css={blueTextSkeleton} lines={0.8} height="0.5rem" borderRadius="twoX" />
                      {description && <Skeleton css={textSkeleton} lines={0.9} height="0.5rem" borderRadius="twoX" />}
                      {videosNumber && <Skeleton css={textSkeleton} lines={0.3} height="0.5rem" borderRadius="twoX" />}
                    </Col>
                    <Col width="content" padding={{ start: 0 }}>
                      {image ? (
                        <Skeleton css={textSkeleton} width="10.5rem" height="7rem" borderRadius="fiveX" />
                      ) : (
                        <Skeleton css={textSkeleton} width="10.5rem" height="0rem" borderRadius="fiveX" />
                      )}
                      <Skeleton css={blueTextSkeleton} lines={0.6} height="0.5rem" borderRadius="twoX" />
                      <Skeleton css={formHeaderSkeleton} lines={0.1} height="0.5rem" borderRadius="twoX" />
                      <Skeleton css={blueTextSkeleton} lines={0.2} height="0.5rem" borderRadius="twoX" />
                      {description && <Skeleton css={textSkeleton} lines={0.9} height="0.5rem" borderRadius="twoX" />}
                      {videosNumber && <Skeleton css={textSkeleton} lines={0.3} height="0.5rem" borderRadius="twoX" />}
                    </Col>
                    <Col width="content" padding={{ start: 0 }}>
                      {image ? (
                        <Skeleton css={textSkeleton} width="10.5rem" height="7rem" borderRadius="fiveX" />
                      ) : (
                        <Skeleton css={textSkeleton} width="10.5rem" height="0rem" borderRadius="fiveX" />
                      )}
                      <Skeleton css={blueTextSkeleton} lines={0.8} height="0.5rem" borderRadius="twoX" />
                      {description && <Skeleton css={textSkeleton} lines={0.9} height="0.5rem" borderRadius="twoX" />}
                      {videosNumber && <Skeleton css={textSkeleton} lines={0.3} height="0.5rem" borderRadius="twoX" />}
                    </Col>
                    <Col width="content" padding={{ start: 0 }}>
                      {image ? (
                        <Skeleton css={textSkeleton} width="10.5rem" height="7rem" borderRadius="fiveX" />
                      ) : (
                        <Skeleton css={textSkeleton} width="10.5rem" height="0rem" borderRadius="fiveX" />
                      )}
                      <Skeleton css={blueTextSkeleton} lines={0.6} height="0.5rem" borderRadius="twoX" />
                      <Skeleton css={formHeaderSkeleton} lines={0.1} height="0.5rem" borderRadius="twoX" />
                      <Skeleton css={blueTextSkeleton} lines={0.2} height="0.5rem" borderRadius="twoX" />
                      {description && <Skeleton css={textSkeleton} lines={0.9} height="0.5rem" borderRadius="twoX" />}
                      {videosNumber && <Skeleton css={textSkeleton} lines={0.3} height="0.5rem" borderRadius="twoX" />}
                    </Col>
                  </Row>
                </>
              )}
            </>
          )}
        </Skeleton>
      </Skeleton>
    </div>
  );
}

export default ChannelsListSectionPreviewer;
