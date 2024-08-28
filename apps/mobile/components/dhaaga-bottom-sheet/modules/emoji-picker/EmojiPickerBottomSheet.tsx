import { memo, useEffect, useReducer, useRef } from 'react';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import {
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { useGlobalMmkvContext } from '../../../../states/useGlobalMMkvCache';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import emojiPickerReducer, {
	defaultValue,
	EMOJI_PICKER_REDUCER_ACTION,
} from './emojiPickerReducer';
import { Image } from 'expo-image';
import { useComposerContext } from '../post-composer/api/useComposerContext';
import SelectedEmojiPreview from './fragments/SelectedEmojiPreview';
import SelectedEmojiActionButtons from './fragments/SelectedEmojiActionButtons';

const EmojiPickerBottomSheet = memo(() => {
	const { domain, subdomain } = useActivityPubRestClientContext();
	const { globalDb } = useGlobalMmkvContext();
	const [State, dispatch] = useReducer(emojiPickerReducer, defaultValue);

	const { setEditMode } = useComposerContext();

	const lastSubdomain = useRef(null);
	useEffect(() => {
		if (lastSubdomain.current === subdomain) return;
		dispatch({
			type: EMOJI_PICKER_REDUCER_ACTION.INIT,
			payload: {
				subdomain,
				globalDb,
				domain,
			},
		});
		lastSubdomain.current = subdomain;
	}, [subdomain]);

	if (!State.tagEmojiMap) return <View />;

	function onSelect(o: any) {
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
				<SelectedEmojiActionButtons selection={State.selectedReaction} />
			</View>

			<TextInput
				placeholder={'Search by alias'}
				autoCapitalize={'none'}
				multiline={false}
				placeholderTextColor={'rgba(255, 255, 255, 0.33)'}
				style={styles.textInput}
				onChangeText={onSearchTermChanged}
			/>

			<ScrollView
				style={{
					flexGrow: 1,
					display: 'flex',
					flexWrap: 'wrap',
					flexShrink: 1,
					height: 200,
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
							{/*@ts-ignore-next-line*/}
							<Image source={{ uri: o.url }} style={styles.emojiContainer} />
						</TouchableOpacity>
					))}
				</View>
				<Text
					style={{
						fontSize: 13,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						color: APP_FONT.MONTSERRAT_BODY,
						marginVertical: 8,
						textAlign: 'center',
					}}
				>
					Showing {State.resultSize}/{State.totalSize} results for category
				</Text>
			</ScrollView>

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

export default EmojiPickerBottomSheet;
