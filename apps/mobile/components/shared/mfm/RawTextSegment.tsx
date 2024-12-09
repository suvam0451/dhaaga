import { memo, useMemo } from 'react';
import { Text } from 'react-native';
import { randomUUID } from 'expo-crypto';
import { useAppTheme } from '../../../hooks/app/useAppThemePack';

type Props = {
	value: string;
	fontFamily: string;
	emphasis: string;
};

const RawTextSegment = memo(({ value, fontFamily, emphasis }: Props) => {
	// @ts-ignore-next-line
	const _value = value?.replaceAll(/<br>/g, '\n');
	const k = randomUUID();
	const { colorScheme } = useAppTheme();

	let color = useMemo(() => {
		switch (emphasis) {
			case 'high':
				return colorScheme.textColor.high;
			case 'medium':
				return colorScheme.textColor.medium;
			case 'low':
				return colorScheme.textColor.low;
		}
	}, [emphasis]);

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
