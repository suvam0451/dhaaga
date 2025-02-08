import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import SoftwareHeader from '../../../screens/accounts/fragments/SoftwareHeader';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AppText } from '../../../components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { APP_FONTS } from '../../../styles/AppFonts';

/**
 * This UI fragment can be shared with other
 * screens (that might have a different header,
 * footer or page decorations)
 * @constructor
 */
function ProtocolCards() {
	const { theme } = useAppTheme();
	const options: {
		label: string;
		padding: number;
		rightComponent: any;
		to: string;
		desc?: string;
	}[] = [
		{
			label: 'Bluesky',
			desc: '- Custom PDS (for now)',
			padding: 0,
			rightComponent: (
				<SoftwareHeader
					software={KNOWN_SOFTWARE.BLUESKY}
					mb={0}
					mt={0}
					iconSizeMultiplier={3}
				/>
			),
			to: APP_ROUTING_ENUM.ATPROTO_SIGNIN,
		},
		{
			label: 'Mastodon',
			padding: 20,
			desc: '+ Pleroma, Akkoma',
			rightComponent: (
				<SoftwareHeader
					software={KNOWN_SOFTWARE.MASTODON}
					mb={0}
					mt={0}
					iconSizeMultiplier={2.2}
				/>
			),
			to: APP_ROUTING_ENUM.MASTODON_SERVER_SELECTION,
		},
		{
			label: 'Misskey',
			padding: 12,
			desc: '+ Sharkey, CherryPick',
			rightComponent: (
				<SoftwareHeader
					software={KNOWN_SOFTWARE.MISSKEY}
					mb={0}
					mt={0}
					iconSizeMultiplier={2.5}
				/>
			),
			to: APP_ROUTING_ENUM.MISSKEY_SERVER_SELECTION,
		},
	];

	return (
		<View>
			{options.map((option, i) => (
				<Pressable
					key={i}
					style={[
						styles.selectSnsBox,
						{
							backgroundColor: theme.palette.menubar,
							paddingVertical: option.padding,
						},
					]}
					onPress={() => {
						router.push(option.to);
					}}
				>
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<AppText.SemiBold
							style={[
								styles.selectSnsLabel,
								{
									color: theme.secondary.a10,
								},
							]}
						>
							{option.label}
						</AppText.SemiBold>
						{option.desc && (
							<AppText.Medium emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}>
								{option.desc}
							</AppText.Medium>
						)}
					</View>
					<View style={{ width: 80, alignItems: 'center' }}>
						{option.rightComponent}
					</View>
				</Pressable>
			))}
		</View>
	);
}

export default ProtocolCards;

const styles = StyleSheet.create({
	noAccountText: {
		fontSize: 24,
		textAlign: 'center',
		marginTop: 48,
		fontFamily: APP_FONTS.INTER_700_BOLD,
		marginBottom: 32,
	},
	selectSnsBox: {
		padding: 6,
		flexDirection: 'row',
		alignItems: 'center',
		margin: 10,
		borderRadius: 16,
		paddingHorizontal: 20,
	},
	selectSnsLabel: {
		fontSize: 22,
	},
	tipContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		width: '100%',
		marginTop: 32,
	},
	tipText: {
		marginLeft: 6,
	},
});
