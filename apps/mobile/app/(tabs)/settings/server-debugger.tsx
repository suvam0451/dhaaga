import { View } from 'react-native';
import { Skeleton, Text } from '@rneui/themed';
import { useQuery } from '@realm/react';
import { ActivityPubServer } from '../../../entities/activitypub-server.entity';
import { memo, useEffect, useRef, useState } from 'react';
import { APP_FONT } from '../../../styles/AppTheme';
import { AnimatedFlashList } from '@shopify/flash-list';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import WithAutoHideTopNavBar from '../../../components/containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { FontAwesome } from '@expo/vector-icons';
import AddServerWidget from '../../../components/widgets/add-server/core/floatingWidget';
import { useAssets } from 'expo-asset';
import { Image } from 'expo-image';
import KnownServersDrawer from '../../../components/drawers/known-servers';
import WithAppDrawerContext from '../../../states/useAppDrawer';
import KnownServerSearchWidget from '../../../components/widgets/add-server/core/floatingSearch';
import WithLocalAppMenuControllerContext from '../../../components/shared/fab/hooks/useFabController';
import WithSearchTermContext, {
	useSearchTermContext,
} from '../../../hooks/forms/useSearchTerm';
import HideOnKeyboardVisibleContainer from '../../../components/containers/HideOnKeyboardVisibleContainer';
import { useAppAssetsContext } from '../../../hooks/app/useAssets';

type ServerItemProps = {
	url: string;
	software: KNOWN_SOFTWARE;
	emojiCount: number;
};

type ControllerProps = {
	softwareServerCount: Map<string, { count: number }>;
};

type SoftwareStatItem = {
	label: string;
	count: number;
	bgColor: string;
	imgUrl: string;
	width: number;
	height: number;
};

type InstanceSoftwareCountIndicatorProps = SoftwareStatItem;

const InstanceSoftwareCountIndicator = memo(function Foo(
	o: InstanceSoftwareCountIndicatorProps,
) {
	const [IsTextExpanded, setIsTextExpanded] = useState(false);

	function toggleTextExpansion() {
		setIsTextExpanded(!IsTextExpanded);
	}

	return (
		<View
			style={{
				backgroundColor: o.bgColor,
				display: 'flex',
				flexDirection: 'row',
				padding: 8,
				borderRadius: 8,
				marginVertical: 4,
				marginRight: 8,
			}}
			onTouchStart={toggleTextExpansion}
		>
			<View style={{ marginRight: 4 }}>
				{/*@ts-ignore-next-line*/}
				<Image
					source={o.imgUrl}
					style={{ width: o.width, height: o.height, opacity: 0.75 }}
				/>
			</View>

			<Text
				style={{
					marginLeft: 8,
					fontFamily: 'Montserrat-Bold',
					color: APP_FONT.MONTSERRAT_BODY,
				}}
			>
				{o.count}
			</Text>
		</View>
	);
});

const SortControllerItem = memo(function Foo({
	softwareServerCount,
}: ControllerProps) {
	const [Data, setData] = useState<SoftwareStatItem[]>([]);
	const [IsAssetsLoaded, setIsAssetsLoaded] = useState(false);

	const [assets, error] = useAssets([
		require('../../../assets/branding/akomma/logo.png'),
		require('../../../assets/branding/firefish/logo.png'),
		require('../../../assets/branding/mastodon/logo.png'),
		require('../../../assets/branding/misskey/logo.png'),
		require('../../../assets/branding/pleroma/logo.png'),
		require('../../../assets/branding/iceshrimp/logo.png'),
		require('../../../assets/branding/gotosocial/logo.png'),
		require('../../../assets/branding/sharkey/logo.png'),
		require('../../../assets/branding/peertube/logo.png'),
		require('../../../assets/branding/pixelfed/logo.png'),
		require('../../../assets/branding/cherrypick/logo.png'),
		require('../../../assets/branding/friendica/logo.png'),
		require('../../../assets/branding/lemmy/logo.png'),
		require('../../../assets/branding/kmyblue/logo.png'),
		require('../../../assets/branding/fedi/logo.png'),
	]);

	function getIcon(input: string) {
		switch (input as KNOWN_SOFTWARE) {
			case KNOWN_SOFTWARE.AKKOMA:
				return { imgUrl: assets[0].localUri, width: 24, height: 24 };
			case KNOWN_SOFTWARE.FIREFISH:
				return { imgUrl: assets[1].localUri, width: 24, height: 24 };
			case KNOWN_SOFTWARE.HOMETOWN:
			case KNOWN_SOFTWARE.MASTODON:
				return { imgUrl: assets[2].localUri, width: 24, height: 24 };
			case KNOWN_SOFTWARE.MEISSKEY:
			case KNOWN_SOFTWARE.MISSKEY:
				return { imgUrl: assets[3].localUri, width: 32, height: 24 };
			case KNOWN_SOFTWARE.PLEROMA:
				return { imgUrl: assets[4].localUri, width: 14, height: 24 };
			case KNOWN_SOFTWARE.ICESHRIMP:
				return { imgUrl: assets[5].localUri, width: 24, height: 24 };
			case KNOWN_SOFTWARE.GOTOSOCIAL:
				return {
					imgUrl: assets[6].localUri,
					width: 28,
					height: 24,
				};
			case KNOWN_SOFTWARE.SHARKEY: {
				return {
					imgUrl: assets[7].localUri,
					width: 28,
					height: 24,
				};
			}
			case KNOWN_SOFTWARE.PEERTUBE: {
				return {
					imgUrl: assets[8].localUri,
					width: 20,
					height: 24,
				};
			}
			case KNOWN_SOFTWARE.PIXELFED: {
				return { imgUrl: assets[9].localUri, width: 24, height: 24 };
			}
			case KNOWN_SOFTWARE.CHERRYPICK: {
				return { imgUrl: assets[10].localUri, width: 148, height: 24 };
			}
			case KNOWN_SOFTWARE.FRIENDICA: {
				return { imgUrl: assets[11].localUri, width: 24, height: 24 };
			}
			case KNOWN_SOFTWARE.LEMMY: {
				return { imgUrl: assets[12].localUri, width: 24, height: 24 };
			}
			// hometown is clubbed with mastodon
			// meisskey is clubbed with misskey
			case KNOWN_SOFTWARE.KMYBLUE: {
				return { imgUrl: assets[13].localUri, width: 24, height: 24 };
			}

			case KNOWN_SOFTWARE.UNKNOWN:
			default:
				return { imgUrl: assets[14].localUri, width: 24, height: 24 };
		}
	}

	useEffect(() => {
		setIsAssetsLoaded(!error && assets?.every((o) => o?.downloaded));
	}, [assets, error]);

	function getBgColor(input: string) {
		switch (input) {
			// case KNOWN_SOFTWARE.MASTODON:
			// 	return '#6364FF';
			default:
				return '#1e1e1e';
		}
	}

	const noResults = useRef(false);

	useEffect(() => {
		if (!IsAssetsLoaded) return;

		const items: SoftwareStatItem[] = [];
		noResults.current = softwareServerCount.size === 0;

		// @ts-ignore-next-line
		for (let [key, value] of softwareServerCount) {
			items.push({
				label: key,
				count: value.count,
				bgColor: getBgColor(key),
				...getIcon(key),
			});
		}
		setData(items);
	}, [softwareServerCount, IsAssetsLoaded]);

	const { searchText } = useSearchTermContext();

	if (!IsAssetsLoaded) {
		return (
			<View>
				<Skeleton style={{ width: '100%', height: 32 }} />
			</View>
		);
	}

	return (
		<View>
			{noResults.current ? <Text>No Results</Text> : <View></View>}
			<HideOnKeyboardVisibleContainer>
				{searchText && searchText !== '' ? (
					<View></View>
				) : (
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							// marginBottom: 8,
							textAlign: 'center',
							fontSize: 16,
							fontFamily: 'Montserrat-Bold',
							marginTop: 24,
							marginBottom: 16,
						}}
					>
						You have met all these instances !
					</Text>
				)}

				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						flexWrap: 'wrap',
						marginHorizontal: 8,
					}}
				>
					{Data.map((o, i) => (
						<InstanceSoftwareCountIndicator
							key={i}
							count={o.count}
							height={o.height}
							width={o.width}
							label={o.label}
							imgUrl={o.imgUrl}
							bgColor={o.bgColor}
						/>
					))}
				</View>
			</HideOnKeyboardVisibleContainer>

			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					marginTop: 16,
					marginBottom: 12,
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
				{/*<View*/}
				{/*	style={{*/}
				{/*		borderRadius: 8,*/}
				{/*		backgroundColor: '#1e1e1e',*/}
				{/*		padding: 8,*/}
				{/*		marginRight: 8,*/}
				{/*	}}*/}
				{/*>*/}
				{/*	<Text*/}
				{/*		style={{*/}
				{/*			color: APP_FONT.MONTSERRAT_BODY,*/}
				{/*			fontFamily: 'Montserrat-Bold',*/}
				{/*		}}*/}
				{/*	>*/}
				{/*		Related*/}
				{/*	</Text>*/}
				{/*</View>*/}
				{/*<View*/}
				{/*	style={{*/}
				{/*		borderRadius: 8,*/}
				{/*		backgroundColor: '#1e1e1e',*/}
				{/*		padding: 8,*/}
				{/*		marginRight: 8,*/}
				{/*	}}*/}
				{/*>*/}
				{/*	<Text*/}
				{/*		style={{*/}
				{/*			color: APP_FONT.MONTSERRAT_BODY,*/}
				{/*			fontFamily: 'Montserrat-Bold',*/}
				{/*		}}*/}
				{/*	>*/}
				{/*		Known*/}
				{/*	</Text>*/}
				{/*</View>*/}
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
		</View>
	);
});

const ServerItem = memo(function Foo({
	url,
	software,
	emojiCount,
}: ServerItemProps) {
	const { getBrandLogo } = useAppAssetsContext();

	const renderData = getBrandLogo(software);
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
							color: APP_FONT.MONTSERRAT_BODY,
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
						{/*@ts-ignore-next-line*/}
						<Image
							source={renderData.imgUrl}
							style={{
								width: renderData.width,
								height: renderData.height,
								opacity: 0.87,
							}}
						/>
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
	props: {
		softwareServerCount: Map<string, { count: number }>;
	};
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
			return (
				<SortControllerItem
					softwareServerCount={item.props.softwareServerCount}
				/>
			);
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

function ServerDebuggerStackBase() {
	const servers = useQuery(ActivityPubServer);
	const [SearchResults, setSearchResults] = useState<ActivityPubServer[]>([]);
	const [FlashListProps, setFlashListProps] = useState<ListItem[]>([]);
	const { searchText } = useSearchTermContext();
	const { isAssetsLoaded } = useAppAssetsContext();

	useEffect(() => {
		const mapper = new Map<string, { count: number }>();

		let serversFiltered = servers;
		if (searchText && searchText !== '') {
			serversFiltered = servers.filter((o) => o.url.includes(searchText));
		}

		for (const server of serversFiltered) {
			if (mapper.has(server.type.toLowerCase())) {
				mapper.get(server.type.toLowerCase()).count++;
			} else {
				mapper.set(server.type.toLowerCase(), { count: 1 });
			}
		}

		setSearchResults(serversFiltered.slice(0, 10));
		setFlashListProps([
			{
				type: ListItemType.SortController,
				props: {
					softwareServerCount: mapper,
				},
			},
			...serversFiltered.slice(0, 10).map((o) => ({
				type: ListItemType.ListItem,
				props: {
					url: o.url,
					software: o.type,
					emojiCount: o.emojis.length,
				},
			})),
		]);
	}, [servers, searchText]);

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: SearchResults.length,
		updateQueryCache: () => {},
	});

	if (!isAssetsLoaded) {
		return <View style={{ backgroundColor: '#121212', height: '100%' }} />;
	}

	return (
		<View style={{ backgroundColor: '#121212', height: '100%' }}>
			<KnownServersDrawer>
				<WithAutoHideTopNavBar title={'Known Servers'} translateY={translateY}>
					<AnimatedFlashList
						estimatedItemSize={48}
						renderItem={FlashListRenderer}
						contentContainerStyle={{ paddingTop: 54 }}
						data={FlashListProps}
						onScroll={onScroll}
					/>
				</WithAutoHideTopNavBar>
			</KnownServersDrawer>
			<AddServerWidget
				onPress={() => {
					console.log('Widget Clicked!');
				}}
			/>
			<KnownServerSearchWidget />
		</View>
	);
}

function ServerDebuggerStack() {
	return (
		<WithSearchTermContext>
			<WithLocalAppMenuControllerContext>
				<WithAppDrawerContext>
					<ServerDebuggerStackBase />
				</WithAppDrawerContext>
			</WithLocalAppMenuControllerContext>
		</WithSearchTermContext>
	);
}

export default ServerDebuggerStack;
