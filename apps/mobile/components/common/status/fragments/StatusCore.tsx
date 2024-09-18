import { memo, useMemo, useState } from 'react';
import useAppNavigator from '../../../../states/useAppNavigator';
import WithAppStatusItemContext, {
	useAppStatusItem,
} from '../../../../hooks/ap-proto/useAppStatusItem';
import useMfm from '../../../hooks/useMfm';
import StatusItemSkeleton from '../../../skeletons/StatusItemSkeleton';
import { TouchableOpacity, View } from 'react-native';
import ExplainOutput from '../../explanation/ExplainOutput';
import MediaItem from '../../media/MediaItem';
import EmojiReactions from './EmojiReactions';
import StatusInteraction from './StatusInteraction';
import StatusCw from './StatusCw';
import PostCreatedBy from './PostCreatedBy';
import { APP_FONTS } from '../../../../styles/AppFonts';
import StatusQuoted from './StatusQuoted';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';

/**
 * Mostly used to remove the border
 * radius and zero in marginTop
 */
type StatusCoreProps = {
	hasParent?: boolean;
	hasBoost?: boolean;
	isPreview?: boolean;
};

const APP_SETTING_VERTICAL_MARGIN = 8;

const StatusCore = memo(
	({ hasParent, hasBoost, isPreview }: StatusCoreProps) => {
		const { dto } = useAppStatusItem();
		const { toPost } = useAppNavigator();
		const [ShowSensitiveContent, setShowSensitiveContent] = useState(false);

		const STATUS_DTO = dto.meta.isBoost
			? dto.content.raw
				? dto
				: dto.boostedFrom
			: dto;

		const IS_QUOTE_BOOST = dto?.meta?.isBoost && dto?.content?.raw;

		const IS_REPLY_OR_BOOST =
			STATUS_DTO.meta.isReply ||
			(STATUS_DTO.meta.isBoost && !STATUS_DTO.content.raw);

		const {
			content: PostContent,
			aiContext,
			isLoaded,
		} = useMfm({
			content: STATUS_DTO.content.raw,
			remoteSubdomain: STATUS_DTO.postedBy.instance,
			emojiMap: STATUS_DTO.calculated.emojis,
			deps: [dto],
			emphasis: 'high',
			fontFamily: APP_FONTS.INTER_400_REGULAR,
		});

		const isSensitive = STATUS_DTO.meta.sensitive;
		const spoilerText = STATUS_DTO.meta.cw;

		let paddingTop = IS_REPLY_OR_BOOST ? 4 : 4;
		if (hasParent || hasBoost) paddingTop = 0;
		if (!hasParent && hasBoost) paddingTop = 6;
		const { colorScheme } = useAppTheme();

		return useMemo(() => {
			if (!isLoaded) return <StatusItemSkeleton />;

			return (
				<View
					style={{
						padding: 10,
						paddingHorizontal: APP_SETTING_VERTICAL_MARGIN,
						paddingTop: paddingTop,
						paddingBottom: 4,
						backgroundColor: colorScheme.palette.bg,
						marginBottom: 4,
						borderRadius: 8,
						borderTopLeftRadius: hasParent || hasBoost ? 0 : 8,
						borderTopRightRadius: hasParent || hasBoost ? 0 : 8,
					}}
				>
					<TouchableOpacity
						delayPressIn={100}
						onPress={() => {
							toPost(STATUS_DTO.id);
						}}
					>
						<View>
							<PostCreatedBy dto={dto} style={{ paddingBottom: 6 }} />
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
					{/*FIXME: enable for bluesky*/}
					{IS_QUOTE_BOOST && (
						<WithAppStatusItemContext dto={STATUS_DTO.boostedFrom}>
							<StatusQuoted />
						</WithAppStatusItemContext>
					)}

					{!isPreview && <EmojiReactions dto={STATUS_DTO} />}
					{!isPreview && (
						<StatusInteraction openAiContext={aiContext} dto={STATUS_DTO} />
					)}
				</View>
			);
		}, [
			isLoaded,
			ShowSensitiveContent,
			PostContent,
			dto,
			STATUS_DTO,
			paddingTop,
			colorScheme,
		]);
	},
);

export default StatusCore;
