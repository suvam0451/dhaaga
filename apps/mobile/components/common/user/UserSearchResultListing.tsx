import { memo, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useActivitypubUserContext } from '../../../states/useProfile';
import { ActivitypubHelper } from '@dhaaga/shared-abstraction-activitypub';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { APP_FONTS } from '../../../styles/AppFonts';
import styles from './utils/styles';
import useMfm from '../../hooks/useMfm';
import ProfileAvatar from './fragments/ProfileAvatar';
import useAppNavigator from '../../../states/useAppNavigator';

const PFP_SIZE = 48;
const UserSearchResultListing = memo(() => {
	const { subdomain } = useActivityPubRestClientContext();
	const { user } = useActivitypubUserContext();
	const { toProfile } = useAppNavigator();

	const handle = useMemo(() => {
		return ActivitypubHelper.getHandle(
			user?.getAccountUrl(subdomain),
			subdomain,
		);
	}, [user?.getAccountUrl(subdomain)]);

	const { content: ParsedDisplayName } = useMfm({
		content: user?.getDisplayName(),
		remoteSubdomain: user?.getInstanceUrl(),
		emojiMap: user?.getEmojiMap(),
		deps: [user?.getDisplayName()],
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
	});

	const { content: DescriptionContent } = useMfm({
		content: user?.getDescription(),
		remoteSubdomain: user?.getInstanceUrl(),
		emojiMap: user?.getEmojiMap(),
		deps: [user?.getDescription()],
		fontFamily: APP_FONTS.INTER_400_REGULAR,
	});

	const DESCRIPTION_EMPTY =
		user?.getDescription() === null || user?.getDescription() === '';

	function onPress() {
		toProfile(user?.getId());
	}

	return (
		<TouchableOpacity
			style={{
				backgroundColor: '#242424',
				borderRadius: 8,
				marginBottom: 8,
				padding: 8,
			}}
			onPress={onPress}
		>
			<View style={{ flexDirection: 'row' }}>
				<ProfileAvatar
					containerStyle={localStyles.avatarContainer}
					imageStyle={localStyles.avatarImageContainer}
					uri={user.getAvatarUrl()}
				/>
				<View style={{ flexShrink: 1, marginLeft: 8 }}>
					{ParsedDisplayName}
					<Text style={styles.secondaryText} numberOfLines={1}>
						{handle}
					</Text>
				</View>
			</View>
			<View style={{ marginTop: DESCRIPTION_EMPTY ? 0 : 8 }}>
				{DescriptionContent}
			</View>
		</TouchableOpacity>
	);
});

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
	avatarImageContainer: {
		flex: 1,
		width: '100%',
		backgroundColor: '#0553',
		padding: 2,
		borderRadius: 8,
		opacity: 0.87,
	},
	avatarContainer: {
		width: PFP_SIZE,
		height: PFP_SIZE,
		borderColor: 'gray',
		borderWidth: 0.75,
		borderRadius: 8,
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

export default UserSearchResultListing;
