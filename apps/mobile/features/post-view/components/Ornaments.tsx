import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { AppIcon } from '#/components/lib/Icon';
import { AppText } from '#/components/lib/Text';
import { View } from 'react-native';
import { appDimensions } from '#/styles/dimensions';

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

type PinOrnamentProps = {
	isPinned: boolean;
};

export function PinOrnament({ isPinned }: PinOrnamentProps) {
	const { theme } = useAppTheme();
	if (!isPinned) return <View />;
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			<AppIcon id={'pin'} size={20} color={theme.complementary.a0} />
			<AppText.Medium
				style={{
					color: theme.complementary.a0,
					marginLeft: 6,
				}}
			>
				Pinned
			</AppText.Medium>
		</View>
	);
}

export function QuoteOrnament() {
	const { theme } = useAppTheme();

	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				marginBottom: SECTION_MARGIN_BOTTOM,
			}}
		>
			<AppIcon id={'quote'} size={14} color={theme.complementary.a0} />
			<AppText.SemiBold
				style={{
					color: theme.complementary.a0,
					marginLeft: 4,
				}}
			>
				Quoted this Post
			</AppText.SemiBold>
		</View>
	);
}
