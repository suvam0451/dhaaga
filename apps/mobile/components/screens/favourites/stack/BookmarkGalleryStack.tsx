import { ActivityIndicator, ScrollView, View } from 'react-native';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import { useState } from 'react';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';
import RealmStatus from '../../../common/status/RealmStatus';
import useBookmarkGalleryBuilder from '../../../../hooks/realm/useBookmarkGalleryBuilder';
import WithBookmarkGalleryControllerContext from '../../../../states/useBookmarkGalleryController';
import BookmarkGalleryWidgetExpanded from '../../../widgets/bookmark-gallery/core/floatingWidget';

function LoadingState() {
	return (
		<View
			style={{
				marginTop: 16,
				display: 'flex',
				flexDirection: 'row',
				paddingHorizontal: 32,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<View style={{ flexShrink: 1 }}>
				<Text
					style={{
						fontFamily: 'Montserrat-Bold',
						fontSize: 16,
						color: APP_FONT.MONTSERRAT_HEADER,
					}}
				>
					Loading Gallery
				</Text>
			</View>
			<View style={{ marginLeft: 8 }}>
				<ActivityIndicator size={28} color={APP_FONT.MONTSERRAT_BODY} />
			</View>
		</View>
	);
}

function BookmarkGalleryStack() {
	const [Offset, setOffset] = useState(0);

	const { acct, LoadedData, LoadedTagData, postsToShow, isBuilding } =
		useBookmarkGalleryBuilder({
			q: '',
			offset: Offset,
			limit: 10,
		});

	return (
		<WithAutoHideTopNavBar title={'Bookmark Gallery'}>
			{isBuilding ? (
				<LoadingState />
			) : (
				<View
					style={{
						height: '100%',
						display: 'flex',
						paddingBottom: 54,
					}}
				>
					<ScrollView style={{ flexGrow: 1 }}>
						{postsToShow.map((o, i) => (
							<RealmStatus key={i} _id={o._id} />
						))}
					</ScrollView>

					{/*This is an absolutely positioned component*/}
					<WithBookmarkGalleryControllerContext
						acct={acct}
						loadedUserData={LoadedData}
						loadedTagData={LoadedTagData}
						isBuilding={isBuilding}
						isRefreshing={false}
					>
						<BookmarkGalleryWidgetExpanded />
					</WithBookmarkGalleryControllerContext>
				</View>
			)}
		</WithAutoHideTopNavBar>
	);
}

export default BookmarkGalleryStack;
