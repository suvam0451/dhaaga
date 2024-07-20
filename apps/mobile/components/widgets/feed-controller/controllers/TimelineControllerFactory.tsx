import { memo } from 'react';
import { View } from 'react-native';

type TimelineControllerFactoryProps = {
	timelineTypeText: string;
	timelineTarget: string;
};
const TimelineControllerFactory = memo(function Foo() {
	return <View></View>;
});
