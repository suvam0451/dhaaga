import { FlatList, Image, Pressable, StyleSheet } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { CustomEmojiObjectType } from '@dhaaga/bridge';
import { NativeTextBold } from '#/ui/NativeText';

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
					<NativeTextBold
						style={[styles.emojiText, { color: theme.complementary }]}
					>
						{item.shortCode}
					</NativeTextBold>
				</Pressable>
			)}
		/>
	);
}

export default SuggestedEmojiListView;

const styles = StyleSheet.create({
	emojiText: {
		marginLeft: 4,
	},
	autoCompletionResultAnimatedContainer: {
		borderRadius: 8,
		paddingHorizontal: 4,
		marginHorizontal: 6,
	},
});
