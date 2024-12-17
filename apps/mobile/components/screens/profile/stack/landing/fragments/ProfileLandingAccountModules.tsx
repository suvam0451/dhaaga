import { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_FONT, APP_THEME } from '../../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppIcon } from '../../../../../lib/Icon';

const ICON_SIZE = 24;

type ActionButtonProps = {
	label: string;
	Icon: any;
	to: string;
};

const ActionButton = memo(({ Icon, label, to }: ActionButtonProps) => {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	return (
		<TouchableOpacity
			style={styles.moduleContainer}
			onPress={() => {
				router.navigate(to);
			}}
		>
			<View style={{ width: 24 }}>{Icon}</View>
			<Text style={[styles.moduleLabel, { color: theme.textColor.medium }]}>
				{label}
			</Text>
			{/*<View style={{ flex: 1 }} />*/}
			{/*<Entypo*/}
			{/*	name="chevron-small-right"*/}
			{/*	size={24}*/}
			{/*	color={theme.textColor.medium}*/}
			{/*/>*/}
		</TouchableOpacity>
	);
});

function ProfileLandingAccountModules() {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
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

			<View
				style={{
					height: 1,
					width: '100%',
					backgroundColor: theme.palette.menubar,
					marginVertical: 12,
					marginBottom: 24,
				}}
			/>
			<View style={styles.checkmarkBox}>
				<AppIcon id={'checkmark-done-outline'} emphasis={'low'} />
				<Text
					style={[
						styles.checkmarkBoxText,
						{ fontSize: 14, color: theme.textColor.low },
					]}
				>
					No pending friend requests.
				</Text>
			</View>

			<Text
				style={{
					marginTop: 32,
					fontSize: 14,
					color: theme.textColor.low,
					textAlign: 'center',
					paddingHorizontal: 32,
					fontFamily: APP_FONTS.INTER_500_MEDIUM,
				}}
			>
				[TIP] Long press your avatar in navbar to quickly swap accounts
			</Text>
		</View>
	);
}

export default ProfileLandingAccountModules;

const styles = StyleSheet.create({
	moduleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		paddingHorizontal: 12,
		marginBottom: 6,
	},
	moduleLabel: {
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		fontSize: 18,
		marginLeft: 14,
	},
	checkmarkBox: {
		marginLeft: 16,
		marginBottom: 16,
		flexDirection: 'row',
		alignItems: 'center',
	},
	checkmarkBoxText: {
		fontFamily: APP_FONTS.INTER_700_BOLD,
		color: APP_FONT.MONTSERRAT_BODY,
		marginLeft: 8,
	},
});
