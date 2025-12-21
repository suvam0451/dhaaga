import { Account } from '@dhaaga/db';
import { TimeOfDayGreeting } from '#/app/(tabs)/index';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useHub } from '#/states/global/hooks';
import Animated, {
	FadeOut,
	FadeInLeft,
	FlipOutXUp,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { NativeTextH1 } from '#/ui/NativeText';
import NavBarFactory from '#/features/navbar/components/NavBarFactory';
import RoutingUtils from '#/utils/routing.utils';

type Props = {
	acct?: Account;
	animatedStyle?: any;
};

/**
 * Component Height = 72
 * @param acct
 * @param animatedStyle
 * @constructor
 */
function SocialHubHeader({ acct, animatedStyle }: Props) {
	const [GreetingActive, setGreetingActive] = useState(false);
	const { pageIndex } = useHub();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	useEffect(() => {
		setGreetingActive(true);
		const timer = setTimeout(() => {
			setGreetingActive(false);
		}, 2000);

		// Clean up the timer if the component unmounts or the state changes
		return () => {
			clearTimeout(timer);
		};
	}, [pageIndex]);

	const menuItems = [
		{
			iconId: 'color-palette-outline',
			onPress: RoutingUtils.toHubSkinSelection,
		},
		{
			iconId: 'user-guide',
			onPress: RoutingUtils.toHubUserGuide,
		},
	];

	function onLabelPressed() {
		setGreetingActive(true);
		setTimeout(() => {
			setGreetingActive(false);
		}, 5000);
	}

	return (
		<NavBarFactory
			menuItems={menuItems}
			LabelComponent={
				<TouchableOpacity style={styles.label} onPress={onLabelPressed}>
					{GreetingActive ? (
						<Animated.View entering={FadeInLeft} exiting={FadeOut}>
							<TimeOfDayGreeting style={{ paddingHorizontal: 0 }} acct={acct} />
						</Animated.View>
					) : (
						<Animated.View entering={FadeInLeft} exiting={FlipOutXUp}>
							<NativeTextH1>{t(`hub.navbarLabel`)}</NativeTextH1>
						</Animated.View>
					)}
				</TouchableOpacity>
			}
			animatedStyle={animatedStyle}
		/>
	);
}

export default SocialHubHeader;

const styles = StyleSheet.create({
	label: {
		flex: 1,
		marginVertical: 'auto',
		alignContent: 'center',
	},
});
