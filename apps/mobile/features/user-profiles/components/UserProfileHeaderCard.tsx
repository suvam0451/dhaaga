import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { UserObjectType } from '@dhaaga/bridge';
import {
	useAppBottomSheet,
	useAppManager,
	useAppTheme,
} from '#/states/global/hooks';
import Animated from 'react-native-reanimated';
import Navbar from '#/features/user-profiles/components/Navbar';
import { Dimensions, View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { appDimensions } from '#/styles/dimensions';
import TextAstRendererView from '#/ui/TextAstRendererView';
import ProfileStatView from '#/features/user-profiles/view/ProfileStatView';
import ProfileAvatar from '#/components/common/user/fragments/ProfileAvatar';
import UserRelationPresenter from '../presenters/UserRelationPresenter';
import { AppIcon } from '#/components/lib/Icon';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { NativeTextBold } from '#/ui/NativeText';
import { useTranslation } from 'react-i18next';

const MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

type Props = {
	animatedStyle: any;
	onLayout: (e: any) => void;
	acct: UserObjectType;
};

function UserProfileHeaderCard({ animatedStyle, onLayout, acct }: Props) {
	const { theme } = useAppTheme();
	const { show } = useAppBottomSheet();
	const { appManager } = useAppManager();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GLOSSARY]);

	function onMoreOptionsPressed() {
		if (!acct) return;
		appManager.storage.setUserId(acct.id);
		appManager.storage.setUserObject(acct);
		show(APP_BOTTOM_SHEET_ENUM.MORE_USER_ACTIONS, true);
	}

	const avatarUrl = acct?.avatarUrl;
	const bannerUrl = acct?.banner;
	const IS_LOCKED = acct?.meta?.isProfileLocked;

	return (
		<Animated.View
			onLayout={onLayout}
			style={[
				styles.root,
				{
					backgroundColor: theme.background.a10,
				},
				animatedStyle,
			]}
		>
			<Navbar acct={acct} />
			{bannerUrl ? (
				<Image
					source={{ uri: bannerUrl }}
					style={{ height: 128, width: Dimensions.get('window').width }}
				/>
			) : (
				<View style={{ height: 128, width: Dimensions.get('window').width }} />
			)}
			<View style={{ marginHorizontal: 10 }}>
				<View
					style={{
						flexDirection: 'row',
						flex: 1,
						marginBottom: MARGIN_BOTTOM,
					}}
				>
					<ProfileAvatar
						containerStyle={[styles.avatarContainer]}
						imageStyle={styles.avatarImageContainer}
						uri={avatarUrl}
					/>
					<ProfileStatView
						userId={acct?.id}
						postCount={acct?.stats?.posts}
						followingCount={acct?.stats?.following}
						followerCount={acct?.stats?.followers}
					/>
				</View>
				<View
					style={{
						marginBottom: appDimensions.timelines.sectionBottomMargin,
					}}
				>
					<TextAstRendererView
						tree={acct.parsedDisplayName}
						variant={'displayName'}
						mentions={[]}
						emojiMap={acct.calculated.emojis}
					/>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<NativeTextBold
							style={[{ color: theme.secondary.a30, fontSize: 13 }]}
							numberOfLines={1}
						>
							{acct?.handle}
						</NativeTextBold>
						{IS_LOCKED && (
							<View style={{ marginLeft: 4 }}>
								<AppIcon
									id="lock-closed-outline"
									size={14}
									color={theme.secondary.a10}
								/>
							</View>
						)}
					</View>
				</View>

				<TextAstRendererView
					tree={acct.parsedDescription}
					variant={'bodyContent'}
					mentions={[]}
					emojiMap={acct.calculated.emojis}
				/>

				<View style={styles.relationManagerSection}>
					<View style={{ flex: 1 }}>
						<UserRelationPresenter userId={acct?.id} />
					</View>
					<View
						style={{
							backgroundColor: theme.background.a40,
							borderRadius: appDimensions.buttons.borderRadius,
							marginHorizontal: 12,
							paddingVertical: 8,
							flex: 1,
						}}
					>
						<NativeTextBold
							style={{
								color: theme.secondary.a10,
								textAlign: 'center',
								fontSize: 16,
							}}
						>
							{t(`verb.message`)}
						</NativeTextBold>
					</View>
					<Pressable
						style={{ paddingHorizontal: 12, paddingLeft: 0 }}
						onPress={onMoreOptionsPressed}
					>
						<AppIcon
							id={'ellipsis-v'}
							size={20}
							color={theme.secondary.a20}
							onPress={onMoreOptionsPressed}
						/>
					</Pressable>
				</View>
			</View>
		</Animated.View>
	);
}

export default UserProfileHeaderCard;

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		width: '100%',
		zIndex: 50,
		paddingBottom: 24,
	},

	avatarImageContainer: {
		flex: 1,
		width: '100%',
		padding: 2,
		borderRadius: 82 / 2,
		overflow: 'hidden',
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
	relationManagerSection: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 24,
		marginBottom: MARGIN_BOTTOM,
	},
});
