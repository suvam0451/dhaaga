import { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { APP_FONT, APP_THEME } from '../../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import * as React from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router } from 'expo-router';
import { useAppTheme } from '../../../../../../hooks/app/useAppThemePack';
import { AppIcon } from '../../../../../lib/Icon';

const ICON_SIZE = 24;

type ActionButtonProps = {
	label: string;
	Icon: any;
	to: string;
};

const ActionButton = memo(({ Icon, label, to }: ActionButtonProps) => {
	const { colorScheme } = useAppTheme();
	return (
		<TouchableOpacity
			style={styles.moduleContainer}
			onPress={() => {
				router.navigate(to);
			}}
		>
			<View style={{ width: 24 }}>{Icon}</View>
			<Text style={[styles.moduleLabel, { color: colorScheme.textColor.high }]}>
				{label}
			</Text>
			<View style={{ flex: 1 }} />
			<Entypo
				name="chevron-small-right"
				size={24}
				color={APP_FONT.MONTSERRAT_BODY}
			/>
		</TouchableOpacity>
	);
});

const ProfileLandingAccountModules = memo(() => {
	return (
		<View style={{ paddingTop: 16 }}>
			<ActionButton
				Icon={
					<AntDesign name="like1" size={ICON_SIZE} color={APP_THEME.LINK} />
				}
				label={'Likes'}
				to={'/profile/account/likes'}
			/>
			<ActionButton
				Icon={
					<Ionicons
						color={APP_THEME.INVALID_ITEM}
						name={'bookmark'}
						size={ICON_SIZE}
					/>
				}
				label={'Bookmarks'}
				to={'/profile/account/bookmarks'}
			/>

			<ActionButton
				Icon={<Entypo name="list" size={24} color={APP_FONT.MONTSERRAT_BODY} />}
				label={'Lists'}
				to={'/profile/account/lists'}
			/>

			<Text
				style={[
					styles.text,
					{ marginTop: 16, fontSize: 14, color: APP_FONT.DISABLED },
				]}
			>
				You have no pending friend requests.
			</Text>
			<View
				style={{
					backgroundColor: 'rgba(48,48,48,0.87)',
					marginVertical: 12,
					marginHorizontal: 8,
					height: 2,
				}}
			/>

			<ActionButton
				Icon={<AppIcon id={'wand'} size={24} emphasis={'high'} />}
				label={'Quick Fix'}
				to={'/profile/account/lists'}
			/>
			<ActionButton
				Icon={<AppIcon id={'cog'} size={24} emphasis={'high'} />}
				label={'All Settings'}
				to={'/profile/settings/landing'}
			/>

			<Text
				style={[
					styles.text,
					{
						marginTop: 16,
						fontSize: 14,
						color: APP_FONT.MEDIUM_EMPHASIS,
						textAlign: 'center',
						paddingHorizontal: 32,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
					},
				]}
			>
				TIP: Press & hold your pfp (in bottom navbar) to swap accounts from
				anywhere
			</Text>
		</View>
	);
});

export default ProfileLandingAccountModules;

const styles = StyleSheet.create({
	moduleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		paddingHorizontal: 12,
	},
	moduleLabel: {
		color: APP_FONT.HIGH_EMPHASIS,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		fontSize: 18,
		marginLeft: 8,
	},
	text: {
		fontFamily: APP_FONTS.INTER_700_BOLD,
		color: APP_FONT.MONTSERRAT_BODY,
		textAlign: 'center',
		marginBottom: 16,
	},
});
