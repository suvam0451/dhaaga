import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { AppIcon } from '#/components/lib/Icon';
import { AppText } from '#/components/lib/Text';
import { View, StyleSheet } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { AttachedLinkBorderDecorations } from '#/skins/BorderDecorations';

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

export function LinkAttachmentOrnament({ children }: any) {
	return (
		<AttachedLinkBorderDecorations>{children}</AttachedLinkBorderDecorations>
	);
}

const styles = StyleSheet.create({
	quoteOrnamentRoot: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		marginTop: 8,
		borderRadius: 6,
		borderStyle: 'dashed',
		borderWidth: 1,
	},
});
