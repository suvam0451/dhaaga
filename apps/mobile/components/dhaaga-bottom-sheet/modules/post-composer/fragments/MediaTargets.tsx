import { memo } from 'react';
import { useComposerContext } from '../api/useComposerContext';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

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
									width: 24,
									height: 24,
									backgroundColor: '#363636',
									borderRadius: 2,
								}}
							>
								<AntDesign name="closesquare" size={24} color={'red'} />
							</View>
						</TouchableOpacity>
					</View>
				)}
			/>
		</View>
	);
});
export default ComposeMediaTargets;
