import { memo } from 'react';
import { Text } from 'react-native';
import { APP_FONT } from '../../../styles/AppTheme';
import { randomUUID } from 'expo-crypto';
import { APP_FONTS } from '../../../styles/AppFonts';

type Props = {
	value: string;
};

const RawTextSegment = memo(({ value }: Props) => {
	// @ts-ignore-next-line
	const _value = value.replaceAll(/<br>/g, '\n');
	const k = randomUUID();

	return (
		<Text
			key={k}
			style={{
				color: APP_FONT.MONTSERRAT_BODY,
				// fontFamily: APP_FONTS.INTER_900_BLACK,
			}}
		>
			{_value}
		</Text>
	);
});

export default RawTextSegment;
