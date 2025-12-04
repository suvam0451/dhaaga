import { withPostItemContext } from '#/components/containers/contexts/WithPostItemContext';
import { AppText } from '#/components/lib/Text';
import { View } from 'react-native';

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
				<AppText.SemiBold>Excluded</AppText.SemiBold>
			</View>
		);
	return children;
}
