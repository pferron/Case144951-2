/*
This takes the html from the description and first takes all paragraph tags and turns them into new lines.
Replace `&amp;` with '&'
Then it scrubs out anything where the `<` or `>` got converted to `&lt;` or `&gt;` and everything in between.
Lastly is strips out any html tags, leaving the inner content behind.
Some calendar services allow for html in the description. If rmeoveHtml is set to false, <br> and <a> tags will
remain in the description and appear as links and new lines in the calendar event description
Removes `&nbsp;`
However, if there is no description, it only returns an empty string
*/

export const formatDescription = (description, removeHtml): string => {
  if (description) {
    let formattedDescription = description
      .replace(/<\/p>/gi, '<br>')
      .replace(/&amp;/gi, '&')
      .replace(/(&lt;([^&]+)&gt;)/gi, '')
      .replace(/((?!<a([^>]+)>|<\/a>|<br>)<([^>]+)>)/gi, '')
      .replace(/&nbsp;/gi, '');

    if (removeHtml) {
      formattedDescription = formattedDescription.replace(/<br>/gi, '\\n').replace(/(<([^>]+)>)/gi, '');
    }
    return formattedDescription;
  }
  return '';
};
