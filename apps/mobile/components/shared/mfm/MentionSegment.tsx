import {
	useAppAcct,
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { TextParserService } from '../../../services/text-parser.service';
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

	const parsed = TextParserService.mentionTextToHandle(value, acct);

	function onPress() {
		if (
			ActivitypubService.mastodonLike(driver) ||
			ActivitypubService.misskeyLike(driver)
		) {
			// MastoAPI usually bundles the mentions in post object
			const match = mentions.find((o) =>
				o.handle.includes(parsed?.text?.replace('@', '')),
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
					color: parsed.me ? theme.primary.a0 : theme.complementaryB.a0,
				}}
				onPress={onPress}
			>
				{parsed.text}
			</AppText.Normal>
		</Text>
	);
}

export default MentionSegment;
