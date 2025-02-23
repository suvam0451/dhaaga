import { Text } from 'react-native';
import { APP_FONT } from '../../../styles/AppTheme';
import { RandomUtil } from '@dhaaga/bridge';

type Props = {
	value: string;
};
function InlineCodeSegment({ value }: Props) {
	const k = RandomUtil.nanoId();
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
}

export default InlineCodeSegment;
