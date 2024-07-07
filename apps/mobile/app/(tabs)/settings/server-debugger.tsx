import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { useQuery } from '@realm/react';
import { ActivityPubServer } from '../../../entities/activitypub-server.entity';
import { memo, useEffect, useState } from 'react';
import { APP_FONT } from '../../../styles/AppTheme';
import { AnimatedFlashList } from '@shopify/flash-list';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import Logo from '../../../assets/branding/mastodon/Logo';
import WithAutoHideTopNavBar from '../../../components/containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { FontAwesome } from '@expo/vector-icons';
import AddServerWidget from '../../../components/widgets/add-server/core/floatingWidget';

type ServerItemProps = {
	url: string;
	software: KNOWN_SOFTWARE;
	emojiCount: number;
};

const SortControllerItem = memo(function Foo({}) {
	return (
		<View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					marginTop: 16,
					marginBottom: 8,
					alignItems: 'center',
				}}
			>
				<View style={{ marginHorizontal: 8, opacity: 0.6 }}>
					<FontAwesome name="sort" size={20} color={APP_FONT.MONTSERRAT_BODY} />
				</View>
				<View
					style={{
						borderRadius: 8,
						backgroundColor: '#1e1e1e',
						padding: 8,
						marginRight: 8,
					}}
				>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							fontFamily: 'Montserrat-Bold',
						}}
					>
						A-Z
					</Text>
				</View>
				<View
					style={{
						borderRadius: 8,
						backgroundColor: '#1e1e1e',
						padding: 8,
						marginRight: 8,
					}}
				>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							fontFamily: 'Montserrat-Bold',
						}}
					>
						Related
					</Text>
				</View>
				<View
					style={{
						borderRadius: 8,
						backgroundColor: '#1e1e1e',
						padding: 8,
						marginRight: 8,
					}}
				>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							fontFamily: 'Montserrat-Bold',
						}}
					>
						Known
					</Text>
				</View>
				<View
					style={{
						borderRadius: 8,
						backgroundColor: '#1e1e1e',
						padding: 8,
						marginRight: 8,
					}}
				>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							fontFamily: 'Montserrat-Bold',
						}}
					>
						Software
					</Text>
				</View>
			</View>
			<Text style={{ color: APP_FONT.MONTSERRAT_BODY, marginBottom: 8 }}>
				This is a list of servers known to Dhaaga:
			</Text>
		</View>
	);
});

const ServerItem = memo(function Foo({
	url,
	software,
	emojiCount,
}: ServerItemProps) {
	return (
		<View
			style={{
				marginBottom: 4,
				backgroundColor: '#1e1e1e',
				padding: 8,
				borderRadius: 8,
			}}
		>
			<View style={{ display: 'flex', flexDirection: 'row', flexShrink: 1 }}>
				<View
					style={{
						flex: 1,
						flexGrow: 1,
						justifyContent: 'space-between',
					}}
				>
					<Text
						style={{
							fontFamily: 'Montserrat-Bold',
							color: APP_FONT.MONTSERRAT_HEADER,
						}}
					>
						{url}
					</Text>
				</View>
				<View
					style={{
						flex: 1,
						justifyContent: 'flex-end',
						alignItems: 'center',
						display: 'flex',
						flexDirection: 'row',
						// opacity: 0.87,
					}}
				>
					{/*< */}
					<View style={{ height: 32, width: 32, marginLeft: 4, opacity: 0.87 }}>
						<Logo />
					</View>
				</View>
			</View>
			<Text style={{ color: APP_FONT.MONTSERRAT_BODY, fontSize: 12 }}>
				Emojis cached: {emojiCount}
			</Text>
		</View>
	);
});

// A message can be either a text or an image
enum ListItemType {
	SortController,
	ListItem,
}

interface TextMessage {
	props: null;
	type: ListItemType.SortController;
}

interface ImageMessage {
	props: ServerItemProps;
	type: ListItemType.ListItem;
}

type ListItem = TextMessage | ImageMessage;

const FlashListRenderer = ({ item }: { item: ListItem }) => {
	switch (item.type) {
		case ListItemType.SortController:
			return <SortControllerItem />;
		case ListItemType.ListItem:
			return (
				<ServerItem
					url={item.props.url}
					software={item.props.software}
					emojiCount={item.props.emojiCount}
				/>
			);
	}
};

function ServerDebuggerStack() {
	const servers = useQuery(ActivityPubServer);
	const [SearchResults, setSearchResults] = useState<ActivityPubServer[]>([]);
	const [FlashListProps, setFlashListProps] = useState<ListItem[]>([]);

	useEffect(() => {
		const lens = servers.map((o) => {
			console.log(o.user);
		});
		console.log(lens);

		setSearchResults(servers.slice(0, 10));
		setFlashListProps([
			{ type: ListItemType.SortController },
			...servers.slice(0, 10).map((o) => ({
				type: ListItemType.ListItem,
				props: {
					url: o.url,
					software: o.type,
					emojiCount: o.emojis.length,
				},
			})),
		]);
	}, [servers]);

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: SearchResults.length,
		updateQueryCache: () => {},
	});

	return (
		<View style={{ backgroundColor: '#121212', height: '100%' }}>
			<WithAutoHideTopNavBar title={'Known Servers'} translateY={translateY}>
				<AnimatedFlashList
					estimatedItemSize={48}
					renderItem={FlashListRenderer}
					contentContainerStyle={{ paddingTop: 54 }}
					data={FlashListProps}
					onScroll={onScroll}
				/>
			</WithAutoHideTopNavBar>
			<AddServerWidget
				onPress={() => {
					console.log('Widget Clicked!');
				}}
			/>
		</View>
	);
}

export default ServerDebuggerStack;
