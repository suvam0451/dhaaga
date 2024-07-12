import { View, Animated } from 'react-native';
import WithScrollOnRevealContext from '../states/useScrollOnReveal';
import { SearchBar } from '@rneui/themed';
import { useState } from 'react';
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
import WithGorhomBottomSheetContext from '../states/useGorhomBottomSheet';
import WithAutoHideTopNavBar from '../components/containers/WithAutoHideTopNavBar';
import useTopbarSmoothTranslate from '../states/useTopbarSmoothTranslate';
import { APP_FONT } from '../styles/AppTheme';

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
				opacity: 0.87,
			}}
			textStyle={{ color: APP_FONT.MONTSERRAT_BODY }}
			title={title}
		/>
	);
}

function Multiselect() {
	const [selectedIndex, setSelectedIndex] = useState(0);

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

	return (
		<WithAutoHideTopNavBar title={'Explore'} translateY={translateY}>
			<SearchResults q={SearchTerm} type={null} onScroll={onScroll} />
			<Animated.View style={[appStyling.inputAssistant]}>
				<SearchBar
					// @ts-ignore
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
				<Stack.Screen name={'Search'} component={HomeContainer} />
				<Stack.Screen name="Browse Hashtag" component={ApiWrapper} />
				<Stack.Screen name="Profile" component={UserProfile} />
				<Stack.Screen name="Post" component={PostWithClientContext} />
			</Stack.Navigator>
		</WithGorhomBottomSheetContext>
	);
}

export default SearchScreen;
