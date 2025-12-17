import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import NavBarFactory from '#/components/topnavbar/components/NavBarFactory';
import { StyleProp, ViewStyle } from 'react-native';

type Props = {
	label: string;
	type: 'mentions' | 'chats' | 'social' | 'updates' | 'replies';
	/**
	 * animates, as per the scroll view
	 * in the page
	 */
	animatedStyle: StyleProp<ViewStyle>;
};

function NavBar_Inbox({ label, type, animatedStyle }: Props) {
	let menuItems = [
		{
			iconId: 'user-guide',
			onPress: () => {
				router.navigate(APP_ROUTING_ENUM.INBOX_GUIDE);
			},
			disabled: false,
		},
	];
	if (type === 'chats') {
		menuItems = [
			{
				iconId: 'add',
				onPress: () => {},
				disabled: false,
			},
			...menuItems,
		];
	}
	if (type === 'updates') {
		menuItems = [
			{
				iconId: 'notifications-outline',
				onPress: () => {
					router.navigate(APP_ROUTING_ENUM.INBOX_MANAGE_SUBSCRIPTIONS);
				},
				disabled: false,
			},
			...menuItems,
		];
	}

	return (
		<NavBarFactory
			menuItems={menuItems}
			labelText={label}
			animatedStyle={animatedStyle}
		/>
	);
}

export default NavBar_Inbox;
