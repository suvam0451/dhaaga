import { View } from 'react-native';
import MediaItem from '../../media/MediaItem';
import PostStats from '../PostStats';
import WithAppStatusItemContext from '../../../../hooks/ap-proto/useAppStatusItem';
import StatusQuoted from './StatusQuoted';
import PostCreatedByIconOnly from './PostCreatedByIconOnly';
import { AppPostObject } from '../../../../types/app-post.types';
import { useAppApiClient } from '../../../../hooks/utility/global-state-extractors';
import {
	PostedByTextOneLine,
	PostTextContent,
	ReplyIndicator,
	timelineStyles,
} from '../Fragments';

type Props = {
	dto: AppPostObject;
};

function ParentPost({ dto }: Props) {
	const { driver } = useAppApiClient();
	const IS_QUOTE_BOOST = dto.meta.isBoost && dto.content.raw;

	return (
		<View style={timelineStyles.parentPostRootView}>
			<PostCreatedByIconOnly dto={dto} />
			<View style={timelineStyles.parentPostContentView}>
				<PostedByTextOneLine
					text={dto.postedBy.displayName}
					driver={driver}
					createdAt={dto.createdAt}
				/>
				<MediaItem
					attachments={dto.content.media}
					calculatedHeight={dto.calculated.mediaContainerHeight}
				/>
				<PostTextContent
					postId={dto.id}
					emojis={dto.calculated.emojis}
					raw={dto.content.raw}
				/>
				{IS_QUOTE_BOOST && !!dto.boostedFrom && (
					<WithAppStatusItemContext dto={dto.boostedFrom}>
						<StatusQuoted />
					</WithAppStatusItemContext>
				)}
				<PostStats />
			</View>
			<ReplyIndicator />
		</View>
	);
}

export default ParentPost;
