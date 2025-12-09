import { FlatList, Image, Pressable, StyleSheet } from 'react-native';
import { AppText } from '#/components/lib/Text';
import { APP_FONTS } from '#/styles/AppFonts';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { CustomEmojiObjectType } from '@dhaaga/bridge';

type Props = {
	suggestions: CustomEmojiObjectType[];
	onPick: (item: CustomEmojiObjectType) => void;
};

const EMOJI_ICON_SIZE = 24;

function SuggestedEmojiListView({ suggestions, onPick }: Props) {
	const { theme } = useAppTheme();
	return (
		<FlatList
			keyboardShouldPersistTaps={'always'}
			horizontal={true}
			data={suggestions}
			renderItem={({ item }) => (
				<Pressable
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginRight: 6,
						padding: 4,
						backgroundColor: '#242424',
						borderRadius: 8,
					}}
					focusable={false}
					onPress={() => {
						onPick(item);
					}}
				>
					<Image
						source={{ uri: item.url }}
						style={{
							height: EMOJI_ICON_SIZE,
							width: EMOJI_ICON_SIZE,
							borderRadius: 4,
						}}
					/>
					<AppText.Medium
						style={[styles.emojiText, { color: theme.complementary.a0 }]}
					>
						{item.shortCode}
					</AppText.Medium>
				</Pressable>
			)}
		/>
	);
}

export default SuggestedEmojiListView;

const styles = StyleSheet.create({
	emojiText: {
		marginLeft: 4,
		fontFamily: APP_FONTS.ROBOTO_500,
	},
	autoCompletionResultAnimatedContainer: {
		borderRadius: 8,
		paddingHorizontal: 4,
		marginHorizontal: 6,
	},
});
