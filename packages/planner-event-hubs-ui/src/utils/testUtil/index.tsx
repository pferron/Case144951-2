import { render, configure } from '@testing-library/react';
import { TestWrapper } from './TestWrapper';

configure({ testIdAttribute: 'data-cvent-id' });

type RenderParams = Parameters<typeof render>;
type RenderReturn = ReturnType<typeof render>;
const customRender = (ui: RenderParams[0], options?: RenderParams[1]): RenderReturn =>
  render(ui, { wrapper: TestWrapper, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
