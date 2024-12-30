import { View } from 'react-native';
import { useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { BottomNavBar } from '../../../../shared/pager-view/BottomNavBar';
import MentionView from './MentionView';
import ChatView from './ChatView';
import UpdatesView from './UpdatesView';
import SocialView from './SocialView';
import { AppPagerView } from '../../../../lib/AppPagerView';

const renderScene = (index: number) => {
	switch (index) {
		case 0:
			return <MentionView />;
		case 1:
			return <ChatView />;
		case 2:
			return <SocialView />;
		case 3:
			return <UpdatesView />;
		default:
			return null;
	}
};

export const TabView = () => {
	const [Index, setIndex] = useState<any>(0);
	const ref = useRef<PagerView>(null);

	function onChipSelect(index: number) {
		if (Index !== index) {
			setIndex(index);
			ref.current?.setPage(index);
		}
	}

	const tabLabels = [
		{
			label: 'Mentions',
			id: 'mentions',
		},
		{
			label: 'Chat',
			id: 'social',
		},
		{
			label: 'Social',
			id: 'chat',
		},
		{
			label: 'Updates',
			id: 'updates',
		},
	];

	return (
		<View style={{ flex: 1 }}>
			<AppPagerView pageCount={4} renderFunction={renderScene} />
			<BottomNavBar
				Index={Index}
				setIndex={onChipSelect}
				items={tabLabels}
				justify={'space-between'}
			/>
		</View>
	);
};

export default TabView;
