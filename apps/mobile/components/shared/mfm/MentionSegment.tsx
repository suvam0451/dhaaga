import { memo, useCallback, useMemo } from 'react';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { Text } from '@rneui/themed';
import { randomUUID } from 'expo-crypto';
import { useAppTheme } from '../../../hooks/app/useAppThemePack';

type Props = {
	value: string;
	link: string;
	fontFamily: string;
};

const MentionSegment = memo(function Foo({ value, link, fontFamily }: Props) {
	const { colorScheme } = useAppTheme();
	const { subdomain } = useActivityPubRestClientContext();
	const k = randomUUID();

	const displayText = useMemo(() => {
		let retval = value;
		const ex = new RegExp(`@?(.*?)@${subdomain}`, 'g');
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

	const onPress = useCallback(() => {}, []);

	return (
		<Text
			key={k}
			style={{ fontFamily, color: colorScheme.palette.link }}
			onPress={onPress}
		>
			{displayText}
		</Text>
	);
});

export default MentionSegment;
