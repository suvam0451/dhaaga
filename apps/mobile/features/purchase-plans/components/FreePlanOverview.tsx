import {
	NativeScrollEvent,
	NativeSyntheticEvent,
	Pressable,
	View,
} from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import HubInterfaceSvg from '#/components/svgs/plans/HubInterfaceSvg';
import Folder from '#/components/svgs/plans/Folder';
import CreateNote from '#/components/svgs/plans/CreateNote';
import SortedInbox from '#/components/svgs/plans/free/SortedInbox';
import Woven from '#/components/svgs/plans/free/Woven';
import GalleryFolder from '#/components/svgs/plans/free/GalleryFolder';
import BookmarkCollections from '#/components/svgs/plans/free/BookmarkCollections';
import LurkerMode from '#/components/svgs/plans/free/LurkerMode';
import ZenModeSunMoon from '#/components/svgs/plans/free/ZenModeSunMoon';
import AdsBlocked from '#/components/svgs/plans/AdsBlocked';
import PrivacyFirst from '#/components/svgs/plans/PrivacyFirst';
import OpenSource from '#/components/svgs/plans/OpenSource';
import { AppDividerSoft } from '#/ui/Divider';
import PlanOverviewFactory, {
	PlanOverviewFactoryData,
} from '#/features/purchase-plans/components/PlanOverviewFactory';
import {
	NativeTextMedium,
	NativeTextNormal,
	NativeTextSpecial,
} from '#/ui/NativeText';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import Animated from 'react-native-reanimated';

type Props = {
	scrollHandler: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
	animatedHeaderStyle: any;
};

const AnimatedText = Animated.createAnimatedComponent(NativeTextSpecial);

function FreePlanOverview({ scrollHandler, animatedHeaderStyle }: Props) {
	const { theme } = useAppTheme();

	const featureList: PlanOverviewFactoryData[] = [
		{
			type: 'feature',
			title: 'Social Hub™',
			description: 'Your own customizable SNS gateway',
			Icon: (
				<View style={{ width: 48, height: 48 }}>
					<HubInterfaceSvg size={48} />
				</View>
			),
		},
		{
			type: 'feature',
			title: 'Social Profiles™',
			description: 'Build your private, on-device algorithms',
			Icon: (
				<View style={{ width: 48, height: 48 }}>
					<Folder size={48} />
				</View>
			),
		},
		{
			type: 'feature',
			title: 'D-Pen™',
			description: 'Make replying fun and stylish ;)',
			Icon: (
				<View style={{ width: 48, height: 48 }}>
					<CreateNote size={48} />
				</View>
			),
		},
		{
			type: 'feature',
			title: 'Organised Inboxes',
			description: 'Why is everything a timeline anyways?',
			Icon: (
				<View style={{ width: 48, height: 48 }}>
					<SortedInbox size={48} />
				</View>
			),
		},
		{
			type: 'feature',
			title: 'Threaded Comments',
			description: 'Never miss the context again',
			Icon: (
				<View style={{ width: 48, height: 48 }}>
					<Woven size={48} />
				</View>
			),
		},
		{
			type: 'feature',
			title: 'Viewing Modes™',
			description: 'Twitter, Instagram and TikTok in one',
			Icon: (
				<View style={{ width: 48, height: 48 }}>
					<GalleryFolder size={48} />
				</View>
			),
		},
		{
			type: 'feature',
			title: 'Collections™',
			description: 'Folders for your saved posts¹',
			Icon: (
				<View style={{ width: 48, height: 48 }}>
					<BookmarkCollections size={48} />
				</View>
			),
		},
		{
			type: 'divider',
		},
		{
			type: 'feature',
			title: 'Lurker Mode',
			description: 'Something for the introverts :)',
			Icon: (
				<View style={{ width: 48, height: 48 }}>
					<LurkerMode />
				</View>
			),
		},
		{
			type: 'feature',
			title: 'Zen Exploration™',
			description: 'A healthy alternative to recommendations',
			Icon: (
				<View style={{ width: 48, height: 48 }}>
					<ZenModeSunMoon size={48} />
				</View>
			),
		},
		{
			type: 'divider',
		},
		{
			type: 'feature',
			title: 'No Ads',
			description: 'You deserve a premium experience.',
			Icon: <AdsBlocked size={48} />,
		},
		{
			type: 'feature',
			title: 'Privacy First',
			description: 'No analytics. No tracking. No spying.',
			Icon: <PrivacyFirst size={48} />,
		},
		{
			type: 'feature',
			title: 'Fully Open Source',
			description: 'Systems you can trust and rely on.',
			Icon: (
				<View style={{ width: 48, height: 48 }}>
					<OpenSource />
				</View>
			),
		},
		{
			type: 'divider',
		},
	];

	return (
		<>
			<PlanOverviewFactory
				scrollHandler={scrollHandler}
				items={featureList}
				Header={
					<AnimatedText
						style={[
							{ fontSize: 32, marginBottom: 16, color: theme.primary },
							animatedHeaderStyle,
						]}
					>
						INCLUDES
					</AnimatedText>
				}
				Footer={
					<View style={{ marginTop: 32 }}>
						<NativeTextSpecial style={{ fontSize: 32, color: theme.primary }}>
							Tip Jar
						</NativeTextSpecial>
						<AppDividerSoft style={{ marginVertical: 8 }} />
						<NativeTextNormal>
							Making social media apps is hard. Making an objectively good one
							is harder.
						</NativeTextNormal>
						<NativeTextNormal style={{ marginTop: 8 }}>
							Add to that the challenge of building a plugin framework around
							it, which can integrate seamlessly with every platform and
							protocol, and that's quite a mega project right there.
						</NativeTextNormal>
						<NativeTextNormal
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A0}
							style={{ marginTop: 8 }}
						>
							Being a passion project being built by yours truly, for a better
							internet for everyone, Dhaaga is fully self-funded and open-source
							:)
						</NativeTextNormal>
						<NativeTextNormal style={{ marginTop: 8 }}>
							In light of transparency, I have disclosed my long term revenue
							model. But, I am in no rush to enable them until the app becomes
							the best of the best in the fediverse client ecosystem.
						</NativeTextNormal>
						<NativeTextNormal style={{ marginTop: 8 }}>
							However, with the sheer scope of this project, this can take
							months, if not years to happen (while I continue to pay out of
							pocket and do it for free).
						</NativeTextNormal>
						<NativeTextNormal style={{ marginTop: 8 }}>
							This is where any tips you send my way will be greatly appreciated
							and let me spend more time to speed things up to reach v1.0
						</NativeTextNormal>
						<View style={{ flexDirection: 'row', marginTop: 16 }}>
							<Pressable style={{ flex: 1 }}>
								<AppButtonVariantA
									label={'One-Time'}
									loading={false}
									onClick={() => {}}
								/>
							</Pressable>
							<Pressable style={{ flex: 1 }}>
								<AppButtonVariantA
									label={'Recurring'}
									loading={false}
									onClick={() => {}}
								/>
							</Pressable>
						</View>

						<NativeTextSpecial
							style={{ fontSize: 32, marginTop: 24, color: theme.primary }}
						>
							developer's Desk
						</NativeTextSpecial>
						<AppDividerSoft style={{ marginVertical: 8 }} />
						<NativeTextNormal emphasis={APP_COLOR_PALETTE_EMPHASIS.A0}>
							Dear user,
						</NativeTextNormal>
						<NativeTextNormal
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A0}
							style={{ marginTop: 8 }}
						>
							Thank you for using Dhaaga and spreading word about it.
						</NativeTextNormal>
						<NativeTextMedium
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A0}
							style={{ marginTop: 8 }}
						>
							I am currently looking at raising some cash to help me launch the
							app for iOS users (apple hardware is expensive -_-). If you are
							comfortable with it, please consider leaving a tip :)
						</NativeTextMedium>
						<NativeTextMedium
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A0}
							style={{ marginTop: 8 }}
						>
							You can do this from the second plan (Beta).
						</NativeTextMedium>
					</View>
				}
			/>
		</>
	);
}

export default FreePlanOverview;
