import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import {
	DiscoverStateAction,
	useDiscoverDispatch,
	useDiscoverState,
} from '@dhaaga/core';
import { getSearchTabs } from '@dhaaga/db';
import { useAppApiClient, useAppTheme } from '#/states/global/hooks';
import { NativeTextBold, NativeTextH1, NativeTextH6 } from '#/ui/NativeText';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import {
	Pressable,
	View,
	StyleSheet,
	StyleProp,
	ViewStyle,
} from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import NavBarFactory from '#/components/topnavbar/components/NavBarFactory';

type Props = {
	animatedStyle?: StyleProp<ViewStyle>;
};

function NavBar_Explore({ animatedStyle }: Props) {
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

		/**
		 * Explore tab is default for all drivers
		 */
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

	const dropdownItems = explorePageTabs();
	const NAVBAR_LABEL = dropdownItems.find((i) => i.id === State.tab)?.label;

	return (
		<NavBarFactory
			menuItems={menuItems}
			LabelComponent={
				<Pressable style={styles.labelArea}>
					{State.q ? (
						<View>
							<NativeTextH6
								numberOfLines={1}
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
							>
								{NAVBAR_LABEL}
							</NativeTextH6>
							<NativeTextBold>
								<NativeTextBold emphasis={APP_COLOR_PALETTE_EMPHASIS.A40}>
									Results For:{' '}
								</NativeTextBold>
								<NativeTextBold style={{ color: theme.primary }}>
									{State.q}
								</NativeTextBold>
							</NativeTextBold>
						</View>
					) : (
						<NativeTextH1>Top Posts</NativeTextH1>
					)}
				</Pressable>
			}
			animatedStyle={animatedStyle}
		/>
	);
}

export default NavBar_Explore;

const styles = StyleSheet.create({
	labelArea: {
		justifyContent: 'center',
		flexGrow: 1,
		marginBottom: appDimensions.topNavbar.padding,
	},
});
