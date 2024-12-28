import { memo, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { useComposerContext } from '../api/useComposerContext';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { APP_FONT } from '../../../../../styles/AppTheme';
import useHookLoadingState from '../../../../../states/useHookLoadingState';
import { Image } from 'expo-image';
import ComposeMediaTargets from './MediaTargets';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../../../states/_global';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';
import { AppBottomSheetMenu } from '../../../../lib/Menu';
import {
	PostComposer_MediaState,
	PostComposerReducerActionType,
} from '../../../../../states/reducers/post-composer.reducer';
import { AppIcon } from '../../../../lib/Icon';
import MediaUtils from '../../../../../utils/media.utils';
import {
	ACCOUNT_METADATA_KEY,
	AccountMetadataService,
} from '../../../../../database/entities/account-metadata';

const ComposerAltListItem = memo(
	({ item, index }: { item: PostComposer_MediaState; index: number }) => {
		const { client } = useGlobalState(
			useShallow((o) => ({
				client: o.router,
			})),
		);
		const { setAltText } = useComposerContext();
		const [TextContent, setTextContent] = useState(item.localCw);
		const { forceUpdate } = useHookLoadingState();

		async function onSaveAltText() {
			if (TextContent === '') return;
			try {
				const { data, error } = await client.media.updateDescription(
					item.remoteId,
					TextContent,
				);
				if (!error) {
					setAltText(index, TextContent);
					forceUpdate();
				}
			} catch (e) {
				console.log('[ERROR]: updating alt-text', e);
			}
		}

		function onChange(text: string) {
			setTextContent(text);
		}

		// console.log(item.previewUrl || item.localUri);
		return (
			<View>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'flex-start',
						marginVertical: 4,
					}}
				>
					<View>
						{/*@ts-ignore-next-line*/}
						<Image
							source={{ uri: item.previewUrl || item.localUri }}
							style={{ width: 64, height: 96, borderRadius: 8 }}
						/>
					</View>
					<View
						style={{
							// width: '100%',
							// height: '100%',
							marginLeft: 10,
							marginTop: 4,
							flex: 1,
						}}
					>
						<TextInput
							autoCapitalize={'none'}
							multiline={true}
							value={TextContent}
							placeholder={'Alt text for this image.'}
							placeholderTextColor={'rgba(255, 255, 255, 0.33)'}
							style={styles.textInput}
							onChangeText={onChange}
							textAlignVertical={'top'}
						/>
						<View style={{ flexGrow: 1 }} />
						<TouchableOpacity
							style={{
								padding: 8,
								backgroundColor: '#404040',
								maxWidth: 72,
								borderRadius: 8,
								marginTop: 16,
								marginLeft: 4,
								display:
									TextContent === '' || item.localCw === TextContent
										? 'none'
										: 'flex',
							}}
							onPress={onSaveAltText}
						>
							<Text
								style={{
									fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
									textAlign: 'center',
									color: APP_FONT.MONTSERRAT_BODY,
								}}
							>
								Apply
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	},
);

const ComposerAlt = memo(() => {
	const { acct, driver, db } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			driver: o.driver,
			db: o.db,
		})),
	);
	const { state, dispatch } = useComposerContext();
	const { theme } = useAppTheme();

	function onBack() {
		dispatch({
			type: PostComposerReducerActionType.SWITCH_TO_TEXT_TAB,
		});
	}

	async function trigger() {
		let _asset = await MediaUtils.pickImageFromDevice();
		if (!_asset) return;

		const token = AccountMetadataService.getKeyValueForAccountSync(
			db,
			acct,
			ACCOUNT_METADATA_KEY.ACCESS_TOKEN,
		);

		dispatch({
			type: PostComposerReducerActionType.ADD_MEDIA,
			payload: {
				item: _asset,
			},
		});
		// try {
		// 	const uploadResult = await ActivityPubProviderService.uploadFile(
		// 		acct?.server,
		// 		_asset.uri,
		// 		{
		// 			token: token,
		// 			mimeType: _asset.mimeType,
		// 			domain: driver,
		// 		},
		// 	);
		//
		// 	addMediaTarget({
		// 		localUri: _asset.uri,
		// 		uploaded: true,
		// 		remoteId: uploadResult.id,
		// 		previewUrl: uploadResult.previewUrl,
		// 	});
		// } catch (E) {
		// 	console.log(E);
		// }
	}

	return (
		<View>
			<AppBottomSheetMenu.WithBackNavigation
				backLabel={'Back'}
				nextLabel={'Sync'}
				onBack={onBack}
				onNext={() => {}}
				nextEnabled={false}
				style={{ marginBottom: 24, marginTop: 24 }}
				MiddleComponent={
					<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
						<AppIcon
							id={'images'}
							color={theme.primary.a0}
							onPress={trigger}
							size={28}
							containerStyle={{ paddingHorizontal: 8 }}
						/>
						<AppIcon
							id={'gallery'}
							color={theme.secondary.a50}
							size={28}
							containerStyle={{ paddingHorizontal: 8 }}
						/>
					</View>
				}
			/>
			<ComposeMediaTargets />
			{state.medias.length === 0 && (
				<Text
					style={{
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						color: theme.secondary.a30,
						textAlign: 'center',
						marginTop: 32,
						padding: 16,
					}}
				>
					No attachments added.
				</Text>
			)}
			{/*<FlatList*/}
			{/*	data={state.medias}*/}
			{/*	renderItem={({ item, index }) => (*/}
			{/*		<ComposerAltListItem item={item} index={index} />*/}
			{/*	)}*/}
			{/*	contentContainerStyle={{*/}
			{/*		marginVertical: 16,*/}
			{/*	}}*/}
			{/*/>*/}
		</View>
	);
});

const styles = StyleSheet.create({
	textInput: {
		textDecorationLine: 'none',
		textDecorationStyle: undefined,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		fontFamily: APP_FONTS.INTER_400_REGULAR, // backgroundColor: 'red',
		flex: 1,
		width: '100%',
	},
});

export default ComposerAlt;
