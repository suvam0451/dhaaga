import { memo } from 'react';
import { useAppTheme } from '../../../../../hooks/app/useAppThemePack';
import { View } from 'react-native';
import { Image } from 'expo-image';

const ComposerDecorator = memo(() => {
	const { activePack } = useAppTheme();

	if (!activePack.valid || !activePack.composerDecoratorInside) {
		return <View />;
	}

	return (
		<View style={{ position: 'absolute', right: -32, top: '100%' }}>
			{/*@ts-ignore-next-line*/}
			<Image
				source={{ uri: activePack.composerDecoratorInside.localUri }}
				style={{
					height: 256,
					width: 256,
					opacity: 0.12,
					transform: [{ scaleX: -1 }, { scaleY: 1 }],
				}}
			/>
		</View>
	);
});

export default ComposerDecorator;
