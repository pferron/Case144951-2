import React from 'react';
import { CSSObject } from '@emotion/react';
import Skeleton from '@cvent/carina/components/Skeleton';
import { injectTestId } from '@cvent/nucleus-test-automation';
import Row from '@cvent/carina/components/Row';
import Col from '@cvent/carina/components/Col';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { alignmentStyles, contentLimit, layoutStyles } from '../HomePageSectionMeta';

const useStyles = (alignment): Record<string, CSSObject> => {
  const theme = useTheme();

  return {
    formHeaderSkeleton: {
      backgroundColor: theme.backgroundColor.active,
      opacity: '75%'
    },
    textSkeleton: { backgroundColor: theme.backgroundColor.neutral.surface, opacity: '100%', marginLeft: 0 },
    textSkeletonList: { backgroundColor: theme.backgroundColor.neutral.surface, opacity: '50%', marginLeft: 0 },
    textSkeletonTile: {
      backgroundColor: theme.backgroundColor.neutral.fill.active,
      opacity: '100%',
      marginLeft: 0,
      top: alignment === alignmentStyles.TOP ? '10rem' : '7rem'
    },

    blueTextSkeletonTop: {
      backgroundColor: theme.backgroundColor.brand.fill.base,
      opacity: '100%',
      marginLeft: 0
    },
    blueTextSkeleton: { backgroundColor: theme.backgroundColor.brand.fill.base, opacity: '100%', marginLeft: 0 },

    blueTextSkeletonTile: {
      backgroundColor: theme.backgroundColor.neutral.surface,
      opacity: '100%',
      marginLeft: 0,
      border: 'solid 2px',
      borderColor: theme.backgroundColor.brand.fill.base,
      left: '4rem',
      top: '10.5rem'
    },

    blueTextSkeletonTileLeft: {
      backgroundColor: theme.backgroundColor.neutral.surface,
      opacity: '100%',
      marginLeft: 0,
      border: 'solid 2px',
      borderColor: theme.backgroundColor.brand.fill.base,
      left: '2rem',
      top: '7.5rem'
    },

    blueTextSkeletonNoFill: {
      backgroundColor: theme.backgroundColor.active,
      opacity: '100%',
      marginLeft: 0,
      border: 'solid 2px',
      borderColor: theme.backgroundColor.brand.fill.base
    },
    cardSkeleton: {
      backgroundColor: theme.backgroundColor.active,
      opacity: '50%'
    }
  };
};
type Props = {
  contentCount: number;
  alignment: string;
  layout: string;
};

function EventsSectionPreviewer({ contentCount, layout, alignment }: Props): JSX.Element {
  const {
    textSkeleton,
    cardSkeleton,
    formHeaderSkeleton,
    blueTextSkeleton,
    blueTextSkeletonNoFill,
    blueTextSkeletonTile,
    blueTextSkeletonTileLeft,
    textSkeletonTile,
    textSkeletonList
  } = useStyles(alignment);

  const listViewTop = (
    <>
      <Row>
        <Row>
          <Col width="content" padding={{ start: 0 }}>
            <Skeleton css={textSkeleton} width="5rem" height="0.5rem" />
          </Col>
          <Col width="content" padding={{ start: 540 }}>
            <Skeleton css={blueTextSkeletonNoFill} width="5rem" height="1rem" borderRadius="fiveX" />
          </Col>
        </Row>
        <Row>
          <Skeleton css={textSkeletonList} lines={0.3} height="0.5rem" />
          <Skeleton css={formHeaderSkeleton} lines={0.02} height="0.5rem" />
          <Skeleton css={textSkeletonList} lines={0.1} height="0.5rem" />
          <Skeleton css={formHeaderSkeleton} lines={0.02} height="0.5rem" />
        </Row>
        <Row>
          <Col width="content" padding={{ start: 0 }}>
            <Skeleton css={textSkeleton} width="5rem" height="0rem" />
          </Col>
        </Row>
      </Row>
      <Row>
        <Row>
          <Col width="content" padding={{ start: 0 }}>
            <Skeleton css={textSkeleton} width="5rem" height="0.5rem" />
          </Col>
          <Col width="content" padding={{ start: 540 }}>
            <Skeleton css={blueTextSkeletonNoFill} width="5rem" height="1rem" borderRadius="fiveX" />
          </Col>
        </Row>
        <Row>
          <Skeleton css={textSkeletonList} lines={0.1} height="0.5rem" />
          <Skeleton css={formHeaderSkeleton} lines={0.02} height="0.5rem" />
          <Skeleton css={textSkeletonList} lines={0.1} height="0.5rem" />
          <Skeleton css={formHeaderSkeleton} lines={0.02} height="0.5rem" />
          <Skeleton css={textSkeletonList} lines={0.1} height="0.5rem" />
          <Skeleton css={formHeaderSkeleton} lines={0.02} height="0.5rem" />
        </Row>
        <Row>
          <Col width="content" padding={{ start: 0 }}>
            <Skeleton css={textSkeleton} width="5rem" height="0rem" />
          </Col>
        </Row>
      </Row>
      <Row>
        <Row>
          <Col width="content" padding={{ start: 0 }}>
            <Skeleton css={textSkeleton} width="5rem" height="0.5rem" />
          </Col>
          <Col width="content" padding={{ start: 540 }}>
            <Skeleton css={blueTextSkeletonNoFill} width="5rem" height="1rem" borderRadius="fiveX" />
          </Col>
        </Row>
        <Row>
          <Skeleton css={textSkeletonList} lines={0.3} height="0.5rem" />
          <Skeleton css={formHeaderSkeleton} lines={0.02} height="0.5rem" />
          <Skeleton css={textSkeletonList} lines={0.1} height="0.5rem" />
          <Skeleton css={formHeaderSkeleton} lines={0.02} height="0.5rem" />
        </Row>
        <Row>
          <Col width="content" padding={{ start: 0 }}>
            <Skeleton css={textSkeleton} width="5rem" height="0rem" />
          </Col>
        </Row>
      </Row>
    </>
  );

  const listViewLeft = (
    <>
      <Row>
        <Col width="content" padding={{ start: 0 }}>
          <Skeleton css={textSkeleton} width="5rem" height="0.5rem" />
        </Col>
        <Col width="content" padding={{ start: 325 }}>
          <Skeleton css={blueTextSkeletonNoFill} width="5rem" height="1rem" borderRadius="fiveX" />
        </Col>
      </Row>
      <Row>
        <Skeleton css={formHeaderSkeleton} lines={0.8} height="0.5rem" />
        <Skeleton css={textSkeletonList} lines={0.3} height="0.5rem" />
        <Skeleton css={formHeaderSkeleton} lines={0.02} height="0.5rem" />
        <Skeleton css={textSkeletonList} lines={0.1} height="0.5rem" />
        <Skeleton css={formHeaderSkeleton} lines={0.02} height="0.5rem" />
      </Row>
      <Row>
        <Col width="content" padding={{ start: 0 }}>
          <Skeleton css={textSkeleton} width="5rem" height="0rem" />
        </Col>
      </Row>

      <Row>
        <Col width="content" padding={{ start: 0 }}>
          <Skeleton css={textSkeleton} width="5rem" height="0.5rem" />
        </Col>
        <Col width="content" padding={{ start: 325 }}>
          <Skeleton css={blueTextSkeletonNoFill} width="5rem" height="1rem" borderRadius="fiveX" />
        </Col>
      </Row>
      <Row>
        <Skeleton css={formHeaderSkeleton} lines={1} height="0.5rem" />
        <Skeleton css={textSkeletonList} lines={0.1} height="0.5rem" />
        <Skeleton css={formHeaderSkeleton} lines={0.02} height="0.5rem" />
        <Skeleton css={textSkeletonList} lines={0.1} height="0.5rem" />
        <Skeleton css={formHeaderSkeleton} lines={0.02} height="0.5rem" />
        <Skeleton css={textSkeletonList} lines={0.1} height="0.5rem" />
        <Skeleton css={formHeaderSkeleton} lines={0.02} height="0.5rem" />
      </Row>
      <Row>
        <Col width="content" padding={{ start: 0 }}>
          <Skeleton css={textSkeleton} width="5rem" height="0rem" />
        </Col>
      </Row>

      <Row>
        <Col width="content" padding={{ start: 0 }}>
          <Skeleton css={textSkeleton} width="5rem" height="0.5rem" />
        </Col>
        <Col width="content" padding={{ start: 325 }}>
          <Skeleton css={blueTextSkeletonNoFill} width="5rem" height="1rem" borderRadius="fiveX" />
        </Col>
      </Row>
      <Row>
        <Skeleton css={formHeaderSkeleton} lines={0.8} height="0.5rem" />
        <Skeleton css={textSkeletonList} lines={0.3} height="0.5rem" />
        <Skeleton css={formHeaderSkeleton} lines={0.02} height="0.5rem" />
        <Skeleton css={textSkeletonList} lines={0.1} height="0.5rem" />
        <Skeleton css={formHeaderSkeleton} lines={0.02} height="0.5rem" />
      </Row>
      <Row>
        <Col width="content" padding={{ start: 0 }}>
          <Skeleton css={textSkeleton} width="5rem" height="0rem" />
        </Col>
      </Row>
    </>
  );

  const tileViewTop = (
    <>
      <Row>
        <Col width="content" padding={{ start: 0 }}>
          <Skeleton css={formHeaderSkeleton} width="12.5rem" height="1rem" borderRadius="fiveX" />
        </Col>
      </Row>
      <Row>
        <Col width="content" padding={{ start: 0 }}>
          <Skeleton css={textSkeleton} width="14.5rem" height="15rem" borderRadius="fiveX">
            <Skeleton css={textSkeletonTile} lines={0.7} height="0.5rem" />
            <Skeleton css={textSkeleton} lines={0.1} height="0.5rem" />
            <Skeleton css={textSkeletonTile} lines={0.2} height="0.5rem" />
            <Skeleton css={blueTextSkeletonTile} width="5rem" height="1rem" borderRadius="fiveX" />
          </Skeleton>
        </Col>
        <Col width="content" padding={{ start: 0 }}>
          <Skeleton css={textSkeleton} width="14.5rem" height="15rem" borderRadius="fiveX">
            <Skeleton css={textSkeletonTile} lines={0.7} height="0.5rem" />
            <Skeleton css={textSkeleton} lines={0.1} height="0.5rem" />
            <Skeleton css={textSkeletonTile} lines={0.2} height="0.5rem" />
            <Skeleton css={blueTextSkeletonTile} width="5rem" height="1rem" borderRadius="fiveX" />{' '}
          </Skeleton>
        </Col>
        <Col width="content" padding={{ start: 0 }}>
          <Skeleton css={textSkeleton} width="14.5rem" height="15rem" borderRadius="fiveX">
            <Skeleton css={textSkeletonTile} lines={0.7} height="0.5rem" />
            <Skeleton css={textSkeleton} lines={0.1} height="0.5rem" />
            <Skeleton css={textSkeletonTile} lines={0.2} height="0.5rem" />
            <Skeleton css={blueTextSkeletonTile} width="5rem" height="1rem" borderRadius="fiveX" />{' '}
          </Skeleton>
        </Col>
      </Row>
    </>
  );

  const tileViewLeft = (
    <Row>
      <Col width="content" padding={{ start: 0 }}>
        <Skeleton css={textSkeleton} width="10rem" height="12rem" borderRadius="fiveX">
          <Skeleton css={textSkeletonTile} lines={0.7} height="0.5rem" />
          <Skeleton css={textSkeleton} lines={0.1} height="0.5rem" />
          <Skeleton css={textSkeletonTile} lines={0.2} height="0.5rem" />
          <Skeleton css={blueTextSkeletonTileLeft} width="5rem" height="1rem" borderRadius="fiveX" />
        </Skeleton>
      </Col>
      <Col width="content" padding={{ start: 0 }}>
        <Skeleton css={textSkeleton} width="10rem" height="12rem" borderRadius="fiveX">
          <Skeleton css={textSkeletonTile} lines={0.7} height="0.5rem" />
          <Skeleton css={textSkeleton} lines={0.1} height="0.5rem" />
          <Skeleton css={textSkeletonTile} lines={0.2} height="0.5rem" />
          <Skeleton css={blueTextSkeletonTileLeft} width="5rem" height="1rem" borderRadius="fiveX" />
        </Skeleton>
      </Col>
      <Col width="content" padding={{ start: 0 }}>
        <Skeleton css={textSkeleton} width="10rem" height="12rem" borderRadius="fiveX">
          <Skeleton css={textSkeletonTile} lines={0.7} height="0.5rem" />
          <Skeleton css={textSkeleton} lines={0.1} height="0.5rem" />
          <Skeleton css={textSkeletonTile} lines={0.2} height="0.5rem" />
          <Skeleton css={blueTextSkeletonTileLeft} width="5rem" height="1rem" borderRadius="fiveX" />
        </Skeleton>
      </Col>
    </Row>
  );

  return (
    <div>
      {layout === layoutStyles.List ? (
        <div {...injectTestId('events-section-previewer')}>
          <Skeleton
            height="100%"
            width="800px"
            css={formHeaderSkeleton}
            {...injectTestId('upcomingEvents-form-skeleton-loader-form-title')}
          >
            {alignment === alignmentStyles.TOP ? (
              <Skeleton css={cardSkeleton} borderRadius="fiveX">
                <Row>
                  <Col width="content" padding={{ start: 0 }}>
                    <Skeleton css={textSkeletonList} width="5rem" height="0.75rem" />
                  </Col>
                  <Col width="content" padding={{ start: 540 }}>
                    <Skeleton css={blueTextSkeleton} width="5rem" height="1rem" borderRadius="fiveX" />
                  </Col>
                </Row>
                <Row>
                  <Col width="content" padding={{ start: 0 }}>
                    <Skeleton css={textSkeletonList} width="3rem" height="0.5rem" />
                    <Skeleton css={formHeaderSkeleton} width="1rem" height="0.5rem" />
                    <Skeleton css={textSkeletonList} width="5rem" height="0.5rem" />

                    <Skeleton css={formHeaderSkeleton} width="1rem" height="0.5rem" />
                    <Skeleton css={textSkeletonList} width="5rem" height="0.5rem" />
                    <Skeleton css={textSkeletonList} lines={0.4} height="0.5rem" />
                  </Col>
                </Row>
                <Row>
                  <Col width="content" padding={{ start: 0 }}>
                    <Skeleton css={textSkeleton} width="5rem" height="0rem" />
                  </Col>
                </Row>
                {contentCount === contentLimit.UP_TO_3 ? listViewTop : Array(2).fill(listViewTop)}
              </Skeleton>
            ) : (
              <Skeleton css={cardSkeleton} borderRadius="fiveX">
                <Row>
                  <Col width="content" padding={{ start: 0 }}>
                    <Skeleton css={textSkeletonList} lines={0.2} height="0.5rem" />
                    <Skeleton css={formHeaderSkeleton} lines={0.1} height="0.5rem" />
                    <Skeleton css={textSkeletonList} lines={0.2} height="0.5rem" />
                    <Skeleton css={formHeaderSkeleton} width="1rem" height="0.5rem" />
                    <Skeleton css={textSkeletonList} width="6rem" height="0.5rem" />

                    <Skeleton css={textSkeletonList} lines={0.4} height="0.5rem" />
                    <Skeleton css={textSkeletonList} lines={0.4} height="0.5rem" />
                    <Skeleton css={formHeaderSkeleton} lines={0.3} height="0.5rem" />
                    <Skeleton css={formHeaderSkeleton} lines={0.8} height="0.5rem" />

                    <Skeleton css={blueTextSkeleton} width="5rem" height="1rem" borderRadius="fiveX" />
                  </Col>
                  <Col width="content" padding={{ start: 0, left: 0 }}>
                    {contentCount === contentLimit.UP_TO_3 ? listViewLeft : <>{Array(2).fill(listViewLeft)}</>}
                  </Col>
                </Row>
              </Skeleton>
            )}
          </Skeleton>
        </div>
      ) : (
        <div {...injectTestId('events-section-previewer')}>
          <Skeleton
            height="100%"
            width="800px"
            css={formHeaderSkeleton}
            {...injectTestId('upcomingEvents-form-skeleton-loader-form-title')}
          >
            {alignment === alignmentStyles.TOP ? (
              <Skeleton css={cardSkeleton} borderRadius="fiveX">
                <Row>
                  <Col width="content" padding={{ start: 0 }}>
                    <Skeleton css={textSkeletonList} width="5rem" height="0.5rem" />
                  </Col>
                  <Col width="content" padding={{ start: 540 }}>
                    <Skeleton css={blueTextSkeleton} width="5rem" height="1rem" borderRadius="fiveX" />
                  </Col>
                </Row>
                <Row>
                  <Col width="content" padding={{ start: 0 }}>
                    <Skeleton css={textSkeletonList} lines={0.4} height="0.5rem" />
                    <Skeleton css={formHeaderSkeleton} lines={0.1} height="0.5rem" />
                    <Skeleton css={textSkeletonList} lines={0.2} height="0.5rem" />
                    <Skeleton css={textSkeletonList} width="2rem" height="0.5rem" />
                    <Skeleton css={formHeaderSkeleton} width="1rem" height="0.5rem" />
                    <Skeleton css={textSkeletonList} width="3rem" height="0.5rem" />
                    <Skeleton css={formHeaderSkeleton} width="1rem" height="0.5rem" />
                    <Skeleton css={textSkeletonList} width="5rem" height="0.5rem" />
                    <Skeleton css={formHeaderSkeleton} width="1rem" height="0.5rem" />
                    <Skeleton css={textSkeletonList} width="5rem" height="0.5rem" />
                  </Col>
                </Row>
                {contentCount === contentLimit.UP_TO_3 ? tileViewTop : Array(2).fill(tileViewTop)}
              </Skeleton>
            ) : (
              <Skeleton css={cardSkeleton} borderRadius="fiveX">
                <Row>
                  <Col width="content" padding={{ start: 0 }}>
                    <Skeleton css={textSkeletonList} lines={0.2} height="0.5rem" />
                    <Skeleton css={formHeaderSkeleton} lines={0.1} height="0.5rem" />
                    <Skeleton css={textSkeletonList} lines={0.2} height="0.5rem" />
                    <Skeleton css={formHeaderSkeleton} width="1rem" height="0.5rem" />
                    <Skeleton css={textSkeletonList} width="6rem" height="0.5rem" />

                    <Skeleton css={textSkeletonList} lines={0.4} height="0.5rem" />
                    <Skeleton css={textSkeletonList} lines={0.4} height="0.5rem" />
                    <Skeleton css={formHeaderSkeleton} lines={0.3} height="0.5rem" />
                    <Skeleton css={formHeaderSkeleton} lines={0.8} height="0.5rem" />

                    <Skeleton css={blueTextSkeleton} width="5rem" height="1rem" borderRadius="fiveX" />
                  </Col>
                  <Col width="content" padding={{ start: 0 }}>
                    {contentCount === contentLimit.UP_TO_3 ? tileViewLeft : <>{Array(2).fill(tileViewLeft)}</>}
                  </Col>
                </Row>
              </Skeleton>
            )}
          </Skeleton>
        </div>
      )}
    </div>
  );
}

export default EventsSectionPreviewer;
