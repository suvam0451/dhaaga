import { StyleSheet, Text } from 'react-native';
import { useMemo } from 'react';
import { APP_THEME } from '../../../styles/AppTheme';
import { useAppAcct } from '../../../hooks/utility/global-state-extractors';
import { APP_FONTS } from '../../../styles/AppFonts';

type Props = {
	url: string;
	text: string;
	interactable: boolean;
};

/**
 * @param props
 * @constructor
 */
function MentionProcessor(props: Props) {
	const { acct } = useAppAcct();

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
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
	},
});

export default MentionProcessor;
