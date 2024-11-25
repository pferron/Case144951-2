import { sanitizeUrl, sanitizeUrls, stripProtocol, stripProtocolFromLinks } from '@utils/sanitizeUrls';

const linksWithoutProtocols = {
  facebookUrl: 'www.facebook.com',
  twitterUrl: 'www.twitter.com',
  linkedInUrl: 'www.linkedin.com'
};

const linksWithProtocols = {
  facebookUrl: 'https://www.facebook.com',
  twitterUrl: 'https://www.twitter.com',
  linkedInUrl: 'https://www.linkedin.com'
};
describe('tests sanitize url utility', () => {
  it('https absent - append https', () => {
    const urls = sanitizeUrl('www.twitter.com');
    expect(urls).toEqual('https://www.twitter.com');
  });

  it('http present - unchanged', () => {
    const urls = sanitizeUrl('http://www.twitter.com');
    expect(urls).toEqual('http://www.twitter.com');
  });

  it('https absent - append https in the links', () => {
    const urls = sanitizeUrls(linksWithoutProtocols);
    expect(urls).toEqual({
      facebookUrl: 'https://www.facebook.com',
      twitterUrl: 'https://www.twitter.com',
      linkedInUrl: 'https://www.linkedin.com'
    });
  });

  it('https present - unchanged', () => {
    const urls = sanitizeUrl('https://www.twitter.com');
    expect(urls).toEqual('https://www.twitter.com');
  });

  it('test stripProtocol method - https', () => {
    const url = stripProtocol('https://www.google.com');
    expect(url).toEqual('www.google.com');
  });

  it('test stripProtocol method - http', () => {
    const url = stripProtocol('http://www.google.com');
    expect(url).toEqual('www.google.com');
  });

  it('test stripProtocol method - protocol not present', () => {
    const url = stripProtocol('google.com');
    expect(url).toEqual('google.com');
  });

  it('test stripProtocolFromLinks method - protocol not present', () => {
    const url = stripProtocolFromLinks(linksWithProtocols);
    expect(url).toEqual(linksWithoutProtocols);
  });
});
