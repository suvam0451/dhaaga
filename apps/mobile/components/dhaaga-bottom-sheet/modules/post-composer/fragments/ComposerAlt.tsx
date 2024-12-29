import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useComposerContext } from '../api/useComposerContext';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { APP_FONT } from '../../../../../styles/AppTheme';
import ComposeMediaTargets from './MediaTargets';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../../../states/_global';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';
import { AppBottomSheetMenu } from '../../../../lib/Menu';
import { PostComposerReducerActionType } from '../../../../../states/reducers/post-composer.reducer';
import { AppIcon } from '../../../../lib/Icon';
import MediaUtils from '../../../../../utils/media.utils';
import {
	ACCOUNT_METADATA_KEY,
	AccountMetadataService,
} from '../../../../../database/entities/account-metadata';
import ActivityPubProviderService from '../../../../../services/activitypub-provider.service';

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

	/**
	 * Lets the user select an image item
	 * to share and starts and updates about
	 * upload status
	 */
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

		// try upload
		try {
			dispatch({
				type: PostComposerReducerActionType.SET_UPLOAD_STATUS,
				payload: {
					status: 'uploading',
					localUri: _asset.uri,
				},
			});
			const uploadResult = await ActivityPubProviderService.uploadFile(
				acct?.server,
				_asset.uri,
				{
					token,
					mimeType: _asset.mimeType,
					domain: driver,
				},
			);
			if (uploadResult.id && uploadResult.previewUrl) {
				dispatch({
					type: PostComposerReducerActionType.SET_UPLOAD_STATUS,
					payload: {
						status: 'uploaded',
						localUri: _asset.uri,
					},
				});
				dispatch({
					type: PostComposerReducerActionType.SET_REMOTE_CONTENT,
					payload: {
						localUri: _asset.uri,
						remoteId: uploadResult.id,
						previewUrl: uploadResult.previewUrl,
					},
				});
			} else {
				dispatch({
					type: PostComposerReducerActionType.SET_UPLOAD_STATUS,
					payload: {
						status: 'failed',
						localUri: _asset.uri,
					},
				});
			}
		} catch (E) {
			dispatch({
				type: PostComposerReducerActionType.SET_UPLOAD_STATUS,
				payload: {
					status: 'failed',
					localUri: _asset.uri,
				},
			});
		}
	}

	return (
		<View>
			<AppBottomSheetMenu.WithBackNavigation
				backLabel={'Back'}
				nextLabel={''}
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
