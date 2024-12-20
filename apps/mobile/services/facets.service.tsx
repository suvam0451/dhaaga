import { detectFacets } from '../utils/atproto-facets.utils';
import RawTextSegment from '../components/shared/mfm/RawTextSegment';
import MentionSegment from '../components/shared/mfm/MentionSegment';
import LinkProcessor from '../components/common/link/LinkProcessor';
import HashtagSegment from '../components/shared/mfm/HashtagSegment';
import { APP_COLOR_PALETTE_EMPHASIS } from '../styles/BuiltinThemes';

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
	static render(
		input: string,
		{
			fontFamily,
			emphasis,
		}: { fontFamily?: string; emphasis?: APP_COLOR_PALETTE_EMPHASIS },
	): JSX.Element[] {
		if (!input) return [];

		const results = detectFacets(input);
		const byteArray: Uint8Array = toUtf8(input);

		const elements = [];
		results.sort((a, b) => a.index.byteStart - b.index.byteStart);
		let idx = 0,
			count = 0;
		for (const result of results) {
			const preSegment = byteArray.slice(idx, result.index.byteStart);
			elements.push(
				<RawTextSegment
					key={count}
					value={toUtf16(preSegment)}
					fontFamily={fontFamily}
					emphasis={emphasis}
				/>,
			);
			count++;

			switch (result.features[0].$type) {
				case 'app.bsky.richtext.facet#mention': {
					elements.push(
						<MentionSegment
							key={count}
							value={result.features[0]?.did as unknown as string}
							fontFamily={fontFamily}
							link={'https://weeb.sh'}
						/>,
					);
					break;
				}
				case 'app.bsky.richtext.facet#link': {
					elements.push(
						<LinkProcessor
							key={count}
							url={result.features[0]?.uri as unknown as string}
							displayName={result.features[0]?.uri as unknown as string}
							fontFamily={fontFamily}
							emphasis={emphasis}
						/>,
					);
					break;
				}
				case 'app.bsky.richtext.facet#tag': {
					elements.push(
						<HashtagSegment
							key={count}
							value={result.features[0]?.tag as unknown as string}
							fontFamily={fontFamily}
						/>,
					);
					break;
				}
			}
			count++;
			idx = result.index.byteEnd;
		}

		// append trail
		const trailSegment = byteArray.slice(idx);
		elements.push(
			<RawTextSegment
				key={count}
				value={toUtf16(trailSegment)}
				fontFamily={fontFamily}
				emphasis={emphasis}
			/>,
		);

		return elements;
	}
}

export default FacetService;
