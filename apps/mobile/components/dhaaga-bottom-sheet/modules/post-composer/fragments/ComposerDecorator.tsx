import { memo } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const ComposerDecorator = memo(() => {
	const { setTheme } = useGlobalState(
		useShallow((o) => ({
			setTheme: o.setColorScheme,
		})),
	);

	return <View />;
	return (
		<View style={{ position: 'absolute', right: -32, top: '100%' }}>
			{/*@ts-ignore-next-line*/}
			{/*<Image*/}
			{/*	source={{ uri: activePack.composerDecoratorInside.localUri }}*/}
			{/*	style={{*/}
			{/*		height: 256,*/}
			{/*		width: 256,*/}
			{/*		opacity: 0.12,*/}
			{/*		transform: [{ scaleX: -1 }, { scaleY: 1 }],*/}
			{/*	}}*/}
			{/*/>*/}
		</View>
	);
});

export default ComposerDecorator;
