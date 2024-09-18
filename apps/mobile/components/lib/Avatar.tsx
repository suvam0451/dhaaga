import { memo } from 'react';
import { Image } from 'expo-image';

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
