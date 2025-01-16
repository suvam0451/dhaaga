import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { KNOWN_SOFTWARE, MediaAttachmentInterface } from '@dhaaga/bridge';
import ActivityPubAdapterService from '../../../../../../services/activitypub-adapter.service';
import { FlatList, View } from 'react-native';
import { APP_THEME } from '../../../../../../styles/AppTheme';
import MediaThumbnail from '../../../../../common/media/Thumb';
import ImageGalleryCanvas from '../../../../../common/user/fragments/ImageGalleryCanvas';
import { AppBskyFeedGetAuthorFeed } from '@atproto/api';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
	useAppApiClient,
	useAppTheme,
} from '../../../../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../../../lib/Text';

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
					marginHorizontal: 2,
					borderColor: selected ? APP_THEME.COLOR_SCHEME_D_NORMAL : 'gray',
					borderWidth: 0.25,
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
					size={72}
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
			<AppText.SemiBold>See</AppText.SemiBold>
			<AppText.SemiBold>More</AppText.SemiBold>
		</View>
	);
}

function ProfileImageGallery({ userId }: Props) {
	const { theme } = useAppTheme();
	const { client, driver } = useAppApiClient();
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
			bskyFilter:
				driver === KNOWN_SOFTWARE.BLUESKY ? 'posts_with_media' : undefined,
		});
		return data;
	}

	// Post Queries
	const { status, data, fetchStatus } = useQuery({
		queryKey: [client, userId],
		queryFn: fn,
		enabled: userId !== undefined,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		const is =
			driver === KNOWN_SOFTWARE.BLUESKY
				? ActivityPubAdapterService.adaptManyStatuses(
						(data as AppBskyFeedGetAuthorFeed.Response).data.feed,
						driver,
					)
				: ActivityPubAdapterService.adaptManyStatuses(data as any[], driver);
		setData(is);

		let images = [];
		for (const i of is) {
			const count = i.getMediaAttachments().length;
			if (count > 0) {
				images.push(
					...i.getMediaAttachments().filter((o) => {
						if (
							[
								'image/jpeg',
								'image/png',
								'image',
								'image/webp',
								'gifv',
							].includes(o.getType())
						)
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
		<View>
			<View style={{ marginHorizontal: 10 }}>
				<ImageGalleryCanvas
					src={MediaItems[CurrentIndex]?.getUrl()}
					width={MediaItems[CurrentIndex]?.getWidth()}
					height={MediaItems[CurrentIndex]?.getHeight()}
					onNext={onNext}
					onPrev={onPrev}
				/>
			</View>

			<View
				style={{
					height: 48,
					width: 256,
					backgroundColor: theme.background.a40,
					zIndex: 99,
					opacity: 0.75,
					borderRadius: 16,
					marginVertical: 16,
					alignSelf: 'center',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Ionicons
						name={'heart-outline'}
						size={24}
						color={theme.secondary.a10}
						style={{ width: 24 }}
					/>
					<AppText.Medium
						style={{
							marginLeft: 6,
							fontSize: 16,
						}}
					>
						24
					</AppText.Medium>
				</View>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Ionicons
						name={'heart-outline'}
						size={24}
						color={theme.textColor.medium}
						style={{ width: 24 }}
					/>
					<AppText.Medium
						style={{
							marginLeft: 6,
							fontSize: 16,
						}}
					>
						0
					</AppText.Medium>
				</View>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Ionicons
						name={'heart-outline'}
						size={24}
						color={theme.textColor.medium}
						style={{ width: 24 }}
					/>
					<AppText.Medium
						style={{
							marginLeft: 6,
							fontSize: 16,
						}}
					>
						24
					</AppText.Medium>
				</View>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Ionicons
						name={'cloud-download-outline'}
						size={24}
						color={theme.textColor.medium}
						style={{ width: 24 }}
					/>
				</View>
			</View>

			<FlatList
				ref={ListRef}
				contentContainerStyle={{ paddingBottom: 24 }}
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
				onScrollToIndexFailed={(info) => {
					const wait = new Promise((resolve) => setTimeout(resolve, 500));
					wait.then(() => {
						ListRef.current?.scrollToIndex({
							index: info.index,
							animated: true,
						});
					});
				}}
			/>
		</View>
	);
}

export default ProfileImageGallery;
