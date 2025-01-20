import { useState } from 'react';
import { View } from 'react-native';
import MediaItem from '../../../../../components/common/media/MediaItem';
import ReplyOwner from '../components/ReplyOwner';
import ReplyToReplyItemPresenter from './ReplyToReplyItemPresenter';
import { useAppStatusContextDataContext } from '../../../../../hooks/api/statuses/WithAppStatusContextData';
import { AppThemingUtil } from '../../../../../utils/theming.util';
import { appDimensions } from '../../../../../styles/dimensions';
import {
	ToggleMediaVisibility,
	ToggleReplyVisibility,
} from '../../../../../components/common/status/DetailView/_shared';
import {
	MiniMoreOptionsButton,
	MiniReplyButton,
} from '../../../../../components/common/status/_shared';
import WithAppStatusItemContext from '../../../../../hooks/ap-proto/useAppStatusItem';
import { TextContentView } from '../../../../../components/common/status/TextContentView';

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

type PostReplyProps = {
	lookupId: string;
	colors: string[];
};

function ReplyItemPresenter({ lookupId, colors }: PostReplyProps) {
	const { data, getChildren } = useAppStatusContextDataContext();
	const [IsMediaShown, setIsMediaShown] = useState(false);
	const [IsThreadShown, setIsThreadShown] = useState(false);

	const dto = data.lookup.get(lookupId);
	const children = getChildren(lookupId);

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
		<View
			style={{ paddingHorizontal: 10, marginBottom: SECTION_MARGIN_BOTTOM }}
		>
			<WithAppStatusItemContext dto={dto}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<ReplyOwner dto={dto} style={{ flex: 1 }} />
					<MiniReplyButton post={dto} />
					<MiniMoreOptionsButton post={dto} />
				</View>

				<TextContentView
					tree={dto.content.parsed}
					variant={'bodyContent'}
					mentions={dto.calculated.mentions as any}
					emojiMap={dto.calculated.emojis}
					style={{
						marginBottom: SECTION_MARGIN_BOTTOM,
					}}
				/>
				{IsMediaShown && (
					<MediaItem
						attachments={dto.content.media}
						calculatedHeight={dto.calculated.mediaContainerHeight}
						style={{
							marginBottom: SECTION_MARGIN_BOTTOM,
						}}
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
				<View>
					{children.map((o, i) => (
						<ReplyToReplyItemPresenter
							key={i}
							colors={[...colors, DEPTH_COLOR]}
							lookupId={o.id}
							depth={1}
						/>
					))}
				</View>
			)}
		</View>
	);
}

export default ReplyItemPresenter;
