import { useAppTheme } from '#/states/global/hooks';
import { AppIcon } from '#/components/lib/Icon';
import { AppText } from '#/components/lib/Text';
import { View } from 'react-native';
import { AttachedLinkBorderDecorations } from '#/skins/BorderDecorations';

type PinOrnamentProps = {
	isPinned: boolean;
};

export function PinOrnament({ isPinned }: PinOrnamentProps) {
	const { theme } = useAppTheme();
	if (!isPinned) return <View />;
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			<AppIcon id={'pin'} size={20} color={theme.complementary} />
			<AppText.Medium
				style={{
					color: theme.complementary,
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

export function ShareIndicatorOrnament({ children }: any) {}
