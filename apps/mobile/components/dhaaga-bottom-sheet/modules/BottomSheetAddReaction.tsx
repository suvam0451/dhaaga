import { useEffect, useReducer, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import SelectedEmojiPreview from './emoji-picker/fragments/SelectedEmojiPreview';
import SelectedEmojiActionButtons from './emoji-picker/fragments/SelectedEmojiActionButtons';
import emojiPickerReducer, {
	defaultValue,
	Emoji,
	EMOJI_PICKER_REDUCER_ACTION,
} from './emoji-picker/emojiPickerReducer';
import { APP_FONT } from '#/styles/AppTheme';
import EmojiPickerSearchResults from './emoji-picker/fragments/EmojiPickerSearchResults';
import EmojiPickerCategoryList from './emoji-picker/fragments/EmojiPickerCategoryList';
import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';

function BottomSheetAddReaction() {
	const { driver } = useAppApiClient();
	const { acct } = useActiveUserSession();

	const [State, dispatch] = useReducer(emojiPickerReducer, defaultValue);
	const lastSubdomain = useRef(null);
	useEffect(() => {
		if (lastSubdomain.current === acct?.server) return;
		dispatch({
			type: EMOJI_PICKER_REDUCER_ACTION.INIT,
			payload: {
				subdomain: acct?.server,
				// globalDb: mmkv,
				driver,
			},
		});
		lastSubdomain.current = acct?.server;
	}, [acct?.server]);

	function onSearchTermChanged(o: any) {
		dispatch({
			type: EMOJI_PICKER_REDUCER_ACTION.APPLY_SEARCH,
			payload: {
				searchTerm: o,
			},
		});
	}

	function onEmojiSelect(o: Emoji) {}
	function onTagSelect(o: string) {}

	return (
		<View style={{ paddingHorizontal: 12 }}>
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
					onSelect={async (shortCode: string) => {}}
					onCancel={() => {}}
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
			<EmojiPickerSearchResults State={State} onSelect={onEmojiSelect} />
			<EmojiPickerCategoryList State={State} onSelect={onTagSelect} />
		</View>
	);
}

const styles = StyleSheet.create({
	textInput: {
		textDecorationLine: 'none',
		paddingVertical: 16,
		paddingBottom: 12,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		borderRadius: 8,
	},
});

export default BottomSheetAddReaction;
