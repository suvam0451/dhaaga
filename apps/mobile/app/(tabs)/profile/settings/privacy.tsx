import { Fragment, memo } from 'react';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../../../components/containers/WithAutoHideTopNavBar';
import { Animated, Text, StyleSheet } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_FONT } from '../../../../styles/AppTheme';
import AppSettingListItem from '../../../../components/screens/settings/fragments/AppSettingListItem';

const PrivacySettingsPage = memo(() => {
	const { translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	return (
		<WithAutoHideTopNavBar title={'Privacy Settings'} translateY={translateY}>
			<Animated.ScrollView
				contentContainerStyle={{
					paddingTop: 54,
					paddingHorizontal: 8,
				}}
			>
				<Text style={styles.sectionLabel}>Advanced</Text>
				<AppSettingListItem
					label={'Remote Instance Calls'}
					subtext={
						'Opt out of app features that make API requests to remote servers'
					}
					children={<Fragment></Fragment>}
				/>
			</Animated.ScrollView>
		</WithAutoHideTopNavBar>
	);
});

const styles = StyleSheet.create({
	listItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 4,
		width: '100%',
	},
	label: {
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		fontSize: 18,
		color: APP_FONT.MONTSERRAT_HEADER,
	},
	subtext: {
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		fontSize: 14,
		color: APP_FONT.MONTSERRAT_BODY,
	},
	sectionLabel: {
		fontSize: 13,
		color: APP_FONT.MONTSERRAT_BODY,
		opacity: 0.87,
		fontFamily: APP_FONTS.INTER_700_BOLD,
		marginVertical: 16,
	},
});

export default PrivacySettingsPage;
