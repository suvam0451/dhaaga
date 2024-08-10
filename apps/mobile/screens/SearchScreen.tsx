import { View, Animated, StyleSheet } from 'react-native';
import WithScrollOnRevealContext from '../states/useScrollOnReveal';
import { SearchBar } from '@rneui/themed';
import { useCallback, useState } from 'react';
import appStyling from '../styles/AppStyles';
import SearchResults from '../components/screens/search/SearchResults';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { TextInputSubmitEditingEventData } from 'react-native/Libraries/Components/TextInput/TextInput';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ApiWrapper from '../components/common/tag/TagBrowseLocal';
import PostWithClientContext from './shared/Post';
import WithAppPaginationContext from '../states/usePagination';
import WithAutoHideTopNavBar from '../components/containers/WithAutoHideTopNavBar';
import useTopbarSmoothTranslate from '../states/useTopbarSmoothTranslate';
import { NativeCheckbox } from '../components/lib/Checkboxes';

const Stack = createNativeStackNavigator();

function Multiselect() {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const onCheckboxPress = useCallback(
		(idx: number) => {
			setSelectedIndex(idx);
		},
		[setSelectedIndex],
	);

	const Checkboxes = [
		{
			label: 'Posts',
		},
		{
			label: 'Users',
		},
		{
			label: 'Tags',
		},
		{
			label: 'Links',
		},
	];

	return (
		<View style={styles.checkboxContainer}>
			{Checkboxes.map((o, i) => (
				<NativeCheckbox
					key={i}
					onClick={() => {
						onCheckboxPress(i);
					}}
					label={o.label}
					checked={selectedIndex === i}
				/>
			))}
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
						borderTopRightRadius: 8,
						borderTopLeftRadius: 8,
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
		<Stack.Navigator
			initialRouteName={'Search'}
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name={'Search'} component={HomeContainer} />
			<Stack.Screen name="Browse Hashtag" component={ApiWrapper} />
		</Stack.Navigator>
	);
}

const styles = StyleSheet.create({
	checkboxContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		backgroundColor: '#252525',
		paddingBottom: 10,
		paddingTop: 8,
		paddingHorizontal: 8,
		borderBottomRightRadius: 8,
		borderBottomLeftRadius: 8,
	},
});

export default SearchScreen;
