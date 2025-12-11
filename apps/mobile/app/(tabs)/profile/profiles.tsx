import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import useScrollMoreOnPageEnd from '#/states/useScrollMoreOnPageEnd';
import { useEffect, useState } from 'react';
import {
	useAppBottomSheet,
	useAppDb,
	useAppDialog,
	useAppPublishers,
	useAppTheme,
} from '#/states/global/hooks';
import { Account, Profile, ProfileService, AccountService } from '@dhaaga/db';
import { appDimensions } from '#/styles/dimensions';
import { AppText } from '#/components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { AppIcon } from '#/components/lib/Icon';
import { AppAccountSelectionItem } from '#/components/common/app/Account';
import { APP_EVENT_ENUM } from '#/services/publishers/app.publisher';
import { DialogBuilderService } from '#/services/dialog-builder.service';
import NavBar_Simple from '#/components/shared/topnavbar/NavBar_Simple';
import useScrollHandleAnimatedList from '#/hooks/anim/useScrollHandleAnimatedList';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

type ProfileFragmentProps = {
	acct: Account;
	profile: Profile;
};

function ProfileFragment({ profile, acct }: ProfileFragmentProps) {
	const { theme } = useAppTheme();
	const { show, hide } = useAppDialog();
	const { appSub } = useAppPublishers();
	const { db } = useAppDb();

	async function _onDone() {
		appSub.publish(APP_EVENT_ENUM.PROFILE_LIST_CHANGED);
		hide();
	}
	async function onUnhide() {
		ProfileService.unhideProfile(db, profile.id);
		_onDone();
	}

	async function onMoveUp() {}

	async function onRemoveConfirm() {
		ProfileService.removeProfile(db, profile.id);
		_onDone();
	}

	async function onRemove() {
		show(DialogBuilderService.confirmProfileDeletion(onRemoveConfirm));
	}

	async function onMoveDown() {}

	async function onHide() {
		ProfileService.hideProfile(db, profile.id);
		_onDone();
	}

	function onPressProfileMoreOptions() {
		show(
			DialogBuilderService.profileActions(0, 10, !profile.visible, {
				onUnhide,
				onMoveUp,
				onRemove,
				onMoveDown,
				onHide,
			}),
		);
	}

	function onDefaultProfileIndicatorPressed() {
		show(DialogBuilderService.defaultProfileIndication());
	}

	return (
		<AppAccountSelectionItem
			style={{ padding: 4, flexDirection: 'row' }}
			acct={acct}
			RightComponent={
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					{profile.uuid === 'DEFAULT' && (
						<AppIcon
							id={'lock-closed-outline'}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A50}
							containerStyle={{
								padding: 8,
							}}
							onPress={onDefaultProfileIndicatorPressed}
						/>
					)}
					{!profile.visible && (
						<AppIcon
							id={'eye-off-filled'}
							size={20}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A50}
							containerStyle={{ marginRight: 8 }}
						/>
					)}
					<AppText.Medium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
						style={{
							fontSize: 16,
							color: profile.visible ? theme.primary : theme.secondary.a50,
							marginRight: 8,
						}}
					>
						{profile.name}
					</AppText.Medium>
					<AppIcon
						id={'ellipsis-v'}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						size={20}
						onPress={onPressProfileMoreOptions}
						containerStyle={{ padding: 8 }}
					/>
				</View>
			}
		/>
	);
}

function Page() {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const [Data, setData] = useState<Account[]>([]);
	const { translateY } = useScrollMoreOnPageEnd();
	const { db } = useAppDb();
	const { theme } = useAppTheme();
	const { show, stateId } = useAppBottomSheet();
	const { appSub } = useAppPublishers();

	function init() {
		setIsRefreshing(true);
		const accts = AccountService.getAll(db);
		for (const acct of accts) {
			acct.profiles = ProfileService.getForAccount(db, acct);
		}
		setData(accts);
		setIsRefreshing(false);
	}

	useEffect(() => {
		init();
		appSub.subscribe(APP_EVENT_ENUM.PROFILE_LIST_CHANGED, init);
		return () => {
			appSub.unsubscribe(APP_EVENT_ENUM.PROFILE_LIST_CHANGED, init);
		};
	}, [stateId]);

	function onAddProfile() {
		show(APP_BOTTOM_SHEET_ENUM.ADD_PROFILE, true);
	}

	const { scrollHandler, animatedStyle } = useScrollHandleAnimatedList();
	return (
		<>
			<NavBar_Simple label={'Manage Profiles'} animatedStyle={animatedStyle} />
			<ScrollView
				style={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding,
					paddingHorizontal: 10,
					backgroundColor: theme.background.a0,
				}}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={init} />
				}
				onScroll={scrollHandler}
			>
				<View
					style={{
						marginVertical: 20,
					}}
				>
					<AppText.Medium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						style={{ fontSize: 16, textAlign: 'center' }}
					>
						Add, remove and order your profiles.
					</AppText.Medium>
					<AppText.Normal
						style={{ textAlign: 'center' }}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
					>
						Requires an app restart to be reflected in the hub.
					</AppText.Normal>
				</View>

				{Data.map((acct, i) => (
					<View key={i}>
						{acct.profiles!.map((o, k) => (
							<ProfileFragment acct={acct} profile={o} key={k} />
						))}
					</View>
				))}
				<Pressable
					style={{ marginTop: 48, paddingBottom: 54 + 16 }}
					onPress={onAddProfile}
				>
					<View
						style={{
							backgroundColor: theme.primary,
							padding: 8,
							borderRadius: 8,
							maxWidth: 128,
							alignSelf: 'center',
						}}
					>
						<AppText.SemiBold
							style={{ color: 'black', textAlign: 'center', fontSize: 18 }}
						>
							Add Profile
						</AppText.SemiBold>
					</View>
				</Pressable>
			</ScrollView>
		</>
	);
}

export default Page;
