import { Dispatch, memo } from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { AppIcon } from '../../../../../lib/Icon';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { router } from 'expo-router';
import { SocialHubPinSectionContainer } from './_factory';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../../../utils/theming.util';
import { ProfilePinnedTimeline } from '../../../../../../database/_schema';
import { socialHubTabReducerAction } from '../../../../../../states/reducers/social-hub-tab.reducer';
import { TimelineFetchMode } from '../../../../../../states/reducers/timeline.reducer';

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

type PinnedTimelineItemProps = {
	label: string;
	icon: any;
};

function PinnedTimelineItem({ label, icon }: PinnedTimelineItemProps) {
	const { setHomepageType, theme } = useGlobalState(
		useShallow((o) => ({
			setHomepageType: o.setHomepageType,
			theme: o.colorScheme,
		})),
	);

	const TEXT_COLOR = theme.secondary.a10; // theme.textColor.medium;

	return (
		<TouchableOpacity
			style={[
				styles.button,
				{
					backgroundColor: '#282828', // '#282828',
					flex: 1,
					overflow: 'hidden',
					alignItems: 'flex-start',
				},
			]}
			onPress={() => {
				setHomepageType(TimelineFetchMode.HOME);
				router.push('/timelines');
			}}
		>
			<View
				style={{
					transform: [{ rotateZ: '-15deg' }],
					width: 42,
					position: 'absolute',
					opacity: 0.48,
					right: 0,
					bottom: -6,
				}}
			>
				{icon}
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
				}}
				numberOfLines={1}
			>
				misskey.io
			</Text>
		</TouchableOpacity>
	);
}

type SocialHubPinnedTimelinesProps = {
	items: ProfilePinnedTimeline[];
	refresh: () => void;
	isRefreshing: boolean;
	dispatch: Dispatch<socialHubTabReducerAction>;
};

const SocialHubPinnedTimelines = memo(
	({
		items,
		refresh,
		isRefreshing,
		dispatch,
	}: SocialHubPinnedTimelinesProps) => {
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);

		return (
			<SocialHubPinSectionContainer
				label={'Timelines'}
				style={{
					marginTop: 16,
					marginHorizontal: 8,
				}}
			>
				<FlatList
					data={items}
					numColumns={2}
					renderItem={({ item }) => (
						<View>
							{/*<Text style={{ color: theme.secondary.a20 }}>Hello</Text>*/}
						</View>
					)}
				/>
				<View style={{ flexDirection: 'column' }}>
					<View
						style={{
							flexDirection: 'row',
							marginBottom: 8,
						}}
					>
						<PinnedTimelineItem
							label={'Home'}
							icon={
								<AppIcon
									id={'home'}
									size={48}
									emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
									iconStyle={{ color: theme.secondary.a0 }}
								/>
							}
						/>
						<PinnedTimelineItem
							label={'Social'}
							icon={
								<AppIcon
									id={'home'}
									size={48}
									emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
									iconStyle={{ color: theme.secondary.a0 }}
								/>
							}
						/>
					</View>
					<View
						style={{
							flexDirection: 'row',
						}}
					>
						<PinnedTimelineItem
							label={'Local'}
							icon={
								<Ionicons name="people" size={48} color={theme.secondary.a0} />
							}
						/>
						<PinnedTimelineItem
							label={'Federated'}
							icon={
								<Feather name="globe" size={48} color={theme.secondary.a0} />
							}
						/>
					</View>
				</View>
			</SocialHubPinSectionContainer>
		);
	},
);
export default SocialHubPinnedTimelines;

const styles = StyleSheet.create({
	text: {
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		fontSize: 18,
	},
	button: {
		marginHorizontal: 5,
		paddingVertical: 10,
		paddingHorizontal: 12, // marginHorizontal: 8,
		borderRadius: 8,
	},
});
