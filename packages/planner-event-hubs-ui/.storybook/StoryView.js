import React from 'react';

const IFRAME_BODY_MARGIN = 16;

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    minHeight: `calc(100vh - (${IFRAME_BODY_MARGIN * 2}px))`,
    boxSizing: 'border-box'
  }
};

const StoryView = ({ children }) => (
  <div style={styles.container}>{children}</div>
);

export default StoryView;
