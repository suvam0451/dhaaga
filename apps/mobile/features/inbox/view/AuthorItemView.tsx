import { Text, View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ICON_SIZE } from '../../../components/screens/notifications/landing/segments/_common';
import { AppIcon } from '../../../components/lib/Icon';
import { DatetimeUtil } from '../../../utils/datetime.utils';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { AppParsedTextNodes } from '../../../types/parsed-text.types';
import { TextContentView } from '../../../components/common/status/TextContentView';
import { AppText } from '../../../components/lib/Text';
import { appDimensions } from '../../../styles/dimensions';

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
			<View style={styles.senderAvatarContainer}>
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
			</View>
			<View style={{ marginLeft: 12, flex: 1 }}>
				<TextContentView
					tree={parsedDisplayName}
					variant={'displayName'}
					mentions={[]}
					emojiMap={emojiMap}
					oneLine
					style={{ marginRight: 16 }}
				/>
				<Text>
					<AppText.Medium
						style={{
							color: theme.complementary.a0,
						}}
					>
						{desc}
					</AppText.Medium>
					<AppText.Medium
						style={{
							color: theme.secondary.a40,
						}}
					>
						{' • '}
						{DatetimeUtil.timeAgo(createdAt)}
					</AppText.Medium>
				</Text>
			</View>
			<View
				style={{
					height: '100%',
					paddingTop: 4,
					paddingHorizontal: 4,
					paddingLeft: 16,
				}}
			>
				<AppIcon id={'ellipsis-v'} color={theme.secondary.a40} size={20} />
			</View>
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
		borderRadius: '100%',
		borderColor: 'black',
		borderWidth: 3,
	},
});
