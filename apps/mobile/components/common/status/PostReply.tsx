import { useState } from 'react';
import { View } from 'react-native';
import ExplainOutput from '../explanation/ExplainOutput';
import MediaItem from '../media/MediaItem';
import useMfm from '../../hooks/useMfm';
import ReplyOwner from '../user/ReplyOwner';
import PostReplyToReply from './PostReplyToReply';
import { useAppStatusContextDataContext } from '../../../hooks/api/statuses/WithAppStatusContextData';
import {
	APP_COLOR_PALETTE_EMPHASIS,
	AppThemingUtil,
} from '../../../utils/theming.util';
import { APP_FONTS } from '../../../styles/AppFonts';
import { appDimensions } from '../../../styles/dimensions';
import {
	ToggleMediaVisibility,
	ToggleReplyVisibility,
} from './DetailView/_shared';
import { MiniMoreOptionsButton, MiniReplyButton } from './_shared';
import WithAppStatusItemContext from '../../../hooks/ap-proto/useAppStatusItem';

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

type PostReplyProps = {
	lookupId: string;
	colors: string[];
};

function PostReplyContent({ lookupId, colors }: PostReplyProps) {
	const { data, getChildren } = useAppStatusContextDataContext();

	const [ExplanationObject, setExplanationObject] = useState<string | null>(
		null,
	);

	const dto = data.lookup.get(lookupId);
	const children = getChildren(lookupId);

	const { content } = useMfm({
		content: dto.content.raw,
		emojiMap: dto.calculated.emojis as any,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A10,
	});

	const [IsMediaShown, setIsMediaShown] = useState(false);
	const [IsReplyThreadVisible, setIsReplyThreadVisible] = useState(false);

	const replyCount = dto.stats.replyCount;
	const mediaCount = dto.content.media.length;

	function toggleMediaVisibility() {
		setIsMediaShown(!IsMediaShown);
	}

	function toggleReplyVisibility() {
		setIsReplyThreadVisible(!IsReplyThreadVisible);
	}

	const DEPTH_COLOR = AppThemingUtil.getThreadColorForDepth(0);

	return (
		<View
			style={{ paddingHorizontal: 10, marginBottom: SECTION_MARGIN_BOTTOM * 4 }}
		>
			<WithAppStatusItemContext dto={dto}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<ReplyOwner dto={dto} style={{ flex: 1 }} />
					<MiniReplyButton post={dto} />
					<MiniMoreOptionsButton post={dto} />
				</View>

				<View style={{ marginBottom: SECTION_MARGIN_BOTTOM }}>{content}</View>
				{ExplanationObject !== null && (
					<ExplainOutput
						additionalInfo={'Translated using OpenAI'}
						fromLang={'jp'}
						toLang={'en'}
						text={ExplanationObject}
					/>
				)}
				{IsMediaShown && (
					<MediaItem
						attachments={dto.content.media}
						calculatedHeight={dto.calculated.mediaContainerHeight}
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
						expanded={IsReplyThreadVisible}
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
			{IsReplyThreadVisible && (
				<View>
					{children.map((o, i) => (
						<PostReplyToReply
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

export default PostReplyContent;
