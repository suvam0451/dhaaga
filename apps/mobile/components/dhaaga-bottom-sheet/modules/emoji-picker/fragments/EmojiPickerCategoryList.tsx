import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { APP_FONT } from '#/styles/AppTheme';
import { EMOJI_PICKER_STATE } from '../emojiPickerReducer';
import { NativeTextBold } from '#/ui/NativeText';

type EmojiPickerCategoryListProps = {
	State: EMOJI_PICKER_STATE;
	onSelect: (o: string) => void;
};

function EmojiPickerCategoryList({
	State,
	onSelect,
}: EmojiPickerCategoryListProps) {
	return (
		<ScrollView
			horizontal={true}
			style={{
				flexDirection: 'row',
				paddingBottom: 8,
				paddingTop: 10,
			}}
			keyboardShouldPersistTaps={'always'}
		>
			{State.allTags.map((o, i) => (
				<TouchableOpacity
					key={i}
					style={{
						marginHorizontal: 4,
						backgroundColor: '#444',
						padding: 6,
						borderRadius: 6,
					}}
					onPress={() => {
						onSelect(o);
					}}
				>
					<NativeTextBold
						style={[
							styles.categoryLabel,
							{
								color:
									o === State.selectedTag ? 'green' : APP_FONT.MONTSERRAT_BODY,
							},
						]}
					>
						{o ? o : '<Untagged>'}
					</NativeTextBold>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
}

export default EmojiPickerCategoryList;

const EMOJI_SIZE = 38;
const styles = StyleSheet.create({
	categoryLabel: {
		color: APP_FONT.MONTSERRAT_BODY,
	},
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
