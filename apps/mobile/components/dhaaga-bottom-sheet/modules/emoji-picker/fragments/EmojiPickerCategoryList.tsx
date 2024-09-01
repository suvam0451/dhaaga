import { memo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { EMOJI_PICKER_STATE } from '../emojiPickerReducer';

type EmojiPickerCategoryListProps = {
	State: EMOJI_PICKER_STATE;
	onSelect: (o: string) => void;
};

const EmojiPickerCategoryList = memo(
	({ State, onSelect }: EmojiPickerCategoryListProps) => {
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
				{/*@ts-ignore-next-line*/}
				{State.allTags.map((o) => (
					<TouchableOpacity
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
						<Text
							style={[
								styles.categoryLabel,
								{
									fontFamily:
										o === State.selectedTag
											? APP_FONTS.INTER_700_BOLD
											: APP_FONTS.INTER_500_MEDIUM,
									color:
										o === State.selectedTag
											? 'green'
											: APP_FONT.MONTSERRAT_BODY,
								},
							]}
						>
							{o ? o : '<Untagged>'}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
		);
	},
);

export default EmojiPickerCategoryList;

const EMOJI_SIZE = 38;
const styles = StyleSheet.create({
	categoryLabel: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
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
