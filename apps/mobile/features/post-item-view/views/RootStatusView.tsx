import { Fragment, useState } from 'react';
import useAppNavigator from '#/states/useAppNavigator';
import { withPostItemContext } from '#/components/containers/WithPostItemContext';
import { Pressable, View } from 'react-native';
import MediaItem from '#/ui/media/MediaItem';
import EmojiReactions from '#/components/common/status/fragments/EmojiReactions';
import PostContentWarning from '../components/PostContentWarning';
import PostCreatedBy from '#/components/common/status/fragments/PostCreatedBy';
import { appDimensions } from '#/styles/dimensions';
import { useAppTheme, useImageInspect } from '#/states/global/hooks';
import PostActionButtonRowView from '#/features/post-item-view/views/PostActionButtonRowView';
import StatusQuoted from '#/features/post-item-view/views/StatusQuoted';
import { PostMoreOptionsButton } from '#/components/common/status/_shared';
import { PostInspector } from '@dhaaga/bridge';
import type { PostObjectType } from '@dhaaga/bridge';
import { PinOrnament } from '#/features/post-item-view/components/Ornaments';
import TextAstRendererView from '#/ui/TextAstRendererView';
import { NativeTextBold } from '#/ui/NativeText';
import PostLinkAttachmentListView from '../components/PostLinkAttachmentListView';
import ExplainOutput from '../components/ExplainOutput';

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

type PostFullDetailsProps = {
	dto: PostObjectType;
};

function PostFullDetails({ dto }: PostFullDetailsProps) {
	const { theme } = useAppTheme();
	const POST = PostInspector.getContentTarget(dto);

	return (
		<View
			style={{
				marginTop: appDimensions.timelines.sectionBottomMargin * 4,
				marginHorizontal: 6,
			}}
		>
			<NativeTextBold style={{ color: theme.complementary }}>
				{new Date(POST.createdAt).toLocaleString()}
			</NativeTextBold>
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
	return <>{children}</>;
}

/**
 * This is the root status against which most
 * timeline interactions are performed.
 *
 * @param isPreview
 * @param isPin
 * @param showFullDetails
 * @constructor
 */
function RootStatusView({
	isPreview,
	isPin,
	showFullDetails,
}: StatusCoreProps) {
	const { dto } = withPostItemContext();
	const { toPost } = useAppNavigator();
	const { showInspector, appSession } = useImageInspect();
	const [ShowSensitiveContent, setShowSensitiveContent] = useState(false);

	const _target = PostInspector.getContentTarget(dto);
	const HAS_MEDIA = _target?.content?.media?.length > 0;
	const IS_TRANSLATED = _target?.calculated?.translationOutput;

	const IS_QUOTE_BOOST = PostInspector.isQuoteObject(dto);

	const isSensitive = _target.meta.sensitive;
	const spoilerText = _target.meta.cw;

	function onGalleryInspect() {
		appSession.appManager.storage.setPostForMediaInspect(dto as any);
		showInspector(true);
	}

	return (
		<Fragment>
			<PinOrnament isPinned={isPin} />
			<View
				style={{
					flexDirection: 'row',
					marginBottom: SECTION_MARGIN_BOTTOM * 0.75,
				}}
			>
				<PostCreatedBy post={_target} />
				{!isPreview && (
					<PostMoreOptionsButton
						postId={_target.id}
						createdAt={_target.createdAt}
					/>
				)}
			</View>

			{isSensitive ? (
				<PostContentWarning
					cw={spoilerText}
					show={ShowSensitiveContent}
					setShow={setShowSensitiveContent}
				/>
			) : (
				<View />
			)}

			{/* --- Media Items --- */}
			<HiddenByCw
				visible={isSensitive ? ShowSensitiveContent && HAS_MEDIA : HAS_MEDIA}
			>
				<MediaItem
					attachments={_target.content.media}
					calculatedHeight={_target.calculated.mediaContainerHeight}
					onPress={onGalleryInspect}
					style={{
						marginTop:
							_target.content.media.length > 0
								? SECTION_MARGIN_BOTTOM * 0.5
								: 0,
					}}
				/>
			</HiddenByCw>

			{/* --- Text Content --- */}
			<HiddenByCw visible={isSensitive ? ShowSensitiveContent : true}>
				<Pressable
					onPress={() => {
						toPost(_target.id);
					}}
				>
					<TextAstRendererView
						tree={_target.content.parsed}
						variant={'bodyContent'}
						mentions={_target.calculated.mentions as any}
						emojiMap={_target.calculated.emojis}
					/>
					{IS_TRANSLATED && (
						<ExplainOutput
							additionalInfo={'Translated using DeepL'}
							fromLang={'jp'}
							toLang={'en'}
							text={_target.calculated.translationOutput}
						/>
					)}
				</Pressable>
			</HiddenByCw>

			{/*FIXME: enable for bluesky*/}
			{IS_QUOTE_BOOST && !!dto.boostedFrom && (
				<StatusQuoted post={_target.boostedFrom} />
			)}

			<PostLinkAttachmentListView items={dto.content.links} />
			{/* Lock reactions for preview (to be refactored) */}
			{isPreview ? <View /> : <EmojiReactions dto={_target} />}
			{isPreview ? <View /> : <PostActionButtonRowView />}
			{showFullDetails ? <PostFullDetails dto={dto} /> : <View />}
		</Fragment>
	);
}

export default RootStatusView;
