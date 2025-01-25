import {
	Pressable,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';
import {
	useAppBottomSheet_Improved,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';
import { appDimensions } from '../../../styles/dimensions';
import { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { AppText } from '../../lib/Text';
import { AppPostObject } from '../../../types/app-post.types';

type StatItemProps = {
	count: number;
	label: string;
	nextCounts: number[];
	onPress: () => void;
	me?: boolean;
};

function util(o: number): string {
	const formatter = new Intl.NumberFormat('en-US', {
		notation: 'compact',
		compactDisplay: 'short',
	});
	return formatter.format(o);
}

/**
 * Shows a post stat
 */
export function StatItem({
	count,
	label,
	nextCounts,
	onPress,
	me,
}: StatItemProps) {
	const { theme } = useAppTheme();
	const formatted = util(count);
	const color = me ? theme.primary.a0 : theme.secondary.a30;

	const SHOW_TRAILING_BULLET = !nextCounts.every((o) => o === 0);
	if (count === 0) return <View />;
	return (
		<Pressable onPress={onPress}>
			<View style={{ flexDirection: 'row' }}>
				<AppText.Medium style={[{ color, fontSize: 14 }]}>
					{formatted}{' '}
					<AppText.Medium style={{ color, fontSize: 13 }}>
						{label}
					</AppText.Medium>
				</AppText.Medium>
				{SHOW_TRAILING_BULLET && (
					<AppText.Medium
						style={[
							{
								color: theme.secondary.a30,
								fontSize: 13,
								marginHorizontal: 6,
							},
						]}
					>
						&bull;
					</AppText.Medium>
				)}
			</View>
		</Pressable>
	);
}

type PostStatsProps = {
	style?: StyleProp<ViewStyle>;
	dto: AppPostObject;
};
/**
 * Show metrics for a post
 *
 * If all metrics are zero, hide the section to preserve
 * vertical screen estate
 * @constructor
 */
function PostStats({ style, dto }: PostStatsProps) {
	const { show, setCtx } = useAppBottomSheet_Improved();

	const LIKE_COUNT = dto.stats.likeCount;
	const REPLY_COUNT = dto.stats.replyCount;
	const SHARE_COUNT = dto.stats.boostCount;

	const LIKED = PostMiddleware.isLiked(dto);
	const SHARED = PostMiddleware.isShared(dto);

	// No stat to show
	if (LIKE_COUNT < 1 && REPLY_COUNT < 1 && SHARE_COUNT < 1) return <View />;

	function onPressLikeCounter() {
		setCtx({ uuid: dto.uuid });
		show(APP_BOTTOM_SHEET_ENUM.POST_SHOW_LIKES, true);
	}

	function onPressShareCounter() {
		setCtx({ uuid: dto.uuid });
		show(APP_BOTTOM_SHEET_ENUM.POST_SHOW_SHARES, true);
	}

	function onPressCommentCounter() {
		setCtx({ uuid: dto.uuid });
		show(APP_BOTTOM_SHEET_ENUM.POST_SHOW_REPLIES, true);
	}

	if (!LIKE_COUNT && !SHARE_COUNT && !REPLY_COUNT) return <View />;

	return (
		<View style={[styles.container, style]}>
			<StatItem
				count={LIKE_COUNT}
				label={'Likes'}
				nextCounts={[REPLY_COUNT, SHARE_COUNT]}
				onPress={onPressLikeCounter}
				me={LIKED}
			/>
			<StatItem
				count={SHARE_COUNT}
				label={'Shares'}
				nextCounts={[REPLY_COUNT]}
				onPress={onPressShareCounter}
				me={SHARED}
			/>
			<StatItem
				count={REPLY_COUNT}
				label={'Replies'}
				nextCounts={[]}
				onPress={onPressCommentCounter}
			/>
		</View>
	);
}

export default PostStats;

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: appDimensions.timelines.sectionBottomMargin * 0.5,
	},
	text: {},
	bull: {
		marginHorizontal: 2,
	},
});
