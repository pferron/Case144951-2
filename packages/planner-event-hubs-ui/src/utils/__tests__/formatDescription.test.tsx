import { formatDescription } from '../formatDescription';

it('Format description correctly with HTML', () => {
  expect(
    formatDescription(
      '<div class="ag87-crtemvc-hsbk"><div class="css-vsf5of"><p style="text-align:justify;" class="carina-rte-public-DraftStyleDefault-block"><span style="color: rgb(0,0,0);">Hello from Unformatted description</span></p><p class="carina-rte-public-DraftStyleDefault-block">&nbsp;</p></div></div>',
      true
    )
  ).toBe('Hello from Unformatted description\\n\\n');
});

it('Format description correctly without HTML', () => {
  expect(
    formatDescription(
      '<div class="ag87-crtemvc-hsbk"><div class="css-vsf5of"><p style="text-align:justify;" class="carina-rte-public-DraftStyleDefault-block"><span style="color: rgb(0,0,0);">Hello from Unformatted description</span></p><p class="carina-rte-public-DraftStyleDefault-block">&nbsp;</p></div></div>',
      false
    )
  ).toBe('Hello from Unformatted description<br><br>');
});
