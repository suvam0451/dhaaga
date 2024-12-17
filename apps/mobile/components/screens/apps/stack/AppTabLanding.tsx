import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../shared/topnavbar/AppTabLandingNavbar';
import useGlobalState, {
	APP_BOTTOM_SHEET_ENUM,
} from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import AppNoAccount from '../../../error-screen/AppNoAccount';

function AppTabLanding() {
	const { theme, show, acct } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
			show: o.bottomSheet.show,
			acct: o.acct,
		})),
	);

	function onPressQuickPost() {
		show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER, true);
	}

	const modules = [
		{
			title: 'Quick Post',
			desc: ['Smart Auto-Completions'],
			onPress: onPressQuickPost,
			bgIcon: <Ionicons name="chatbox-outline" size={64} color="white" />,
		},
		{
			title: 'Create a Post',
			desc: ['More Options', 'Longer Posts'],
			bgIcon: <Ionicons name="create-outline" size={64} color="white" />,
		},
		{
			title: 'Create a Poll',
			desc: ['WIP', 'Low Priority'],
			bgIcon: <MaterialCommunityIcons name="poll" size={64} color="white" />,
		},
		{
			title: 'Create a Scheduled Post',
			desc: ['WIP', 'No Priority'],
			bgIcon: <MaterialIcons name="schedule" size={64} color="white" />,
		},
	];

	if (!acct) return <AppNoAccount tab={APP_LANDING_PAGE_TYPE.COMPOSE} />;

	return (
		<ScrollView style={{ height: '100%', backgroundColor: theme.palette.bg }}>
			<AppTabLandingNavbar
				type={APP_LANDING_PAGE_TYPE.COMPOSE}
				menuItems={[
					{
						iconId: 'user-guide',
						onPress: () => {
							router.navigate('/apps/user-guide');
						},
					},
				]}
			/>

			<View style={style.rootContainer}>
				{modules.map((module, i) => (
					<View
						key={i}
						style={{
							borderRadius: 16,
							backgroundColor: theme.palette.menubar,
							padding: 16,
							marginBottom: 16,
							marginHorizontal: 10,
							position: 'relative',
						}}
					>
						<Text
							style={{
								color: theme.textColor.medium,
								fontSize: 20,
								fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							}}
						>
							{module.title}
						</Text>
						<Text
							style={{
								color: theme.textColor.medium,
								marginTop: 8,
							}}
						>
							{module.desc.join(' • ')}
						</Text>
						<View
							style={{
								position: 'absolute',
								right: 12,
								bottom: 12,
								opacity: 0.1,
							}}
						>
							{module.bgIcon}
						</View>
					</View>
				))}

				{/*TODO: move these apps to the Social Hub*/}
				{/*<AppListingBookmarkGallery />*/}
				{/*<View style={style.appFeaturesGridRow}>*/}
				{/*	<AppFeatureLargeGridItem*/}
				{/*		label={'Known Servers'}*/}
				{/*		link={'/apps/known-servers'}*/}
				{/*		Icon={*/}
				{/*			<FontAwesome6*/}
				{/*				name="server"*/}
				{/*				size={24}*/}
				{/*				color={APP_FONT.MONTSERRAT_BODY}*/}
				{/*			/>*/}
				{/*		}*/}
				{/*		alignment={'left'}*/}
				{/*	/>*/}
				{/*</View>*/}
			</View>
		</ScrollView>
	);
}

const style = StyleSheet.create({
	rootContainer: {
		marginTop: 54,
	},

	sectionContainer: {
		borderWidth: 2,
		borderColor: '#383838',
		borderRadius: 8,
		padding: 8,
		margin: 8,
	},
	texStyle: {
		textAlign: 'center',
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		fontSize: 20,
		color: APP_FONT.MONTSERRAT_BODY,
	},
	appFeaturesGridRow: {
		marginHorizontal: 8,
		marginBottom: 8,
		display: 'flex',
		flexDirection: 'row',
	},
});

export default AppTabLanding;
