import { DriverNotificationType, PostObjectType } from '@dhaaga/bridge';
import useAppNavigator from '#/states/useAppNavigator';
import { View } from 'react-native';
import MediaThumbListPresenter from '#/features/inbox/presenters/MediaThumbListPresenter';
import { PressableDisabledOnSwipe } from '#/ui/Touchable';
import { TextContentView } from '#/components/common/status/TextContentView';
import {
	useAppApiClient,
	useAppTheme,
} from '#/hooks/utility/global-state-extractors';
import AuthorItemPresenter from '#/features/inbox/presenters/AuthorItemPresenter';
import { QuoteOrnament } from '#/features/post-view/components/Ornaments';

type Props = {
	post: PostObjectType;
};

function InboxItemBoostedFrom({ post }: Props) {
	const { toPost } = useAppNavigator();
	const { driver } = useAppApiClient();
	const { theme } = useAppTheme();

	if (!post) return <View />;

	function onPress() {
		toPost(post.id);
	}

	return (
		<View>
			<QuoteOrnament />
			<View
				style={{
					borderWidth: 1.5,
					borderColor: theme.secondary.a50,
					borderRadius: 16,
					padding: 10,
				}}
			>
				<AuthorItemPresenter
					user={post.postedBy}
					notificationType={DriverNotificationType.REPLY}
					createdAt={new Date(post.createdAt)}
				/>
				<MediaThumbListPresenter
					post={post}
					items={post?.content?.media}
					server={driver}
				/>
				<PressableDisabledOnSwipe onPress={onPress}>
					<TextContentView
						tree={post.content.parsed}
						variant={'bodyContent'}
						mentions={post.meta.mentions}
						emojiMap={post.calculated.emojis}
					/>
				</PressableDisabledOnSwipe>
			</View>
		</View>
	);
}

export default InboxItemBoostedFrom;
