import { memo } from 'react';
import { useComposerContext } from '../api/useComposerContext';
import { FlatList, Image, TouchableOpacity, View, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import Feather from '@expo/vector-icons/Feather';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import useImagePicker from '../api/useImagePicker';
import { useAppTheme } from '../../../../../hooks/app/useAppThemePack';

/**
 * Shows a list of uploaded
 * media files and options to
 * select/remove
 */
const ComposeMediaTargets = memo(function Foo() {
	const { mediaTargets, removeMediaTarget } = useComposerContext();
	const { trigger } = useImagePicker();
	const { colorScheme } = useAppTheme();

	return (
		<View
			style={{
				marginBottom: mediaTargets.length > 0 ? 8 : 0,
			}}
		>
			<FlatList
				horizontal={true}
				data={mediaTargets}
				ListHeaderComponent={
					<View style={{ justifyContent: 'space-between', flex: 1 }}>
						<TouchableOpacity
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								padding: 8,
								borderWidth: 2,
								borderColor: 'rgba(200, 200, 200, 0.3)',
								borderRadius: 8,
								flex: 1,
								marginVertical: 4,
							}}
							onPress={trigger}
						>
							<Feather
								name="image"
								size={24}
								color={colorScheme.textColor.medium}
							/>
							<Text
								style={{
									color: colorScheme.textColor.medium,
									marginLeft: 4,
									fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
								}}
							>
								Add Media
							</Text>
						</TouchableOpacity>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								padding: 8,
								borderWidth: 2,
								borderColor: 'rgba(200, 200, 200, 0.3)',
								borderRadius: 8,
								flex: 1,
								marginVertical: 4,
							}}
						>
							<Feather name="camera" size={24} color={APP_FONT.DISABLED} />
							<Text
								style={{
									color: APP_FONT.DISABLED,
									marginLeft: 4,
									fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
								}}
							>
								Camera
							</Text>
						</View>
					</View>
				}
				renderItem={({ item, index }) => (
					<View
						style={{
							position: 'relative',
							overflow: 'visible',
							marginHorizontal: 4,
						}}
					>
						<Image
							source={{ uri: item.previewUrl || item.localUri }}
							height={108}
							width={72}
							style={{ borderRadius: 8 }}
						/>
						<TouchableOpacity
							style={{ position: 'absolute', right: 2, top: 2 }}
							onPress={() => {
								removeMediaTarget(index);
							}}
						>
							<View
								style={{
									// width: 24,
									// height: 24,
									backgroundColor: '#363636',
									// borderRadius: '100%',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<View style={{ height: 20, width: 20 }}>
									<AntDesign
										name="closecircle"
										size={20}
										color={APP_THEME.INVALID_ITEM}
									/>
								</View>
							</View>
						</TouchableOpacity>
					</View>
				)}
			/>
		</View>
	);
});
export default ComposeMediaTargets;
