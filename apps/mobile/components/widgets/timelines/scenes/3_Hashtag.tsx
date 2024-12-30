import { Pressable, StyleSheet, View } from 'react-native';
import { useTimelineController } from '../../../common/timeline/api/useTimelineController';
import { Button, Text } from '@rneui/themed';
import { useEffect, useRef, useState } from 'react';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useDebounce } from 'use-debounce';
import AppInput from '../../../lib/Inputs';
import HideOnKeyboardVisibleContainer from '../../../containers/HideOnKeyboardVisibleContainer';
import AppButtonGroup from '../../../lib/ButtonGroups';
import Ionicons from '@expo/vector-icons/Ionicons';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { TimelineFetchMode } from '../../../../states/reducers/post-timeline.reducer';

type SearchResults = {
	following: boolean;
	name: string;
	privatelyFollowing: boolean;
};

type Props = {
	id: string;
	clear: () => void;
};

function TimelineWidgetHashtagOptions(props: Props) {
	const { acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);

	const [SelectedIndexA, setSelectedIndexA] = useState(0);
	const [SelectedIndexB, setSelectedIndexB] = useState(0);

	function onClear() {
		props.clear();
	}

	return (
		<View style={{ height: '100%' }}>
			<View
				style={[
					styles.hashtagContainer,
					{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						marginTop: 8,
					},
				]}
			>
				<View
					style={{ width: 24, margin: -4, padding: 4 }}
					onTouchStart={onClear}
				>
					<FontAwesome5
						name="chevron-left"
						size={20}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>
				<View style={{ flex: 1 }}>
					<Text
						style={{
							fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
							color: APP_FONT.MONTSERRAT_BODY,
							textAlign: 'center',
						}}
					>
						#{props.id}
					</Text>
				</View>
				<View style={{ width: 24 }}></View>
			</View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					borderRadius: 8,
					backgroundColor: '#363636',
					padding: 8,
					marginHorizontal: 8,
					marginTop: 32,
				}}
			>
				<View
					style={{
						flexGrow: 1,
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<FontAwesome6
						name="server"
						size={16}
						style={{ width: 24, opacity: 0.75, marginTop: 2 }}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
					<Text
						style={{
							fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
							color: APP_FONT.MONTSERRAT_BODY,
						}}
					>
						{acct?.server}
					</Text>
				</View>
				<View>
					<FontAwesome5
						name="chevron-right"
						size={18}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>
			</View>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					fontSize: 12,
					color: APP_THEME.COLOR_SCHEME_C,
					marginHorizontal: 10,
					marginTop: 4,
				}}
			>
				Remote hashtag browsing is WIP
			</Text>

			<View style={{ flexGrow: 1, marginTop: 32 }}>
				<Text
					style={{
						fontFamily: 'Montserrat-Bold',
						color: APP_FONT.MONTSERRAT_BODY,
						paddingHorizontal: 8,
					}}
				>
					Timeline options:
				</Text>
				<AppButtonGroup
					options={['All', 'Local', 'Remote']}
					selectedIndex={SelectedIndexA}
					onPress={setSelectedIndexA}
				/>
				<AppButtonGroup
					options={['All', 'Media Only']}
					selectedIndex={SelectedIndexB}
					onPress={setSelectedIndexB}
				/>
			</View>

			<View>
				<Button
					buttonStyle={{
						backgroundColor: APP_THEME.COLOR_SCHEME_B,
					}}
					// onPress={onClickGoToSocialHub}
				>
					<Ionicons
						name="navigate"
						size={20}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
					<Text
						style={{ fontFamily: 'Inter-Bold', marginLeft: 4, fontSize: 16 }}
					>
						Browse
					</Text>
				</Button>
			</View>
		</View>
	);
}

function TimelineWidgetHashtagScene() {
	const { setTimelineType, setQuery, setShowTimelineSelection } =
		useTimelineController();
	const [SearchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm] = useDebounce(SearchTerm, 100);

	const tags = [];
	// const tags = useQuery(ActivityPubTag);
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
				<Text style={{ color: APP_FONT.MONTSERRAT_BODY, marginTop: 16 }}>
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
						color: APP_FONT.MONTSERRAT_BODY,
						fontSize: 11,
					}}
				>
					Cached: {tags.length}{' '}
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
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
