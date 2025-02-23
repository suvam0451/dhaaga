import { Fragment, useState } from 'react';
import useAppNavigator from '../../../../states/useAppNavigator';
import WithAppStatusItemContext, {
	useAppStatusItem,
} from '../../../../hooks/ap-proto/useAppStatusItem';
import { Pressable, View } from 'react-native';
import ExplainOutput from '../../explanation/ExplainOutput';
import MediaItem from '../../media/MediaItem';
import EmojiReactions from './EmojiReactions';
import StatusCw from './StatusCw';
import PostCreatedBy from './PostCreatedBy';
import { AppIcon } from '../../../lib/Icon';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { appDimensions } from '../../../../styles/dimensions';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import StatusInteraction from './StatusInteraction';
import { AppText } from '../../../lib/Text';
import StatusQuoted from './StatusQuoted';
import { PostMoreOptionsButton } from '../_shared';
import { TextContentView } from '../TextContentView';
import { PostInspector } from '@dhaaga/bridge';
import type { PostObjectType } from '@dhaaga/bridge';

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

function PinIndicator() {
	const { theme } = useAppTheme();
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			<AppIcon id={'pin'} size={20} color={theme.complementary.a0} />
			<AppText.Medium
				style={{
					color: theme.complementary.a0,
					marginLeft: 6,
				}}
			>
				Pinned
			</AppText.Medium>
		</View>
	);
}

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

function StatusCore({ isPreview, isPin, showFullDetails }: StatusCoreProps) {
	const { dto } = useAppStatusItem();
	const { toPost } = useAppNavigator();
	const { showInspector, appSession } = useGlobalState(
		useShallow((o) => ({
			showInspector: o.imageInspectModal.show,
			appSession: o.appSession,
		})),
	);
	const [ShowSensitiveContent, setShowSensitiveContent] = useState(false);

	const _target = PostInspector.getContentTarget(dto);
	const HAS_MEDIA = _target?.content?.media?.length > 0;
	const IS_TRANSLATED = _target?.calculated?.translationOutput;

	const IS_QUOTE_BOOST = PostInspector.isQuoteObject(dto);

	const isSensitive = _target.meta.sensitive;
	const spoilerText = _target.meta.cw;

	function onGalleryInspect() {
		appSession.storage.setPostForMediaInspect(dto as any);
		showInspector(true);
	}

	return (
		<Fragment>
			{isPin && <PinIndicator />}
			<View
				style={{
					flexDirection: 'row',
					marginBottom: SECTION_MARGIN_BOTTOM * 0.5,
				}}
			>
				<PostCreatedBy
					style={{
						flex: 1,
					}}
				/>
				{!isPreview && <PostMoreOptionsButton post={_target} />}
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
				visible={isSensitive ? ShowSensitiveContent && HAS_MEDIA : HAS_MEDIA}
			>
				<Pressable
					onPress={onGalleryInspect}
					style={{
						marginTop:
							_target.content.media.length > 0
								? SECTION_MARGIN_BOTTOM * 0.5
								: 0,
					}}
				>
					<MediaItem
						attachments={_target.content.media}
						calculatedHeight={_target.calculated.mediaContainerHeight}
					/>
				</Pressable>
			</HiddenByCw>

			{/* --- Text Content --- */}
			<HiddenByCw visible={isSensitive ? ShowSensitiveContent : true}>
				<Pressable
					onPress={() => {
						toPost(_target.id);
					}}
				>
					<TextContentView
						tree={_target.content.parsed}
						variant={'bodyContent'}
						mentions={_target.calculated.mentions as any}
						emojiMap={_target.calculated.emojis}
					/>
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
}

export default StatusCore;
