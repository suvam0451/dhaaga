const EMOJI_REGEX = /:[a-zA-Z_@]+?$/;
const ACCT_REGEX = /(@[a-zA-Z_0-9.]+(@[a-zA-Z_0-9.]*)?)$/;

type KeyboardSelection = { start: number; end: number };

class TextEditorService {
	/**
	 * auto-completes reaction shortCode in the text editor
	 * @param draft
	 * @param shortCode
	 * @param selection
	 */
	static autoCompleteReaction(
		draft: string,
		shortCode: string,
		selection?: KeyboardSelection,
	): string {
		if (!EMOJI_REGEX.test(draft)) return draft;
		const match = EMOJI_REGEX.exec(draft);
		return draft.replaceAll(match[0], `:${shortCode}: `);
	}

	/**
	 * auto-complete handle in text editor.
	 * also works in middle of text (if selection is provided)
	 * @param draft original text content
	 * @param handle @suvam@miruku.cafe
	 * @param selection start and end index, from TextInput component
	 */
	static autoCompleteHandler(
		draft: string,
		handle: string,
		selection?: KeyboardSelection,
	): string {
		const firstHalf = draft.slice(0, selection.start);
		const secondHalf = draft.slice(selection.start, draft.length);
		if (!ACCT_REGEX.test(firstHalf)) return draft;

		const match = ACCT_REGEX.exec(firstHalf);
		// @ts-ignore-next-line
		const updatedFirstHalf = firstHalf.replaceAll(match[0], handle);

		let combined = '';
		if (secondHalf[0] !== ' ') {
			combined = updatedFirstHalf + ' ' + secondHalf;
		} else {
			combined = updatedFirstHalf + secondHalf;
		}
		return combined;
	}

	/**
	 * Add some text to the text field
	 * @param draft
	 * @param shortCode
	 */
	static addReactionText(draft: string, shortCode: string): string {
		return (draft || '') + `:${shortCode}:` + ' ';
	}
}

export default TextEditorService;
