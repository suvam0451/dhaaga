import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAppTheme } from '#/states/global/hooks';
import { Image } from 'expo-image';
import { AppIcon } from '../../../../lib/Icon';
import {
	usePostComposerDispatch,
	usePostComposerState,
	PostComposerAction,
} from '@dhaaga/react';
import { NativeTextBold } from '#/ui/NativeText';
import useAltText from '#/features/composer/hooks/useAltText';

/**
 * Shows a list of uploaded
 * media files and options to
 * select/remove
 */
function ComposeMediaTargets() {
	const state = usePostComposerState();
	const dispatch = usePostComposerDispatch();
	const { theme } = useAppTheme();
	const { showDialog } = useAltText();

	function onRemovePress(idx: number) {
		dispatch({
			type: PostComposerAction.REMOVE_MEDIA,
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
									color={theme.primary}
								/>
							);
							break;
						}
						case 'uploading': {
							indicatorIcon = (
								<AppIcon
									id={'cloud-upload-outline'}
									size={22}
									color={theme.complementary}
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
										showDialog(index);
									}}
									style={styles.buttonMid}
								>
									<NativeTextBold
										style={{
											color:
												state.medias[index].remoteAlt ===
													state.medias[index].localAlt &&
												!!state.medias[index].remoteAlt
													? theme.primary
													: theme.complementary,
										}}
									>
										{state.medias[index].localAlt ? `ALT` : `NO ALT`}
									</NativeTextBold>
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
