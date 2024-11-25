import React, { ReactNode, useState } from 'react';
import { fireEvent, render, screen } from '@utils/testUtil';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { BreakpointsContext } from '@cvent/carina/components/Breakpoints/BreakpointsProvider';
import PropTypes from 'prop-types';
import Flyout from '../Flyout';

const size = { s: 0, m: 0, l: 0, xl: 0, isS: true };

function Wrapper({ hoverTrigger = false }): JSX.Element {
  const [isVisible, setVisibility] = useState(false);
  const trigger = ({ toggleOpen }): ReactNode => (
    <div {...injectTestId('flyout-trigger')} onClick={toggleOpen} onKeyDown={() => null} role="button" tabIndex={0}>
      Open flyout
    </div>
  );

  return (
    <Flyout
      isVisible={isVisible}
      toggleVisible={setVisibility}
      trigger={trigger}
      triggerMethod={hoverTrigger ? 'HOVER' : undefined}
      hasSpacerAfterTrigger
    >
      {(): ReactNode => <div>Flyout content</div>}
    </Flyout>
  );
}
Wrapper.propTypes = {
  hoverTrigger: PropTypes.bool
};

describe('Flyout', () => {
  describe('for desktop view', () => {
    it('should open flyout initially', async () => {
      const { container } = render(<Wrapper />);
      expect(container).toMatchSnapshot();
      expect(await screen.findByTestId('flyout-container')).toBeInTheDocument();
      expect(screen.queryByText('Flyout content')).toBeVisible();
    });

    it('should open flyout after click', async () => {
      render(<Wrapper />);
      expect(screen).toMatchSnapshot();
      expect(await screen.findByTestId('flyout-trigger')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('flyout-trigger'));
      expect(screen.getByText('Flyout content')).toBeVisible();
    });
    it('should open flyout after mouseEnter', async () => {
      render(<Wrapper hoverTrigger />);
      expect(screen).toMatchSnapshot();
      expect(await screen.findByTestId('flyout-container')).toBeInTheDocument();
      const element = await screen.findByTestId('flyout-container');
      fireEvent.mouseEnter(element);
      expect(await screen.findByText('Flyout content')).toBeVisible();
    });
  });

  describe('for mobile view', () => {
    it('should not open flyout initially', async () => {
      render(
        <BreakpointsContext.Provider value={size}>
          <Wrapper />
        </BreakpointsContext.Provider>
      );

      expect(await screen.findByTestId('flyout-container')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-navigation-panel')).not.toBeInTheDocument();
    });

    it('should open flyout after click', async () => {
      render(
        <BreakpointsContext.Provider value={size}>
          <Wrapper />
        </BreakpointsContext.Provider>
      );

      expect(await screen.findByTestId('flyout-trigger')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('flyout-trigger'));
      expect(await screen.findByTestId('mobile-navigation-panel')).toBeInTheDocument();
      expect(screen.getByText('Flyout content')).toBeInTheDocument();
    });
  });
});
