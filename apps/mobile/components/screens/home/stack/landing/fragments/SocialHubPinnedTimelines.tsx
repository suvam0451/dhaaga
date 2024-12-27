import { Dispatch, memo } from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { APP_ICON_ENUM, AppIcon } from '../../../../../lib/Icon';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import { router } from 'expo-router';
import { SocialHubPinSectionContainer } from './_factory';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../../../utils/theming.util';
import { ProfilePinnedTimeline } from '../../../../../../database/_schema';
import { socialHubTabReducerAction } from '../../../../../../states/reducers/social-hub-tab.reducer';
import { useAppTheme } from '../../../../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../../../../styles/dimensions';
import { HubService } from '../../../../../../services/hub.service';

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
	label: string;
	iconId: APP_ICON_ENUM;
	server: string;
};

function PinnedTimelineItem({
	label,
	iconId,
	server,
}: PinnedTimelineItemProps) {
	const { theme } = useAppTheme();
	const TEXT_COLOR = theme.secondary.a10; // theme.textColor.medium;

	return (
		<View style={styles.buttonContainer}>
			<TouchableOpacity
				style={[
					styles.button,
					{
						backgroundColor: '#242424', // '#282828',
					},
				]}
				onPress={() => {
					router.push('/timelines');
				}}
			>
				<View style={styles.tiltedIconContainer}>
					<AppIcon
						id={iconId}
						size={appDimensions.socialHub.feeds.tiltedIconSize}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						iconStyle={{ color: theme.secondary.a0 }}
					/>
				</View>
				<Text
					style={[
						styles.text,
						{
							color: TEXT_COLOR,
						},
					]}
				>
					{label}
				</Text>
				<Text
					style={{
						color: theme.complementary.a0,
						fontSize: 13,
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						width: 96,
					}}
					numberOfLines={1}
				>
					{server}
				</Text>
			</TouchableOpacity>
		</View>
	);
}

type SocialHubPinnedTimelinesProps = {
	items: ProfilePinnedTimeline[];
	refresh: () => void;
	isRefreshing: boolean;
	dispatch: Dispatch<socialHubTabReducerAction>;
};

const SocialHubPinnedTimelines = memo(
	({ items }: SocialHubPinnedTimelinesProps) => {
		const destinations = HubService.resolveTimelineDestinations(items);
		return (
			<SocialHubPinSectionContainer label={'Timelines'} style={styles.root}>
				<FlatList
					data={destinations}
					numColumns={2}
					renderItem={({ item }) => (
						<PinnedTimelineItem
							label={item.label}
							iconId={item.iconId}
							server={item.server}
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
