import React, { useEffect, useState } from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	StyleSheet,
	useWindowDimensions,
	View,
} from 'react-native';
import {
	TouchableOpacity,
	TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dialog, Text } from '@rneui/themed';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT, APP_THEME } from '../styles/AppTheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TabView, SceneMap } from 'react-native-tab-view';
import { DialogButtonGroupItem } from '../styles/Containers';
import CustomTimelineOptions from './widgets/timelines/fragments/CustomTimelineOptions';
import DefaultTimelineOptions from './widgets/timelines/fragments/DefaultTimelineOptions';
import ListTimelineOptions from './widgets/timelines/fragments/ListTimelineOptions';
import { useTimelineControllerContext } from '../states/useTimelineController';
import HashtagTimelineOptions from './widgets/timelines/fragments/HashtagTimelineOptions';
import useKeyboard from './hooks/useKeyboard';
import { FontAwesome } from '@expo/vector-icons';

function FirstRoute() {
	return <DefaultTimelineOptions />;
}

const SecondRoute = () => {
	return <ListTimelineOptions />;
};

const ThirdRoute = () => {
	return <HashtagTimelineOptions />;
};

function FifthRoute() {
	return <CustomTimelineOptions />;
}

const renderScene = SceneMap({
	pinned: FirstRoute,
	lists: SecondRoute,
	tags: ThirdRoute,
	users: FirstRoute,
	custom: FifthRoute,
});

type HeadersProps = {
	HIDDEN_SECTION_HEIGHT: number;
	SHOWN_SECTION_HEIGHT: number;
	label?: string;
};
const TimelinesHeader = ({
	HIDDEN_SECTION_HEIGHT,
	SHOWN_SECTION_HEIGHT,
	label,
}: HeadersProps) => {
	const { KeyboardVisible } = useKeyboard();

	const { ShowTimelineSelection, setShowTimelineSelection } =
		useTimelineControllerContext();

	function onIconPress() {
		setShowTimelineSelection(true);
	}

	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'pinned', title: 'Pinned' },
		{ key: 'lists', title: 'Lists' },
		{ key: 'tags', title: 'Tags' },
		{ key: 'users', title: 'Users' },
		{ key: 'custom', title: 'Custom' },
	]);
	const layout = useWindowDimensions();

	const renderTabBar = (props: any) => {
		const routes: {
			key: string;
			title: string;
		}[] = props.navigationState.routes;
		return (
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-around',
					backgroundColor: '#555',
					borderRadius: 8,
					paddingHorizontal: 8,
				}}
			>
				{routes.map((o, i) => {
					switch (i) {
						case 0:
							return (
								<DialogButtonGroupItem key={i}>
									<View style={{ width: 24 }}>
										<AntDesign
											name="pushpin"
											size={24}
											color={index === 0 ? APP_THEME.LINK : '#888'}
										/>
									</View>
								</DialogButtonGroupItem>
							);
						case 1:
							return (
								<DialogButtonGroupItem key={i} style={{ flex: 1 }}>
									<View style={{ width: 24 }}>
										<FontAwesome5
											name="list"
											size={24}
											color={index === 1 ? APP_THEME.LINK : '#888'}
										/>
									</View>
								</DialogButtonGroupItem>
							);

						case 2:
							return (
								<DialogButtonGroupItem key={i}>
									<View style={{ width: 24 }}>
										<FontAwesome6
											name="hashtag"
											size={24}
											color={index === 2 ? APP_THEME.LINK : '#888'}
										/>
									</View>
								</DialogButtonGroupItem>
							);

						case 3:
							return (
								<DialogButtonGroupItem key={i}>
									<View style={{ width: 24 }}>
										<FontAwesome5
											name="user-alt"
											size={24}
											color={index === 3 ? APP_THEME.LINK : '#888'}
										/>
									</View>
								</DialogButtonGroupItem>
							);
						case 4:
							return (
								<DialogButtonGroupItem key={i}>
									<View style={{ width: 24 }}>
										<MaterialIcons
											name="dashboard-customize"
											size={24}
											color={index === 4 ? APP_THEME.LINK : '#888'}
										/>
									</View>
								</DialogButtonGroupItem>
							);
					}
				})}
			</View>
		);
	};

	return (
		<View
			style={[
				styles.subHeader,
				{
					height: HIDDEN_SECTION_HEIGHT,
				},
			]}
		>
			<Ionicons name="menu" size={24} color="white" style={{ opacity: 0.6 }} />
			<Pressable
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: 12,
					paddingHorizontal: 16,
				}}
				onPress={onIconPress}
			>
				<Text
					style={[
						styles.conversation,
						{
							opacity: 0.6,
						},
					]}
				>
					{label || 'Home'}
				</Text>
				<Ionicons
					name="chevron-down"
					color={'white'}
					size={20}
					style={{ opacity: 0.6, marginLeft: 4, marginTop: 2 }}
				/>
			</Pressable>

			<Ionicons
				name="settings-outline"
				size={24}
				color="white"
				style={{ opacity: 0.6 }}
			/>

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
							height: KeyboardVisible ? 300 + 32 : '100%',
							paddingVertical: 'auto',
							paddingHorizontal: 16,
						}}
					>
						<View
							style={{
								backgroundColor: '#2c2c2c',
								minHeight: KeyboardVisible ? 300 : 400,
								width: 256,
								margin: 'auto',
								zIndex: 99,
							}}
						>
							<TabView
								navigationState={{ index, routes }}
								renderScene={renderScene}
								onIndexChange={setIndex}
								renderTabBar={renderTabBar}
								initialLayout={{ width: layout.width }}
								onMoveShouldSetResponder={() => true}
							/>
							<View
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
							</View>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	subHeader: {
		width: '100%',
		paddingHorizontal: 10,
		backgroundColor: APP_THEME.DARK_THEME_MENUBAR,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	conversation: { color: 'white', fontSize: 16, fontWeight: 'bold' },
	searchText: {
		color: '#8B8B8B',
		fontSize: 17,
		lineHeight: 22,
		marginLeft: 8,
	},
	searchBox: {
		paddingVertical: 8,
		paddingHorizontal: 10,
		backgroundColor: '#0F0F0F',
		borderRadius: 10,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
});
export default TimelinesHeader;
