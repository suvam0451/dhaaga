import { Fragment, memo, useMemo } from 'react';
import { View } from 'react-native';
import TimelineEmpty from '../../../error-screen/TimelineEmpty';
import NowBrowsingHeader from '../../../widgets/feed-controller/core/NowBrowsingHeader';

const ListHeaderComponent = memo(function Foo({
	loadedOnce,
	itemCount,
}: {
	loadedOnce: boolean;
	itemCount: number;
}) {
	const AdditionalState = useMemo(() => {
		if (!loadedOnce) {
			return <View />;
		}
		if (itemCount === 0) {
			return <TimelineEmpty />;
		}
		return <View />;
	}, [loadedOnce, itemCount]);

	return (
		<Fragment>
			<NowBrowsingHeader />
			{AdditionalState}
		</Fragment>
	);
});

export default ListHeaderComponent;
