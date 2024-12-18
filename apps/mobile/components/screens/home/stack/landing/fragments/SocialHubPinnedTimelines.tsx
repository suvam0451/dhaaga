import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../../../../lib/Icon';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { TimelineFetchMode } from '../../../../../common/timeline/utils/timeline.types';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { router } from 'expo-router';
import { SocialHubPinSectionContainer } from './_factory';

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

	const TEXT_COLOR = theme.textColor.medium;

	return (
		<TouchableOpacity
			style={[
				styles.button,
				{
					backgroundColor: '#333',
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
					transform: [{ rotateZ: '-30deg' }],
					width: 42,
					position: 'absolute',
					opacity: 0.24,
					right: 0,
					bottom: -4,
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
		</TouchableOpacity>
	);
}

const SocialHubPinnedTimelines = memo(() => {
	return (
		<SocialHubPinSectionContainer
			label={'Timelines'}
			style={{
				marginTop: 16,
				marginHorizontal: 8,
			}}
		>
			<View style={{ flexDirection: 'column' }}>
				<View
					style={{
						flexDirection: 'row',
						marginBottom: 8,
					}}
				>
					<PinnedTimelineItem
						label={'Home'}
						icon={<AppIcon id={'home'} size={48} emphasis={'high'} />}
					/>
					<PinnedTimelineItem
						label={'Social'}
						icon={<AppIcon id={'home'} size={48} emphasis={'high'} />}
					/>
				</View>
				<View
					style={{
						flexDirection: 'row', // marginVertical: 8,
					}}
				>
					<PinnedTimelineItem
						label={'Home'}
						icon={<AppIcon id={'home'} size={48} emphasis={'high'} />}
					/>
					<PinnedTimelineItem
						label={'Federated'}
						icon={<AppIcon id={'home'} size={48} emphasis={'high'} />}
					/>
				</View>
			</View>
		</SocialHubPinSectionContainer>
	);
});
export default SocialHubPinnedTimelines;

const styles = StyleSheet.create({
	text: {
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		fontSize: 18,
	},
	button: {
		marginHorizontal: 5,
		paddingVertical: 14,
		paddingHorizontal: 12, // marginHorizontal: 8,
		borderRadius: 8,
	},
});
