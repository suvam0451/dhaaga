import { Fragment, memo } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Text } from 'react-native';
import { APP_FONT } from '../../../styles/AppTheme';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_FONTS } from '../../../styles/AppFonts';
import { AppPostObject } from '../../../types/app-post.types';

type StatItemProps = {
	count: number;
	label: string;
	nextCounts: number[];
	onPress: () => void;
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
const StatItem = memo(({ count, label, nextCounts }: StatItemProps) => {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	const formatted = util(count);

	const SHOW_TRAILING_BULLET = !nextCounts.every((o) => o === 0);
	if (count === 0) return <View />;
	return (
		<Fragment>
			<Text style={[styles.text, { color: theme.complementary.a0 }]}>
				{formatted} {label}
			</Text>
			{SHOW_TRAILING_BULLET && (
				<Text style={[styles.bull, { color: theme.textColor.emphasisC }]}>
					&bull;
				</Text>
			)}
		</Fragment>
	);
});

/**
 * Show metrics for a post
 *
 * If all metrics are zero, hide the section to preserve
 * vertical screen estate
 * @constructor
 */
const PostStats = memo(function Foo({
	dto,
	style,
}: {
	dto: AppPostObject;
	style?: StyleProp<ViewStyle>;
}) {
	const STATUS_DTO = dto.meta.isBoost
		? dto.content.raw
			? dto
			: dto.boostedFrom
		: dto;

	const LIKE_COUNT = STATUS_DTO.stats.likeCount;
	const REPLY_COUNT = STATUS_DTO.stats.replyCount;
	const SHARE_COUNT = STATUS_DTO.stats.boostCount;

	if (LIKE_COUNT < 1 && REPLY_COUNT < 1 && SHARE_COUNT < 1)
		return <View></View>;

	return (
		<View style={[styles.container, style]}>
			<StatItem
				count={LIKE_COUNT}
				label={'Likes'}
				nextCounts={[REPLY_COUNT, SHARE_COUNT]}
				onPress={() => {}}
			/>
			<StatItem
				count={SHARE_COUNT}
				label={'Shared'}
				nextCounts={[REPLY_COUNT]}
				onPress={() => {}}
			/>
			<StatItem
				count={REPLY_COUNT}
				label={'Replies'}
				nextCounts={[]}
				onPress={() => {}}
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
		fontSize: 12,
		textAlign: 'right',
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
	bull: {
		color: APP_FONT.MEDIUM_EMPHASIS,
		marginHorizontal: 2,
		opacity: 0.3,
	},
});
export default PostStats;
