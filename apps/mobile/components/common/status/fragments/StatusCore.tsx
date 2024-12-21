import { Fragment, memo, useMemo, useState } from 'react';
import useAppNavigator from '../../../../states/useAppNavigator';
import WithAppStatusItemContext, {
	useAppStatusItem,
} from '../../../../hooks/ap-proto/useAppStatusItem';
import useMfm from '../../../hooks/useMfm';
import StatusItemSkeleton from '../../../skeletons/StatusItemSkeleton';
import { Pressable, View } from 'react-native';
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
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import { appDimensions } from '../../../../styles/dimensions';

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
	const { show, setPostValue, setReducer, theme } = useGlobalState(
		useShallow((o) => ({
			show: o.bottomSheet.show,
			setPostValue: o.bottomSheet.setPostValue,
			setReducer: o.bottomSheet.setTimelineDataPostListReducer,
			theme: o.colorScheme,
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
	}

	return (
		<View
			style={{
				justifyContent: 'flex-start',
				flexDirection: 'row',
				alignItems: 'flex-start',
				flexShrink: 1,
				height: '100%',
			}}
		>
			<Pressable
				style={{
					height: '100%',
					paddingTop: 4,
					paddingLeft: 16,
				}}
				onPress={onMoreOptionsPress}
			>
				<AppIcon
					id={'ellipsis-v'}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A40}
					size={20}
				/>
			</Pressable>
		</View>
	);
}

const StatusCore = memo(({ isPreview }: StatusCoreProps) => {
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
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A10,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
	});

	const isSensitive = STATUS_DTO.meta.sensitive;
	const spoilerText = STATUS_DTO.meta.cw;

	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	return useMemo(() => {
		if (!isLoaded) return <StatusItemSkeleton />;

		return (
			<Fragment>
				<View
					style={{
						flexDirection: 'row',
						marginBottom: appDimensions.timelines.sectionBottomMargin,
					}}
				>
					<PostCreatedBy
						dto={dto}
						style={{
							paddingBottom: 4,
							flex: 1,
							overflowX: 'hidden',
						}}
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

				{/* --- Media Items --- */}
				<Pressable onPress={() => {}}>
					{isSensitive && !ShowSensitiveContent ? (
						<View></View>
					) : STATUS_DTO.content?.media?.length > 0 ? (
						<View
							style={{
								marginBottom: appDimensions.timelines.sectionBottomMargin,
							}}
						>
							<MediaItem
								attachments={STATUS_DTO.content.media}
								calculatedHeight={STATUS_DTO.calculated.mediaContainerHeight}
							/>
						</View>
					) : (
						<View />
					)}
				</Pressable>

				{/* --- Text Content --- */}
				<Pressable
					onPress={() => {
						toPost(STATUS_DTO.id);
					}}
				>
					{isSensitive && !ShowSensitiveContent ? (
						<View />
					) : (
						<View
							style={{
								marginBottom: appDimensions.timelines.sectionBottomMargin,
							}}
						>
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

					{/*FIXME: enable for bluesky*/}
					{IS_QUOTE_BOOST && (
						<WithAppStatusItemContext dto={STATUS_DTO.boostedFrom}>
							<StatusQuoted />
						</WithAppStatusItemContext>
					)}
				</Pressable>

				{!isPreview && <EmojiReactions dto={STATUS_DTO} />}
				{/*{!isPreview && (*/}
				{/*	<StatusInteraction openAiContext={aiContext} dto={STATUS_DTO} />*/}
				{/*)}*/}
			</Fragment>
		);
	}, [isLoaded, ShowSensitiveContent, PostContent, dto, STATUS_DTO, theme]);
});

export default StatusCore;
