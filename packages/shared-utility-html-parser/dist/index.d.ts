import { MfmNode } from 'mfm-js';
export { MfmEmojiCode, MfmNode } from 'mfm-js';

/**
 * Utility function that
 * 1. Removes <p> tags
 * 2. Replaces &#39; with '
 * 3. Replaces tag urls with #tag
 * 4. Splits paragraphs
 * @param str
 */
declare function parseStatusContent(str: string): MfmNode[][];

export { parseStatusContent };
