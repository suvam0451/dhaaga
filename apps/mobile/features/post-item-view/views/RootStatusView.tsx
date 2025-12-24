import { useState } from 'react';
import useAppNavigator from '#/states/useAppNavigator';
import { withPostItemContext } from '#/components/containers/WithPostItemContext';
import { Pressable, View } from 'react-native';
import MediaItem from '#/ui/media/MediaItem';
import EmojiReactions from '#/components/common/status/fragments/EmojiReactions';
import PostContentWarning from '../components/PostContentWarning';
import { appDimensions } from '#/styles/dimensions';
import { useImageInspect } from '#/states/global/hooks';
import PostActionButtonRowView from '#/features/post-item-view/views/PostActionButtonRowView';
import StatusQuoted from '#/features/post-item-view/views/StatusQuoted';
import { PostMoreOptionsButton } from '#/components/common/status/_shared';
import { PostInspector } from '@dhaaga/bridge';
import { PinOrnament } from '#/features/post-item-view/components/Ornaments';
import TextAstRendererView from '#/ui/TextAstRendererView';
import PostLinkAttachmentListView from '../components/PostLinkAttachmentListView';
import ExplainOutput from '../components/ExplainOutput';
import UserBadge from '#/ui/UserBadge';

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

type HiddenByCwProps = {
	children: any;
	visible: boolean;
};

function HiddenByCw({ children, visible }: HiddenByCwProps) {
	if (!visible) return <View />;
	return <>{children}</>;
}

type Props = {
	isPreview?: boolean;
	isPin?: boolean;
};

/**
 * This is the root status against which most
 * timeline interactions are performed.
 *
 * @param isPreview
 * @param isPin
 * @constructor
 */
function RootStatusView({ isPreview, isPin }: Props) {
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
		<>
			<PinOrnament isPinned={isPin} />
			<View
				style={{
					flexDirection: 'row',
					marginBottom: SECTION_MARGIN_BOTTOM * 0.75,
				}}
			>
				<UserBadge
					userId={_target.postedBy.id}
					avatarUrl={_target.postedBy.avatarUrl}
					displayName={_target.postedBy.displayName}
					parsedDisplayName={_target.postedBy.parsedDisplayName}
					handle={_target.postedBy.handle}
					emojiMap={_target.calculated.emojis}
				/>
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
		</>
	);
}

export default RootStatusView;
