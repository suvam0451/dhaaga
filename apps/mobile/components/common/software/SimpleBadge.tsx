import { memo } from 'react';
import useKnownSoftware from '../../../hooks/app/useKnownSoftware';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../../styles/AppFonts';
import { APP_FONT } from '../../../styles/AppTheme';
import { Accounts } from '../../../database/entities/account';

type SoftwareBadgeUpdateAccountOnClickProps = {
	acct: Accounts;
};

export const SoftwareBadgeUpdateAccountOnClick = memo(function Foo({
	acct,
}: SoftwareBadgeUpdateAccountOnClickProps) {
	const Theming = useKnownSoftware(acct.server);

	return (
		<View style={styles.badgeContainer}>
			<View style={{ width: Theming.width, height: Theming.height }}>
				{/*@ts-ignore-next-line*/}
				<Image
					source={{
						uri: Theming.logo.uri,
					}}
					style={{
						width: Theming.width,
						height: Theming.height,
						opacity: 0.8,
					}}
				/>
			</View>

			<Text
				style={{
					fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
					color: APP_FONT.MONTSERRAT_HEADER,
					fontSize: 12,
					marginLeft: 4,
				}}
			>
				{Theming.label}
			</Text>
		</View>
	);
});

type Props = {
	software: string;
};

const SimpleSoftwareBadge = memo(function Foo({ software }: Props) {
	const Theming = useKnownSoftware(software);

	return (
		<View style={styles.badgeContainer}>
			<View style={{ width: Theming.width, height: Theming.height }}>
				{/*@ts-ignore-next-line*/}
				<Image
					source={{
						uri: Theming.logo.uri,
					}}
					style={{ width: Theming.width, height: Theming.height }}
				/>
			</View>
			<Text
				style={{
					fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
					color: APP_FONT.MONTSERRAT_HEADER,
					fontSize: 13,
					marginLeft: 4,
				}}
			>
				{Theming.label}
			</Text>
		</View>
	);
});

const styles = StyleSheet.create({
	badgeContainer: {
		backgroundColor: '#121212',
		padding: 4,
		paddingHorizontal: 6,
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
	},
});

export default SimpleSoftwareBadge;
