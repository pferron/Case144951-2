import { Row } from '@cvent/carina/components/Row';
import { Col } from '@cvent/carina/components/Col';
import React from 'react';
import { useThemeChangePreviewStyles } from '@components/videoCenters/branding/preview/styles';

export function HeaderSkeleton(): JSX.Element {
  const { logoShadow, navItems, profile, header } = useThemeChangePreviewStyles();
  return (
    <header css={header}>
      <Row justifyContent="flex-start" margin={0}>
        <Col
          width="fill"
          flex={{
            display: 'flex',
            justifyContent: 'flex-start'
          }}
        >
          <div css={logoShadow} />
        </Col>
        <Col
          width="fill"
          flex={{
            display: 'flex',
            justifyContent: 'center'
          }}
          css={{ gap: 12 }}
          padding={{ start: 16 }}
        >
          <div css={navItems} />
          <div css={navItems} />
          <div css={navItems} />
        </Col>
        <Col
          width="fill"
          flex={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          padding={{ end: 4 }}
          offsetEnd={0}
        >
          <div css={profile} />
        </Col>
      </Row>
    </header>
  );
}
