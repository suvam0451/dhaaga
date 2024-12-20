import { StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';
import { useMemo } from 'react';
import { APP_THEME } from '../../../styles/AppTheme';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type Props = {
	url: string;
	text: string;
	interactable: boolean;
};

/**
 *
 * @param props
 * @constructor
 */
function MentionProcessor(props: Props) {
	const { acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);

	const { text } = props;

	const displayText = useMemo(() => {
		let retval = text;
		const ex = new RegExp(`(.*?)@${acct?.server}`, 'g');
		const res = Array.from(text.matchAll(ex));
		if (res.length > 0) {
			retval = `${res[0][1]}`;
		} else {
			retval = `${text}`;
		}

		const removeSpanEx = /<span>(.*?)<\/span>/g;
		const removeSpanRes = Array.from(text.matchAll(removeSpanEx));
		if (removeSpanRes.length > 0) {
			retval = `${removeSpanRes[0][1]}`;
		}
		return '@' + retval;
	}, [text]);

	return <Text style={styles.text}>{displayText}</Text>;
}

const styles = StyleSheet.create({
	text: {
		color: APP_THEME.MENTION,
		fontFamily: 'Montserrat-Bold',
	},
});

export default MentionProcessor;
