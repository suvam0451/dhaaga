import { Fragment, memo, useMemo, useState } from 'react';
import useAppNavigator from '../../../../states/useAppNavigator';
import WithAppStatusItemContext, {
	useAppStatusItem,
} from '../../../../hooks/ap-proto/useAppStatusItem';
import useMfm from '../../../hooks/useMfm';
import StatusItemSkeleton from '../../../skeletons/StatusItemSkeleton';
import { View, TouchableOpacity } from 'react-native';
import ExplainOutput from '../../explanation/ExplainOutput';
import MediaItem from '../../media/MediaItem';
import EmojiReactions from './EmojiReactions';
import StatusCw from './StatusCw';
import PostCreatedBy from './PostCreatedBy';
import { APP_FONTS } from '../../../../styles/AppFonts';
import StatusQuoted from './StatusQuoted';
import { AppIcon } from '../../../lib/Icon';
import useGlobalState, {
	APP_BOTTOM_SHEET_ENUM,
} from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { useAppTimelinePosts } from '../../../../hooks/app/timelines/useAppTimelinePosts';

/**
 * Mostly used to remove the border
 * radius and zero in marginTop
 */
type StatusCoreProps = {
	hasParent?: boolean;
	hasBoost?: boolean;
	isPreview?: boolean;
};

function StatusController() {
	const { dto } = useAppStatusItem();
	const { show, setPostValue, setReducer } = useGlobalState(
		useShallow((o) => ({
			show: o.bottomSheet.show,
			setPostValue: o.bottomSheet.setPostValue,
			setReducer: o.bottomSheet.setTimelineDataPostListReducer,
		})),
	);
	const { getPostListReducer } = useAppTimelinePosts();

	const STATUS_DTO = dto.meta.isBoost
		? dto.content.raw
			? dto
			: dto.boostedFrom
		: dto;

	function onMoreOptionsPress() {
		setPostValue(STATUS_DTO);
		setReducer(getPostListReducer());
		show(APP_BOTTOM_SHEET_ENUM.MORE_POST_ACTIONS);
		console.log('saved state');
	}

	return (
		<View
			style={{
				flexShrink: 1,
				maxWidth: 256,
				justifyContent: 'flex-start',
			}}
		>
			<TouchableOpacity onPress={onMoreOptionsPress} style={{ paddingTop: 4 }}>
				<AppIcon id={'ellipsis-v'} emphasis={'medium'} />
			</TouchableOpacity>
		</View>
	);
}

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

		const { content: PostContent, isLoaded } = useMfm({
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
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);

		return useMemo(() => {
			if (!isLoaded) return <StatusItemSkeleton />;

			return (
				<Fragment>
					<TouchableOpacity
						delayPressIn={150}
						onPress={() => {
							toPost(STATUS_DTO.id);
						}}
					>
						<View>
							<View style={{ flexDirection: 'row' }}>
								<PostCreatedBy
									dto={dto}
									style={{ paddingBottom: 6, flex: 1, overflowX: 'hidden' }}
								/>
								<StatusController />
							</View>

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
					{/*{!isPreview && (*/}
					{/*	<StatusInteraction openAiContext={aiContext} dto={STATUS_DTO} />*/}
					{/*)}*/}
				</Fragment>
			);
		}, [
			isLoaded,
			ShowSensitiveContent,
			PostContent,
			dto,
			STATUS_DTO,
			paddingTop,
			theme,
		]);
	},
);

export default StatusCore;
