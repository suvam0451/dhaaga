import { memo, useEffect, useReducer, useRef, useState } from 'react';
import {
	FlatList,
	Pressable,
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
import EmojiPickerSearchResults from './fragments/EmojiPickerSearchResults';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import { AppIcon } from '../../../lib/Icon';
import { appDimensions } from '../../../../styles/dimensions';
import SelectedEmojiPreview from './fragments/SelectedEmojiPreview';

type EmojiPickerBottomSheetProps = {
	onSelect: (shortCode: string) => Promise<void>;
	onCancel: () => void;
};

type NoReactionsAvailableProps = {
	onBack: () => void;
};

function NoReactionsAvailable({ onBack }: NoReactionsAvailableProps) {
	const { theme } = useAppTheme();
	return (
		<View>
			<View style={{ alignItems: 'center' }}>
				<Text
					style={{
						color: theme.secondary.a10,
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						fontSize: 16,
						textAlign: 'center',
						paddingVertical: 32,
						maxWidth: 256,
					}}
				>
					Could not load custom emojis for your server.
				</Text>
			</View>
			<TouchableOpacity
				style={{
					backgroundColor: theme.complementary.a10,
					padding: 8,
					borderRadius: 8,
					alignSelf: 'center',
					justifyContent: 'center',
					maxWidth: 128,
					paddingHorizontal: 16,
				}}
				onPress={onBack}
			>
				<Text
					style={{
						color: 'black',
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						fontSize: 16,
						textAlign: 'center',
					}}
				>
					Back
				</Text>
			</TouchableOpacity>
		</View>
	);
}

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
		const { theme } = useAppTheme();
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

		function onPressBack() {
			onCancel();
		}

		const [Loading, setLoading] = useState(false);
		function onConfirmPick() {
			if (!State.selectedReaction) return;
			setLoading(true);
			onSelect(State.selectedReaction.shortCode)
				.then((res) => {
					console.log(res);
				})
				.finally(() => {
					setLoading(false);
				});
		}

		if (!State.tagEmojiMap)
			return <NoReactionsAvailable onBack={onPressBack} />;

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
			<View
				style={{
					marginTop: 4,
					position: 'relative',
					flex: 1,
					marginBottom: 8,
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						maxWidth: '100%',
						marginBottom: 8,
					}}
				>
					<Pressable
						onPress={onCancel}
						style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
					>
						<AppIcon id={'chevron-left'} color={theme.complementary.a0} />
						<Text
							style={{
								color: theme.complementary.a0,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
								fontSize: 16,
							}}
						>
							Go Back
						</Text>
					</Pressable>
					<View
						style={{
							flexGrow: 1,
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<TextInput
							placeholder={'Search'}
							autoCapitalize={'none'}
							multiline={false}
							placeholderTextColor={'rgba(255, 255, 255, 0.33)'}
							style={styles.textInput}
							onChangeText={onSearchTermChanged}
						/>
					</View>
					<Pressable
						onPress={onConfirmPick}
						style={{
							flexDirection: 'row',
							alignItems: 'flex-end',
							paddingRight: 8,
							flex: 1,
						}}
					>
						<Text
							style={{
								color: State.selectedReaction
									? theme.primary.a0
									: theme.secondary.a20,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
								fontSize: 16,
								textAlign: 'right',
								marginLeft: 'auto',
							}}
						>
							Pick
						</Text>
					</Pressable>
				</View>

				<SelectedEmojiPreview selection={State.selectedReaction} />

				<EmojiPickerSearchResults State={State} onSelect={onEmojiSelected} />
				<View style={{ paddingTop: 6 }}>
					<FlatList
						horizontal={true}
						data={State.allTags}
						renderItem={({ item }) => (
							<Pressable
								style={{
									backgroundColor: '#363636',
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
								<Text
									style={{
										color: theme.complementary.a0,
										fontSize: 16,
										fontFamily: APP_FONTS.INTER_500_MEDIUM,
									}}
								>
									{item ? item : 'DEFAULT'}
								</Text>
							</Pressable>
						)}
						style={{ flexGrow: 1, maxHeight: 48 }}
					/>
				</View>
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
		textAlign: 'center',
		minWidth: 128,
	},
});

export default EmojiPickerBottomSheet;
