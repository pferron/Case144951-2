import { extractFileBaseName, extractFileExtension } from '@utils/apiUtils';
import { CustomFont } from '@cvent/planner-event-hubs-model/types';

export const isAcceptedFileFormat = (filename: string, acceptedFileFormats: string): boolean => {
  const fileExtension = filename.toLowerCase().split('.').pop();
  return !!acceptedFileFormats.split(',').find(ext => ext.trim() === `.${fileExtension}`);
};

export const trimFileBaseName = (filename: string, maxLength: number): string => {
  if (maxLength && filename.length > maxLength) {
    const fileExtension = extractFileExtension(filename);
    return fileExtension === filename
      ? filename.slice(0, maxLength)
      : `${extractFileBaseName(filename).slice(0, maxLength - fileExtension.length - 1)}.${fileExtension}`;
  }
  return filename;
};
/**
 * The method takes file size in bytes and returns the size based on the following logic:
 * 0 <= size <= 999 KB => return size in KB
 * 1MB <= size <= 999 MB => return size in MB
 * 1GB <= size <= 999 GB => return size in GB
 * 1TB and above => return size in TB
 *
 * @param size
 * @param translate
 * @param number
 */
export const convertBytesToRelevantFileSize = (
  size: string,
  translate: (key: string, options: { [key: string]: string | number }) => string,
  number: (text: number) => number
): string => {
  const sizeNum = parseInt(size, 10);
  if (Number.isNaN(sizeNum) || sizeNum < 0) {
    return '-';
  }
  const factor = 1000;
  const fileSizeInKB = Math.trunc(sizeNum / factor);
  if (!fileSizeInKB) {
    return translate('video_size_kb', { size: 0 });
  }
  const sizeKey = ['video_size_kb', 'video_size_mb', 'video_size_gb', 'video_size_tb', 'video_size_pb'];
  const factoredSize = Math.floor(Math.log(fileSizeInKB) / Math.log(factor));
  const updatedSize = number(parseFloat((fileSizeInKB / factor ** factoredSize).toFixed(2)));
  return translate(sizeKey[factoredSize], { size: updatedSize });
};

export function getFontCss(font: CustomFont): string {
  let fontCss = '';
  if (font?.files) {
    for (const file of font.files) {
      fontCss = fontCss.concat(
        `@font-face { font-family: '${font.fontFamily}'; font-style: ${file.fontStyle}; font-weight: ${file.fontWeight}; font-display: swap; src: url(${file.url}); } `
      );
    }
  }
  return fontCss;
}
