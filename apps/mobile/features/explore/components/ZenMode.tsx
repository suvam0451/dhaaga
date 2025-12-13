import { Dimensions, View } from 'react-native';
import { NativeTextMedium, NativeTextSemiBold } from '#/ui/NativeText';
import { useActiveUserSession, useAppTheme } from '#/states/global/hooks';
import StarField from '#/skins/default/night/ManyStars';
import ShootingStar from '#/skins/default/ShottingStar';
import BobbingObject from '#/ui/anim/BobbingObject';
import SunBored from '#/skins/default/day/SunBored';
import DayCloud from '#/skins/default/day/DayCloud';

function ZenMode() {
	const { acct } = useActiveUserSession();
	const { theme } = useAppTheme();
	return (
		<View
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flex: 1,
			}}
		>
			<ShootingStar />
			<ShootingStar />
			<StarField count={4} />

			<View
				style={{
					paddingBottom: Dimensions.get('screen').height * 0.12,
					alignItems: 'center',
				}}
			>
				<View>
					<View style={{ zIndex: 2 }}>
						<BobbingObject>
							<SunBored size={128} />
							{/*<MoonSleepingFilled size={128} />*/}
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
				<NativeTextSemiBold
					style={{
						color: theme.primary,
						fontSize: 20,
						marginTop: 12,
						lineHeight: 24,
					}}
				>
					{acct.displayName ?? acct.username}
				</NativeTextSemiBold>
			</View>
		</View>
	);
}

export default ZenMode;
