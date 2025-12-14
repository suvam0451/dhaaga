import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import MediaItem from '#/ui/media/MediaItem';
import ReplyOwner from '../components/ReplyOwner';
import ReplyToReplyItemPresenter from './ReplyToReplyItemPresenter';
import { AppThemingUtil } from '#/utils/theming.util';
import { appDimensions } from '#/styles/dimensions';
import {
	ToggleMediaVisibility,
	ToggleReplyVisibility,
} from '#/components/common/status/DetailView/_shared';
import WithAppStatusItemContext from '#/components/containers/WithPostItemContext';
import { usePostThreadState } from '@dhaaga/react';
import { AppIcon } from '#/components/lib/Icon';
import { NativeTextNormal } from '#/ui/NativeText';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import TextAstRendererView from '#/ui/TextAstRendererView';

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

type PostReplyProps = {
	postId: string;
	colors: string[];
};

function Content({ postId, colors }: PostReplyProps) {
	const data = usePostThreadState();
	const [IsMediaShown, setIsMediaShown] = useState(false);
	const [IsThreadShown, setIsThreadShown] = useState(false);

	const dto = data.lookup.get(postId);
	const children = (data.children.get(postId) ?? []).map((childId) =>
		data.lookup.get(childId),
	);

	const replyCount = dto.stats.replyCount;
	const mediaCount = dto.content.media.length;

	function toggleMediaVisibility() {
		setIsMediaShown(!IsMediaShown);
	}

	function toggleReplyVisibility() {
		setIsThreadShown(!IsThreadShown);
	}

	const DEPTH_COLOR = AppThemingUtil.getThreadColorForDepth(0);

	return (
		<View style={{ paddingHorizontal: 10 }}>
			<WithAppStatusItemContext dto={dto}>
				<View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
					<ReplyOwner dto={dto} style={{ flex: 1 }} />
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							marginLeft: 32,
						}}
					>
						<NativeTextNormal style={{ marginRight: 2 }}>
							{dto.stats.likeCount}
						</NativeTextNormal>
						<AppIcon id={'heart'} size={16} />
					</View>
					{/*<MiniMoreOptionsButton post={dto} />*/}
				</View>

				<TextAstRendererView
					tree={dto.content.parsed}
					variant={'bodyContent'}
					mentions={dto.calculated.mentions as any}
					emojiMap={dto.calculated.emojis}
				/>
				{IsMediaShown && (
					<MediaItem
						attachments={dto.content.media}
						calculatedHeight={dto.calculated.mediaContainerHeight}
						style={{
							marginBottom: SECTION_MARGIN_BOTTOM,
						}}
						onPress={() => {}}
					/>
				)}
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-start',
					}}
				>
					<ToggleReplyVisibility
						enabled={replyCount > 0}
						onPress={toggleReplyVisibility}
						expanded={IsThreadShown}
						count={replyCount}
						style={{ marginRight: 4 }}
					/>
					<ToggleMediaVisibility
						enabled={mediaCount > 0}
						onPress={toggleMediaVisibility}
						expanded={IsMediaShown}
						count={mediaCount}
					/>
				</View>
			</WithAppStatusItemContext>
			{/*	Reply Thread*/}
			{IsThreadShown && (
				<>
					{children.map((o, i) => (
						<ReplyToReplyItemPresenter
							key={i}
							colors={[...colors, DEPTH_COLOR]}
							postId={o.id}
							depth={1}
						/>
					))}
				</>
			)}
		</View>
	);
}

function ReplyItem({ postId, colors }: PostReplyProps) {
	function renderRightActions(progress, dragX) {
		return (
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<TouchableOpacity style={{ paddingHorizontal: 16 }}>
					<AppIcon id={'sync-outline'} size={32} />
				</TouchableOpacity>
				<TouchableOpacity style={{ paddingHorizontal: 16 }}>
					<AppIcon id={'chatbox-outline'} size={32} />
				</TouchableOpacity>
				<TouchableOpacity style={{ paddingHorizontal: 16 }}>
					<AppIcon id={'heart'} size={32} />
				</TouchableOpacity>
			</View>
		);
	}
	return (
		<Swipeable
			renderRightActions={renderRightActions}
			overshootLeft={false}
			overshootFriction={8}
		>
			<Content postId={postId} colors={colors} />
		</Swipeable>
	);
}

export default ReplyItem;
