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
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import { appDimensions } from '../../../../styles/dimensions';
import { Text } from 'react-native';
import { APP_BOTTOM_SHEET_ENUM } from '../../../dhaaga-bottom-sheet/Core';
import {
	useTimelineDispatch,
	useTimelineState,
} from '../../timeline/core/Timeline';
import {
	useAppBottomSheet_TimelineReference,
	useAppManager,
} from '../../../../hooks/utility/global-state-extractors';
import { PostMiddleware } from '../../../../services/middlewares/post.middleware';
import StatusInteraction from './StatusInteraction';

/**
 * Mostly used to remove the border
 * radius and zero in marginTop
 */
type StatusCoreProps = {
	hasParent?: boolean;
	hasBoost?: boolean;
	isPreview?: boolean;
	isPin?: boolean;
};

function StatusController() {
	const { dto } = useAppStatusItem();
	const State = useTimelineState();
	const dispatch = useTimelineDispatch();
	const { show } = useGlobalState(
		useShallow((o) => ({
			show: o.bottomSheet.show,
		})),
	);
	const { attach } = useAppBottomSheet_TimelineReference();
	const { appManager } = useAppManager();

	function onMoreOptionsPress() {
		attach(State, dispatch);
		appManager.storage.setBottomSheetPostActionsTarget(dto);
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

const StatusCore = memo(({ isPreview, isPin }: StatusCoreProps) => {
	const { dto } = useAppStatusItem();
	const { toPost } = useAppNavigator();
	const [ShowSensitiveContent, setShowSensitiveContent] = useState(false);

	const STATUS_DTO = PostMiddleware.getContentTarget(dto);

	const IS_QUOTE_BOOST = PostMiddleware.isQuoteObject(dto);

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

	const { theme, showInspector, appSession } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
			showInspector: o.imageInspectModal.show,
			appSession: o.appSession,
		})),
	);

	function onGalleryInspect() {
		appSession.storage.setPostForMediaInspect(dto as any);
		showInspector(true);
	}

	return useMemo(() => {
		if (!isLoaded) return <StatusItemSkeleton />;

		return (
			<Fragment>
				{isPin && (
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<AppIcon id={'pin'} size={20} color={theme.complementary.a0} />
						<Text
							style={{
								color: theme.complementary.a0,
								marginLeft: 6,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
							}}
						>
							Pinned
						</Text>
					</View>
				)}
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
				<Pressable>
					{isSensitive && !ShowSensitiveContent ? (
						<View></View>
					) : STATUS_DTO.content?.media?.length > 0 ? (
						<Pressable
							style={{
								marginBottom: appDimensions.timelines.sectionBottomMargin,
							}}
							onPress={onGalleryInspect}
						>
							<MediaItem
								attachments={STATUS_DTO.content.media}
								calculatedHeight={STATUS_DTO.calculated.mediaContainerHeight}
							/>
						</Pressable>
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
				{!isPreview && (
					<StatusInteraction openAiContext={null} dto={STATUS_DTO} />
				)}
			</Fragment>
		);
	}, [isLoaded, ShowSensitiveContent, PostContent, dto, STATUS_DTO, theme]);
});

export default StatusCore;
