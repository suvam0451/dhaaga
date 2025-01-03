import { memo, useMemo } from 'react';
import { Text } from 'react-native';
import { RandomUtil } from '../../../utils/random.utils';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

type Props = {
	value: string;
	fontFamily: string;
	emphasis: string;
};

const RawTextSegment = memo(({ value, fontFamily, emphasis }: Props) => {
	// @ts-ignore-next-line
	const _value = value?.replaceAll(/<br>/g, '\n');
	const k = RandomUtil.nanoId();
	const { theme } = useAppTheme();

	let color = useMemo(() => {
		switch (emphasis) {
			case 'high':
				return theme.textColor.high;
			case 'medium':
				return theme.textColor.medium;
			case 'low':
				return theme.textColor.low;
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
			}}
		>
			{_value}
		</Text>
	);
});

export default RawTextSegment;
