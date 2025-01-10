// @ts-ignore-next-line
import TLDs from 'tlds';
import { AppBskyRichtextFacet } from '@atproto/api';

type Facet = AppBskyRichtextFacet.Main;

const encoder = new TextEncoder();

export enum ATPROTO_FACET_ENUM {
	MENTION = 'app.bsky.richtext.facet#mention',
	LINK = 'app.bsky.richtext.facet#link',
	TAG = 'app.bsky.richtext.facet#tag',
}

export class UnicodeString {
	utf16: string;
	utf8: Uint8Array;

	constructor(utf16: string) {
		this.utf16 = utf16;
		this.utf8 = encoder.encode(utf16);
	}

	// helper to convert utf16 code-unit offsets to utf8 code-unit offsets
	utf16IndexToUtf8Index(i: number) {
		return encoder.encode(this.utf16.slice(0, i)).byteLength;
	}
}

/**
 * Notably, @suvam@mastodon.social would not be supported
 */
export function detectFacets(_text: string): Facet[] | undefined {
	const text = new UnicodeString(_text);
	let match;
	const facets: Facet[] = [];
	{
		// mentions
		const re = /(^|\s|\()(@)([a-zA-Z0-9.-]+)(\b)/g;
		while ((match = re.exec(text.utf16))) {
			if (!isValidDomain(match[3]) && !match[3].endsWith('.test')) {
				continue; // probably not a handle
			}

			const start = text.utf16.indexOf(match[3], match.index) - 1;
			facets.push({
				$type: 'app.bsky.richtext.facet',
				index: {
					byteStart: text.utf16IndexToUtf8Index(start),
					byteEnd: text.utf16IndexToUtf8Index(start + match[3].length + 1),
				},
				features: [
					{
						$type: ATPROTO_FACET_ENUM.MENTION,
						did: match[3], // must be resolved afterward
					},
				],
			});
		}
	}
	{
		// links
		const re = // @ts-ignore-next-line
			/(^|\s|\()((https?:\/\/[\S]+)|((?<domain>[a-z][a-z0-9]*(\.[a-z0-9]+)+)[\S]*))/gim;
		while ((match = re.exec(text.utf16))) {
			let uri = match[2];
			if (!uri.startsWith('http')) {
				const domain = match.groups?.domain;
				if (!domain || !isValidDomain(domain)) {
					continue;
				}
				uri = `https://${uri}`;
			}
			const start = text.utf16.indexOf(match[2], match.index);
			const index = { start, end: start + match[2].length };
			// strip ending punctuation
			if (/[.,;!?]$/.test(uri)) {
				uri = uri.slice(0, -1);
				index.end--;
			}
			if (/[)]$/.test(uri) && !uri.includes('(')) {
				uri = uri.slice(0, -1);
				index.end--;
			}
			facets.push({
				index: {
					byteStart: text.utf16IndexToUtf8Index(index.start),
					byteEnd: text.utf16IndexToUtf8Index(index.end),
				},
				features: [
					{
						$type: ATPROTO_FACET_ENUM.LINK,
						uri,
					},
				],
			});
		}
	}
	{
		const re = /(?:^|\s)(#[^\d\s]\S*)(?=\s)?/g;
		while ((match = re.exec(text.utf16))) {
			let [tag] = match;
			const hasLeadingSpace = /^\s/.test(tag);

			// @ts-ignore-next-line
			tag = tag.trim().replace(/\p{P}+$/gu, ''); // strip ending punctuation

			// inclusive of #, max of 64 chars
			if (tag.length > 66) continue;

			const index = match.index + (hasLeadingSpace ? 1 : 0);

			facets.push({
				index: {
					byteStart: text.utf16IndexToUtf8Index(index),
					byteEnd: text.utf16IndexToUtf8Index(index + tag.length), // inclusive of last char
				},
				features: [
					{
						$type: ATPROTO_FACET_ENUM.TAG,
						tag: tag.replace(/^#/, ''),
					},
				],
			});
		}
	}
	return facets.length > 0 ? facets : [];
}

function isValidDomain(str: string): boolean {
	// NOTE: atproto should already be doing this from backend
	return !!TLDs.find((tld) => {
		const i = str.lastIndexOf(tld);
		if (i === -1) {
			return false;
		}
		return str.charAt(i - 1) === '.' && i === str.length - tld.length;
	});
}
