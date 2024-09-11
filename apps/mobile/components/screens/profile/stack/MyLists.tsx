import { memo } from 'react';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import { View } from 'react-native';

const MyLists = memo(() => {
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<WithAutoHideTopNavBar title={'My Lists'} translateY={translateY}>
			<View />
		</WithAutoHideTopNavBar>
	);
});

export default MyLists;
