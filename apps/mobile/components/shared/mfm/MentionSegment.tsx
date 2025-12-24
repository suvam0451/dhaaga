import {
	useActiveUserSession,
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '#/states/global/hooks';
import { PostViewer, TextParser } from '@dhaaga/bridge';
import { Text } from 'react-native';
import type { PostMentionObjectType } from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { NativeTextBold } from '#/ui/NativeText';
import { DriverService } from '@dhaaga/bridge';

type Props = {
	value: string;
	link: string;
	mentions: PostMentionObjectType[];
};

function MentionSegment({ value, mentions }: Props) {
	const { driver } = useAppApiClient();
	const { theme } = useAppTheme();
	const { show } = useAppBottomSheet();
	const { acct } = useActiveUserSession();

	const parsed = TextParser.mentionTextToHandle(
		value,
		acct.server,
		acct.username,
	);

	function onPress() {
		if (DriverService.supportsAtProto(driver)) {
			show(APP_BOTTOM_SHEET_ENUM.USER_PREVIEW, true, {
				$type: 'user-preview',
				use: 'handle',
				handle: value,
			});
		}

		const ctx = PostViewer.mentionItemsToWebfinger(parsed?.text, mentions);
		if (ctx) show(APP_BOTTOM_SHEET_ENUM.USER_PREVIEW, true, ctx);
	}

	return (
		<Text onPress={onPress}>
			<NativeTextBold
				style={{
					color: parsed.me ? theme.primary : theme.complementary,
				}}
				onPress={onPress}
			>
				{parsed.text}
			</NativeTextBold>
		</Text>
	);
}

export default MentionSegment;
