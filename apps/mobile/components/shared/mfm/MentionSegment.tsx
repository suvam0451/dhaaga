import { memo, useMemo } from 'react';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { Text } from '@rneui/themed';
import { StyleSheet } from 'react-native';
import { APP_THEME } from '../../../styles/AppTheme';
import { randomUUID } from 'expo-crypto';

type Props = {
	value: string;
	link: string;
};

const MentionSegment = memo(function Foo({ value, link }: Props) {
	const { subdomain } = useActivityPubRestClientContext();
	const k = randomUUID();

	const displayText = useMemo(() => {
		let retval = value;
		const ex = new RegExp(`(.*?)@${subdomain}`, 'g');
		const res = Array.from(value.matchAll(ex));
		if (res.length > 0) {
			retval = `${res[0][1]}`;
		} else {
			retval = `${value}`;
		}

		console.log(value, retval, link);

		const removeSpanEx = /<span>(.*?)<\/span>/g;
		const removeSpanRes = Array.from(value.matchAll(removeSpanEx));
		if (removeSpanRes.length > 0) {
			retval = `${removeSpanRes[0][1]}`;
		}
		return '@' + retval;
	}, [value]);

	return (
		<Text key={k} style={styles.text}>
			{displayText}
		</Text>
	);
});

export default MentionSegment;

const styles = StyleSheet.create({
	text: {
		color: APP_THEME.MENTION,
		fontFamily: 'Montserrat-Bold',
	},
});
