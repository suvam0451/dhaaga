import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useQuery } from '@tanstack/react-query';
import {
	ActivityPubStatuses,
	MediaAttachmentInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import MediaThumbnail from '../../media/Thumb';
import ImageGalleryCanvas from './ImageGalleryCanvas';

type FlashListItemProps = {
	selected: boolean;
	type: string;
	url: string;
	width: number;
	height: number;
	activeIndex: number;
	myIndex: number;
	onClick: (index: number) => void;
};

const FlashListItem = memo(
	({
		type,
		url,
		width,
		height,
		activeIndex,
		myIndex,
		onClick,
	}: FlashListItemProps) => {
		const selected = activeIndex === myIndex;
		return (
			<View
				style={{
					marginHorizontal: 4,
					borderColor: selected ? APP_THEME.COLOR_SCHEME_D_NORMAL : 'gray',
					borderWidth: 1.5,
					borderRadius: 8,
				}}
				onTouchEnd={() => {
					onClick(myIndex);
				}}
			>
				<MediaThumbnail
					type={type}
					url={url}
					width={width}
					height={height}
					size={64}
				/>
			</View>
		);
	},
);

type Props = {
	userId: string;
};

function SeeMore() {
	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: 64,
				height: 64,
				marginHorizontal: 4,
				borderColor: 'gray',
				borderWidth: 1,
				borderRadius: 4,
			}}
		>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_FONT.MONTSERRAT_BODY,
				}}
			>
				See
			</Text>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_FONT.MONTSERRAT_BODY,
				}}
			>
				More
			</Text>
		</View>
	);
}

function ProfileImageGallery({ userId }: Props) {
	const [IsVisible, setIsVisible] = useState(false);
	const { client, domain } = useActivityPubRestClientContext();
	const [Data, setData] = useState([]);
	const [MediaItems, setMediaItems] = useState<MediaAttachmentInterface[]>([]);
	const [MediaGalleryCtrl, setMediaGalleryCtrl] = useState({
		total: 0,
		curr: 0,
	});
	const [CurrentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		setData([]);
		setMediaGalleryCtrl({ total: 0, curr: 0 });
		setCurrentIndex(0);
	}, [userId]);

	async function fn() {
		const { data } = await client.accounts.statuses(userId, {
			limit: 40,
			userId,
			onlyMedia: true,
			excludeReblogs: true,
		});
		return data;
	}

	// Post Queries
	const { status, data, fetchStatus } = useQuery<ActivityPubStatuses>({
		queryKey: [client, userId],
		queryFn: fn,
		enabled: userId !== undefined,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		const is = ActivityPubAdapterService.adaptManyStatuses(data, domain);
		setData(is);

		let images = [];
		for (const i of is) {
			const count = i.getMediaAttachments().length;
			if (count > 0) {
				images.push(
					...i.getMediaAttachments().filter((o) => {
						if (['image/jpeg', 'image', 'image/webp'].includes(o.getType()))
							return true;
						console.log(
							'[WARN]: unknown image type in profile gallery',
							o.getType(),
						);
						return false;
					}),
				);
			}
		}
		setMediaItems(images);
		setMediaGalleryCtrl({ total: images.length, curr: 0 });
	}, [fetchStatus]);

	// const ListRef = useRef<FlashList<any>>(null);
	const ListRef = useRef<FlatList>(null);

	const onNext = useCallback(() => {
		if (MediaGalleryCtrl.total === 0) return;
		if (MediaGalleryCtrl.curr === MediaGalleryCtrl.total - 1) {
			setMediaGalleryCtrl({
				curr: 0,
				total: MediaGalleryCtrl.total,
			});
			setCurrentIndex(0);
			ListRef.current.scrollToIndex({ animated: true, index: 0 });
		} else {
			setMediaGalleryCtrl({
				curr: MediaGalleryCtrl.curr + 1,
				total: MediaGalleryCtrl.total,
			});
			setCurrentIndex(MediaGalleryCtrl.curr + 1);
			ListRef.current.scrollToIndex({
				animated: true,
				index: MediaGalleryCtrl.curr + 1,
			});
		}
	}, [MediaGalleryCtrl]);

	const onPrev = useCallback(() => {
		if (MediaGalleryCtrl.total === 0) return;
		if (MediaGalleryCtrl.curr === 0) {
			setMediaGalleryCtrl({
				curr: MediaGalleryCtrl.total - 1,
				total: MediaGalleryCtrl.total,
			});
			setCurrentIndex(MediaGalleryCtrl.total - 1);
			ListRef.current.scrollToIndex({
				animated: true,
				index: MediaGalleryCtrl.total - 1,
			});
		} else {
			setMediaGalleryCtrl({
				curr: MediaGalleryCtrl.curr - 1,
				total: MediaGalleryCtrl.total,
			});
			setCurrentIndex(MediaGalleryCtrl.curr - 1);
			ListRef.current.scrollToIndex({
				animated: true,
				index: MediaGalleryCtrl.curr - 1,
			});
		}
	}, [MediaGalleryCtrl, CurrentIndex]);

	const onThumbClick = useCallback((index: number) => {
		setCurrentIndex(index);
		setMediaGalleryCtrl((o) => ({ curr: index, total: o.total }));
	}, []);

	return (
		<View style={{ paddingHorizontal: 8 }}>
			<TouchableOpacity
				onPress={() => {
					if (MediaItems.length === 0) return;
					setIsVisible((o) => !o);
				}}
			>
				<View style={styles.expandableSectionMarkerContainer}>
					<Text style={styles.collapsibleProfileSectionText}>
						Gallery{' '}
						<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
							({MediaItems.length})
						</Text>
					</Text>
					<Ionicons
						name={IsVisible ? 'chevron-down' : 'chevron-forward'}
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>
			</TouchableOpacity>
			<View
				style={{
					display: IsVisible ? 'flex' : 'none',
					marginTop: 6,
				}}
			>
				<ImageGalleryCanvas
					src={MediaItems[CurrentIndex]?.getUrl()}
					width={MediaItems[CurrentIndex]?.getWidth()}
					height={MediaItems[CurrentIndex]?.getHeight()}
					onNext={onNext}
					onPrev={onPrev}
				/>
				<View>
					<FlatList
						ref={ListRef}
						contentContainerStyle={{ paddingTop: 12, paddingBottom: 12 }}
						ListFooterComponent={<SeeMore />}
						horizontal={true}
						data={MediaItems}
						renderItem={({ item, index }) => (
							<FlashListItem
								myIndex={index}
								activeIndex={CurrentIndex}
								onClick={onThumbClick}
								selected={false}
								type={item.getType()}
								url={item.getUrl()}
								width={item.getWidth()}
								height={item.getHeight()}
							/>
						)}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		backgroundColor: '#1c1c1c',
		left: 0,
		right: 0,
		width: '100%',
		zIndex: 1,
	},
	expandableSectionMarkerContainer: {
		marginVertical: 6,
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 16,
		paddingRight: 16,
		backgroundColor: '#272727',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 8,
	},
	collapsibleProfileSectionText: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: 'Montserrat-Bold',
		flexGrow: 1,
	},
});

export default ProfileImageGallery;
