import { useComposerCtx } from '#/features/composer/contexts/useComposerCtx';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import {
	useAppApiClient,
	useAppDialog,
	useAppTheme,
} from '#/states/global/hooks';
import { Image } from 'expo-image';
import { PostComposerReducerActionType } from '#/features/composer/reducers/composer.reducer';
import { AppIcon } from '../../../../lib/Icon';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AppText } from '../../../../lib/Text';

/**
 * Shows a list of uploaded
 * media files and options to
 * select/remove
 */
function ComposeMediaTargets() {
	const { client, driver } = useAppApiClient();
	const { state, dispatch } = useComposerCtx();
	const { theme } = useAppTheme();
	const { show } = useAppDialog();

	async function altInputCallback(idx: number, input: string) {
		dispatch({
			type: PostComposerReducerActionType.SET_ALT_TEXT,
			payload: {
				index: idx,
				text: input,
			},
		});

		// for bluesky, media assets are not preloaded
		if (driver === KNOWN_SOFTWARE.BLUESKY) return;

		dispatch({
			type: PostComposerReducerActionType.SET_ALT_TEXT_SYNC_STATUS,
			payload: {
				index: idx,
				status: 'uploading',
			},
		});
		await onSaveAltText(idx, input);
	}

	function onAltPress(idx: number) {
		show(
			{
				title: 'Alt Text',
				actions: [],
				description: [
					'See alt text for this image.',
					'Submit empty string to remove.',
				],
			},
			{
				$type: 'text-prompt',
				placeholder: state.medias[idx].remoteAlt || 'Enter new alt text',
			},
			(ctx) => {
				if (ctx.$type !== 'text-prompt') return;
				if (!ctx.userInput) return;
				altInputCallback(idx, ctx.userInput.trim());
			},
		);
	}

	async function onSaveAltText(idx: number, text: string) {
		if (text == '') return;
		if (state.medias.length <= idx) {
			return;
		}
		const _media = state.medias[idx];
		try {
			const { error } = await client.media.updateDescription(
				_media.remoteId,
				text,
			);
			if (error) {
				dispatch({
					type: PostComposerReducerActionType.SET_ALT_TEXT_SYNC_STATUS,
					payload: {
						index: idx,
						status: 'failed',
					},
				});
			} else {
				dispatch({
					type: PostComposerReducerActionType.SET_ALT_TEXT_SYNC_STATUS,
					payload: {
						index: idx,
						status: 'uploaded',
					},
				});
			}
		} catch (e) {
			dispatch({
				type: PostComposerReducerActionType.SET_ALT_TEXT_SYNC_STATUS,
				payload: {
					index: idx,
					status: 'failed',
				},
			});
		}
	}

	function onRemovePress(idx: number) {
		dispatch({
			type: PostComposerReducerActionType.REMOVE_MEDIA,
			payload: {
				index: idx,
			},
		});
	}

	return (
		<View
			style={{
				marginHorizontal: 10,
				marginTop: 8,
				marginBottom: state.medias.length > 0 ? 8 : 0,
			}}
		>
			<FlatList
				horizontal={true}
				data={state.medias}
				renderItem={({ item, index }) => {
					let indicatorIcon = <View />;
					switch (item.status) {
						case 'uploaded': {
							indicatorIcon = (
								<AppIcon
									id={'checkmark-done-outline'}
									size={22}
									color={theme.primary.a0}
								/>
							);
							break;
						}
						case 'uploading': {
							indicatorIcon = (
								<AppIcon
									id={'cloud-upload-outline'}
									size={22}
									color={theme.complementary.a0}
								/>
							);
							break;
						}
						case 'failed': {
							indicatorIcon = (
								<AppIcon id={'warning-outline'} size={22} color={'red'} />
							);
							break;
						}
					}
					return (
						<View
							style={{
								overflow: 'visible',
								marginRight: 8,
								borderColor: theme.background.a50,
								borderWidth: 2,
								borderRadius: 12,
							}}
						>
							<Image
								source={{ uri: item.previewUrl || item.localUri }}
								style={{ borderRadius: 12, height: 196, width: 128 }}
							/>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
								}}
							>
								<View style={styles.button}>{indicatorIcon}</View>
								<Pressable
									onPress={() => {
										onAltPress(index);
									}}
									style={styles.buttonMid}
								>
									<AppText.Medium
										style={{
											color:
												state.medias[index].remoteAlt ===
													state.medias[index].localAlt &&
												!!state.medias[index].remoteAlt
													? theme.primary.a0
													: theme.complementary.a0,
										}}
									>
										ALT
									</AppText.Medium>
								</Pressable>
								<Pressable
									onPress={() => {
										onRemovePress(index);
									}}
									style={styles.button}
								>
									<AntDesign name="close" size={24} color={'red'} />
								</Pressable>
							</View>
						</View>
					);
				}}
			/>
		</View>
	);
}

export default ComposeMediaTargets;

const styles = StyleSheet.create({
	button: {
		paddingHorizontal: 8,
		paddingVertical: 6,
	},
	buttonMid: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 6,
	},
});
