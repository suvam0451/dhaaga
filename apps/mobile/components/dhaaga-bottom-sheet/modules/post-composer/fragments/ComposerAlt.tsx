import { View, Text } from 'react-native';
import { useComposerContext } from '../api/useComposerContext';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import ComposeMediaTargets from './MediaTargets';
import {
	useAppAcct,
	useAppApiClient,
	useAppDb,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { AppBottomSheetMenu } from '../../../../lib/Menu';
import { PostComposerReducerActionType } from '../../../../../states/reducers/post-composer.reducer';
import { AppIcon } from '../../../../lib/Icon';
import MediaUtils from '../../../../../utils/media.utils';
import {
	ACCOUNT_METADATA_KEY,
	AccountMetadataService,
} from '../../../../../database/entities/account-metadata';
import ActivityPubProviderService from '../../../../../services/activitypub-provider.service';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';

function ComposerAlt() {
	const { driver } = useAppApiClient();
	const { acct } = useAppAcct();
	const { db } = useAppDb();
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

		// media attachments are uploaded during post creation
		if (driver === KNOWN_SOFTWARE.BLUESKY) return;

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
		</View>
	);
}

export default ComposerAlt;
