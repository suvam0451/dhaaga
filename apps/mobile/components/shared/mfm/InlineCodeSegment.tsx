import { memo } from 'react';
import { Text } from 'react-native';
import { randomUUID } from 'expo-crypto';
import { APP_FONT } from '../../../styles/AppTheme';

type Props = {
	value: string;
};
const InlineCodeSegment = memo(function Foo({ value }: Props) {
	const k = randomUUID();
	const BG_COLOR = 'rgba(253,227,126,0.24)';

	return (
		<Text
			key={k}
			style={{
				backgroundColor: BG_COLOR,
				fontFamily: 'Inter-Bold',
				paddingHorizontal: 4,
				color: APP_FONT.MONTSERRAT_BODY,
			}}
		>
			{' '}
			{value}{' '}
		</Text>
	);
});

export default InlineCodeSegment;
