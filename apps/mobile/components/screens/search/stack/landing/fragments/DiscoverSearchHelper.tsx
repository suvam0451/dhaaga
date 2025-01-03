import { Dispatch, SetStateAction, useState } from 'react';
import { Animated, StyleSheet, TextInput, View } from 'react-native';
import { NativeCheckbox } from '../../../../../lib/Checkboxes';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { TextInputSubmitEditingEventData } from 'react-native/Libraries/Components/TextInput/TextInput';
import { APP_SEARCH_TYPE } from '../../../api/useSearch';
import { AppIcon } from '../../../../../lib/Icon';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import {
	useAppApiClient,
	useAppTheme,
} from '../../../../../../hooks/utility/global-state-extractors';
import { DiscoverTabReducerActionType } from '../../../../../../states/reducers/discover-tab.reducer';
import {
	useDiscoverTabDispatch,
	useDiscoverTabState,
} from '../../../../../context-wrappers/WithDiscoverTabCtx';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';

type MultiSelectProps = {
	setSearchCategory: Dispatch<SetStateAction<APP_SEARCH_TYPE>>;
};

/**
 * Control section to set the
 * search category
 */
export function Multiselect({ setSearchCategory }: MultiSelectProps) {
	const { theme } = useAppTheme();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const { driver } = useAppApiClient();

	function onCheckboxPress(idx: number) {
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
	}

	const Checkboxes = [
		{
			label: 'Top',
			enabled: driver === KNOWN_SOFTWARE.BLUESKY,
			visible: driver === KNOWN_SOFTWARE.BLUESKY,
		},
		{
			label: 'Latest',
			enabled: driver === KNOWN_SOFTWARE.BLUESKY,
			visible: driver === KNOWN_SOFTWARE.BLUESKY,
		},
		{
			label: 'Posts',
			enabled: driver !== KNOWN_SOFTWARE.BLUESKY,
			visible: driver !== KNOWN_SOFTWARE.BLUESKY,
		},
		{
			label: 'People',
			visible: true,
			enabled: true,
		},
		{
			label: 'Tags',
			visible: true,
			enabled: true,
		},
		{
			label: 'Links',
			enabled: driver === KNOWN_SOFTWARE.MASTODON,
			visible: driver === KNOWN_SOFTWARE.MASTODON,
		},
		{
			label: 'Feeds',
			enabled: driver === KNOWN_SOFTWARE.BLUESKY,
			visible: driver === KNOWN_SOFTWARE.BLUESKY,
		},
	];

	return (
		<View
			style={[
				styles.checkboxContainer,
				{
					backgroundColor: theme.palette.menubar,
					justifyContent: 'space-around',
				},
			]}
		>
			{Checkboxes.filter((o) => o.enabled && o.visible).map((o, i) => (
				<NativeCheckbox
					key={i}
					onClick={() => {
						if (Checkboxes[i].enabled) {
							onCheckboxPress(i);
						}
					}}
					label={o.label}
					checked={selectedIndex === i}
				/>
			))}
		</View>
	);
}

/**
 * The floaty helper component
 * for the discover tab landing
 * page
 */
function DiscoverSearchHelper() {
	const { theme } = useAppTheme();
	const dispatch = useDiscoverTabDispatch();
	const state = useDiscoverTabState();

	const updateSearch = (search: string) => {
		dispatch({
			type: DiscoverTabReducerActionType.SET_SEARCH,
			payload: {
				q: search,
			},
		});
	};

	const submitSearch = (
		search: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
	) => {
		dispatch({
			type: DiscoverTabReducerActionType.APPLY_SEARCH,
		});
	};

	function setCategory(cat: APP_SEARCH_TYPE) {
		dispatch({
			type: DiscoverTabReducerActionType.SET_CATEGORY,
			payload: {
				tab: cat,
			},
		});
	}

	return (
		<Animated.View
			style={[styles.helperWidget, { backgroundColor: 'transparent' }]}
		>
			<View
				style={{
					padding: 8,
					backgroundColor: theme.palette.menubar,
					flexDirection: 'row',
					borderTopLeftRadius: 8,
					borderTopRightRadius: 8,
				}}
			>
				<View
					style={{
						backgroundColor: theme.primary.a0,
						flexDirection: 'row',
						width: '100%',
						paddingLeft: 8,
						borderRadius: 8,
						alignItems: 'center',
						paddingVertical: 6,
					}}
				>
					<AppIcon
						id={'search'}
						color={theme.palette.bg}
						containerStyle={{ paddingHorizontal: 4 }}
					/>
					<TextInput
						multiline={false}
						onChangeText={updateSearch}
						onSubmitEditing={submitSearch}
						value={state.text}
						placeholderTextColor={'rgba(0, 0, 0, 0.64)'}
						placeholder={'Discover something new!'}
						style={[
							styles.textInput,
							{
								padding: 8,
								flex: 1,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
							},
						]}
						numberOfLines={1}
					/>
					<AppIcon
						id={'clear'}
						containerStyle={{ marginRight: 12 }}
						onPress={() => {
							dispatch({
								type: DiscoverTabReducerActionType.CLEAR_SEARCH,
							});
						}}
						color={'black'}
					/>
				</View>
			</View>
			<Multiselect setSearchCategory={setCategory} />
		</Animated.View>
	);
}

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
		marginBottom: 120, // 16
		paddingHorizontal: 12,
		zIndex: 99,
	},
	textInput: {
		textDecorationLine: 'none',
		// color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		flex: 1,
		// textAlignVertical: 'top',
	},
});

export default DiscoverSearchHelper;
