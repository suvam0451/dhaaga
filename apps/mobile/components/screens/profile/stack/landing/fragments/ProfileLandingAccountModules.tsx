import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_FONT } from '../../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import { useAppTheme } from '../../../../../../hooks/utility/global-state-extractors';

const ICON_SIZE = 24;

type ActionButtonProps = {
	label: string;
	Icon: any;
	to: string;
};

const ActionButton = memo(({ Icon, label, to }: ActionButtonProps) => {
	const { theme } = useAppTheme();
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
			<View style={{ flex: 1 }} />
			<Entypo
				name="chevron-small-right"
				size={24}
				color={theme.complementary.a0}
			/>
		</TouchableOpacity>
	);
});

function ProfileLandingAccountModules() {
	const { theme } = useAppTheme();
	return (
		<View style={{ paddingTop: 28 }}>
			<ActionButton
				Icon={
					<AntDesign
						name="like"
						size={ICON_SIZE}
						color={theme.complementary.a0}
					/>
				}
				label={'Likes'}
				to={'/profile/account/likes'}
			/>
			<ActionButton
				Icon={
					<Ionicons
						color={theme.complementary.a0}
						name={'bookmark'}
						size={ICON_SIZE}
					/>
				}
				label={'Bookmarks'}
				to={'/profile/account/bookmarks'}
			/>
			<ActionButton
				Icon={<Entypo name="list" size={24} color={theme.complementary.a0} />}
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
