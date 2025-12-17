import { Emoji, EMOJI_PICKER_STATE } from '../emojiPickerReducer';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { APP_FONT } from '#/styles/AppTheme';

type EmojiPickerSearchResultsProps = {
	State: EMOJI_PICKER_STATE;
	onSelect: (o: Emoji) => void;
};

function EmojiPickerSearchResults({
	State,
	onSelect,
}: EmojiPickerSearchResultsProps) {
	return (
		<ScrollView
			style={{
				flexWrap: 'wrap',
			}}
			keyboardShouldPersistTaps={'always'}
		>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
				{State.visibleReactions.map((o) => (
					<TouchableOpacity
						onPress={() => {
							onSelect(o);
						}}
					>
						<Image source={{ uri: o.url }} style={styles.emojiContainer} />
					</TouchableOpacity>
				))}
			</View>
		</ScrollView>
	);
}

const EMOJI_SIZE = 38;
const styles = StyleSheet.create({
	emojiContainer: {
		width: EMOJI_SIZE,
		height: EMOJI_SIZE,
		borderRadius: 8,
		margin: 4,
	},
	textInput: {
		textDecorationLine: 'none',
		paddingVertical: 16,
		paddingBottom: 12,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		borderRadius: 8,
	},
});

export default EmojiPickerSearchResults;
