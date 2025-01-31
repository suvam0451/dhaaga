import { generateFacets } from '../utils/atproto-facets.utils';
import { AppParsedTextNodes } from '../types/parsed-text.types';
import { RandomUtil } from '../utils/random.utils';

function toUtf8(input: string): Uint8Array {
	const encoder = new TextEncoder();
	return encoder.encode(input);
}

function toUtf16(input: Uint8Array): string {
	// Optionally decode back to string
	const decoder = new TextDecoder('utf-8');
	return decoder.decode(input);
}

class FacetService {
	/**
	 * Takes an AT proto object
	 * as input and resolves embeds, links,
	 * mentions etc.
	 * @param input
	 */
	static parseTextContent(input: string): AppParsedTextNodes {
		if (!input) return [];

		const results = generateFacets(input);
		const byteArray: Uint8Array = toUtf8(input);

		const elements = [];
		// It is currently difficult to detect line breaks in at proto
		elements.push({
			uuid: RandomUtil.nanoId(),
			type: 'para',
			nodes: [],
		});
		results.sort((a, b) => a.index.byteStart - b.index.byteStart);
		let idx = 0,
			count = 0;

		for (const result of results) {
			// The raw text segments between facet segments
			const prefix = byteArray.slice(idx, result.index.byteStart);
			elements[0].nodes.push({
				uuid: RandomUtil.nanoId(),
				nodes: [],
				type: 'text',
				text: toUtf16(prefix),
			});
			count++;

			const midSegment = byteArray.slice(
				result.index.byteStart,
				result.index.byteEnd,
			);
			switch (result.features[0].$type) {
				case 'app.bsky.richtext.facet#mention': {
					elements[0].nodes.push({
						type: 'mention',
						uuid: RandomUtil.nanoId(),
						text: toUtf16(midSegment),
						url: result.features[0]?.did,
						nodes: [],
					});
					break;
				}
				case 'app.bsky.richtext.facet#link': {
					elements[0].nodes.push({
						type: 'link',
						uuid: RandomUtil.nanoId(),
						text: toUtf16(midSegment),
						url: result.features[0]?.uri,
						nodes: [],
					});
					break;
				}
				case 'app.bsky.richtext.facet#tag': {
					elements[0].nodes.push({
						type: 'tag',
						uuid: RandomUtil.nanoId(),
						text: toUtf16(midSegment),
						url: result.features[0]?.tag,
						nodes: [],
					});

					break;
				}
			}
			count++;
			idx = result.index.byteEnd;
		}

		// The suffix raw text segment
		const suffix = byteArray.slice(idx);
		elements[0].nodes.push({
			uuid: RandomUtil.nanoId(),
			nodes: [],
			type: 'text',
			text: toUtf16(suffix),
		});

		return elements;
	}
}

export default FacetService;
