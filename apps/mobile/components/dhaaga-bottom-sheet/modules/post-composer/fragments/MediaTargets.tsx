import { useComposerContext } from '../api/useComposerContext';
import {
	FlatList,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import {
	useAppApiClient,
	useAppDialog,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { Image } from 'expo-image';
import { PostComposerReducerActionType } from '../../../../../states/reducers/post-composer.reducer';
import { AppIcon } from '../../../../lib/Icon';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';

/**
 * Shows a list of uploaded
 * media files and options to
 * select/remove
 */
function ComposeMediaTargets() {
	const { client, driver } = useAppApiClient();
	const { state, dispatch } = useComposerContext();
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
				title: 'Edit Alt Text',
				actions: [],
				description: ['Set/Update your alt text for this image.'],
			},
			state.medias[idx].remoteAlt || '',
			(text: string) => {
				altInputCallback(idx, text);
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
			const { data, error } = await client.media.updateDescription(
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
				marginBottom: state.medias.length > 0 ? 8 : 0,
			}}
		>
			<FlatList
				horizontal={true}
				data={state.medias}
				renderItem={({ item, index }) => {
					const ALT_SYNCED =
						state.medias[index].remoteAlt === state.medias[index].localAlt &&
						!!state.medias[index].remoteAlt;

					let indicatorIcon = <View />;
					switch (item.status) {
						case 'uploaded': {
							indicatorIcon = (
								<AppIcon
									id={'checkmark-done-outline'}
									size={28}
									color={theme.primary.a0}
								/>
							);
							break;
						}
						case 'uploading': {
							indicatorIcon = (
								<AppIcon
									id={'cloud-upload-outline'}
									size={28}
									color={theme.complementary.a0}
								/>
							);
							break;
						}
						case 'failed': {
							indicatorIcon = (
								<AppIcon id={'warning-outline'} size={28} color={'red'} />
							);
							break;
						}
					}
					return (
						<View
							style={{
								position: 'relative',
								overflow: 'visible',
								marginHorizontal: 4,
							}}
						>
							{/* @ts-ignore-next-line */}
							<Image
								source={{ uri: item.previewUrl || item.localUri }}
								height={196}
								width={128}
								style={{ borderRadius: 8 }}
							/>
							<View style={{ position: 'absolute', left: 8, bottom: 6 }}>
								<View
									style={{
										backgroundColor: theme.palette.bg,
										justifyContent: 'center',
										alignItems: 'center',
										borderRadius: '100%',
									}}
								>
									{indicatorIcon}
								</View>
							</View>

							<TouchableOpacity
								style={{ position: 'absolute', right: 8, top: 6 }}
								onPress={() => {
									onRemovePress(index);
								}}
							>
								<View
									style={{
										backgroundColor: theme.palette.bg,
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<View style={{ height: 28, width: 28 }}>
										<AntDesign
											name="closecircle"
											size={28}
											color={theme.complementary.a0}
										/>
									</View>
								</View>
							</TouchableOpacity>

							<TouchableOpacity
								style={{ position: 'absolute', right: 8, top: 6 }}
								onPress={() => {
									onRemovePress(index);
								}}
							>
								<View
									style={{
										backgroundColor: theme.palette.bg,
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<View style={{ height: 28, width: 28 }}>
										<AntDesign
											name="closecircle"
											size={28}
											color={theme.complementary.a0}
										/>
									</View>
								</View>
							</TouchableOpacity>
							<View style={{ position: 'absolute', right: 8, bottom: 8 }}>
								<View
									style={{
										backgroundColor: theme.palette.bg,
										justifyContent: 'center',
										alignItems: 'center',
										borderRadius: 8,
										paddingHorizontal: 8,
										paddingVertical: 6,
										opacity: 0.9,
									}}
								>
									<Pressable
										onPress={() => {
											onAltPress(index);
										}}
									>
										<Text
											style={{
												color:
													state.medias[index].remoteAlt ===
														state.medias[index].localAlt &&
													!!state.medias[index].remoteAlt
														? theme.primary.a0
														: theme.complementary.a0,
												fontFamily: APP_FONTS.INTER_500_MEDIUM,
											}}
										>
											ALT
										</Text>
									</Pressable>
								</View>
							</View>
						</View>
					);
				}}
			/>
		</View>
	);
}

export default ComposeMediaTargets;
