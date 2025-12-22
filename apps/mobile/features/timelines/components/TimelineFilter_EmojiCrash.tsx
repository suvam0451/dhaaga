import { withPostItemContext } from '#/components/containers/WithPostItemContext';
import { View } from 'react-native';
import { NativeTextBold } from '#/ui/NativeText';

/**
 * Prevents malicious
 * @param children
 * @constructor
 */
export function TimelineFilter_EmojiCrash({ children }: any) {
	const { dto } = withPostItemContext();

	if (dto?.calculated?.customEmojiCount > 16)
		return (
			<View>
				<NativeTextBold>
					Post not rendered due to too many custom emojis (16+).
				</NativeTextBold>
			</View>
		);
	return children;
}
