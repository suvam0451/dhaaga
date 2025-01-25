import { Account } from '../../../database/_schema';
import { APP_ICON_ENUM, AppIcon } from '../../../components/lib/Icon';
import {
	useAppAcct,
	useAppDb,
	useAppDialog,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import useAppNavigator from '../../../states/useAppNavigator';
import { DialogBuilderService } from '../../../services/dialog-builder.service';
import { AccountService } from '../../../database/entities/account';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { appDimensions } from '../../../styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { AppText } from '../../../components/lib/Text';
import { APP_FONTS } from '../../../styles/AppFonts';

type Props = {
	pinId: number;
	account: Account;
	label: string;
	iconId: APP_ICON_ENUM;
	server: string;
};

function PinnedTimelineItemView({
	pinId,
	account,
	label,
	iconId,
	server,
}: Props) {
	const { theme } = useAppTheme();
	const { db } = useAppDb();
	const { acct } = useAppAcct();
	const { loadApp } = useGlobalState(
		useShallow((o) => ({
			loadApp: o.loadApp,
		})),
	);
	const { show, hide } = useAppDialog();
	const { toTimelineViaPin } = useAppNavigator();

	function onPress() {
		if (account.id !== acct.id) {
			show(
				DialogBuilderService.toSwitchActiveAccount(() => {
					AccountService.select(db, account);
					loadApp().then(() => {
						hide();
						toTimelineViaPin(pinId, 'feed');
					});
				}),
			);
			return;
		} else {
			toTimelineViaPin(pinId, 'feed');
		}
	}

	return (
		<View style={styles.buttonContainer}>
			<Animated.View entering={FadeIn} exiting={FadeOut}>
				<TouchableOpacity
					style={[
						styles.button,
						{
							backgroundColor: '#242424', // '#282828',
						},
					]}
					onPress={onPress}
				>
					<View style={styles.tiltedIconContainer}>
						<AppIcon
							id={iconId}
							size={appDimensions.socialHub.feeds.tiltedIconSize}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
							iconStyle={{ color: theme.secondary.a0 }}
						/>
					</View>
					<AppText.H6 emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}>
						{label}
					</AppText.H6>
					<AppText.Medium
						style={{
							width: 96,
							color: theme.secondary.a40,
						}}
						numberOfLines={1}
					>
						{server}
					</AppText.Medium>
				</TouchableOpacity>
			</Animated.View>
		</View>
	);
}

export default PinnedTimelineItemView;

const styles = StyleSheet.create({
	root: {
		marginTop: 16,
		marginHorizontal: 8,
	},
	text: {
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		fontSize: 18,
	},
	buttonContainer: {
		maxWidth: '50%',
		flex: 1,
		paddingHorizontal: 6,
	},
	button: {
		paddingVertical: 10,
		paddingHorizontal: 12, // marginHorizontal: 8,
		borderRadius: 8,
		marginBottom: 12,

		overflow: 'hidden',
		width: 'auto',
	},
	tiltedIconContainer: {
		transform: [{ rotateZ: '-15deg' }],
		width: 42,
		position: 'absolute',
		opacity: 0.48,
		right: 0,
		bottom: -6,
	},
});
