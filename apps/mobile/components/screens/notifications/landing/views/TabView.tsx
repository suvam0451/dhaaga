import { StyleSheet, View } from 'react-native';
import { useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { SingleSelectAnimated } from '../../../../lib/SingleSelectAnimated';
import NotificationViewSocial from './NotificationViewSocial';
import NotificationViewChat from './NotificationViewChat';
import NotificationViewUpdates from './NotificationViewUpdates';
import NotificationViewOthers from './NotificationViewOthers';

const renderScene = (index: number) => {
	switch (index) {
		case 0:
			return <NotificationViewSocial />;
		case 1:
			return <NotificationViewSocial />;
		case 2:
			return <NotificationViewChat />;
		case 3:
			return <NotificationViewUpdates />;
		case 4:
			return <NotificationViewOthers />;
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
				<SingleSelectAnimated
					Index={Index}
					setIndex={onChipSelect}
					items={[
						{
							label: 'Replies',
							id: 'reply',
						},
						{
							label: 'Social',
							id: 'social',
						},
						{
							label: 'Chat',
							id: 'chat',
						},
						{
							label: 'Updates',
							id: 'updates',
						},
						{
							label: 'Misc',
							id: 'misc',
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
