import { memo } from 'react';
import useMyProfile from '../../../api/useMyProfile';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import useMfm from '../../../../../hooks/useMfm';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import { Image } from 'expo-image';
import ProfileAvatar from '../../../../../common/user/fragments/ProfileAvatar';
import ProfileStats from '../../../../(shared)/stack/profile/fragments/ProfileStats';
import styles from '../../../../../common/user/utils/styles';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const ProfileAndSettings = memo(() => {
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
				style={{
					height: 128,
					width: Dimensions.get('window').width,
				}}
			/>
			<View style={{ flexDirection: 'row' }}>
				<View>
					<ProfileAvatar
						containerStyle={localStyles.avatarContainer}
						imageStyle={localStyles.avatarImageContainer}
						uri={acct?.avatarUrl}
					/>
					<View style={{ flexShrink: 1, marginTop: 8, marginLeft: 8 }}>
						{ParsedDisplayName}
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text
								style={[
									styles.secondaryText,
									{ color: theme.textColor.medium },
								]}
								numberOfLines={1}
							>
								{acct?.handle}
							</Text>
						</View>
					</View>
				</View>
				<View style={{ flexGrow: 1 }} />
				<ProfileStats
					userId={acct?.id}
					postCount={acct?.stats?.posts}
					followingCount={acct?.stats?.following}
					followerCount={acct?.stats?.followers}
					style={{ marginTop: 16 }}
				/>

				{/*<View style={localStyles.secondSectionContainer}></View>*/}
			</View>
		</View>
	);
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
		// borderRadius: 8,
		borderRadius: '100%',
	},
	avatarContainer: {
		width: 72,
		height: 72,
		borderColor: 'gray',
		borderWidth: 0.75,
		marginTop: -36,
		marginLeft: 6,
		borderRadius: '100%',
		overflow: 'hidden',
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
