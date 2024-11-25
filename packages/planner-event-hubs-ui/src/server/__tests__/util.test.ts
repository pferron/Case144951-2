import {
  extractFileBaseName,
  extractFileExtension,
  extractFileName,
  parseCookies,
  normalizeRawOrJSONResponseToJSON,
  getDefaultLocales
} from '@server/utils';

describe('Test parse cookies method', () => {
  it('parse cookies with single cookie', () => {
    const cookieMap = parseCookies({ headers: { cookie: 'best=chocolate' } });
    expect(cookieMap.get('best')).toBe('chocolate');
  });

  it('parse cookies with multiple cookies', () => {
    const cookieMap = parseCookies({
      headers: {
        cookie:
          'cvt_cookielocale=%5B%7B%22eventId%22%3A%2230ce1afa-b043-4f67-8f6f-73621eacc51a%22%2C%22locale%22%3A%22en-US%22%7D%5D; engage-auth=6c81bce7a84035317722d6816a29e858; cvt_id=CA1.b4c5061e36fa60ebc5aad0ccea95f900b34794ecad49e965eaa94f7c534dec83; s_cc=true; s_vi=[CS]v1|319A329CB78D9331-400001B8A49583D2[CE];'
      }
    });
    expect(cookieMap.size).toBe(6);
    expect(cookieMap.get('s_cc')).toBe('true');
  });

  it('extract file extension from the file', () => {
    const fileExtension = extractFileExtension('sample.mp4');
    expect(fileExtension).toBe('mp4');
  });

  it('extract file Name from the path', () => {
    const fileExtension = extractFileName('abc/xyz/sample.mp4');
    expect(fileExtension).toBe('sample.mp4');
  });

  it('extract file base Name', () => {
    const fileExtension = extractFileBaseName('abc/xyz/sample.abc.mp4');
    expect(fileExtension).toBe('abc/xyz/sample.abc');
  });
});

describe('normalizeRawOrJSONResponseToJSON(string)', () => {
  const string = '{"data": "hello"}';
  const json = {
    data: 'hello'
  };

  it('returns the input if already parsed', () => {
    expect(normalizeRawOrJSONResponseToJSON(json)).toEqual(json);
  });

  it('returns json if the input is unparsed', () => {
    expect(normalizeRawOrJSONResponseToJSON(string)).toEqual(json);
  });
});

describe('test locales', () => {
  it('test getDefaultLocales', async () => {
    expect(await getDefaultLocales('en-US', 'video_hub_branding_preview_upcoming_events_title')).toEqual(
      'Upcoming Events'
    );
  });
});
