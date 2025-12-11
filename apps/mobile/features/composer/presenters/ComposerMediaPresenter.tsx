import { View, StyleSheet } from 'react-native';
import { useComposerCtx } from '../contexts/useComposerCtx';
import ComposeMediaTargets from '#/components/dhaaga-bottom-sheet/modules/post-composer/fragments/MediaTargets';
import {
	useActiveUserSession,
	useAppApiClient,
	useAppDb,
	useAppTheme,
} from '#/states/global/hooks';
import { AppBottomSheetMenu } from '#/components/lib/Menu';
import { PostComposerReducerActionType } from '../reducers/composer.reducer';
import { AppIcon } from '#/components/lib/Icon';
import MediaUtils from '#/utils/media.utils';
import { ACCOUNT_METADATA_KEY, AccountMetadataService } from '@dhaaga/db';
import ActivityPubProviderService from '#/services/activitypub-provider.service';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import useComposer from '../../../states/app/useComposer';
import { AppText } from '#/components/lib/Text';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';

function ComposerMediaPresenter() {
	const { driver } = useAppApiClient();
	const { acct } = useActiveUserSession();
	const { db } = useAppDb();
	const { state, dispatch } = useComposerCtx();
	const { theme } = useAppTheme();
	const { toHome } = useComposer();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

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
				backLabel={t(`sheets.backOption`)}
				nextLabel={''}
				onBack={toHome}
				onNext={() => {}}
				nextEnabled={false}
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
				style={{
					paddingHorizontal: 6,
				}}
			/>
			<ComposeMediaTargets />
			{state.medias.length === 0 && (
				<AppText.Medium
					style={[
						styles.noAttachments,
						{
							color: theme.secondary.a30,
						},
					]}
				>
					{t(`composer.noAttachments`)}
				</AppText.Medium>
			)}
		</View>
	);
}

export default ComposerMediaPresenter;

const styles = StyleSheet.create({
	noAttachments: {
		textAlign: 'center',
		marginTop: 32,
		padding: 16,
		fontSize: 18,
	},
});
