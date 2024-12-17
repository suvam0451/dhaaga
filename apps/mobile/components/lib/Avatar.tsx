import { memo } from 'react';
import { Image } from 'expo-image';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { StyleProp, View, ViewStyle } from 'react-native';

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
	const { acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);

	console.log(acct?.avatarUrl);
	if (!acct) return <View />;

	return (
		<View style={style}>
			<AppAvatar uri={acct?.avatarUrl} size={size} />
		</View>
	);
}
