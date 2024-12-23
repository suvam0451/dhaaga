import { memo, useEffect, useState } from 'react';
import {
	View,
	Image as NativeImage,
	Dimensions,
	StyleSheet,
	ScrollView,
} from 'react-native';
import useGetProfile from '../../../../hooks/api/accounts/useGetProfile';
import ProfileAvatar from '../../../common/user/fragments/ProfileAvatar';
import ProfileNameAndHandle from '../../../common/user/fragments/ProfileNameAndHandle';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_FONT } from '../../../../styles/AppTheme';
import ProfileDesc from '../../../common/user/fragments/ProfileDesc';
import ProfileButtonMessage from '../../../screens/(shared)/stack/profile/fragments/ProfileButtonMessage';
import RelationshipButtonCore from '../../../common/relationship/RelationshipButtonCore';
import ProfileButtonPhonebook from '../../../screens/(shared)/stack/profile/fragments/ProfileButtonPhonebook';
import ProfileStats from '../../../screens/(shared)/stack/profile/fragments/ProfileStats';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppUserObject } from '../../../../types/app-user.types';

/**
 * This bottom sheet will show a preview
 * of the selected user's profile.
 */
const AppBottomSheetProfilePeek = memo(() => {
	const [UserId, setUserId] = useState<string>(null);
	const [UserObject, setUserObject] = useState<AppUserObject>(null);
	const { stateId, appManager } = useGlobalState(
		useShallow((o) => ({
			stateId: o.bottomSheet.stateId,
			appManager: o.appSession,
		})),
	);

	useEffect(() => {
		const userId = appManager?.storage?.getUserId();
		const userObj = appManager?.storage?.getUserObject();

		setUserId(userId);
		setUserObject(userObj);
	}, [stateId]);

	const { data: acct } = useGetProfile({
		userId: UserId,
	});

	if (!UserId) return <View />;

	return (
		<ScrollView style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
			{/*@ts-ignore-next-line*/}
			<NativeImage
				source={{ uri: acct?.banner }}
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
					uri={acct?.avatarUrl}
				/>
				<View
					style={{
						alignItems: 'center',
						justifyContent: 'space-evenly',
						flexDirection: 'row',
						marginHorizontal: 8,
					}}
				>
					<ProfileButtonMessage handle={acct?.handle} />
					<View style={{ width: 8 }} />
					<ProfileButtonPhonebook />
				</View>
				<ProfileStats
					userId={acct?.id}
					followerCount={acct?.stats?.followers}
					followingCount={acct?.stats?.following}
					postCount={acct?.stats?.posts}
				/>
			</View>

			<View style={localStyles.secondSectionContainer}>
				<ProfileNameAndHandle dto={acct} style={{ flexShrink: 1 }} />
				<View style={localStyles.relationManagerSection}>
					<View style={{ marginRight: 8 }}>
						<Ionicons
							name="notifications"
							size={22}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</View>
					<RelationshipButtonCore userId={acct?.id} />
				</View>
			</View>
			<ProfileDesc
				style={localStyles.parsedDescriptionContainer}
				rawContext={acct?.description}
				remoteSubdomain={acct?.instance}
				acceptTouch={false}
			/>
		</ScrollView>
	);
});

const localStyles = StyleSheet.create({
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

export default AppBottomSheetProfilePeek;
