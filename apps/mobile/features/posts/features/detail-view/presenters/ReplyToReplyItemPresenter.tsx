import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Fragment, useState } from 'react';
import ReplyOwner from '../components/ReplyOwner';
import { useAppStatusContextDataContext } from '../../../../../hooks/api/statuses/WithAppStatusContextData';
import { AppThemingUtil } from '../../../../../utils/theming.util';
import { appDimensions } from '../../../../../styles/dimensions';
import { ToggleReplyVisibility } from '../../../../../components/common/status/DetailView/_shared';
import {
	MiniMoreOptionsButton,
	MiniReplyButton,
} from '../../../../../components/common/status/_shared';
import WithAppStatusItemContext from '../../../../../hooks/ap-proto/useAppStatusItem';
import { TextContentView } from '../../../../../components/common/status/TextContentView';
import CurvedLine from '../components/CurvedLine';

type PostReplyToReplyProps = {
	colors: string[];
	lookupId: string;
	depth: number;
	last: boolean;
};

type PostReplyToReplyContentProps = {
	lookupId: string;
	color: string;
	IsReplyThreadVisible: boolean;
	setIsReplyThreadVisible: any;
	style?: StyleProp<ViewStyle>;
};

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

const INDICATOR_LINE_SPACING = 10;

function PostReplyToReplyContent({
	lookupId,
	IsReplyThreadVisible,
	setIsReplyThreadVisible,
	style,
}: PostReplyToReplyContentProps) {
	const { data } = useAppStatusContextDataContext();

	const dto = data.lookup.get(lookupId);

	const replyCount = dto.stats.replyCount;
	const mediaCount = dto.content.media.length;

	function toggleReplyVisibility() {
		setIsReplyThreadVisible(!IsReplyThreadVisible);
	}

	return (
		<View
			style={[
				{
					width: '100%',
					paddingTop: 8,
					paddingHorizontal: 8,
				},
				style,
			]}
		>
			<WithAppStatusItemContext dto={dto}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<ReplyOwner dto={dto} style={{ flex: 1 }} />
					<MiniReplyButton post={dto} />
					<MiniMoreOptionsButton post={dto} />
				</View>
				{/* Some magical numbers to get rid of overflow */}
				<TextContentView
					tree={dto.content.parsed}
					variant={'bodyContent'}
					mentions={dto.calculated.mentions as any}
					emojiMap={dto.calculated.emojis}
					style={{
						marginBottom: SECTION_MARGIN_BOTTOM,
					}}
				/>
				<ToggleReplyVisibility
					enabled={replyCount > 0}
					onPress={toggleReplyVisibility}
					expanded={IsReplyThreadVisible}
					count={replyCount}
					style={{ marginRight: 4 }}
				/>
			</WithAppStatusItemContext>
		</View>
	);
}

function ReplyToReplyItemPresenter({
	colors,
	lookupId,
	depth,
	last,
}: PostReplyToReplyProps) {
	const { getChildren } = useAppStatusContextDataContext();
	const children = getChildren(lookupId);
	const [IsReplyThreadVisible, setIsReplyThreadVisible] = useState(false);
	const depthIndicator = AppThemingUtil.getThreadColorForDepth(depth + 1);
	return (
		<Fragment>
			<View style={[styles.container]}>
				{colors.map((o, i) => (
					<View
						key={i}
						style={[
							styles.contextLine,
							{
								backgroundColor: o,
								height:
									i === colors.length - 1 && last && !IsReplyThreadVisible
										? 4
										: '100%',
							},
						]}
					/>
				))}
				<View
					style={{
						position: 'absolute',
						left: (colors.length - 1) * (INDICATOR_LINE_SPACING + 2),
						zIndex: -1,
					}}
				>
					<CurvedLine color={colors[colors.length - 1]} />
				</View>

				<PostReplyToReplyContent
					color={depthIndicator}
					lookupId={lookupId}
					IsReplyThreadVisible={IsReplyThreadVisible}
					setIsReplyThreadVisible={setIsReplyThreadVisible}
					style={{ marginLeft: -INDICATOR_LINE_SPACING }}
				/>
			</View>
			{IsReplyThreadVisible && (
				<View>
					{children.map((o, i) => (
						<ReplyToReplyItemPresenter
							key={i}
							colors={[...colors, depthIndicator]}
							lookupId={o.id}
							depth={1}
							last={i === children.length - 1}
						/>
					))}
				</View>
			)}
		</Fragment>
	);
}

export default ReplyToReplyItemPresenter;

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		marginLeft: 6,
	},
	contextLine: {
		height: '100%',
		width: 2,
		marginRight: INDICATOR_LINE_SPACING,
	},
});
