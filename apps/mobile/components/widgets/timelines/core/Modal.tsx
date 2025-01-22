import { Modal, useWindowDimensions, View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { APP_FONT } from '../../../../styles/AppTheme';
import useKeyboard from '../../../hooks/useKeyboard';
import { useTimelineController } from '../../../../features/timelines/api/useTimelineController';
import tabBarRenderer from './renderTabBar';
import HideOnKeyboardVisibleContainer from '../../../containers/HideOnKeyboardVisibleContainer';
import { useState } from 'react';

function TimelineWidgetModal() {
	const [index, setIndex] = useState(0);
	const [routes] = useState([
		{ key: 'pinned', title: 'Pinned' },
		{ key: 'lists', title: 'Lists' },
		{
			key: 'tags',
			title: 'Tags',
		},
		{ key: 'users', title: 'Users' },
		{ key: 'custom', title: 'Custom' },
	]);
	const layout = useWindowDimensions();
	const { KeyboardVisible } = useKeyboard();

	const { ShowTimelineSelection, setShowTimelineSelection } =
		useTimelineController();

	const renderTabBar = tabBarRenderer(index);

	return (
		<Modal
			animationType="slide"
			visible={ShowTimelineSelection}
			transparent={true}
			onRequestClose={() => {
				setShowTimelineSelection(false);
			}}
		>
			<View
				style={{
					height: '100%',
					backgroundColor: 'rgba(0, 0, 0, 0.75)',
				}}
			>
				<View
					style={{
						height: KeyboardVisible ? 360 + 32 : '100%',
						paddingVertical: 'auto',
						paddingHorizontal: 16,
					}}
				>
					<View
						style={{
							backgroundColor: '#2c2c2c',
							minHeight: KeyboardVisible ? 360 : 400,
							width: 256,
							margin: 'auto',
							zIndex: 99,
						}}
					>
						{/*<TabView*/}
						{/*	navigationState={{ index, routes }}*/}
						{/*	renderScene={renderScene}*/}
						{/*	onIndexChange={setIndex}*/}
						{/*	renderTabBar={renderTabBar}*/}
						{/*	initialLayout={{ width: layout.width }}*/}
						{/*	onMoveShouldSetResponder={() => true}*/}
						{/*/>*/}
						<HideOnKeyboardVisibleContainer
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								position: 'relative',
							}}
						>
							<View
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									position: 'absolute',
									top: 16,
									backgroundColor: 'rgba(70, 70, 70, 0.75)',
									borderRadius: 8,
									paddingVertical: 8,
									paddingHorizontal: 16,
								}}
								onTouchEnd={() => {
									setShowTimelineSelection(false);
								}}
							>
								<View style={{ width: 32 }}>
									<FontAwesome
										name="close"
										size={24}
										color={APP_FONT.MONTSERRAT_BODY}
									/>
								</View>
								<View style={{ flexShrink: 1, maxWidth: 72 }}>
									<Text style={{ textAlign: 'center' }}>Cancel</Text>
								</View>
							</View>
						</HideOnKeyboardVisibleContainer>
					</View>
				</View>
			</View>
		</Modal>
	);
}

export default TimelineWidgetModal;
