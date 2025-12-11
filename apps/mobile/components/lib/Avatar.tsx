import { Image } from 'expo-image';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { Account } from '@dhaaga/db';
import { useAppTheme } from '#/states/global/hooks';

type AppAvatarProps = {
	uri: string;
	size?: number;
};

export function AppAvatar({ uri, size }: AppAvatarProps) {
	return (
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
}

type SocialHubAvatarCircleProps = {
	size?: number;
	style?: StyleProp<ViewStyle>;
	acct: Account;
};

export function SocialHubAvatarCircle({
	size,
	style,
	acct,
}: SocialHubAvatarCircleProps) {
	const { theme } = useAppTheme();

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
			<View
				style={{
					backgroundColor: theme.palette.bg,
					borderStyle: 'dashed',
					borderWidth: 1.5,
					borderColor: theme.primary.a0,
					flexDirection: 'row',
					alignItems: 'center',
					borderRadius: 20,
				}}
			>
				<AppAvatar uri={acct?.avatarUrl} size={size} />
				<Text
					style={{
						color: theme.primary.a0,
						marginLeft: 8,
						marginRight: 12,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
					}}
				>
					Default
				</Text>
			</View>
		</View>
	);
}
