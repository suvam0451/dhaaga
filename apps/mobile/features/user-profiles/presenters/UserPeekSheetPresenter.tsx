import { ScrollView, StyleSheet, View } from 'react-native';
import ProfileAvatar from '../../../components/common/user/fragments/ProfileAvatar';
import Ionicons from '@expo/vector-icons/Ionicons';
import UserRelationPresenter from './UserRelationPresenter';
import { TextContentView } from '../../../components/common/status/TextContentView';
import useProfilePeekSheetInteractor from '../interactors/useProfilePeekSheetInteractor';
import { appDimensions } from '../../../styles/dimensions';
import { AppText } from '../../../components/lib/Text';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { Image } from 'expo-image';
import ProfileStatPresenter from './ProfileStatPresenter';

/**
 * This bottom sheet will show a preview
 * of the selected user's profile.
 */
function UserPeekSheetPresenter() {
	const { data: acct } = useProfilePeekSheetInteractor();
	const { theme } = useAppTheme();

	if (!acct) return <View />;

	return (
		<ScrollView style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
			{/*@ts-ignore-next-line*/}
			<Image source={{ uri: acct?.banner }} style={styles.banner} />
			<View
				style={{
					flexDirection: 'row',
					marginBottom: MARGIN_BOTTOM,
				}}
			>
				<ProfileAvatar
					containerStyle={styles.avatarContainer}
					imageStyle={styles.avatarImageContainer}
					uri={acct?.avatarUrl}
				/>
				<ProfileStatPresenter
					acctId={acct.id}
					followerCount={acct.stats.followers}
					followingCount={acct.stats.following}
					postCount={acct.stats.posts}
				/>
			</View>

			<View style={styles.secondSectionContainer}>
				<View style={{ flexShrink: 1 }}>
					<TextContentView
						tree={acct.parsedDisplayName}
						variant={'displayName'}
						mentions={[]}
						emojiMap={acct.calculated.emojis}
					/>
					<AppText.Medium
						numberOfLines={1}
						style={{
							color: theme.secondary.a40,
							fontSize: 13,
							maxWidth: 196,
						}}
					>
						{acct?.handle}
					</AppText.Medium>
				</View>
				<View style={styles.relationManagerSection}>
					<View style={{ marginRight: 8 }}>
						<Ionicons
							name="notifications"
							size={22}
							color={theme.secondary.a30}
						/>
					</View>
					<UserRelationPresenter userId={acct?.id} />
				</View>
			</View>
			<TextContentView
				tree={acct?.parsedDescription}
				variant={'bodyContent'}
				mentions={[]}
				emojiMap={acct?.calculated?.emojis}
				style={{ paddingHorizontal: 10 }}
			/>
		</ScrollView>
	);
}

const MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;
const BORDER_RADIUS = appDimensions.bottomSheet.borderRadius;

const styles = StyleSheet.create({
	banner: {
		height: 128,
		flex: 1,
		borderTopLeftRadius: BORDER_RADIUS,
		borderTopRightRadius: BORDER_RADIUS,
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
	secondSectionContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginLeft: 8,
		width: '100%',
		marginRight: 8,
		marginBottom: MARGIN_BOTTOM,
	},
});

export default UserPeekSheetPresenter;
