import Animated from 'react-native-reanimated';
import appStyling from '../../styles/AppStyles';
import { Button, Tab, TabView } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { View } from 'react-native';
import { useScrollOnReveal } from '../../states/useScrollOnReveal';

const ICON_SIZE = 22;

function FloatingAssist() {
	const [TabValue, setTabValue] = useState(0);
	const { outputStyle } = useScrollOnReveal();

	function onTabChanged(e: any) {
		setTabValue(e);
	}

	return (
		<View>
			<TabView
				disableSwipe={true}
				value={TabValue}
				onChange={onTabChanged}
				animationType="spring"
				containerStyle={{
					backgroundColor: '#121212',
				}}
				tabItemContainerStyle={{
					width: '100%',
					backgroundColor: '#121212',
				}}
			></TabView>
			<Animated.View style={[appStyling.inputAssistant, outputStyle]}>
				<Tab
					value={TabValue}
					onChange={onTabChanged}
					// scrollable
					indicatorStyle={{
						backgroundColor: 'white',
						height: 2,
					}}
					containerStyle={{
						backgroundColor: '#2E2E2E',
					}}
					style={{
						marginHorizontal: 4,
						marginBottom: 4,
					}}
					variant="primary"
				>
					<Tab.Item>
						<Ionicons color={'#888'} name={'star-outline'} size={ICON_SIZE} />
					</Tab.Item>
					<Tab.Item>
						<Ionicons
							color={'#888'}
							name={'bookmark-outline'}
							size={ICON_SIZE}
						/>
					</Tab.Item>
					<Tab.Item>
						<Ionicons color={'#888'} name={'star-outline'} size={ICON_SIZE} />
					</Tab.Item>
					<Tab.Item>
						<Ionicons color={'#888'} name={'star-outline'} size={ICON_SIZE} />
					</Tab.Item>
					<Button color={'#ff38fe'}>Top</Button>
				</Tab>
			</Animated.View>
		</View>
	);
}

export default FloatingAssist;
