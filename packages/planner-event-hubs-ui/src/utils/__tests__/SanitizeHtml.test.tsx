import { SanitizeHTML } from '@utils/SanitizeHTML';

describe('Test Html sanitization', () => {
  it('onLoad is not allowed', () => {
    expect(
      SanitizeHTML(
        '<div><div onload=alert(\'XSS02\')> Xss issue </div> <img src="img_girl.jpg" alt="Girl in a jacket"' +
          'width="500" height="600" /> </div>'
      )
    ).toBe(
      '<div><div> Xss issue </div> <img src="img_girl.jpg" alt="Girl in a jacket" width="500" ' +
        'height="600" /> </div>'
    );
  });

  it('style is not allowed', () => {
    expect(
      SanitizeHTML(
        '<div><div style="margin: auto"> Xss issue </div> <img src="img_girl.jpg" alt="Girl in a jacket"' +
          'width="500" height="600" /> </div>'
      )
    ).toBe(
      '<div><div> Xss issue </div> <img src="img_girl.jpg" alt="Girl in a jacket" width="500" ' +
        'height="600" /> </div>'
    );
  });

  it('should have no change header html', () => {
    const SAMPLE_HTML =
      '<div class="topnav" id="myTopnav">\n' +
      '  <a href="#home" class="active">Just a link</a>\n' +
      '  <a href="https://indianexpress.com/" id="id1">Open news in current tab</a>\n' +
      '  <a href="https://indianexpress.com/" target="_self" id="id2" rel="noopener noreferrer">Open news in new tab</a>\n' +
      '  <div class="dropdown">\n' +
      '    <button class="dropbtn">Dropdown \n' +
      '      <i class="fa fa-caret-down"></i>\n' +
      '    </button>\n' +
      '    <div class="dropdown-content">\n' +
      '      <a href="#">Link 1</a>\n' +
      '      <a href="#">Link 2</a>\n' +
      '      <a href="#">Link 3</a>\n' +
      '    </div>\n' +
      '  </div> \n' +
      '  <a href="#about">Just a link</a>\n' +
      ' <a id="open-side-nav"> Side nav\n' +
      '  </a><a id="top-nav-responsive" class="icon">☰</a>\n' +
      '<div id="mySidenav" class="sidenav">\n' +
      '  <a id="close-side-nav" class="closebtn">×</a>\n' +
      '  <a href="#">About</a>\n' +
      '  <a href="#">Services</a>\n' +
      '  <a href="#">Clients</a>\n' +
      '  <a href="#">Contact</a>\n' +
      '</div>\n' +
      '</div>\n';

    expect(SanitizeHTML(SAMPLE_HTML)).toBe(SAMPLE_HTML);
  });
});
