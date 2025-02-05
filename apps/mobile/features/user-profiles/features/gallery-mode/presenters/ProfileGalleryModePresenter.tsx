import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import SeeMore from '../components/SeeMore';
import ThumbnailView from '../views/ThumbnailView';
import useProfileGalleryModeInteractor from '../interactors/useProfileGalleryModeInteractor';
import {
	AppMediaObject,
	AppPostObject,
} from '../../../../../types/app-post.types';
import MediaUtils from '../../../../../utils/media.utils';
import { appDimensions } from '../../../../../styles/dimensions';
import CanvasPresenter from './CanvasPresenter';
import MenuPresenter from './MenuPresenter';

const MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

type Props = {
	userId: string;
};

type MediaPostTuple = { media: AppMediaObject; post: AppPostObject };

function ProfileGalleryModePresenter({ userId }: Props) {
	const [MediaItems, setMediaItems] = useState<MediaPostTuple[]>([]);
	const [MediaGalleryCtrl, setMediaGalleryCtrl] = useState({
		total: 0,
		curr: 0,
	});
	const [CurrentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		setMediaGalleryCtrl({ total: 0, curr: 0 });
		setCurrentIndex(0);
	}, [userId]);
	const { data } = useProfileGalleryModeInteractor(userId);

	useEffect(() => {
		let images: MediaPostTuple[] = [];
		for (const item of data) {
			for (const mediaItem of item.content.media) {
				if (MediaUtils.isImageType(mediaItem.type)) {
					images.push({
						post: item,
						media: mediaItem,
					});
				}
			}
		}
		setMediaItems(images);
		setMediaGalleryCtrl({ total: images.length, curr: 0 });
	}, [data]);

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

	function onThumbClick(index: number) {
		setCurrentIndex(index);
		setMediaGalleryCtrl((o) => ({ curr: index, total: o.total }));
	}

	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<View
				style={{
					marginBottom: MARGIN_BOTTOM * 2,
					flex: 1,
				}}
			>
				{MediaItems[CurrentIndex] && (
					<CanvasPresenter
						src={MediaItems[CurrentIndex].media.url}
						width={MediaItems[CurrentIndex].media.width}
						height={MediaItems[CurrentIndex].media.height}
						onNext={onNext}
						onPrev={onPrev}
					/>
				)}
			</View>

			<MenuPresenter post={MediaItems[CurrentIndex]?.post} />

			<View>
				<FlatList
					ref={ListRef}
					contentContainerStyle={{ paddingBottom: 8, height: 84 }}
					ListFooterComponent={<SeeMore />}
					horizontal={true}
					data={MediaItems}
					renderItem={({ item, index }) => (
						<ThumbnailView
							myIndex={index}
							activeIndex={CurrentIndex}
							onClick={onThumbClick}
							selected={false}
							type={item.media.type}
							url={item.media.url}
							width={item.media.width}
							height={item.media.height}
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
		</View>
	);
}

export default ProfileGalleryModePresenter;
