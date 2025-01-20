import { useCallback, useEffect, useRef, useState } from 'react';
import { MediaAttachmentInterface } from '@dhaaga/bridge';
import { FlatList, View } from 'react-native';
import ImageGalleryCanvas from '../../../../../components/common/user/fragments/ImageGalleryCanvas';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../../../components/lib/Text';
import SeeMore from '../components/SeeMore';
import ThumbnailView from '../views/ThumbnailView';
import useProfileGalleryModeInteractor from '../interactors/useProfileGalleryModeInteractor';

type Props = {
	userId: string;
};

function ProfileGalleryModePresenter({ userId }: Props) {
	const { theme } = useAppTheme();
	const [MediaItems, setMediaItems] = useState<MediaAttachmentInterface[]>([]);
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
		let images = [];
		for (const i of data) {
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
					<ThumbnailView
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

export default ProfileGalleryModePresenter;
