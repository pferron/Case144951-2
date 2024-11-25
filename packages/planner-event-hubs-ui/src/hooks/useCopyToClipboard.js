// RED
/* eslint-disable */
import { useState } from 'react';
import { isSafari } from 'react-device-detect';

/**
 * Copies the text to clipboard
 * @param textToCopy
 */
const useCopyToClipboard = textToCopy => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const copy = async () => {
    try {
      if (isSafari) {
        const copiedValue = new ClipboardItem({
          'text/plain': textToCopy
        });
        await navigator.clipboard.write([copiedValue]);
        setCopied(false);
      } else {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(false);
      }
    } catch (e) {
      // something went wrong
      setCopied(false);
      setError(e);
      LOG.error(`Failed to copy ${textToCopy} to clipboard: ${error}`);
    }
  };

  return { copied, error, copy };
};

export default useCopyToClipboard;
