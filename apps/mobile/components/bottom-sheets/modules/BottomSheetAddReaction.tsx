import { memo, useEffect, useReducer, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import SelectedEmojiPreview from '../../dhaaga-bottom-sheet/modules/emoji-picker/fragments/SelectedEmojiPreview';
import SelectedEmojiActionButtons from '../../dhaaga-bottom-sheet/modules/emoji-picker/fragments/SelectedEmojiActionButtons';
import emojiPickerReducer, {
	defaultValue,
	Emoji,
	EMOJI_PICKER_REDUCER_ACTION,
} from '../../dhaaga-bottom-sheet/modules/emoji-picker/emojiPickerReducer';
import { APP_FONT } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';
import EmojiPickerSearchResults from '../../dhaaga-bottom-sheet/modules/emoji-picker/fragments/EmojiPickerSearchResults';
import EmojiPickerCategoryList from '../../dhaaga-bottom-sheet/modules/emoji-picker/fragments/EmojiPickerCategoryList';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const BottomSheetAddReaction = memo(() => {
	const { driver, acct } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			acct: o.acct,
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
});

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

export default BottomSheetAddReaction;
