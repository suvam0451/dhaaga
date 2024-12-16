import { Text } from 'react-native';
import { memo, useMemo } from 'react';
import useGlobalState, { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { RandomUtil } from '../../../utils/random.utils';

type Props = {
	value: string;
	link: string;
	fontFamily: string;
};

const MentionSegment = memo(function Foo({ value, link, fontFamily }: Props) {
	const { acct, theme, setStringValue, show } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			visible: o.bottomSheet.visible,
			setType: o.bottomSheet.setType,
			setStringValue: o.bottomSheet.setTextValue,
			show: o.bottomSheet.show,
			theme: o.colorScheme,
		})),
	);
	const k = RandomUtil.nanoId();

	const displayText = useMemo(() => {
		let retval = value;
		const ex = new RegExp(`@?(.*?)@${acct?.server}`, 'g');
		const res = Array.from(value.matchAll(ex));
		if (res.length > 0) {
			retval = `${res[0][1]}`;
		} else {
			retval = `${value}`;
		}

		const removeSpanEx = /<span>(.*?)<\/span>/g;
		const removeSpanRes = Array.from(value.matchAll(removeSpanEx));
		if (removeSpanRes.length > 0) {
			retval = `${removeSpanRes[0][1]}`;
		}
		return retval[0] === '@' ? retval : '@' + retval;
	}, [value]);

	function onPress() {
		setStringValue(value);
		show(APP_BOTTOM_SHEET_ENUM.PROFILE_PEEK, true);
	}

	return (
		<Text
			key={k}
			style={{ fontFamily, color: theme.palette.link }}
			onPress={onPress}
		>
			{displayText}
		</Text>
	);
});

export default MentionSegment;
