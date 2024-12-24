import { StyleSheet, View } from 'react-native';
import { useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { BottomNavBar } from '../../../../shared/pager-view/BottomNavBar';
import MentionView from './MentionView';
import ChatView from './ChatView';
import UpdatesView from './UpdatesView';
import SocialView from './SocialView';

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

	const onChipSelect = (index: number) => {
		if (Index !== index) {
			setIndex(index);
			ref.current?.setPage(index);
		}
	};

	function onPageSelected(e: any) {
		const { offset, position } = e.nativeEvent;
		const newIndex = Math.round(position + offset);
		setIndex(newIndex);
	}

	return (
		<View style={{ flex: 1 }}>
			<View style={{ flex: 1 }}>
				{/*@ts-ignore-next-line*/}
				<PagerView
					ref={ref}
					scrollEnabled={true}
					style={styles.pagerView}
					initialPage={0}
					onPageScroll={onPageSelected}
				>
					{Array.from({ length: 4 }).map((_, index) => (
						<View key={index.toString()}>{renderScene(index)}</View>
					))}
				</PagerView>
				<BottomNavBar
					Index={Index}
					setIndex={onChipSelect}
					items={[
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
					]}
					justify={'space-between'}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	pagerView: {
		flex: 1,
	},
});

export default TabView;
