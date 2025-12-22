import { Pressable, StyleSheet, View } from 'react-native';
import { DatetimeUtil } from '#/utils/datetime.utils';
import { useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import type { AppParsedTextNodes } from '@dhaaga/bridge';
import { AppIcon } from '#/components/lib/Icon';
import TextAstRendererView from '#/ui/TextAstRendererView';
import { NativeTextBold, NativeTextNormal } from '#/ui/NativeText';
import Avatar from '#/ui/Avatar';

type Props = {
	handle: string;
	parsedDisplayName: AppParsedTextNodes;
	avatarUrl: string;
	extraData?: any;
	createdAt: Date | string;
	Icon: any;
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
	emojiMap,
	desc,
	onAvatarPressed,
	onUserPressed,
	onMoreOptionsPressed,
	extraData,
	handle,
}: Props) {
	const { theme } = useAppTheme();

	return (
		<View style={styles.root}>
			<Avatar uri={avatarUrl} onPressed={onAvatarPressed} />
			<Pressable style={{ marginLeft: 8, flex: 1 }} onPress={onUserPressed}>
				{parsedDisplayName.length > 0 ? (
					<TextAstRendererView
						tree={parsedDisplayName}
						variant={'displayName'}
						mentions={[]}
						emojiMap={emojiMap}
						oneLine
					/>
				) : (
					<NativeTextBold>{handle}</NativeTextBold>
				)}
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<View style={[styles.notificationCategoryIconContainer, {}]}>
						{Icon}
					</View>
					<NativeTextNormal
						style={{ fontSize: 13.5, color: theme.secondary.a40 }}
					>
						{desc}
					</NativeTextNormal>
				</View>
			</Pressable>
			<Pressable style={styles.timeAgoContainer} onPress={onMoreOptionsPressed}>
				<NativeTextNormal
					style={[
						styles.timeAgo,
						{
							color: theme.secondary.a40,
						},
					]}
				>
					{DatetimeUtil.timeAgo(createdAt)}
				</NativeTextNormal>
				{extraData?.interaction?.liked ? (
					<AppIcon id={'heart'} size={28} color={theme.primary} />
				) : (
					<View />
				)}
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
		marginBottom: appDimensions.timelines.sectionBottomMargin,
	},
	notificationCategoryIconContainer: {
		marginRight: 4,
	},
	timeAgoContainer: {
		height: '100%',
		paddingTop: 4,
		paddingHorizontal: 4,
		paddingLeft: 16,
		flexDirection: 'row',
		alignItems: 'center',
	},
	timeAgo: {
		fontSize: 13,
		marginBottom: 'auto',
	},
});
