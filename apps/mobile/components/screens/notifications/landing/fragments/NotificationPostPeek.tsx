import { memo } from 'react';
import { Pressable, View } from 'react-native';
import useAppNavigator from '../../../../../states/useAppNavigator';
import { AppPostObject } from '../../../../../types/app-post.types';
import NotificationMediaThumbs from '../../../../common/media/NotificationMediaThumbs';
import { appDimensions } from '../../../../../styles/dimensions';
import { AppUserObject } from '../../../../../types/app-user.types';
import { useAppApiClient } from '../../../../../hooks/utility/global-state-extractors';
import { TextContentView } from '../../../../common/status/TextContentView';
import { PostMiddleware } from '../../../../../services/middlewares/post.middleware';

type Props = {
	acct: AppUserObject;
	post: AppPostObject;
};

/**
 * Shows a preview of the status being liked/boosted,
 *
 * - upto 3 lines for text-only posts
 */
export const NotificationPostPeek = memo(({ acct, post }: Props) => {
	const { driver } = useAppApiClient();
	const { toPost } = useAppNavigator();

	if (!post) return <View />;

	let _post = PostMiddleware.getContentTarget(post);

	function onPress() {
		toPost(post.id);
	}

	return (
		<View>
			<NotificationMediaThumbs
				post={_post}
				items={_post?.content?.media}
				server={driver}
			/>
			<View
				style={{
					marginBottom: appDimensions.timelines.sectionBottomMargin,
				}}
			>
				<Pressable onPress={onPress}>
					<TextContentView
						tree={_post.content.parsed}
						variant={'bodyContent'}
						mentions={_post.calculated.mentions as any}
						emojiMap={_post.calculated.emojis}
					/>
				</Pressable>
			</View>
		</View>
	);
});
