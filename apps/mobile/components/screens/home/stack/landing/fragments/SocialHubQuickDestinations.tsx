import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../../../../lib/Icon';
import { useAppTheme } from '../../../../../../hooks/app/useAppThemePack';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { TimelineFetchMode } from '../../../../../common/timeline/utils/timeline.types';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

/**
 * If whitelist is present, filtered for those drivers only
 *
 * If blacklist is present, hidden for those drivers only
 */
const data = [
	{ label: 'Home', mode: TimelineFetchMode.HOME },
	{ label: 'Local', mode: TimelineFetchMode.LOCAL },
	{
		label: 'Social',
		mode: TimelineFetchMode.SOCIAL,
		whitelist: [KNOWN_SOFTWARE.AKKOMA],
	},
	{
		label: 'Federated',
		mode: TimelineFetchMode.FEDERATED,
	},
	{
		label: 'Bubble',
		mode: TimelineFetchMode.BUBBLE,
		whitelist: [KNOWN_SOFTWARE.AKKOMA, KNOWN_SOFTWARE.PLEROMA],
	},
];

const SocialHubQuickDestinations = memo(() => {
	const { colorScheme } = useAppTheme();
	const { setHomepageType } = useGlobalState(
		useShallow((o) => ({
			setHomepageType: o.setHomepageType,
		})),
	);

	return (
		<View
			style={{
				marginTop: 16,
				marginHorizontal: 8,
			}}
		>
			<Text
				style={{
					color: colorScheme.textColor.medium,
					marginBottom: 4,
					fontSize: 18,
					fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
				}}
			>
				Quick Destinations
			</Text>
			<View style={{ flexDirection: 'column' }}>
				<View
					style={{
						flexDirection: 'row',
						marginVertical: 8,
					}}
				>
					<TouchableOpacity
						style={[
							styles.button,
							{ backgroundColor: '#333', flex: 1, marginRight: 6 },
						]}
						onPress={() => {
							setHomepageType(TimelineFetchMode.HOME);
						}}
					>
						<AppIcon id={'home'} emphasis={'high'} />
						<Text
							style={[
								styles.text,
								{
									color: colorScheme.textColor.high,
									fontSize: 16,
								},
							]}
						>
							Home
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.button,
							{ backgroundColor: '#333', flex: 1, marginLeft: 6 },
						]}
					>
						<AppIcon id={'home'} emphasis={'high'} />
						<Text
							style={[
								styles.text,
								{ color: colorScheme.textColor.high, fontSize: 16 },
							]}
						>
							Social
						</Text>
					</TouchableOpacity>
				</View>
				<View
					style={{
						flexDirection: 'row',
						marginVertical: 8,
					}}
				>
					<View
						style={[
							styles.button,
							{ backgroundColor: '#333', flex: 1, marginRight: 6 },
						]}
					>
						<AppIcon id={'home'} emphasis={'high'} />
						<Text style={[styles.text, { color: colorScheme.textColor.high }]}>
							Social
						</Text>
					</View>
					<View
						style={[
							styles.button,
							{ backgroundColor: '#333', flex: 1, marginLeft: 6 },
						]}
					>
						<AppIcon id={'home'} />
						<Text style={[styles.text, { color: colorScheme.textColor.high }]}>
							Federated
						</Text>
					</View>
				</View>
			</View>

			<Text
				style={{
					color: colorScheme.textColor.medium,
					marginBottom: 4,
					fontSize: 18,
					fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
				}}
			>
				How are you feeling today?
			</Text>

			<View style={{ flexDirection: 'column' }}>
				<View style={{ flexDirection: 'row' }}>
					<View
						style={{
							backgroundColor: '#333',
							padding: 8,
							borderRadius: 8,
							paddingHorizontal: 12,
							flex: 1,
							marginRight: 4,
						}}
					>
						<Text
							style={{
								color: colorScheme.textColor.medium,
								marginBottom: 4,
								fontSize: 18,
								fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							}}
						>
							Classic
						</Text>
					</View>
					<View
						style={{
							backgroundColor: '#333',
							padding: 8,
							borderRadius: 8,
							paddingHorizontal: 12,
							flex: 1,
							marginLeft: 4,
						}}
					>
						<Text
							style={{
								color: colorScheme.textColor.medium,
								marginBottom: 4,
								fontSize: 18,
								fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							}}
						>
							Sakura 🌸
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
});
export default SocialHubQuickDestinations;

const styles = StyleSheet.create({
	text: {
		marginTop: 6,
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		fontSize: 16,
	},
	button: {
		padding: 8,
		paddingHorizontal: 12,
		// marginHorizontal: 8,
		borderRadius: 8,
	},
});
