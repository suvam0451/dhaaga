import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_FONTS } from '../../../styles/AppFonts';

/**
 * The last tab of the Social Hub
 * is always a UI to add a new profile
 *
 * @deprecated
 */
function HubAddProfileView() {
	const { theme } = useAppTheme();

	function onGuideRequested() {
		router.navigate(APP_ROUTING_ENUM.GUIDE_NEW_TAB_INTERFACE);
	}

	return (
		<ScrollView
			style={{
				backgroundColor: theme.palette.bg,
				minHeight: '100%',
			}}
		>
			<AppTabLandingNavbar
				type={APP_LANDING_PAGE_TYPE.SOCIAL_HUB_ADD_TAB}
				menuItems={[
					{
						iconId: 'user-guide',
						onPress: () => {
							router.push('/user-guide');
						},
					},
				]}
			/>
			<View style={{ marginTop: 128 }}>
				<View
					style={{
						alignSelf: 'center',
						justifyContent: 'center',
						maxWidth: 256,
					}}
				>
					<Ionicons
						name={'add-circle-outline'}
						size={128}
						color={theme.primary.a0}
					/>
				</View>

				<Pressable
					style={[
						styles.addTabCtaContainer,
						{
							backgroundColor: theme.primary.a0,
						},
					]}
					onPress={() => {
						router.navigate(APP_ROUTING_ENUM.PROFILES);
					}}
				>
					<Text
						style={[
							styles.addTabCtaText,
							{
								color: 'black',
							},
						]}
					>
						Add Profile
					</Text>
				</Pressable>
				<Pressable
					style={{
						alignSelf: 'center',
						marginTop: 20,
						padding: 12,
					}}
					onPress={onGuideRequested}
				>
					<Text
						style={[
							styles.addTabCtaDesc,
							{
								color: theme.secondary.a20,
							},
						]}
					>
						How does this work?
					</Text>
				</Pressable>
			</View>
		</ScrollView>
	);
}

export default HubAddProfileView;

const styles = StyleSheet.create({
	addTabCtaContainer: {
		alignItems: 'center',
		borderRadius: 8,
		padding: 8,
		paddingHorizontal: 12,
		maxWidth: 256,
		alignSelf: 'center',
		marginTop: 24,
	},
	addTabCtaText: {
		fontSize: 20,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		textAlign: 'center',
	},
	addTabCtaDesc: {
		fontSize: 18,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
	},
});
