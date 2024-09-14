import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useActivityPubRestClientContext } from '../../../../../../states/useActivityPubRestClient';
import { useQuery } from '@tanstack/react-query';
import {
	KNOWN_SOFTWARE,
	MediaAttachmentInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import ActivityPubAdapterService from '../../../../../../services/activitypub-adapter.service';
import { FlatList, View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../../../../../../styles/AppTheme';
import MediaThumbnail from '../../../../../common/media/Thumb';
import ImageGalleryCanvas from '../../../../../common/user/fragments/ImageGalleryCanvas';
import ProfileModuleFactory from './ProfileModuleFactory';
import { AppBskyFeedGetAuthorFeed } from '@atproto/api';

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
			bskyFilter:
				domain === KNOWN_SOFTWARE.BLUESKY ? 'posts_with_media' : undefined,
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
			domain === KNOWN_SOFTWARE.BLUESKY
				? ActivityPubAdapterService.adaptManyStatuses(
						(data as AppBskyFeedGetAuthorFeed.Response).data.feed,
						domain,
					)
				: ActivityPubAdapterService.adaptManyStatuses(data as any[], domain);
		setData(is);

		let images = [];
		for (const i of is) {
			const count = i.getMediaAttachments().length;
			if (count > 0) {
				images.push(
					...i.getMediaAttachments().filter((o) => {
						if (
							['image/jpeg', 'image', 'image/webp', 'gifv'].includes(
								o.getType(),
							)
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
		<ProfileModuleFactory
			style={{
				paddingHorizontal: 8,
			}}
			label={'Gallery'}
			subtext={`${MediaItems.length}`}
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
		</ProfileModuleFactory>
	);
}

export default ProfileImageGallery;
