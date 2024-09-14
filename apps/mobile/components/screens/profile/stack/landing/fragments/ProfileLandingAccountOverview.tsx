import { memo, useMemo } from 'react';
import useMyProfile from '../../../api/useMyProfile';
import { useActivityPubRestClientContext } from '../../../../../../states/useActivityPubRestClient';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import WithActivitypubUserContext, {
	useActivitypubUserContext,
} from '../../../../../../states/useProfile';
import useMfm from '../../../../../hooks/useMfm';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import { ActivitypubHelper } from '@dhaaga/shared-abstraction-activitypub';
import { Image } from 'expo-image';
import ProfileAvatar from '../../../../../common/user/fragments/ProfileAvatar';
import ProfileButtonMessage from '../../../../(shared)/stack/profile/fragments/ProfileButtonMessage';
import ProfileButtonPhonebook from '../../../../(shared)/stack/profile/fragments/ProfileButtonPhonebook';
import { ProfileStatsInterface } from '../../../../(shared)/stack/profile/fragments/ProfileStats';
import { APP_FONT } from '../../../../../../styles/AppTheme';
import styles from '../../../../../common/user/utils/styles';

const WithoutAccountSelected = memo(() => {
	return <View />;
});

const WithAccountSelectedCore = memo(() => {
	const { subdomain } = useActivityPubRestClientContext();
	const { user } = useActivitypubUserContext();
	const { content: ParsedDisplayName } = useMfm({
		content: user?.getDisplayName(),
		remoteSubdomain: user?.getInstanceUrl(),
		emojiMap: user?.getEmojiMap(),
		deps: [user?.getDisplayName()],
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
	});

	const handle = useMemo(() => {
		return ActivitypubHelper.getHandle(
			user?.getAccountUrl(subdomain),
			subdomain,
		);
	}, [user?.getAccountUrl(subdomain)]);

	const avatarUrl = user.getAvatarUrl();
	const bannerUrl = user.getBannerUrl();

	return (
		<View>
			{/*@ts-ignore-next-line*/}
			<Image
				source={{ uri: bannerUrl }}
				style={{ height: 128, width: Dimensions.get('window').width }}
			/>
			<View style={{ flexDirection: 'row' }}>
				<ProfileAvatar
					containerStyle={localStyles.avatarContainer}
					imageStyle={localStyles.avatarImageContainer}
					uri={avatarUrl}
				/>
				<View style={localStyles.buttonSection}>
					<ProfileButtonMessage handle={handle} />
					<ProfileButtonPhonebook />
				</View>
				<ProfileStatsInterface style={localStyles.statSectionContainer} />
			</View>
			<View style={localStyles.secondSectionContainer}>
				<View style={{ flexShrink: 1 }}>
					<Text
						style={{
							fontFamily: APP_FONTS.MONTSERRAT_900_BLACK,
							color: APP_FONT.MONTSERRAT_HEADER,
						}}
						numberOfLines={1}
					>
						{ParsedDisplayName}
					</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={styles.secondaryText} numberOfLines={1}>
							{handle}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
});

const WithAccountSelected = memo(() => {
	const { Data } = useMyProfile();

	return (
		<WithActivitypubUserContext userI={Data}>
			<WithAccountSelectedCore />
		</WithActivitypubUserContext>
	);
});

const ProfileLandingAccountOverview = memo(() => {
	const { primaryAcct } = useActivityPubRestClientContext();
	if (!primaryAcct || !primaryAcct.isValid()) {
		return <WithoutAccountSelected />;
	}
	return <WithAccountSelected />;
});

export default ProfileLandingAccountOverview;

const localStyles = StyleSheet.create({
	rootScrollView: {
		paddingTop: 50,
		backgroundColor: '#121212',
		minHeight: '100%',
	},
	parsedDescriptionContainer: {
		marginTop: 12,
		padding: 8,
	},
	buttonSection: {
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'space-evenly',
		flexDirection: 'row',
	},
	avatarImageContainer: {
		flex: 1,
		width: '100%',
		backgroundColor: '#0553',
		padding: 2,
		borderRadius: 8,
	},
	avatarContainer: {
		width: 72,
		height: 72,
		borderColor: 'gray',
		borderWidth: 0.75,
		borderRadius: 8,
		marginTop: -24,
		marginLeft: 6,
	},
	relationManagerSection: {
		flexDirection: 'row',
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingHorizontal: 8,
		marginLeft: 4,
		marginRight: 8,
	},
	statSectionContainer: {
		backgroundColor: '#242424',
		marginRight: 4,
		borderRadius: 6,
		marginTop: 4,
		padding: 4,
		paddingLeft: 0,
	},
	secondSectionContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 8,
		marginLeft: 8,
		width: '100%',
	},
});
