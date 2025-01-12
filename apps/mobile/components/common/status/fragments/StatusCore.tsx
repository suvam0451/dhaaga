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
import { AppIcon } from '../../../lib/Icon';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import { appDimensions } from '../../../../styles/dimensions';
import { Text, StyleSheet } from 'react-native';
import { APP_BOTTOM_SHEET_ENUM } from '../../../dhaaga-bottom-sheet/Core';
import {
	useAppApiClient,
	useAppBottomSheet_Improved,
	useAppPublishers,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { PostMiddleware } from '../../../../services/middlewares/post.middleware';
import StatusInteraction from './StatusInteraction';
import { AppPostObject } from '../../../../types/app-post.types';
import { AppText } from '../../../lib/Text';
import ActivityPubService from '../../../../services/activitypub.service';
import StatusQuoted from './StatusQuoted';

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

/**
 * Mostly used to remove the border
 * radius and zero in marginTop
 */
type StatusCoreProps = {
	hasParent?: boolean;
	hasBoost?: boolean;
	isPreview?: boolean;
	isPin?: boolean;
	showFullDetails?: boolean;
};

function StatusMoreOptionsButton() {
	const { driver } = useAppApiClient();
	const { dto } = useAppStatusItem();
	const { show, setCtx } = useAppBottomSheet_Improved();
	const { postPub } = useAppPublishers();

	function onPress() {
		if (ActivityPubService.misskeyLike(driver)) {
			postPub.finalizeBookmarkState(dto?.uuid).finally(() => {});
		}
		setCtx({ uuid: dto.uuid });
		show(APP_BOTTOM_SHEET_ENUM.MORE_POST_ACTIONS, true);
	}

	return (
		<Pressable style={styles.statusMoreOptionsContainer} onPress={onPress}>
			<View style={styles.statusMoreOptionsButton}>
				<AppIcon
					id={'more-options-vertical'}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A40}
					size={16}
					onPress={onPress}
				/>
			</View>
		</Pressable>
	);
}

function PinIndicator() {
	const { theme } = useAppTheme();
	return (
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
	);
}

type PostFullDetailsProps = {
	dto: AppPostObject;
};
function PostFullDetails({ dto }: PostFullDetailsProps) {
	const { theme } = useAppTheme();
	const POST = PostMiddleware.getContentTarget(dto);

	return (
		<View
			style={{
				marginTop: appDimensions.timelines.sectionBottomMargin * 4,
				marginHorizontal: 6,
			}}
		>
			<AppText.Medium style={{ color: theme.complementary.a0 }}>
				{new Date(POST.createdAt).toLocaleString()}
			</AppText.Medium>
		</View>
	);
}

function HiddenByCw({
	children,
	visible,
}: {
	children: any;
	visible: boolean;
}) {
	if (!visible) return <View />;
	return <Fragment>{children}</Fragment>;
}

const StatusCore = memo(
	({ isPreview, isPin, showFullDetails }: StatusCoreProps) => {
		const { dto } = useAppStatusItem();
		const { toPost } = useAppNavigator();
		const { showInspector, appSession } = useGlobalState(
			useShallow((o) => ({
				showInspector: o.imageInspectModal.show,
				appSession: o.appSession,
			})),
		);
		const [ShowSensitiveContent, setShowSensitiveContent] = useState(false);

		const _target = PostMiddleware.getContentTarget(dto);
		const HAS_MEDIA = _target?.content?.media?.length > 0;
		const IS_TRANSLATED = _target?.calculated?.translationOutput;

		const IS_QUOTE_BOOST = PostMiddleware.isQuoteObject(dto);
		const HAS_TEXT_CONTENT = !!_target?.content?.raw;

		const { content: PostContent, isLoaded } = useMfm({
			content: _target?.content?.raw,
			emojiMap: _target?.calculated?.emojis,
			emphasis: APP_COLOR_PALETTE_EMPHASIS.A10, // fontFamily: APP_FONTS.INTER_400_REGULAR
		});

		const isSensitive = _target.meta.sensitive;
		const spoilerText = _target.meta.cw;

		function onGalleryInspect() {
			appSession.storage.setPostForMediaInspect(dto as any);
			showInspector(true);
		}

		return useMemo(() => {
			if (!isLoaded) return <StatusItemSkeleton />;
			return (
				<Fragment>
					{isPin && <PinIndicator />}
					<View
						style={{
							flexDirection: 'row',
							marginBottom: SECTION_MARGIN_BOTTOM,
						}}
					>
						<PostCreatedBy
							style={{
								paddingBottom: 4,
								flex: 1,
							}}
						/>
						{!isPreview && <StatusMoreOptionsButton />}
					</View>

					{isSensitive && (
						<StatusCw
							cw={spoilerText}
							show={ShowSensitiveContent}
							setShow={setShowSensitiveContent}
						/>
					)}

					{/* --- Media Items --- */}
					<HiddenByCw
						visible={
							isSensitive ? ShowSensitiveContent && HAS_MEDIA : HAS_MEDIA
						}
					>
						<Pressable onPress={onGalleryInspect}>
							<MediaItem
								attachments={_target.content.media}
								calculatedHeight={_target.calculated.mediaContainerHeight}
							/>
						</Pressable>
					</HiddenByCw>

					{/* --- Text Content --- */}
					<HiddenByCw visible={isSensitive ? ShowSensitiveContent : true}>
						<Pressable
							style={{
								marginBottom: SECTION_MARGIN_BOTTOM,
							}}
							onPress={() => {
								toPost(_target.id);
							}}
						>
							{HAS_TEXT_CONTENT ? PostContent : <View />}
							{IS_TRANSLATED && (
								<ExplainOutput
									additionalInfo={'Translated using OpenAI'}
									fromLang={'jp'}
									toLang={'en'}
									text={_target.calculated.translationOutput}
								/>
							)}
						</Pressable>
					</HiddenByCw>

					{/*FIXME: enable for bluesky*/}
					{IS_QUOTE_BOOST && !!dto.boostedFrom && (
						<WithAppStatusItemContext dto={_target.boostedFrom}>
							<StatusQuoted />
						</WithAppStatusItemContext>
					)}

					{/* Lock reactions for preview (to be refactored) */}
					{!isPreview && <EmojiReactions dto={_target} />}
					{!isPreview && <StatusInteraction />}
					{showFullDetails && <PostFullDetails dto={dto} />}
				</Fragment>
			);
		}, [ShowSensitiveContent, PostContent, _target]);
	},
);

export default StatusCore;

const styles = StyleSheet.create({
	statusMoreOptionsContainer: {
		justifyContent: 'flex-start',
		flexDirection: 'row',
		alignItems: 'flex-start',
		flexShrink: 1,
		height: '100%',
		paddingRight: 8,
		paddingTop: 4,
	},
	statusMoreOptionsButton: {
		height: '100%',
		paddingTop: 4,
		paddingLeft: 16,
	},
});
