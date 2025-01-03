import { memo } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { APP_ICON_ENUM, AppIcon } from '../../../../../lib/Icon';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import { SocialHubPinSectionContainer } from './_factory';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../../../utils/theming.util';
import {
	Account,
	ProfilePinnedTimeline,
} from '../../../../../../database/_schema';
import {
	useAppDialog,
	useAppTheme,
} from '../../../../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../../../../styles/dimensions';
import { HubService } from '../../../../../../services/hub.service';
import { AccountService } from '../../../../../../database/entities/account';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import useAppNavigator from '../../../../../../states/useAppNavigator';
import { DialogBuilderService } from '../../../../../../services/dialog-builder.service';
import { AppText } from '../../../../../lib/Text';

/**
 * If whitelist is present, filtered for those drivers only
 *
 * If blacklist is present, hidden for those drivers only
 */
// const data = [
// 	{ label: 'Home', mode: TimelineFetchMode.HOME },
// 	{ label: 'Local', mode: TimelineFetchMode.LOCAL },
// 	{
// 		label: 'Social',
// 		mode: TimelineFetchMode.SOCIAL,
// 		whitelist: [KNOWN_SOFTWARE.AKKOMA],
// 	},
// 	{
// 		label: 'Federated',
// 		mode: TimelineFetchMode.FEDERATED,
// 	},
// 	{
// 		label: 'Bubble',
// 		mode: TimelineFetchMode.BUBBLE,
// 		whitelist: [KNOWN_SOFTWARE.AKKOMA, KNOWN_SOFTWARE.PLEROMA],
// 	},
// ];

type PinnedTimelineItemProps = {
	pinId: number;
	account: Account;
	label: string;
	iconId: APP_ICON_ENUM;
	server: string;
};

function PinnedTimelineItem({
	pinId,
	account,
	label,
	iconId,
	server,
}: PinnedTimelineItemProps) {
	const { theme } = useAppTheme();
	const { acct, db, loadApp } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			db: o.db,
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
						color: theme.complementary.a0,
					}}
					numberOfLines={1}
				>
					{server}
				</AppText.Medium>
			</TouchableOpacity>
		</View>
	);
}

type SocialHubPinnedTimelinesProps = {
	account: Account;
	items: ProfilePinnedTimeline[];
};

const SocialHubPinnedTimelines = memo(
	({ items, account }: SocialHubPinnedTimelinesProps) => {
		const destinations = HubService.resolveTimelineDestinations(items);
		return (
			<SocialHubPinSectionContainer label={'Timelines'} style={styles.root}>
				<FlatList
					data={destinations}
					numColumns={2}
					renderItem={({ item }) => (
						<PinnedTimelineItem
							pinId={item.pinId}
							label={item.label}
							iconId={item.iconId}
							server={item.server}
							account={account}
						/>
					)}
				/>
			</SocialHubPinSectionContainer>
		);
	},
);
export default SocialHubPinnedTimelines;

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
