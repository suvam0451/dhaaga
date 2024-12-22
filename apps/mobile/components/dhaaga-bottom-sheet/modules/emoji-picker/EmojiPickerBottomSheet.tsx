import { memo, useEffect, useReducer, useRef } from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import emojiPickerReducer, {
	defaultValue,
	EMOJI_PICKER_REDUCER_ACTION,
} from './emojiPickerReducer';
import SelectedEmojiPreview from './fragments/SelectedEmojiPreview';
import SelectedEmojiActionButtons from './fragments/SelectedEmojiActionButtons';
import EmojiPickerSearchResults from './fragments/EmojiPickerSearchResults';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type EmojiPickerBottomSheetProps = {
	onSelect: (shortCode: string) => Promise<void>;
	onCancel: () => void;
};

/**
 * @param onSelect what happens when emoji selection is confirmed
 * @param onCancel what happens when workflow is cancelled
 */
const EmojiPickerBottomSheet = memo(
	({ onSelect, onCancel }: EmojiPickerBottomSheetProps) => {
		const { driver, acct, acctManager } = useGlobalState(
			useShallow((o) => ({
				driver: o.driver,
				acct: o.acct,
				acctManager: o.acctManager,
			})),
		);
		const [State, dispatch] = useReducer(emojiPickerReducer, defaultValue);

		const lastSubdomain = useRef(null);
		useEffect(() => {
			if (lastSubdomain.current === acct?.server) return;
			dispatch({
				type: EMOJI_PICKER_REDUCER_ACTION.INIT,
				payload: {
					subdomain: acct?.server,
					acctManager: acctManager,
					domain: driver,
				},
			});
			lastSubdomain.current = acct?.server;
		}, [acct?.server]);

		if (!State.tagEmojiMap) return <View />;

		function onEmojiSelected(o: any) {
			dispatch({
				type: EMOJI_PICKER_REDUCER_ACTION.SELECT,
				payload: {
					shortCode: o.shortCode,
				},
			});
		}

		function onSearchTermChanged(o: any) {
			dispatch({
				type: EMOJI_PICKER_REDUCER_ACTION.APPLY_SEARCH,
				payload: {
					searchTerm: o,
				},
			});
		}

		function onTagSelectionChanged(o: any) {
			dispatch({
				type: EMOJI_PICKER_REDUCER_ACTION.APPLY_TAG,
				payload: {
					tag: o,
				},
			});
		}

		return (
			<View style={{ marginTop: 12, position: 'relative' }}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						maxWidth: '100%',
					}}
				>
					<SelectedEmojiPreview selection={State.selectedReaction} />
					<SelectedEmojiActionButtons
						selection={State.selectedReaction}
						onSelect={onSelect}
						onCancel={onCancel}
					/>
				</View>

				<TextInput
					placeholder={'Search by alias'}
					autoCapitalize={'none'}
					multiline={false}
					placeholderTextColor={'rgba(255, 255, 255, 0.33)'}
					style={styles.textInput}
					onChangeText={onSearchTermChanged}
				/>

				<EmojiPickerSearchResults State={State} onSelect={onEmojiSelected} />
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
								onTagSelectionChanged(o);
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
			</View>
		);
	},
);

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

export default EmojiPickerBottomSheet;
