import {
	useAppAcct,
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { TextParser } from '@dhaaga/core';
import { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { AppText } from '../../lib/Text';
import { Text } from 'react-native';
import ActivitypubService from '../../../services/activitypub.service';

type Props = {
	value: string;
	link: string;
	fontFamily: string;
	mentions: any[];
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
			ActivitypubService.mastodonLike(driver) ||
			ActivitypubService.misskeyLike(driver)
		) {
			console.log(mentions);
			// MastoAPI usually bundles the mentions in post object
			const match = mentions.find((o) =>
				o?.acct?.includes(parsed?.text?.replace('@', '')),
			);
			if (match) {
				setCtx({ userId: match.id });
			} else {
				setCtx({ handle: parsed?.text || value });
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
