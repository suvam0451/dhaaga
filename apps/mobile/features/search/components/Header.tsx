import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import {
	DiscoverStateAction,
	useDiscoverDispatch,
	useDiscoverState,
} from '@dhaaga/core';
import { getSearchTabs } from '@dhaaga/db';
import { useAppApiClient, useAppTheme } from '#/states/global/hooks';
import { NativeTextH1, NativeTextMedium } from '#/ui/NativeText';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import {
	TOP_NAVBAR_BOTTOM_PADDING,
	TOP_NAVBAR_MENU_ICON_SIZE,
	TOP_NAVBAR_TOP_PADDING,
} from '#/components/shared/topnavbar/settings';
import NavBar_Explore from '#/components/shared/topnavbar/NavBar_Explore';
import { Pressable, View, StyleSheet } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { appDimensions } from '#/styles/dimensions';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

function Header() {
	const { theme } = useAppTheme();
	const { driver } = useAppApiClient();
	const State = useDiscoverState();
	const dispatch = useDiscoverDispatch();

	function changeTab(value: string) {
		dispatch({
			type: DiscoverStateAction.SET_CATEGORY,
			payload: {
				tab: value as any,
			},
		});
	}

	function explorePageTabs(): {
		id: string;
		label: string;
		onSelect: () => void;
	}[] {
		const protocolLevel = getSearchTabs(driver).map((o) => ({
			id: o,
			label: o.charAt(0).toUpperCase() + o.slice(1),
			onSelect: () => {
				changeTab(o);
			},
		}));

		return [
			{
				id: 'explore',
				label: 'Explore',
				onSelect: () => {
					changeTab('explore');
				},
			},
			...protocolLevel,
		];
	}

	const menuItems = [
		{
			iconId: 'clear',
			onPress: () => {
				// clear search
				dispatch({
					type: DiscoverStateAction.CLEAR_SEARCH,
				});
			},
			hidden: !State.q,
		},
		{
			iconId: 'time-outline',
			onPress: () => {
				router.navigate(APP_ROUTING_ENUM.EXPLORE_HISTORY);
			},
			hidden: false,
		},
		{
			iconId: 'user-guide',
			onPress: () => {
				router.navigate(APP_ROUTING_ENUM.EXPLORE_GUIDE);
			},
			hidden: false,
		},
	];

	const [DropdownOpen, setDropdownOpen] = useState(false);

	function toggleDropdown() {
		setDropdownOpen((o) => !o);
	}

	function closeDropdown() {
		setDropdownOpen(false);
	}

	const dropdownItems = explorePageTabs();
	const NAVBAR_LABEL = dropdownItems.find((i) => i.id === State.tab)?.label;

	return (
		<View style={[styles.container]}>
			<View style={{ flexDirection: 'row' }}>
				<Pressable style={styles.labelArea} onPress={toggleDropdown}>
					<View style={{ flexDirection: 'row' }}>
						<NativeTextH1>{NAVBAR_LABEL}</NativeTextH1>
						<Ionicons
							name="chevron-down"
							style={{ marginLeft: 6, paddingTop: 4 }}
							size={24}
							color={'white'}
						/>
					</View>
					{State.q ? (
						<View style={{ marginTop: 8 }}>
							<NativeTextMedium>
								<NativeTextMedium emphasis={APP_COLOR_PALETTE_EMPHASIS.A40}>
									Search Term:{' '}
								</NativeTextMedium>
								<NativeTextMedium style={{ color: theme.primary.a0 }}>
									{State.q}
								</NativeTextMedium>
							</NativeTextMedium>
						</View>
					) : (
						<View />
					)}
				</Pressable>

				<View
					style={{
						flexDirection: 'row',
						// marginVertical: 'auto',
						alignItems: 'flex-start',
					}}
				>
					{menuItems.map(({ iconId, onPress, hidden }, i) =>
						hidden ? (
							<View />
						) : (
							<Pressable key={i} style={styles.menuButton} onPress={onPress}>
								<AppIcon
									id={iconId as any}
									emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
									onPress={onPress}
									size={TOP_NAVBAR_MENU_ICON_SIZE}
								/>
							</Pressable>
						),
					)}
				</View>
			</View>

			<NavBar_Explore
				isOpen={DropdownOpen}
				close={closeDropdown}
				items={explorePageTabs() ?? []}
				selectedItemId={State.tab}
			/>
		</View>
	);
}

export default Header;

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 12,
		width: '100%',
		zIndex: 1,
	},
	headerText: {
		fontSize: 28,
		fontFamily: APP_FONTS.INTER_700_BOLD, // fontWeight: '600',
	},
	labelArea: {
		justifyContent: 'center',
		flexGrow: 1,
		paddingVertical: TOP_NAVBAR_TOP_PADDING,
	},
	menuButton: {
		padding: appDimensions.topNavbar.padding,
		marginLeft: appDimensions.topNavbar.marginLeft,
		paddingTop: TOP_NAVBAR_TOP_PADDING,
		paddingBottom: TOP_NAVBAR_BOTTOM_PADDING,
	},
});
