import { View, Animated } from 'react-native';
import WithScrollOnRevealContext, {
	useScrollOnReveal,
} from '../states/useScrollOnReveal';
import { SearchBar } from '@rneui/themed';
import React, { useState } from 'react';
import { CheckBox } from '@rneui/base';
import appStyling from '../styles/AppStyles';
import SearchResults from '../components/screens/search/SearchResults';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { TextInputSubmitEditingEventData } from 'react-native/Libraries/Components/TextInput/TextInput';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ApiWrapper from '../components/common/tag/TagBrowseLocal';
import UserProfile from './shared/profile/UserProfile';
import PostWithClientContext from './shared/Post';
import WithAppPaginationContext from '../states/usePagination';
import TrendingPosts from '../components/screens/search/stack/TrendingPosts';
import TrendingTags from '../components/screens/search/stack/TrendingTags';
import WithGorhomBottomSheetContext from '../states/useGorhomBottomSheet';
import WithAutoHideTopNavBar from '../components/containers/WithAutoHideTopNavBar';
import useTopbarSmoothTranslate from '../states/useTopbarSmoothTranslate';
import { useSharedValue } from 'react-native-reanimated';

type CheckboxItemProps = {
	selected: boolean;
	title: string;
	onPress: any;
};

const Stack = createNativeStackNavigator();

function CheckboxItem({ selected, title, onPress }: CheckboxItemProps) {
	return (
		<CheckBox
			checked={selected}
			onPress={onPress}
			iconType="material-community"
			checkedIcon="checkbox-outline"
			uncheckedIcon={'checkbox-blank-outline'}
			containerStyle={{
				backgroundColor: '#252525',
				flex: 1,
				margin: 0,
				padding: 0,
				marginLeft: 4,
				marginRight: 0,
			}}
			textStyle={{ color: '#fff', opacity: 0.6 }}
			title={title}
		/>
	);
}

function Multiselect() {
	const [selectedIndex, setSelectedIndex] = React.useState(0);

	function onCheckboxPress(idx: number) {
		setSelectedIndex(idx);
	}

	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				width: '100%',
				backgroundColor: '#252525',
				paddingBottom: 12,
				paddingHorizontal: 8,
			}}
		>
			<CheckboxItem
				onPress={() => {
					onCheckboxPress(0);
				}}
				title={'All'}
				selected={selectedIndex === 0}
			/>
			<CheckboxItem
				onPress={() => {
					onCheckboxPress(1);
				}}
				title={'Tags'}
				selected={selectedIndex === 1}
			/>
			<CheckboxItem
				onPress={() => {
					onCheckboxPress(2);
				}}
				title={'Users'}
				selected={selectedIndex === 2}
			/>
			<CheckboxItem
				onPress={() => {
					onCheckboxPress(3);
				}}
				title={'Posts'}
				selected={selectedIndex === 3}
			/>
		</View>
	);
}

function FloatingMenuWrapper() {
	const [searchBoxText, setSearchBoxText] = useState('');
	const [SearchTerm, setSearchTerm] = useState('');
	const { outputStyle } = useScrollOnReveal();

	const updateSearch = (search: string) => {
		setSearchBoxText(search);
	};

	const submitSearch = (
		search: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
	) => {
		setSearchTerm(search.nativeEvent.text);
	};

	const { onScroll, translateY, scrollY } = useTopbarSmoothTranslate({
		onScrollJsFn: () => {},
		totalHeight: 100,
		hiddenHeight: 50,
	});

	const width = useSharedValue(0);

	// useAnimatedStyle(() => {
	// 	return {
	// 		transform: [
	// 			{
	// 				translateY: withTiming(translateY.value, {
	// 					duration: 250,
	// 					easing: Easing.inOut(Easing.ease),
	// 				}),
	// 			},
	// 		],
	// 	};
	// });

	return (
		<WithAutoHideTopNavBar title={'Explore'} translateY={translateY}>
			<SearchResults q={SearchTerm} type={null} onScroll={onScroll} />
			<Animated.View style={[appStyling.inputAssistant]}>
				<SearchBar
					onChangeText={updateSearch}
					onSubmitEditing={submitSearch}
					value={searchBoxText}
					containerStyle={{
						width: '100%',
						height: 54,
						backgroundColor: '#252525',
						margin: 0,
					}}
					style={{ width: '100%' }}
					inputContainerStyle={{ height: 36 }}
					inputStyle={{ fontSize: 16 }}
				/>
				<Multiselect />
			</Animated.View>
		</WithAutoHideTopNavBar>
	);
}

function HomeContainer() {
	return (
		<WithScrollOnRevealContext maxDisplacement={150}>
			<WithAppPaginationContext>
				<FloatingMenuWrapper />
			</WithAppPaginationContext>
		</WithScrollOnRevealContext>
	);
}

function SearchScreen() {
	return (
		<WithGorhomBottomSheetContext>
			<Stack.Navigator
				initialRouteName={'Search'}
				screenOptions={{ headerShown: false }}
			>
				<Stack.Screen name={'Trending Posts'} component={TrendingPosts} />
				<Stack.Screen name={'Trending Tags'} component={TrendingTags} />
				<Stack.Screen name={'Search'} component={HomeContainer} />
				<Stack.Screen name="Browse Hashtag" component={ApiWrapper} />
				<Stack.Screen name="Profile" component={UserProfile} />
				<Stack.Screen name="Post" component={PostWithClientContext} />
			</Stack.Navigator>
		</WithGorhomBottomSheetContext>
	);
}

export default SearchScreen;
