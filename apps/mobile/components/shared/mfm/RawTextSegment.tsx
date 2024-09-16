import { memo } from 'react';
import { Text } from 'react-native';
import { APP_FONT } from '../../../styles/AppTheme';
import { randomUUID } from 'expo-crypto';
import { APP_FONTS } from '../../../styles/AppFonts';

type Props = {
	value: string;
	fontFamily: string;
	emphasis: string;
};

const RawTextSegment = memo(({ value, fontFamily, emphasis }: Props) => {
	// @ts-ignore-next-line
	const _value = value?.replaceAll(/<br>/g, '\n');
	const k = randomUUID();

	let color = () => {
		switch (emphasis) {
			case 'high':
				return APP_FONT.HIGH_EMPHASIS;
			case 'medium':
				return APP_FONT.MEDIUM_EMPHASIS;
			case 'low':
				return APP_FONT.LOW_EMPHASIS;
		}
	};

	if (!_value) {
		return <Text key={k}></Text>;
	}
	return (
		<Text
			key={k}
			style={{
				color: color as any,
				fontFamily,
			}}
		>
			{_value}
		</Text>
	);
});

export default RawTextSegment;
