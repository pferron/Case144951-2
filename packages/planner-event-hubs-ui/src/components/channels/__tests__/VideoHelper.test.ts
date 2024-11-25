import {
  addVideoInSection,
  createSectionWithVideos,
  formatHoursFromMilliseconds,
  getAndRemoveVideosFromSection,
  getDefaultSection,
  getSection,
  showSection
} from '@components/channels/videos/videoHelper';
import { ExtendedItemCatalog, ExtendedSection } from '@components/channels/type/channelCatalog';
import { DEFAULT_SECTION_NAME } from '@utils/constants';

const extendedItemCatalog: ExtendedItemCatalog = {
  id: 'catalogId123',
  sections: [
    {
      id: 'section-1',
      title: 'section-1',
      itemCount: 2,
      sectionType: 'CUSTOM',
      items: [
        {
          id: 'section-1-video-1',
          videoId: 'section-1-video-1',
          displayName: 'section-1-video-1',
          thumbnail: null,
          duration: 12344,
          content: null
        },
        {
          id: 'section-1-video-2',
          videoId: 'section-1-video-2',
          displayName: 'section-1-video-2',
          thumbnail: null,
          duration: 12344,
          content: null
        }
      ],
      content: null
    },
    {
      id: 'c244f427-2fbb-42f9-811a-9abfe883552f',
      title: DEFAULT_SECTION_NAME,
      sectionType: 'DEFAULT',
      itemCount: 2,
      items: [
        {
          id: 'default-section-video-1',
          videoId: 'default-section-video-1',
          displayName: 'default-section-video-1',
          thumbnail: null,
          duration: 12344,
          content: null
        },
        {
          id: 'default-section-video-2',
          videoId: 'default-section-video-2',
          displayName: 'default-section-video-2',
          thumbnail: null,
          duration: 12344,
          content: null
        },
        {
          id: 'default-section-video-3',
          videoId: 'default-section-video-3',
          displayName: 'default-section-video-3',
          thumbnail: null,
          duration: 12344,
          content: null
        }
      ],
      content: null
    }
  ]
};

const section1 = extendedItemCatalog.sections[0];
const defaultSection = extendedItemCatalog.sections[1];

describe('Test Video Helper', () => {
  it('Create Section With Videos', async () => {
    const section: ExtendedSection = createSectionWithVideos(
      'test-section-id',
      'test-section',
      section1.items,
      'DEFAULT'
    );
    expect(section.id).toBe('test-section-id');
    expect(section.title).toBe('test-section');
    expect(section.itemCount).toBe(section1.items.length);
    expect(section.sectionType).toBe('DEFAULT');
  });

  it('Add Video In a Section', async () => {
    const section: ExtendedSection = addVideoInSection(section1, defaultSection.items);
    expect(section.id).toBe(section1.id);
    expect(section.title).toBe(section1.title);
    expect(section.itemCount).toBe(section1.items.length + defaultSection.items.length);
    expect(section.items.find(video => video.id === defaultSection.items[0].id)).toBeTruthy();
  });

  it('Get And Remove Video From Section', async () => {
    const { removedVideos, updatedSection } = getAndRemoveVideosFromSection(defaultSection, [
      'default-section-video-1'
    ]);
    expect(removedVideos.find(video => video.id === 'default-section-video-1')).toBeTruthy();
    expect(updatedSection.title).toBe(defaultSection.title);
    expect(updatedSection.itemCount).toBe(2);
    expect(updatedSection.items.length).toBe(2);
    expect(updatedSection.items.find(video => video.id === 'default-section-video-1')).toBeFalsy();
  });

  it('Get Default Section', async () => {
    const section = getDefaultSection(extendedItemCatalog);
    expect(section.sectionType).toBe('DEFAULT');
    expect(section.title).toBe(defaultSection.title);
    expect(section).toBe(defaultSection);
  });

  it('Get Section', async () => {
    const section = getSection(extendedItemCatalog, section1.id);
    expect(section.id).toBe(section1.id);
    expect(section.title).toBe(section1.title);
    expect(section).toBe(section1);
  });

  test('get formatted time in hours', async (): Promise<void> => {
    const time = formatHoursFromMilliseconds((2 * 60 * 60 + 29 * 60 + 9) * 1000);
    expect(time).toBe('02:29:09');
  });

  test('get formatted time in hours without hour', async (): Promise<void> => {
    const time = formatHoursFromMilliseconds((29 * 60 + 22) * 1000);
    expect(time).toBe('29:22');
  });

  test('get formatted time in hours with more than 24 hour video', async (): Promise<void> => {
    const time = formatHoursFromMilliseconds((36 * 60 * 60 + 29 * 60 + 22) * 1000);
    expect(time).toBe('36:29:22');
  });

  test('get formatted time when incorrect seconds is passed', async (): Promise<void> => {
    const time = formatHoursFromMilliseconds(-123);
    expect(time).toBe('');
  });

  test('Show Section', async (): Promise<void> => {
    expect(showSection(extendedItemCatalog)).toBe(true);
  });

  test("Don't Show Section", async (): Promise<void> => {
    const updateExtendedItemCatalog = {
      ...extendedItemCatalog,
      sections: null
    };
    expect(showSection(updateExtendedItemCatalog)).toBe(false);
  });
});
