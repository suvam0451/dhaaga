import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Fragment, useState } from 'react';
import ReplyOwner from '../components/ReplyOwner';
import { AppThemingUtil } from '#/utils/theming.util';
import { appDimensions } from '#/styles/dimensions';
import { ToggleReplyVisibility } from '#/features/post-thread-view/components/_shared';
import WithAppStatusItemContext from '#/components/containers/WithPostItemContext';
import { usePostThreadState } from '@dhaaga/react';
import { NativeTextNormal } from '#/ui/NativeText';
import { AppIcon } from '#/components/lib/Icon';
import TextAstRendererView from '#/ui/TextAstRendererView';

type PostReplyToReplyProps = {
	colors: string[];
	postId: string;
	depth: number;
};

type PostReplyToReplyContentProps = {
	lookupId: string;
	color: string;
	IsReplyThreadVisible: boolean;
	setIsReplyThreadVisible: any;
	style?: StyleProp<ViewStyle>;
};

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

const INDICATOR_LINE_SPACING = 4;

function PostReplyToReplyContent({
	lookupId,
	IsReplyThreadVisible,
	setIsReplyThreadVisible,
	style,
}: PostReplyToReplyContentProps) {
	const data = usePostThreadState();

	const dto = data.lookup.get(lookupId);

	const replyCount = dto.stats.replyCount;
	const mediaCount = dto.content.media.length;

	function toggleReplyVisibility() {
		setIsReplyThreadVisible(!IsReplyThreadVisible);
	}

	return (
		<View style={[{ flex: 1 }, style]}>
			<WithAppStatusItemContext dto={dto}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'flex-start',
						flex: 1,
					}}
				>
					<ReplyOwner dto={dto} style={{ flex: 1 }} />
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							marginLeft: 32,
							flexShrink: 1,
						}}
					>
						<NativeTextNormal style={{ marginRight: 2 }}>
							{dto.stats.likeCount}
						</NativeTextNormal>
						<AppIcon id={'heart'} size={16} />
					</View>
				</View>
				{/* Some magical numbers to get rid of overflow */}
				<TextAstRendererView
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
	postId,
	depth,
}: PostReplyToReplyProps) {
	const data = usePostThreadState();
	const children = (data.children.get(postId) ?? []).map((childId) =>
		data.lookup.get(childId),
	);
	const [IsReplyThreadVisible, setIsReplyThreadVisible] = useState(false);
	const depthIndicator = AppThemingUtil.getThreadColorForDepth(depth + 1);
	return (
		<>
			<View
				style={[
					styles.container,
					{
						paddingLeft: depth * 4 + 8,
					},
				]}
			>
				{colors.map((o, i) => (
					<View
						key={i}
						style={[
							styles.contextLine,
							{
								backgroundColor: o,
								left: i * 4,
							},
						]}
					/>
				))}
				<PostReplyToReplyContent
					color={depthIndicator}
					lookupId={postId}
					IsReplyThreadVisible={IsReplyThreadVisible}
					setIsReplyThreadVisible={setIsReplyThreadVisible}
					style={{ paddingTop: 8 }}
				/>
			</View>
			{IsReplyThreadVisible && (
				<>
					{children.map((o, i) => (
						<ReplyToReplyItemPresenter
							key={i}
							colors={[...colors, depthIndicator]}
							postId={o.id}
							depth={depth + 1}
						/>
					))}
				</>
			)}
		</>
	);
}

export default ReplyToReplyItemPresenter;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		// marginLeft: 6,
		flex: 1,
		position: 'relative',
		width: '100%',
	},
	contextLine: {
		height: '100%',
		position: 'absolute',
		width: 2,
	},
});
