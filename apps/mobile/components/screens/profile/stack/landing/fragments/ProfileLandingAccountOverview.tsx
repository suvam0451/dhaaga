import { memo } from 'react';
import useMyProfile from '../../../api/useMyProfile';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import useMfm from '../../../../../hooks/useMfm';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import { Image } from 'expo-image';
import ProfileAvatar from '../../../../../common/user/fragments/ProfileAvatar';
import ProfileButtonMessage from '../../../../(shared)/stack/profile/fragments/ProfileButtonMessage';
import ProfileButtonPhonebook from '../../../../(shared)/stack/profile/fragments/ProfileButtonPhonebook';
import ProfileStats from '../../../../(shared)/stack/profile/fragments/ProfileStats';
import styles from '../../../../../common/user/utils/styles';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const WithoutAccount = memo(() => {
	return <View />;
});

const WithAccount = memo(() => {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	const { Data: acct } = useMyProfile();
	const { content: ParsedDisplayName } = useMfm({
		content: acct?.displayName,
		remoteSubdomain: acct?.instance,
		emojiMap: acct?.calculated?.emojis,
		deps: [acct?.displayName],
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		emphasis: 'high',
	});

	return (
		<View>
			{/*@ts-ignore-next-line*/}
			<Image
				source={{ uri: acct?.banner }}
				style={{ height: 128, width: Dimensions.get('window').width }}
			/>
			<View style={{ flexDirection: 'row' }}>
				<ProfileAvatar
					containerStyle={localStyles.avatarContainer}
					imageStyle={localStyles.avatarImageContainer}
					uri={acct?.avatarUrl}
				/>
				<View style={localStyles.buttonSection}>
					<ProfileButtonMessage handle={acct?.handle} />
					<View style={{ width: 8 }} />
					<ProfileButtonPhonebook />
				</View>
				<ProfileStats
					userId={acct?.id}
					postCount={acct?.stats?.posts}
					followingCount={acct?.stats?.following}
					followerCount={acct?.stats?.followers}
					style={localStyles.statSectionContainer}
				/>
			</View>
			<View style={localStyles.secondSectionContainer}>
				<View style={{ flexShrink: 1 }}>
					{ParsedDisplayName}
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text
							style={[styles.secondaryText, { color: theme.textColor.medium }]}
							numberOfLines={1}
						>
							{acct?.handle}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
});

const ProfileAndSettings = memo(() => {
	const { acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);
	if (!acct) {
		return <WithoutAccount />;
	}
	return <WithAccount />;
});

export default ProfileAndSettings;

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
		alignItems: 'center',
		justifyContent: 'space-evenly',
		flexDirection: 'row',
		marginHorizontal: 8,
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
