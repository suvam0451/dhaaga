import { memo } from 'react';
import { Image } from 'expo-image';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { StyleProp, View, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

type AppAvatarProps = {
	uri: string;
	size?: number;
};

export const AppAvatar = memo(({ uri, size }: AppAvatarProps) => {
	return (
		// @ts-ignore-next-line
		<Image
			source={{ uri: uri }}
			style={{
				width: size || 48,
				height: size || 48,
				borderRadius: size ? size / 2 : 48 / 2,
				borderWidth: 1.5,
				borderColor: '#888',
			}}
		/>
	);
});

type SocialHubAvatarCircleProps = {
	size?: number;
	style?: StyleProp<ViewStyle>;
};

export function SocialHubAvatarCircle({
	size,
	style,
}: SocialHubAvatarCircleProps) {
	const { acct, theme } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			theme: o.colorScheme,
		})),
	);

	if (!acct) return <View />;

	return (
		<View
			style={[
				style,
				{
					position: 'relative',
					overflow: 'visible',
					flexDirection: 'row',
					alignItems: 'center',
					borderRadius: 32,
				},
			]}
		>
			{/*<View*/}
			{/*	style={{*/}
			{/*		borderWidth: 0.5,*/}
			{/*		borderColor: 'black',*/}
			{/*		borderRadius: '100%',*/}
			{/*	}}*/}
			{/*>*/}
			<AppAvatar uri={acct?.avatarUrl} size={size} />
			{/*</View>*/}
			{/*<View*/}
			{/*	style={{*/}
			{/*		zIndex: 99,*/}
			{/*		marginLeft: 4,*/}
			{/*	}}*/}
			{/*>*/}
			{/*	<AntDesign name="switcher" size={24} color="black" />*/}
			{/*</View>*/}
		</View>
	);
}
