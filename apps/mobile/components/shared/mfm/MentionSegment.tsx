import { Text } from 'react-native';
import { RandomUtil } from '../../../utils/random.utils';
import { APP_FONTS } from '../../../styles/AppFonts';
import {
	useAppAcct,
	useAppBottomSheet_Improved,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { TextParserService } from '../../../services/text-parser.service';
import { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';

type Props = {
	value: string;
	link: string;
	fontFamily: string;
};

function MentionSegment({ value, link, fontFamily }: Props) {
	const { theme } = useAppTheme();
	const { show } = useAppBottomSheet_Improved();
	const { acct } = useAppAcct();

	const k = RandomUtil.nanoId();

	const parsed = TextParserService.mentionTextToHandle(value, acct);

	function onPress() {
		show(APP_BOTTOM_SHEET_ENUM.PROFILE_PEEK, true);
	}

	return (
		<Text
			key={k}
			style={{
				fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
				color: parsed.me ? theme.primary.a0 : theme.complementary.a0,
			}}
			onPress={onPress}
		>
			{parsed.text}
		</Text>
	);
}

export default MentionSegment;
