import { View, StyleSheet } from 'react-native';
import { NativeTextMedium, NativeTextBold } from '#/ui/NativeText';
import { useActiveUserSession, useAppTheme } from '#/states/global/hooks';
import StarField from '#/skins/default/night/ManyStars';
import ShootingStar from '#/skins/default/ShottingStar';
import BobbingObject from '#/ui/anim/BobbingObject';
import SunBored from '#/skins/default/day/SunBored';
import DayCloud from '#/skins/default/day/DayCloud';
import useTimeOfDay from '#/ui/hooks/useTimeOfDay';
import MoonSleepingFilled from '#/skins/default/night/MoonSleepingFilled';
import NavBar_Explore from '#/components/topnavbar/NavBar_Explore';

function DayMode() {
	const { acct } = useActiveUserSession();
	const { theme } = useAppTheme();

	return (
		<View style={styles.root}>
			<View
				style={{
					alignItems: 'center',
				}}
			>
				<View>
					<View style={{ zIndex: 2 }}>
						<BobbingObject>
							<SunBored size={128} />
						</BobbingObject>
					</View>
					<View style={{ position: 'absolute', top: 40, left: 36, zIndex: 3 }}>
						<DayCloud size={128} />
					</View>
					<View
						style={{ position: 'absolute', top: -40, right: 36, zIndex: 1 }}
					>
						<DayCloud size={128} />
					</View>
				</View>

				<NativeTextMedium
					style={{ fontSize: 20, marginTop: 20, lineHeight: 24 }}
				>
					Have a lovely night,
				</NativeTextMedium>
				<NativeTextBold
					style={{
						color: theme.primary,
						fontSize: 20,
						marginTop: 12,
						lineHeight: 24,
					}}
				>
					{acct.displayName ?? acct.username}
				</NativeTextBold>
			</View>
		</View>
	);
}

function NightMode() {
	const { acct } = useActiveUserSession();
	const { theme } = useAppTheme();

	return (
		<View style={styles.root}>
			<ShootingStar />
			<ShootingStar />
			<StarField count={4} />

			<View
				style={{
					alignItems: 'center',
				}}
			>
				<View>
					<View style={{ zIndex: 2 }}>
						<BobbingObject>
							<MoonSleepingFilled size={128} />
						</BobbingObject>
					</View>
				</View>

				<NativeTextMedium
					style={{ fontSize: 20, marginTop: 20, lineHeight: 24 }}
				>
					Have a lovely night,
				</NativeTextMedium>
				<NativeTextBold
					style={{
						color: theme.primary,
						fontSize: 20,
						marginTop: 12,
						lineHeight: 24,
					}}
				>
					{acct.displayName ?? acct.username}
				</NativeTextBold>
			</View>
		</View>
	);
}

function ZenModeAnimations() {
	const timeOfDay = useTimeOfDay();

	if (timeOfDay === 'Morning' || timeOfDay === 'Afternoon')
		return (
			<>
				<NavBar_Explore />
				<DayMode />
			</>
		);
	return (
		<>
			<NavBar_Explore />
			<NightMode />
		</>
	);
}

export default ZenModeAnimations;

const styles = StyleSheet.create({
	root: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
});
