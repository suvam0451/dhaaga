import { memo } from 'react';
import useMyProfile from '../../../api/useMyProfile';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import useMfm from '../../../../../hooks/useMfm';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import { Image } from 'expo-image';
import ProfileAvatar from '../../../../../common/user/fragments/ProfileAvatar';
import UserViewProfileStats from '../../../../../common/user/fragments/UserViewProfileStats';
import styles from '../../../../../common/user/utils/styles';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../../../utils/theming.util';

const ProfileAndSettings = memo(() => {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	const { data } = useMyProfile();

	const { content: ParsedDisplayName } = useMfm({
		content: data?.displayName,
		remoteSubdomain: data?.instance,
		emojiMap: data?.calculated?.emojis,
		deps: [data?.displayName],
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A0,
	});

	if (!data) return <View />;

	return (
		<View>
			{/*@ts-ignore-next-line*/}
			<Image
				source={{ uri: data?.banner }}
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
						uri={data?.avatarUrl}
					/>
				</View>
				<UserViewProfileStats
					userId={data?.id}
					postCount={data?.stats?.posts}
					followingCount={data?.stats?.following}
					followerCount={data?.stats?.followers}
				/>
			</View>
			<View style={{ flexShrink: 1, marginTop: 8, marginLeft: 8 }}>
				{ParsedDisplayName}
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text
						style={[styles.secondaryText, { color: theme.textColor.medium }]}
						numberOfLines={1}
					>
						{data?.handle}
					</Text>
				</View>
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
		width: 84,
		height: 84,
		borderColor: 'rgba(200, 200, 200, 0.24)',
		borderWidth: 3,
		borderRadius: 84 / 2,
		marginTop: -24,
		marginLeft: 6,
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
