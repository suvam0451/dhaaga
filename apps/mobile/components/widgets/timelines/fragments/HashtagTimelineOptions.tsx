import { Pressable, View } from 'react-native';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import {
	TimelineFetchMode,
	useTimelineControllerContext,
} from '../../../../states/useTimelineController';
import { useQuery } from '@realm/react';
import { ActivityPubTag } from '../../../../entities/activitypub-tag.entity';
import { Input, Text } from '@rneui/themed';
import React, { useEffect, useRef, useState } from 'react';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import useKeyboard from '../../../hooks/useKeyboard';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useDebounce } from 'use-debounce';

type SearchResults = {
	following: boolean;
	name: string;
	privatelyFollowing: boolean;
};

function HashtagTimelineOptions() {
	const { client, primaryAcct } = useActivityPubRestClientContext();
	const username = primaryAcct.username;
	const subdomain = primaryAcct.subdomain;
	const { setTimelineType, setQueryOptions, setShowTimelineSelection } =
		useTimelineControllerContext();
	const [SearchTerm, setSearchTerm] = useState('');
	const { KeyboardVisible } = useKeyboard();

	const [debouncedSearchTerm] = useDebounce(SearchTerm, 100);

	const tags = useQuery(ActivityPubTag);
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
		setQueryOptions({ hashtagName: o });
		setTimelineType(TimelineFetchMode.HASHTAG);
		setShowTimelineSelection(false);
	}

	return (
		<View style={{ flexGrow: 1, padding: 8 }}>
			<View
				style={{
					marginVertical: 16,
					display: KeyboardVisible ? 'none' : 'flex',
				}}
			>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						borderRadius: 8,
						backgroundColor: '#363636',
						padding: 8,
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
								fontFamily: 'Montserrat-Bold',
								color: APP_FONT.MONTSERRAT_BODY,
							}}
						>
							{subdomain}
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
					}}
				>
					Remote hashtag browsing is WIP
				</Text>
			</View>
			<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>Search Results:</Text>
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
				<Input
					multiline={false}
					placeholder={'Search or Enter'}
					containerStyle={{
						borderBottomWidth: 0,
						paddingBottom: 0,
						marginBottom: -16,
					}}
					onChangeText={setSearchTerm}
					inputContainerStyle={{
						borderBottomWidth: 0,
					}}
					inputStyle={{
						paddingHorizontal: 16,
						color: '#fff',
					}}
					style={{
						color: APP_FONT.MONTSERRAT_HEADER,
						fontSize: 16,
						opacity: 0.87,
						marginHorizontal: -8,
						backgroundColor: '#363636',
					}}
					labelStyle={{
						color: '#fff',
					}}
				/>
			</View>
			<Text
				style={{
					color: APP_FONT.MONTSERRAT_BODY,
					fontSize: 11,
					display: KeyboardVisible ? 'none' : 'flex',
				}}
			>
				Cached: {tags.length}{' '}
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						fontSize: 11,
						// fontStyle: 'italic',
					}}
				>
					(Public: {followedCount.current})
				</Text>
			</Text>
		</View>
	);
}

export default HashtagTimelineOptions;
