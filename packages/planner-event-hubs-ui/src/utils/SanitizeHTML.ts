import sanitizeHtml from 'sanitize-html';

const allowedAttributes = [
  'id',
  'class',
  'aria-expanded',
  'aria-labelledby',
  'aria-haspopup',
  'aria-label',
  'role',
  'title',
  'tabindex',
  'type',
  'd'
];
const allowedTags = [
  'html',
  'head',
  'body',
  'div',
  'nav',
  'header',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'a',
  'svg',
  'path',
  'ul',
  'li',
  'ol',
  'button',
  'blockquote',
  'b',
  'i',
  'font',
  's',
  'u',
  'o',
  'sup',
  'sub',
  'ins',
  'del',
  'strong',
  'strike',
  'tt',
  'code',
  'big',
  'small',
  'br',
  'span',
  'em',
  'img'
];

export const SanitizeHTML = (html: string) => {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(...allowedTags),
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      svg: ['viewBox', 'path', 'height', 'width'],
      img: ['alt', 'src', 'border', 'height', 'width'],
      '*': allowedAttributes
    },
    nonBooleanAttributes: ['href']
  });
};
