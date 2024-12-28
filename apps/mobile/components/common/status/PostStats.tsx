import { memo } from 'react';
import {
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from 'react-native';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_FONTS } from '../../../styles/AppFonts';
import { useAppBottomSheet_Improved } from '../../../hooks/utility/global-state-extractors';
import { useAppStatusItem } from '../../../hooks/ap-proto/useAppStatusItem';
import { APP_BOTTOM_SHEET_ENUM } from '../../dhaaga-bottom-sheet/Core';

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
const StatItem = memo(
	({ count, label, nextCounts, onPress, me }: StatItemProps) => {
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);

		const formatted = util(count);
		const color = me ? theme.primary.a0 : theme.complementary.a0;

		const SHOW_TRAILING_BULLET = !nextCounts.every((o) => o === 0);
		if (count === 0) return <View />;
		return (
			<Pressable onPress={onPress}>
				<View style={{ flexDirection: 'row' }}>
					<Text style={[styles.text, { color }]}>
						{formatted} {label}
					</Text>
					{SHOW_TRAILING_BULLET && (
						<Text style={[{ color: theme.secondary.a30, marginHorizontal: 6 }]}>
							&bull;
						</Text>
					)}
				</View>
			</Pressable>
		);
	},
);

/**
 * Show metrics for a post
 *
 * If all metrics are zero, hide the section to preserve
 * vertical screen estate
 * @constructor
 */
const PostStats = memo(function Foo({
	style,
}: {
	style?: StyleProp<ViewStyle>;
}) {
	const { show, setCtx } = useAppBottomSheet_Improved();
	const { dto } = useAppStatusItem();
	const LIKE_COUNT = dto.stats.likeCount;
	const REPLY_COUNT = dto.stats.replyCount;
	const SHARE_COUNT = dto.stats.boostCount;

	const LIKED = dto.interaction.liked;
	const SHARED = dto.interaction.boosted;

	if (LIKE_COUNT < 1 && REPLY_COUNT < 1 && SHARE_COUNT < 1)
		return <View></View>;

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
});

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		marginTop: 8,
		flexDirection: 'row',
		alignItems: 'center',
	},
	text: {
		fontSize: 14,
		textAlign: 'right',
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
	bull: {
		marginHorizontal: 2,
	},
});
export default PostStats;
