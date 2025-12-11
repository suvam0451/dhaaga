import {
	useActiveUserSession,
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '#/states/global/hooks';
import { PostResolver, TextParser } from '@dhaaga/bridge';
import { AppText } from '../../lib/Text';
import { Text } from 'react-native';
import { ActivityPubService } from '@dhaaga/bridge';
import type { PostMentionObjectType } from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

type Props = {
	value: string;
	link: string;
	fontFamily: string;
	mentions: PostMentionObjectType[];
};

function MentionSegment({ value, link, fontFamily, mentions }: Props) {
	const { driver } = useAppApiClient();
	const { theme } = useAppTheme();
	const { show, setCtx } = useAppBottomSheet();
	const { acct } = useActiveUserSession();

	const parsed = TextParser.mentionTextToHandle(
		value,
		acct.server,
		acct.username,
	);

	function onPress() {
		if (
			ActivityPubService.mastodonLike(driver) ||
			ActivityPubService.misskeyLike(driver)
		) {
			const ctx = PostResolver.mentionItemsToWebfinger(parsed?.text, mentions);
			console.log(ctx, parsed?.text, mentions);
			if (ctx) {
				// FIXME: correct the typing
				setCtx({$type: "user-preview", userId:});
			}
		} else {
			setCtx({
				did: link,
			});
		}
		show(APP_BOTTOM_SHEET_ENUM.PROFILE_PEEK, true);
	}

	return (
		<Text onPress={onPress}>
			<AppText.Normal
				style={{
					fontFamily,
					color: parsed.me ? theme.primary : theme.complementary,
				}}
				onPress={onPress}
			>
				{parsed.text}
			</AppText.Normal>
		</Text>
	);
}

export default MentionSegment;
