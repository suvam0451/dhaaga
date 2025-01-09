import { Pressable, StyleSheet, View, Text } from 'react-native';
import { useTimelineController } from '../../../common/timeline/api/useTimelineController';
import { useEffect, useRef, useState } from 'react';
import { APP_THEME } from '../../../../styles/AppTheme';
import AppInput from '../../../lib/Inputs';
import HideOnKeyboardVisibleContainer from '../../../containers/HideOnKeyboardVisibleContainer';
import { TimelineFetchMode } from '../../../../states/reducers/post-timeline.reducer';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';

type SearchResults = {
	following: boolean;
	name: string;
	privatelyFollowing: boolean;
};

function TimelineWidgetHashtagScene() {
	const { theme } = useAppTheme();
	const { setTimelineType, setQuery, setShowTimelineSelection } =
		useTimelineController();
	const [SearchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = SearchTerm;

	const tags = [];
	const [SearchResults, setSearchResults] = useState<SearchResults[]>([]);

	useEffect(() => {
		if (SearchTerm === '') {
			setSearchResults(tags.slice(0, 8));
		} else {
			const _Res = tags
				.filter((o) => o.name.toLowerCase().includes(SearchTerm.toLowerCase()))
				.slice(0, 8);
			if (_Res.length > 0) {
				setSearchResults(_Res);
			} else {
				setSearchResults([
					{
						name: SearchTerm,
						following: false,
						privatelyFollowing: false,
					},
				]);
			}
		}
	}, [tags, debouncedSearchTerm]);

	const followedCount = useRef(tags.filter((o) => o.following).length);

	function onHashtagClicked(o: string) {
		setQuery({ id: o, label: o });
		setTimelineType(TimelineFetchMode.HASHTAG);
		setShowTimelineSelection(false);
	}

	return (
		<View style={{ flexGrow: 1, padding: 8 }}>
			<HideOnKeyboardVisibleContainer
				style={{
					marginVertical: 16,
					marginBottom: 0,
				}}
			>
				<Text style={{ color: theme.secondary.a20, marginTop: 16 }}>
					Search Results:
				</Text>
			</HideOnKeyboardVisibleContainer>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					flexGrow: 1,
				}}
			>
				{SearchResults.map((o, i: number) => (
					<Pressable
						key={i}
						style={{
							backgroundColor: 'rgba(240,185,56,0.16)', // '#363636',
							margin: 4,
							padding: 4,
							paddingHorizontal: 12,
							paddingVertical: 6,
							borderRadius: 4,
							flexShrink: 1,
						}}
						onPress={() => {
							onHashtagClicked(o.name);
						}}
					>
						<Text
							key={i}
							style={{
								maxWidth: 128,
								fontSize: 13,
								color: APP_THEME.COLOR_SCHEME_D_EMPHASIS,
								fontFamily: 'Montserrat-Bold',
							}}
							numberOfLines={1}
						>
							{o.name}
						</Text>
					</Pressable>
				))}
			</View>

			<View>
				<AppInput
					placeholder={'Search or Enter'}
					onChangeText={setSearchTerm}
				/>
			</View>
			<HideOnKeyboardVisibleContainer>
				<Text
					style={{
						color: theme.secondary.a20,
						fontSize: 11,
					}}
				>
					Cached: {tags.length}{' '}
					<Text
						style={{
							color: theme.secondary.a20,
							fontSize: 11,
						}}
					>
						(Public: {followedCount.current})
					</Text>
				</Text>
			</HideOnKeyboardVisibleContainer>
		</View>
	);
}

const styles = StyleSheet.create({
	hashtagContainer: {
		backgroundColor: 'rgba(240,185,56,0.16)', // '#363636',
		margin: 4,
		padding: 4,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 4,
		flexShrink: 1,
	},
});

export default TimelineWidgetHashtagScene;
