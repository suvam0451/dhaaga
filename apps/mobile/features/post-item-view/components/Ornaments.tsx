import { useAppTheme } from '#/states/global/hooks';
import { AppIcon } from '#/components/lib/Icon';
import { AppText } from '#/components/lib/Text';
import { View } from 'react-native';
import { NativeTextBold } from '#/ui/NativeText';
import { Ionicons } from '@expo/vector-icons';
import ThemedReplyContextLine from '#/features/skins/components/ThemedReplyContextLine';
import {
	ThemedLinkAttachmentOrnament,
	ThemedQuotedPostOrnament,
} from '#/features/skins/components/ThemedBorderDecorations';

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

export function ReplyIndicatorOrnament() {
	const { theme } = useAppTheme();

	return (
		<View
			style={{
				borderRadius: 8,
				borderBottomLeftRadius: 0,
				borderBottomRightRadius: 0,
			}}
		>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					marginBottom: 4,
				}}
			>
				<Ionicons
					color={theme.secondary.a20}
					name={'arrow-redo-outline'}
					size={14}
				/>
				<NativeTextBold
					style={{
						marginLeft: 4,
						fontSize: 13,
						color: theme.secondary.a20,
					}}
				>
					Replied to a thread
				</NativeTextBold>
			</View>
		</View>
	);
}

export function ReplyContextLine() {
	return <ThemedReplyContextLine />;
}

export function LinkAttachmentOrnament({ children }: any) {
	return (
		<ThemedLinkAttachmentOrnament>{children}</ThemedLinkAttachmentOrnament>
	);
}

export function QuotedPostOrnament({ children }: any) {
	return <ThemedQuotedPostOrnament>{children}</ThemedQuotedPostOrnament>;
}

export function ShareIndicatorOrnament({ children }: any) {}
