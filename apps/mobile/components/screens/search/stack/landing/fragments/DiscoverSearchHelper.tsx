import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react';
import { Animated, StyleSheet, View, TextInput } from 'react-native';
import { NativeCheckbox } from '../../../../../lib/Checkboxes';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { TextInputSubmitEditingEventData } from 'react-native/Libraries/Components/TextInput/TextInput';
import { APP_SEARCH_TYPE } from '../../../api/useSearch';
import { useAppTheme } from '../../../../../../hooks/app/useAppThemePack';
import { APP_FONT } from '../../../../../../styles/AppTheme';
import { AppIcon } from '../../../../../lib/Icon';

type MultiSelectProps = {
	setSearchCategory: Dispatch<SetStateAction<APP_SEARCH_TYPE>>;
};

/**
 * Control section to set the
 * search category
 */
const Multiselect = memo(({ setSearchCategory }: MultiSelectProps) => {
	const { colorScheme } = useAppTheme();
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
		<View
			style={[
				styles.checkboxContainer,
				{ backgroundColor: colorScheme.palette.menubar },
			]}
		>
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
		const { colorScheme } = useAppTheme();
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
			<Animated.View
				style={[styles.helperWidget, { backgroundColor: 'transparent' }]}
			>
				<View
					style={{
						padding: 8,
						backgroundColor: colorScheme.palette.menubar,
						flexDirection: 'row',
						borderTopLeftRadius: 8,
						borderTopRightRadius: 8,
					}}
				>
					<View
						style={{
							backgroundColor: colorScheme.palette.buttonUnstyled,
							flexDirection: 'row',
							width: '100%',
							paddingLeft: 8,
							borderRadius: 8,
						}}
					>
						<AppIcon id={'search'} />
						<TextInput
							multiline={false}
							onChangeText={updateSearch}
							onSubmitEditing={submitSearch}
							value={searchBoxText}
							placeholderTextColor={'rgba(255, 255, 255, 0.33)'}
							style={[
								styles.textInput,
								{
									padding: 8,
									flex: 1,
								},
							]}
							numberOfLines={1}
						/>
						<AppIcon
							id={'clear'}
							containerStyle={{ marginRight: 12 }}
							onPress={() => {
								setSearchBoxText('');
							}}
						/>
					</View>
				</View>
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
		paddingTop: 4,
		paddingVertical: 8,
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
	textInput: {
		textDecorationLine: 'none',
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		flex: 1,
		textAlignVertical: 'top',
	},
});

export default DiscoverSearchHelper;
