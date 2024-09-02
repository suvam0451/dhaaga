import { Fragment, memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import TitleOnlyScrollContainer from '../../../components/containers/TitleOnlyScrollContainer';
import AppSettingListItem from '../../../components/screens/settings/fragments/AppSettingListItem';
import AppSettingBooleanToggle from '../../../components/screens/settings/fragments/AppSettingBooleanToggle';
import { appSettingsKeys } from '../../../services/app-settings/app-settings';
import { APP_FONTS } from '../../../styles/AppFonts';
import { APP_FONT } from '../../../styles/AppTheme';

const UserPreferences = memo(() => {
	return (
		<TitleOnlyScrollContainer
			title={'User Preferences'}
			contentContainerStyle={{ paddingHorizontal: 8 }}
		>
			{/*<Text style={styles.sectionLabel}>Composer</Text>*/}
			{/*<AppSettingListItem*/}
			{/*	label={'Mastodon and Pleroma'}*/}
			{/*	subtext={*/}
			{/*		'Set defaults for all your Mastodon/Pleroma compatible' + ' accounts.'*/}
			{/*	}*/}
			{/*	children={*/}
			{/*		<Fragment>*/}
			{/*			<AppSettingBooleanToggle*/}
			{/*				label={'Post Visibility'}*/}
			{/*				subtext={'Default visibility selected when creating new posts.'}*/}
			{/*				settingKey={*/}
			{/*					appSettingsKeys.preferences.post.interaction.quickReaction*/}
			{/*				}*/}
			{/*				style={{ marginBottom: 16 }}*/}
			{/*			/>*/}
			{/*			<AppSettingBooleanToggle*/}
			{/*				label={'Reply Visibility'}*/}
			{/*				subtext={'Default visibility selected when replying.'}*/}
			{/*				settingKey={*/}
			{/*					appSettingsKeys.preferences.post.interaction.quickReaction*/}
			{/*				}*/}
			{/*			/>*/}
			{/*		</Fragment>*/}
			{/*	}*/}
			{/*/>*/}
			{/*<AppSettingListItem*/}
			{/*	label={'Misskey'}*/}
			{/*	subtext={'Set defaults for all your Misskey compatible accounts.'}*/}
			{/*	children={*/}
			{/*		<Fragment>*/}
			{/*			<AppSettingBooleanToggle*/}
			{/*				label={'Post Visibility'}*/}
			{/*				subtext={'Default visibility selected when creating new posts.'}*/}
			{/*				settingKey={*/}
			{/*					appSettingsKeys.preferences.post.interaction.quickReaction*/}
			{/*				}*/}
			{/*				style={{ marginBottom: 16 }}*/}
			{/*			/>*/}
			{/*			<AppSettingBooleanToggle*/}
			{/*				label={'Reply Visibility'}*/}
			{/*				subtext={'Default visibility selected when replying.'}*/}
			{/*				settingKey={*/}
			{/*					appSettingsKeys.preferences.post.interaction.quickReaction*/}
			{/*				}*/}
			{/*			/>*/}
			{/*		</Fragment>*/}
			{/*	}*/}
			{/*/>*/}

			<Text style={styles.sectionLabel}>Miscellaneous</Text>

			<AppSettingListItem
				label={'Quick Actions'}
				subtext={
					'Skip confirmation dialogs when performing' + ' various actions.'
				}
				children={
					<Fragment>
						<AppSettingBooleanToggle
							label={'Quick Reactions'}
							subtext={
								'Pressing reactions add/remove them. Holding views details.'
							}
							settingKey={
								appSettingsKeys.preferences.post.interaction.quickReaction
							}
						/>
					</Fragment>
				}
			></AppSettingListItem>
		</TitleOnlyScrollContainer>
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

export default UserPreferences;
