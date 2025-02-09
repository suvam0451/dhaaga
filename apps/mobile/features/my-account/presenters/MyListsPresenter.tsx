import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../../components/containers/WithAutoHideTopNavBar';
import { View } from 'react-native';

function MyListsPresenter() {
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<WithAutoHideTopNavBar title={'My Lists'} translateY={translateY}>
			<View />
		</WithAutoHideTopNavBar>
	);
}

export default MyListsPresenter;
