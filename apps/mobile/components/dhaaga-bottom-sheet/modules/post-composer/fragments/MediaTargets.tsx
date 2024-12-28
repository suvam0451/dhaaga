import { memo } from 'react';
import { useComposerContext } from '../api/useComposerContext';
import {
	FlatList,
	TouchableOpacity,
	View,
	Text,
	Pressable,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import {
	useAppDialog,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { Image } from 'expo-image';
import { APP_DIALOG_SHEET_ENUM } from '../../../../../states/_global';

/**
 * Shows a list of uploaded
 * media files and options to
 * select/remove
 */
const ComposeMediaTargets = memo(function Foo() {
	const { removeMediaTarget, state } = useComposerContext();
	const { theme } = useAppTheme();
	const { show } = useAppDialog();

	function onAltPress(idx: number) {
		show(
			{
				title: 'Edit Alt Text',
				actions: [],
				description: ['Set/Update your alt text for this image.'],
			},
			APP_DIALOG_SHEET_ENUM.TEXT_INPUT,
		);
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
				renderItem={({ item, index }) => (
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
						<TouchableOpacity
							style={{ position: 'absolute', right: 8, top: 6 }}
							onPress={() => {
								removeMediaTarget(index);
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
									backgroundColor: state.medias[index].localCw
										? theme.complementary.a0
										: theme.palette.bg,
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
											color: state.medias[index].localCw
												? 'black'
												: theme.secondary.a30,
											fontFamily: APP_FONTS.INTER_500_MEDIUM,
										}}
									>
										ALT
									</Text>
								</Pressable>
							</View>
						</View>
					</View>
				)}
			/>
		</View>
	);
});
export default ComposeMediaTargets;
