import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import { useEffect, useState } from 'react';
import {
	useAppBottomSheet_Improved,
	useAppDb,
	useAppDialog,
	useAppPublishers,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { ProfileService } from '../../../database/entities/profile';
import { AccountService } from '../../../database/entities/account';
import { Account, Profile } from '../../../database/_schema';
import { appDimensions } from '../../../styles/dimensions';
import { AppText } from '../../../components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { AppIcon } from '../../../components/lib/Icon';
import { AppAccountSelectionItem } from '../../../components/common/app/Account';
import { APP_BOTTOM_SHEET_ENUM } from '../../../components/dhaaga-bottom-sheet/Core';
import { APP_EVENT_ENUM } from '../../../services/publishers/app.publisher';
import { DialogBuilderService } from '../../../services/dialog-builder.service';

type ProfileFragmentProps = {
	acct: Account;
	profile: Profile;
};

function ProfileFragment({ profile, acct }: ProfileFragmentProps) {
	const { theme } = useAppTheme();
	const { show } = useAppDialog();

	function onPressProfileMoreOptions() {
		show(
			DialogBuilderService.profileActions(0, 10, false, {
				onUnhide: () => {},
				onMoveUp: () => {},
				onRemove: () => {},
				onMoveDown: () => {},
				onHide: () => {},
			}),
		);
	}

	return (
		<AppAccountSelectionItem
			style={{ padding: 4, flexDirection: 'row' }}
			acct={acct}
			RightComponent={
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<AppText.Medium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
						style={{
							fontSize: 16,
							color: theme.complementary.a0,
							marginRight: 6,
						}}
					>
						{profile.name}
					</AppText.Medium>
					<AppIcon
						id={'ellipsis-v'}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						size={20}
						onPress={onPressProfileMoreOptions}
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
	const { show, stateId } = useAppBottomSheet_Improved();
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

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={'Manage Profiles'}
			translateY={translateY}
		>
			<ScrollView
				style={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding,
					paddingHorizontal: 10,
				}}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={init} />
				}
			>
				<AppText.Medium
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
					style={{ fontSize: 16, marginVertical: 20, textAlign: 'center' }}
				>
					Add, remove and order your profiles.
				</AppText.Medium>
				{Data.map((acct, i) => (
					<View key={i}>
						{acct.profiles.map((o, k) => (
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
							backgroundColor: theme.primary.a0,
							padding: 8,
							borderRadius: 8,
							maxWidth: 128,
							alignSelf: 'center',
						}}
					>
						<AppText.SemiBold style={{ color: 'black', textAlign: 'center' }}>
							Add Profile
						</AppText.SemiBold>
					</View>
				</Pressable>
			</ScrollView>
		</AppTopNavbar>
	);
}

export default Page;
