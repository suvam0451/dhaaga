import {
	StatusInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { memo } from 'react';
import { styles } from '../segments/_common';
import { LinearGradient } from 'expo-linear-gradient';
import useMfm from '../../../../hooks/useMfm';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { Pressable } from 'react-native';
import useAppNavigator from '../../../../../states/useAppNavigator';

type Props = {
	acct: UserInterface;
	post: StatusInterface;
};

/**
 * Shows a preview of the status being liked/boosted,
 *
 * - upto 3 lines for text-only posts
 */
export const NotificationPostPeek = memo(({ acct, post }: Props) => {
	const { content } = useMfm({
		content: post.getContent(),
		remoteSubdomain: acct.getInstanceUrl(),
		emojiMap: acct.getEmojiMap(),
		deps: [post.getContent()],
		expectedHeight: 20,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
	});

	const { toPost } = useAppNavigator();

	function onPress() {
		toPost(post.getId());
	}

	return (
		<Pressable onPress={onPress}>
			<LinearGradient
				colors={['rgba(0,0,0,0.8)', 'transparent']}
				style={styles.gradientContainerTextOnlyPost}
			>
				{content}
			</LinearGradient>
		</Pressable>
	);
});
