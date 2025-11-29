import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { ICON_SIZE } from '../components/_common';
import { AppIcon } from '../../../components/lib/Icon';
import { DatetimeUtil } from '../../../utils/datetime.utils';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { TextContentView } from '../../../components/common/status/TextContentView';
import { AppText } from '../../../components/lib/Text';
import { appDimensions } from '../../../styles/dimensions';
import type { AppParsedTextNodes } from '@dhaaga/bridge';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';

type Props = {
	handle: string;
	parsedDisplayName: AppParsedTextNodes;
	avatarUrl: string;
	extraData?: string;
	createdAt: Date | string;
	Icon: any;
	bg: string;
	emojiMap: Map<string, string>;
	desc: string;
	onAvatarPressed: () => void;
	onUserPressed: () => void;
	onMoreOptionsPressed: () => void;
};

/**
 * Pure Component
 */
export function AuthorItemView({
	parsedDisplayName,
	avatarUrl,
	createdAt,
	Icon,
	bg,
	emojiMap,
	desc,
	onAvatarPressed,
	onUserPressed,
	onMoreOptionsPressed,
}: Props) {
	const { theme } = useAppTheme();

	return (
		<View
			style={{
				flexDirection: 'row',
				flex: 1,
				alignItems: 'center',
				marginBottom: appDimensions.timelines.sectionBottomMargin,
			}}
		>
			<Pressable style={styles.senderAvatarContainer} onPress={onAvatarPressed}>
				{/*@ts-ignore-next-line*/}
				<Image
					source={{
						uri: avatarUrl,
					}}
					style={{
						width: ICON_SIZE,
						height: ICON_SIZE,
						borderRadius: ICON_SIZE / 2,
					}}
				/>
				<View
					style={[
						styles.notificationCategoryIconContainer,
						{ backgroundColor: bg || '#1f1f1f' },
					]}
				>
					{Icon}
				</View>
			</Pressable>
			<Pressable style={{ marginLeft: 12, flex: 1 }} onPress={onUserPressed}>
				<TextContentView
					tree={parsedDisplayName}
					variant={'displayName'}
					mentions={[]}
					emojiMap={emojiMap}
					oneLine
					style={{
						marginRight: 16,
						marginBottom: appDimensions.timelines.sectionBottomMargin * 0.25,
					}}
				/>
				<AppText.Normal
					style={{ fontSize: 13.5 }}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A40}
				>
					{desc}
				</AppText.Normal>
			</Pressable>
			<Pressable
				style={{
					height: '100%',
					paddingTop: 4,
					paddingHorizontal: 4,
					paddingLeft: 16,
					flexDirection: 'row',
				}}
				onPress={onMoreOptionsPressed}
			>
				<AppText.Normal
					style={{
						color: theme.secondary.a40,
						marginRight: 8,
						fontSize: 13,
					}}
				>
					{DatetimeUtil.timeAgo(createdAt)}
				</AppText.Normal>
				<AppIcon id={'ellipsis-v'} color={theme.secondary.a40} size={20} />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	senderAvatarContainer: {
		width: ICON_SIZE + 2,
		height: ICON_SIZE + 2,
		position: 'relative',
		borderWidth: 1,
		borderColor: 'grey',
		borderRadius: ICON_SIZE / 2,
	},
	notificationCategoryIconContainer: {
		position: 'absolute',
		zIndex: 99,
		bottom: -9,
		right: -9,
		padding: 0.5,
		borderRadius: 32,
		borderColor: 'black',
		borderWidth: 3,
	},
});
