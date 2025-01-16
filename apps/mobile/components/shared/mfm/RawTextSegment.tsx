import { Text } from 'react-native';
import { RandomUtil } from '../../../utils/random.utils';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import {
	APP_COLOR_PALETTE_EMPHASIS,
	AppThemingUtil,
} from '../../../utils/theming.util';

type Props = {
	value: string;
	fontFamily: string;
	emphasis: APP_COLOR_PALETTE_EMPHASIS;
};

function RawTextSegment({ value, fontFamily, emphasis }: Props) {
	// @ts-ignore-next-line
	const _value = value?.replaceAll(/<br>/g, '\n');
	const k = RandomUtil.nanoId();
	const { theme } = useAppTheme();

	let color = AppThemingUtil.getColorForEmphasis(theme.secondary, emphasis);

	if (!_value) return <Text key={k}></Text>;

	return (
		<Text
			key={k}
			style={{
				color: color,
				fontFamily,
			}}
		>
			{_value}
		</Text>
	);
}

export default RawTextSegment;
