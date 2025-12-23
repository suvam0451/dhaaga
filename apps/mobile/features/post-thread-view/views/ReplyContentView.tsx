import UserBadge from '#/ui/UserBadge';
import { NativeTextNormal } from '#/ui/NativeText';
import { AppIcon } from '#/components/lib/Icon';
import TextAstRendererView from '#/ui/TextAstRendererView';
import MediaItem from '#/ui/media/MediaItem';
import { ToggleReplyVisibility } from '#/features/post-thread-view/components/_shared';
import WithAppStatusItemContext, {
	withPostItemContext,
} from '#/components/containers/WithPostItemContext';
import { PostObjectType } from '@dhaaga/bridge';
import { usePostEventBusStore } from '#/hooks/pubsub/usePostEventBus';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import useAppNavigator from '#/states/useAppNavigator';
import useSheetNavigation from '#/states/navigation/useSheetNavigation';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useAppTheme } from '#/states/global/hooks';

type GeneratorProps = {
	setIsReplyThreadVisible: any;
	IsThreadShown: boolean;
};

function Generator({ setIsReplyThreadVisible, IsThreadShown }: GeneratorProps) {
	const { dto } = withPostItemContext();
	const { toProfile } = useAppNavigator();
	const { openUserProfileSheet } = useSheetNavigation();
	const { theme } = useAppTheme();

	if (!dto) return <View />;

	const authorId = dto?.postedBy?.id;
	const replyCount = dto.stats.replyCount;

	function toggleReplyVisibility() {
		setIsReplyThreadVisible((o) => !o);
	}

	function onAvatarClicked() {
		openUserProfileSheet(authorId);
	}

	function onProfileClicked() {
		toProfile(authorId);
	}

	return (
		<View style={{ backgroundColor: theme.background.a0, borderRadius: 12 }}>
			<View style={[styles.root, {}]}>
				<UserBadge
					avatarUrl={dto.postedBy.avatarUrl}
					displayName={dto.postedBy.displayName}
					handle={dto.postedBy.handle}
					style={{ marginBottom: 6 }}
					onAvatarPressed={onAvatarClicked}
					onDisplayNamePressed={onProfileClicked}
				/>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginLeft: 32,
					}}
				>
					<NativeTextNormal style={{ marginRight: 2 }}>
						{dto.stats.likeCount}
					</NativeTextNormal>
					<AppIcon id={'heart'} size={16} />
				</View>
			</View>

			<TextAstRendererView
				tree={dto.content.parsed}
				variant={'bodyContent'}
				mentions={dto.calculated.mentions as any}
				emojiMap={dto.calculated.emojis}
			/>
			<MediaItem
				attachments={dto.content.media}
				calculatedHeight={dto.calculated.mediaContainerHeight}
				style={{
					marginBottom: appDimensions.timelines.sectionBottomMargin,
				}}
				onPress={() => {}}
			/>
			<ToggleReplyVisibility
				enabled={replyCount > 0}
				onPress={toggleReplyVisibility}
				expanded={IsThreadShown}
				count={replyCount}
				style={{ marginRight: 4 }}
			/>
		</View>
	);
}

function WithSwipeActions(props: GeneratorProps) {
	const { theme } = useAppTheme();
	function renderRightActions(progress, dragX) {
		return (
			<View
				style={[
					styles.swipeActionsContainer,
					{ backgroundColor: theme.background.a30 },
				]}
			>
				<TouchableOpacity style={{ paddingHorizontal: 16 }}>
					<AppIcon id={'heart-outline'} size={32} />
				</TouchableOpacity>
				<TouchableOpacity style={{ paddingHorizontal: 16 }}>
					<AppIcon id={'chatbox-outline'} size={32} />
				</TouchableOpacity>
				<TouchableOpacity style={{ paddingHorizontal: 16 }}>
					<AppIcon id={'sync-outline'} size={32} />
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<Swipeable
			renderRightActions={renderRightActions}
			overshootLeft={false}
			overshootFriction={8}
		>
			<Generator {...props} />
		</Swipeable>
	);
}

type Props = {
	post: PostObjectType;
	setIsReplyThreadVisible: any;
	IsThreadShown: boolean;
};

function ReplyContentView(props: Props) {
	const { post: _post } = usePostEventBusStore(props.post);

	return (
		<WithAppStatusItemContext dto={_post}>
			<WithSwipeActions {...props} />
		</WithAppStatusItemContext>
	);
}

export default ReplyContentView;

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		overflow: 'visible',
	},
	swipeActionsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 12,
		marginLeft: 10,
	},
});
