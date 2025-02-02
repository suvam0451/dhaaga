import {
	useAppAcct,
	useAppBottomSheet_Improved,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { TextParserService } from '../../../services/text-parser.service';
import { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { AppText } from '../../lib/Text';

type Props = {
	value: string;
	link: string;
	fontFamily: string;
};

function MentionSegment({ value, link, fontFamily }: Props) {
	const { theme } = useAppTheme();
	const { show, setCtx } = useAppBottomSheet_Improved();
	const { acct } = useAppAcct();

	const parsed = TextParserService.mentionTextToHandle(value, acct);

	function onPress() {
		setCtx({
			did: link,
		});
		show(APP_BOTTOM_SHEET_ENUM.PROFILE_PEEK, true);
	}

	return (
		<AppText.Medium
			style={{
				fontFamily,
				color: parsed.me ? theme.primary.a0 : theme.complementaryB.a0,
			}}
			onPress={onPress}
		>
			{parsed.text}
		</AppText.Medium>
	);
}

export default MentionSegment;
