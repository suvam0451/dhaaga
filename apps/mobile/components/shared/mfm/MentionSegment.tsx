import {
	useAppAcct,
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import {
	PostMentionObjectType,
	PostResolver,
	TextParser,
} from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { AppText } from '../../lib/Text';
import { Text } from 'react-native';
import { ActivityPubService } from '@dhaaga/bridge';

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
	const { acct } = useAppAcct();

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
				setCtx(ctx);
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
					color: parsed.me ? theme.primary.a0 : theme.complementary.a0,
				}}
				onPress={onPress}
			>
				{parsed.text}
			</AppText.Normal>
		</Text>
	);
}

export default MentionSegment;
