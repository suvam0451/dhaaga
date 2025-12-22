import { useEffect, useReducer, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import emojiPickerReducer, {
	defaultValue,
	Emoji,
	EMOJI_PICKER_REDUCER_ACTION,
} from './emojiPickerReducer';
import EmojiPickerSearchResults from './fragments/EmojiPickerSearchResults';
import {
	useAccountManager,
	useActiveUserSession,
	useAppApiClient,
	useAppTheme,
} from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import SelectedEmojiPreview from './fragments/SelectedEmojiPreview';
import { AppBottomSheetMenu } from '../../../lib/Menu';
import { AppTextInput } from '../../../lib/TextInput';
import { NativeTextBold } from '#/ui/NativeText';

type EmojiPickerBottomSheetProps = {
	onAccept: (o: Emoji) => void;
	onCancel: () => void;
	isProcessing?: boolean;
};

type NoReactionsAvailableProps = {
	onBack: () => void;
};

function NoReactionsAvailable({ onBack }: NoReactionsAvailableProps) {
	const { theme } = useAppTheme();
	return (
		<View>
			<View style={{ alignItems: 'center' }}>
				<NativeTextBold
					style={[
						styles.noReactionAvailableSectionA,
						{
							color: theme.secondary.a10,
						},
					]}
				>
					Could not load custom emojis for your server.
				</NativeTextBold>
			</View>
			<Pressable
				style={[
					styles.noReactionAvailableSectionB,
					{
						backgroundColor: theme.complementary,
					},
				]}
				onPress={onBack}
			>
				<NativeTextBold style={styles.noReactionAvailableButton}>
					Back
				</NativeTextBold>
			</Pressable>
		</View>
	);
}

/**
 * @composerState the parent composer state,
 */
function EmojiPickerBottomSheet({
	onAccept,
	onCancel,
	isProcessing,
}: EmojiPickerBottomSheetProps) {
	const { driver } = useAppApiClient();
	const { acct } = useActiveUserSession();
	const { acctManager } = useAccountManager();
	const { theme } = useAppTheme();
	const [State, dispatch] = useReducer(emojiPickerReducer, defaultValue);

	const [SearchText, setSearchText] = useState('');

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

	function _onAccept() {
		if (!State.selectedReaction) return;
		onAccept(State.selectedReaction);
	}

	if (!State.tagEmojiMap) return <NoReactionsAvailable onBack={onCancel} />;

	function onEmojiSelected(o: any) {
		dispatch({
			type: EMOJI_PICKER_REDUCER_ACTION.SELECT,
			payload: {
				shortCode: o.shortCode,
			},
		});
	}

	function onSearchTermChanged(o: any) {
		setSearchText(o);
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
		<View
			style={{
				flex: 1,
				marginBottom: 12,
			}}
		>
			<AppBottomSheetMenu.WithBackNavigation
				nextLabel={'Select'}
				backLabel={'Back'}
				onBack={onCancel}
				onNext={_onAccept}
				nextEnabled={!!State.selectedReaction}
				MiddleComponent={
					<AppTextInput.SingleLine
						placeholder={'Search'}
						onChangeText={onSearchTermChanged}
						style={styles.textInput}
						value={SearchText}
					/>
				}
				style={{
					paddingHorizontal: 6,
				}}
				nextLoading={isProcessing}
			/>
			<SelectedEmojiPreview selection={State.selectedReaction} />
			<EmojiPickerSearchResults State={State} onSelect={onEmojiSelected} />
			<View style={{ paddingTop: 6 }}>
				<FlatList
					horizontal={true}
					data={State.allTags}
					renderItem={({ item }) => (
						<Pressable
							style={{
								backgroundColor: theme.background.a30,
								paddingHorizontal: 10,
								paddingVertical: 8,
								marginHorizontal: 4,
								borderRadius: appDimensions.buttons.borderRadius,
								maxHeight: 38,
							}}
							onPress={() => {
								onTagSelectionChanged(item);
							}}
						>
							<NativeTextBold
								style={{
									color: theme.complementary,
									fontSize: 16,
								}}
							>
								{item ? item : 'DEFAULT'}
							</NativeTextBold>
						</Pressable>
					)}
					style={{ flexGrow: 1, maxHeight: 48 }}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	textInput: {
		paddingVertical: 8,
		fontSize: 16,
		textAlign: 'center',
		minWidth: 128,
	}, // no reaction available prompt
	noReactionAvailableSectionA: {
		fontSize: 16,
		textAlign: 'center',
		paddingVertical: 32,
		maxWidth: 256,
	},
	noReactionAvailableSectionB: {
		padding: 8,
		borderRadius: 8,
		alignSelf: 'center',
		justifyContent: 'center',
		maxWidth: 128,
		paddingHorizontal: 16,
	},
	noReactionAvailableButton: {
		color: 'black',
		fontSize: 16,
		textAlign: 'center',
	},
});

export default EmojiPickerBottomSheet;
