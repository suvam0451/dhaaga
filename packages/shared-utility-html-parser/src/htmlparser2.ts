import { DomUtils, Parser } from 'htmlparser2';
import DomHandler from 'domhandler';
import DomSerializer from 'dom-serializer';
import { decode } from 'html-entities';

class HtmlParserService {
	private static removeNestedSpans(node: any) {
		if (node.name === 'span' && node.children) {
			// Replace the current span node with its children
			return node.children.flatMap(HtmlParserService.removeNestedSpans);
		} else if (node.children) {
			// Recursively process child nodes
			node.children = node.children.flatMap(
				HtmlParserService.removeNestedSpans,
			);
		}
		return [node];
	}

	private static replaceHashtagLinksWithText(node: any) {
		if (node.type === 'tag' && node.name === 'a') {
			const nodeData: any[] = node.children.map((o: any) => ({
				type: o.type,
				data: o.data,
			}));
			if (nodeData.every((o) => o.type === 'text')) {
				const text = nodeData.map((o) => o.data).join('');

				if (text.match(/#.*?/)) {
					return DomUtils.getChildren(node);
				}
			}
		}
		if (node.children) {
			node.children = node.children.flatMap(
				HtmlParserService.replaceHashtagLinksWithText,
			); // Recursively process child nodes
		}
		return [node];
	}

	private static removeNestedEmphasis(node: any) {
		if (node.type === 'tag' && node.name === 'em' && node.children) {
			// Replace the current span node with its children
			return node.children.flatMap(HtmlParserService.removeNestedEmphasis);
		} else if (node.children) {
			// Recursively process child nodes
			node.children = node.children.flatMap(
				HtmlParserService.removeNestedEmphasis,
			);
		}
		return [node];
	}

	private static replaceStrongTagsWithBoldTags(node: any) {
		if (node.type === 'tag' && node.name === 'strong') {
			node.name = 'b';
			node.tagName = 'b'; // Update tagName to 'b' for serialization
		}
		if (node.children) {
			node.children = node.children.flatMap(
				HtmlParserService.replaceStrongTagsWithBoldTags,
			);
		}
		return [node];
	}

	/**
	 * Remove all instance-specific stuff
	 */
	static cleanup(line: string) {
		const handler = new DomHandler((error, dom) => {
			if (error) {
				return '[ERROR]: Dhaaga failed to parse html';
			} else {
				// Remove nested span tags from the DOM
				const stepA = dom.flatMap(HtmlParserService.removeNestedSpans);
				const stepB = stepA.flatMap(
					HtmlParserService.replaceHashtagLinksWithText,
				);
				const stepC = stepB.flatMap(HtmlParserService.removeNestedEmphasis);
				const stepD = stepC.flatMap(
					HtmlParserService.replaceStrongTagsWithBoldTags,
				);
				return DomSerializer(stepD);
			}
		});

		// don't need all these...
		const parser = new Parser(handler);
		parser.write(line);
		parser.end();
		const output = DomSerializer(handler.dom);
		return decode(output);
	}
}

export default HtmlParserService;
