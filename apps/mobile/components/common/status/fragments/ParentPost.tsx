import { Pressable, View } from 'react-native';
import MediaItem from '../../../../ui/media/MediaItem';
import PostStats from '../PostStats';
import WithAppStatusItemContext from '../../../../hooks/ap-proto/useAppStatusItem';
import StatusQuoted from './StatusQuoted';
import PostCreatedByIconOnly from './PostCreatedByIconOnly';
import type { PostObjectType } from '@dhaaga/bridge';
import { useAppApiClient } from '../../../../hooks/utility/global-state-extractors';
import {
	PostedByTextOneLine,
	ReplyIndicator as ReplyContextLine,
	timelineStyles,
} from '../Fragments';
import { ReplyIndicator } from '../ListView/_shared';
import { TextContentView } from '../TextContentView';
import useAppNavigator from '../../../../states/useAppNavigator';
import { appDimensions } from '../../../../styles/dimensions';

type Props = {
	dto: PostObjectType;
	showReplyIndicator: boolean;
};

function ParentPost({ dto, showReplyIndicator }: Props) {
	const { driver } = useAppApiClient();
	const { toPost } = useAppNavigator();

	const IS_QUOTE_BOOST = dto.meta.isBoost && dto.content.raw;

	function onPressBody() {
		toPost(dto.id);
	}

	return (
		<View>
			{showReplyIndicator && dto.meta.isReply && <ReplyIndicator />}
			<View style={timelineStyles.parentPostRootView}>
				<PostCreatedByIconOnly dto={dto} />
				<View style={timelineStyles.parentPostContentView}>
					<PostedByTextOneLine
						parsedText={dto.postedBy.parsedDisplayName}
						altText={dto.postedBy.handle}
						driver={driver}
						createdAt={dto.createdAt}
					/>
					<MediaItem
						attachments={dto.content.media}
						calculatedHeight={dto.calculated.mediaContainerHeight}
						style={{
							marginTop: appDimensions.timelines.sectionBottomMargin,
						}}
					/>
					<Pressable onPress={onPressBody}>
						<TextContentView
							tree={dto.content.parsed}
							variant={'bodyContent'}
							mentions={dto.calculated.mentions as any}
							emojiMap={dto.calculated.emojis}
						/>
					</Pressable>
					{IS_QUOTE_BOOST && !!dto.boostedFrom && (
						<WithAppStatusItemContext dto={dto.boostedFrom}>
							<StatusQuoted />
						</WithAppStatusItemContext>
					)}
					<PostStats dto={dto} />
				</View>
				<ReplyContextLine />
			</View>
		</View>
	);
}

export default ParentPost;
