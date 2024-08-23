import { memo, useMemo } from 'react';
import {
	View,
	Image as NativeImage,
	Dimensions,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import useGetProfile from '../../../../../hooks/api/accounts/useGetProfile';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import ProfileAvatar from '../../../../common/user/fragments/ProfileAvatar';
import { ProfileStatsInterface } from '../../../../common/user/fragments/ProfileStats';
import WithActivitypubUserContext from '../../../../../states/useProfile';
import ProfileNameAndHandle from '../../../../common/user/fragments/ProfileNameAndHandle';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_FONT } from '../../../../../styles/AppTheme';
import ProfileDesc from '../../../../common/user/fragments/ProfileDesc';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ProfilePeekMessage from '../fragments/ProfilePeekMessage';
import { ActivitypubHelper } from '@dhaaga/shared-abstraction-activitypub';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import RelationshipButtonCore from '../../../../common/relationship/RelationshipButtonCore';

const ProfilePeekBottomSheet = memo(() => {
	const { subdomain } = useActivityPubRestClientContext();
	const { UserRef, UserIdRef, requestId } = useAppBottomSheet();
	const { Data } = useGetProfile({
		user: UserRef.current,
		userId: UserIdRef.current,
		requestId,
	});

	const banner = Data?.getBannerUrl();
	const avatar = Data?.getAvatarUrl();
	const acctUrl = Data?.getAccountUrl(subdomain);

	const handle = useMemo(() => {
		return ActivitypubHelper.getHandle(acctUrl, subdomain);
	}, [acctUrl]);

	return (
		<WithActivitypubUserContext userI={Data}>
			<ScrollView style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
				{/*@ts-ignore-next-line*/}
				<NativeImage
					source={{ uri: banner }}
					style={{
						height: 128,
						width: Dimensions.get('window').width,
						borderTopLeftRadius: 8,
						borderTopRightRadius: 8,
					}}
				/>
				<View style={{ display: 'flex', flexDirection: 'row' }}></View>
				<View style={{ flexDirection: 'row' }}>
					<ProfileAvatar
						containerStyle={localStyles.avatarContainer}
						imageStyle={localStyles.avatarImageContainer}
						uri={avatar}
					/>
					<View
						style={{
							flexGrow: 1,
							alignItems: 'center',
							justifyContent: 'space-evenly',
							flexDirection: 'row',
						}}
					>
						<ProfilePeekMessage handle={handle} />
						<TouchableOpacity
							style={{
								padding: 8,
								backgroundColor: '#202020',
								borderRadius: 8,
							}}
						>
							<FontAwesome6
								name="contact-book"
								size={20}
								color={APP_FONT.DISABLED}
							/>
						</TouchableOpacity>
					</View>
					<ProfileStatsInterface style={localStyles.statSectionContainer} />
				</View>

				<View style={localStyles.secondSectionContainer}>
					<ProfileNameAndHandle style={{ flexShrink: 1 }} />
					<View style={localStyles.relationManagerSection}>
						<View style={{ marginRight: 8 }}>
							<Ionicons
								name="notifications"
								size={22}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						</View>
						<RelationshipButtonCore userId={Data?.getId()} />
					</View>
				</View>
				<ProfileDesc
					style={localStyles.parsedDescriptionContainer}
					rawContext={Data?.getDescription()}
					remoteSubdomain={Data?.getInstanceUrl()}
					acceptTouch={false}
				/>
			</ScrollView>
		</WithActivitypubUserContext>
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
		backgroundColor: '#202020',
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
		marginRight: 8,
	},
});

export default ProfilePeekBottomSheet;
