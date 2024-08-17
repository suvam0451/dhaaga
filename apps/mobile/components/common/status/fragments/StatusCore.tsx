import { memo, useMemo, useState } from 'react';
import useAppNavigator from '../../../../states/useAppNavigator';
import WithAppStatusItemContext, {
	useAppStatusItem,
} from '../../../../hooks/ap-proto/useAppStatusItem';
import useMfm from '../../../hooks/useMfm';
import StatusItemSkeleton from '../../../skeletons/StatusItemSkeleton';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import StatusPostedBy from './StatusPostedBy';
import ExplainOutput from '../../explanation/ExplainOutput';
import MediaItem from '../../media/MediaItem';
import EmojiReactions from './EmojiReactions';
import StatusInteraction from './StatusInteraction';
import StatusQuoted from './StatusQuoted';
import StatusCw from './StatusCw';

const StatusCore = memo(() => {
	const { dto } = useAppStatusItem();
	const { toPost } = useAppNavigator();
	const [ShowSensitiveContent, setShowSensitiveContent] = useState(false);

	const IS_REPLY_OR_BOOST =
		dto.meta.isReply || (dto.meta.isBoost && !dto.content.raw);
	const IS_QUOTE_BOOST = dto.meta.isBoost && dto.content.raw;

	const STATUS_DTO = dto.meta.isBoost
		? dto.content.raw
			? dto
			: dto.boostedFrom
		: dto;

	const {
		content: PostContent,
		aiContext,
		isLoaded,
	} = useMfm({
		content: STATUS_DTO.content.raw,
		remoteSubdomain: STATUS_DTO.postedBy.instance,
		emojiMap: STATUS_DTO.calculated.emojis as any,
		deps: [dto],
	});

	const isSensitive = STATUS_DTO.meta.sensitive;
	const spoilerText = STATUS_DTO.meta.cw;

	return useMemo(() => {
		if (!isLoaded) return <StatusItemSkeleton />;

		return (
			<View
				style={{
					padding: 10,
					paddingTop: IS_REPLY_OR_BOOST ? 4 : 10,
					paddingBottom: 4,
					backgroundColor: APP_THEME.DARK_THEME_STATUS_BG,
					marginBottom: 4,
					borderRadius: 8,
					borderTopLeftRadius: IS_REPLY_OR_BOOST ? 0 : 8,
					borderTopRightRadius: IS_REPLY_OR_BOOST ? 0 : 8,
				}}
			>
				<TouchableOpacity
					delayPressIn={100}
					onPress={() => {
						toPost(dto.id);
					}}
				>
					<View>
						<StatusPostedBy />
						{isSensitive && (
							<StatusCw
								cw={spoilerText}
								show={ShowSensitiveContent}
								setShow={setShowSensitiveContent}
							/>
						)}

						{isSensitive && !ShowSensitiveContent ? (
							<View></View>
						) : (
							<View style={{ height: 'auto' }}>
								{PostContent}
								{dto.calculated.translationOutput && (
									<ExplainOutput
										additionalInfo={'Translated using OpenAI'}
										fromLang={'jp'}
										toLang={'en'}
										text={dto.calculated.translationOutput}
									/>
								)}
							</View>
						)}
					</View>
				</TouchableOpacity>
				{isSensitive && !ShowSensitiveContent ? (
					<View></View>
				) : (
					<MediaItem
						attachments={STATUS_DTO.content.media}
						calculatedHeight={STATUS_DTO.calculated.mediaContainerHeight}
					/>
				)}
				{IS_QUOTE_BOOST && (
					<WithAppStatusItemContext dto={dto.boostedFrom}>
						<StatusQuoted />
					</WithAppStatusItemContext>
				)}
				<EmojiReactions />
				<StatusInteraction openAiContext={aiContext} />
			</View>
		);
	}, [isLoaded, ShowSensitiveContent, PostContent, dto]);
});

const styles = StyleSheet.create({
	toggleHideContainer: {
		marginHorizontal: 'auto',
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		width: '100%',
		marginBottom: 8,
	},
	toggleHideText: {
		color: APP_FONT.MONTSERRAT_BODY,
		flexShrink: 1,
		textAlign: 'center',
		fontSize: 16,
		fontFamily: 'Montserrat-Bold',
	},
	toggleHidePressableAreaContainer: {
		flexShrink: 1,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 8,
	},
});

export default StatusCore;
