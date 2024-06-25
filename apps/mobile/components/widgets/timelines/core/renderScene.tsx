import DefaultTimelineOptions from '../scenes/1_Default';
import ListTimelineOptions from '../scenes/2_List';
import HashtagTimelineOptions from '../scenes/3_Hashtag';
import CustomTimelineOptions from '../scenes/CustomTimelineOptions';
import { SceneMap } from 'react-native-tab-view';
import * as React from 'react';
import TimelineWidgetUserScene from '../scenes/4_User';

function FirstRoute() {
	return <DefaultTimelineOptions />;
}

const SecondRoute = () => {
	return <ListTimelineOptions />;
};

const ThirdRoute = () => {
	return <HashtagTimelineOptions />;
};

const FourthRoute = () => {
	return <TimelineWidgetUserScene />;
};

function FifthRoute() {
	return <CustomTimelineOptions />;
}

const renderScene = SceneMap({
	pinned: FirstRoute,
	lists: SecondRoute,
	tags: ThirdRoute,
	users: FourthRoute,
	custom: FifthRoute,
});

export default renderScene;
