import { Fragment, memo } from 'react';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../../components/containers/WithAutoHideTopNavBar';
import { Animated, Text, StyleSheet } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import { APP_FONT } from '../../../styles/AppTheme';
import AppSettingListItem from '../../../components/screens/settings/fragments/AppSettingListItem';
import AppSettingBooleanToggle from '../../../components/screens/settings/fragments/AppSettingBooleanToggle';
import { appSettingsKeys } from '../../../services/app-settings/app-settings';

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
					children={
						<Fragment>
							<AppSettingBooleanToggle
								label={'All'}
								subtext={'Opt out of everything.'}
								settingKey={
									appSettingsKeys.privacy.advanced.disableRemoteInstanceCalls
										.ALL
								}
							/>
							<Text style={styles.sectionLabel}>App Triggered</Text>
							<AppSettingBooleanToggle
								label={'Reaction Caching'}
								subtext={'May cause broken :reactions:'}
								settingKey={
									appSettingsKeys.privacy.advanced.disableRemoteInstanceCalls
										.REACTION_CACHING
								}
								style={{ marginBottom: 12 }}
							/>
							<AppSettingBooleanToggle
								label={'Instance Caching'}
								subtext={'Affects the "Known Servers" feature'}
								settingKey={
									appSettingsKeys.privacy.advanced.disableRemoteInstanceCalls
										.SOFTWARE_CACHING
								}
								style={{ marginBottom: 12 }}
							/>
							<AppSettingBooleanToggle
								label={'Profile Caching'}
								subtext={'Disables cat ears, profile backgrounds etc.'}
								settingKey={
									appSettingsKeys.privacy.advanced.disableRemoteInstanceCalls
										.PROFILE_CACHING
								}
							/>
							<Text style={styles.sectionLabel}>User Triggered</Text>
							<AppSettingBooleanToggle
								label={'Remote Timelines'}
								subtext={'Disables ability to browse remote timelines.'}
								settingKey={
									appSettingsKeys.privacy.advanced.disableRemoteInstanceCalls
										.REMOTE_TIMELINES
								}
								style={{ marginBottom: 12 }}
							/>
							<AppSettingBooleanToggle
								label={'Manual Data Sync'}
								subtext={
									'Disables ability to fetch remote profile/post data on request'
								}
								settingKey={
									appSettingsKeys.privacy.advanced.disableRemoteInstanceCalls
										.REMOTE_DATA_SYNC
								}
							/>
						</Fragment>
					}
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
