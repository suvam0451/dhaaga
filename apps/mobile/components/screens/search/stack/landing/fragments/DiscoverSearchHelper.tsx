import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react';
import { SearchBar } from '@rneui/themed';
import { Animated, StyleSheet, View } from 'react-native';
import { NativeCheckbox } from '../../../../../lib/Checkboxes';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { TextInputSubmitEditingEventData } from 'react-native/Libraries/Components/TextInput/TextInput';
import { APP_SEARCH_TYPE } from '../../../api/useSearch';

type MultiSelectProps = {
	setSearchCategory: Dispatch<SetStateAction<APP_SEARCH_TYPE>>;
};

/**
 * Control section to set the
 * search category
 */
const Multiselect = memo(({ setSearchCategory }: MultiSelectProps) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const onCheckboxPress = useCallback(
		(idx: number) => {
			setSelectedIndex(idx);
			switch (idx) {
				case 0: {
					setSearchCategory(APP_SEARCH_TYPE.POSTS);
					break;
				}
				case 1: {
					setSearchCategory(APP_SEARCH_TYPE.USERS);
					break;
				}
				case 2: {
					setSearchCategory(APP_SEARCH_TYPE.HASHTAGS);
					break;
				}
				case 3: {
					// setSearchCategory(APP_SEARCH_TYPE.LINKS);
					break;
				}
				default: {
					setSearchCategory(APP_SEARCH_TYPE.POSTS);
					break;
				}
			}
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
});

type DiscoverSearchHelperProps = {
	setSearchTerm: Dispatch<SetStateAction<string>>;
	setSearchCategory: Dispatch<SetStateAction<APP_SEARCH_TYPE>>;
};

/**
 * The floaty helper component
 * for the discover tab landing
 * page
 */
const DiscoverSearchHelper = memo(
	({ setSearchTerm, setSearchCategory }: DiscoverSearchHelperProps) => {
		const [searchBoxText, setSearchBoxText] = useState('');

		const updateSearch = (search: string) => {
			setSearchBoxText(search);
		};

		const submitSearch = (
			search: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
		) => {
			setSearchTerm(search.nativeEvent.text);
		};

		return (
			<Animated.View style={[styles.helperWidget]}>
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
				<Multiselect setSearchCategory={setSearchCategory} />
			</Animated.View>
		);
	},
);

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
	helperWidget: {
		position: 'absolute',
		width: '100%',
		bottom: 0,
		marginBottom: 16,
		paddingHorizontal: 12,
		zIndex: 99,
	},
});

export default DiscoverSearchHelper;
