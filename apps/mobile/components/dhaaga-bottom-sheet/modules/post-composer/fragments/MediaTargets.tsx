import { memo } from 'react';
import { useComposerContext } from '../api/useComposerContext';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_THEME } from '../../../../../styles/AppTheme';

const ComposeMediaTargets = memo(function Foo() {
	const { mediaTargets, removeMediaTarget } = useComposerContext();

	return (
		<View
			style={{
				marginBottom: mediaTargets.length > 0 ? 8 : 0,
			}}
		>
			<FlatList
				horizontal={true}
				data={mediaTargets}
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
