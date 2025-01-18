import { Account } from '../../../database/_schema';
import { TimeOfDayGreeting } from '../../../app/(tabs)/index';
import { Pressable, StyleSheet, View } from 'react-native';
import { appDimensions } from '../../../styles/dimensions';
import { AppIcon } from '../../../components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useHub } from '../../../hooks/utility/global-state-extractors';
import Animated, { FadeOut, FadeInLeft } from 'react-native-reanimated';
import { AppText } from '../../../components/lib/Text';
import { APP_FONTS } from '../../../styles/AppFonts';

type Props = {
	acct?: Account;
};

function SocialHubHeader({ acct }: Props) {
	const [GreetingActive, setGreetingActive] = useState(false);
	const { navigation } = useHub();

	useEffect(() => {
		setGreetingActive(true);
		const timer = setTimeout(() => {
			setGreetingActive(false);
		}, 2000);

		// Clean up the timer if the component unmounts or the state changes
		return () => {
			clearTimeout(timer);
		};
	}, [navigation]);

	const menuItems = [
		{
			iconId: 'user-guide',
			onPress: () => {
				router.push('/user-guide');
			},
		},
	];

	return (
		<View style={[styles.container]}>
			<Animated.View
				style={{
					flex: 1,
				}}
				entering={FadeInLeft}
				exiting={FadeOut}
			>
				{GreetingActive ? (
					<TimeOfDayGreeting style={{ paddingHorizontal: 0 }} acct={acct} />
				) : (
					<Animated.View entering={FadeInLeft}>
						<AppText.H1>Social Hub</AppText.H1>
					</Animated.View>
				)}
			</Animated.View>
			<View style={{ flexDirection: 'row' }}>
				{menuItems.map(({ iconId, onPress }, i) => (
					<Pressable
						key={i}
						style={{
							padding: appDimensions.topNavbar.padding,
							marginLeft: appDimensions.topNavbar.marginLeft,
						}}
						onPress={onPress}
					>
						<AppIcon
							id={iconId as any}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
							onPress={onPress}
							size={appDimensions.topNavbar.iconSize}
						/>
					</Pressable>
				))}
			</View>
		</View>
	);
}

export default SocialHubHeader;

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 12,
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		minHeight: 72,
	},
	headerText: {
		fontSize: 28,
		fontFamily: APP_FONTS.INTER_700_BOLD, // fontWeight: '600',
	},
});
