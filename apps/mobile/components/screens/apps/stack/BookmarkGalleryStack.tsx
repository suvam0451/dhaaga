import { ActivityIndicator, View, Text } from 'react-native';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import { APP_FONT } from '../../../../styles/AppTheme';
import WithBookmarkGalleryControllerContext, {
	useBookmarkGalleryControllerContext,
} from '../../../../states/useBookmarkGalleryController';
import BookmarkGalleryWidgetExpanded from '../../../widgets/bookmark-gallery/core/floatingWidget';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import WithScrollOnRevealContext from '../../../../states/useScrollOnReveal';
import { memo, useEffect, useRef } from 'react';

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
						color: APP_FONT.MONTSERRAT_BODY,
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

function ResultsRefreshing() {
	return (
		<View
			style={{
				marginTop: 54 + 8,
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Text
				style={{
					textAlign: 'center',
					fontSize: 20,
					color: APP_FONT.MONTSERRAT_BODY,
				}}
			>
				Loading Results
			</Text>
			<ActivityIndicator size={32} style={{ marginLeft: 8 }} />
		</View>
	);
}

function NothingToSeeHere() {
	return (
		<View
			style={{
				marginTop: 54 + 8,
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Text
				style={{
					textAlign: 'center',
					fontSize: 20,
					color: APP_FONT.MONTSERRAT_BODY,
				}}
			>
				No Results
			</Text>
		</View>
	);
}

type Props = {
	onScroll: any;
	resetPosition: () => void;
};

const ListHeaderComponent = memo(function Foo() {
	const { posts, isBuilding, isRefreshing } =
		useBookmarkGalleryControllerContext();

	if (isBuilding) return <LoadingState />;
	if (isRefreshing) return <ResultsRefreshing />;
	if (posts.length === 0) return <NothingToSeeHere />;
	return <View></View>;
});

function PostList({ onScroll, resetPosition }: Props) {
	const { posts } = useBookmarkGalleryControllerContext();

	useEffect(() => {
		return () => {
			resetPosition();
		};
	}, []);

	const ref = useRef(null);

	return <View />;
}

function Core() {
	const { posts, loadMore } = useBookmarkGalleryControllerContext();
	const { onScroll, translateY, resetPosition } = useScrollMoreOnPageEnd({
		itemCount: posts.length,
		updateQueryCache: loadMore,
	});

	return (
		<WithAutoHideTopNavBar title={'Bookmark Gallery'} translateY={translateY}>
			<View
				style={{
					height: '100%',
					display: 'flex',
				}}
			>
				<PostList onScroll={onScroll} resetPosition={resetPosition} />
				<BookmarkGalleryWidgetExpanded />
			</View>
		</WithAutoHideTopNavBar>
	);
}

function BookmarkGalleryStack() {
	return (
		<WithScrollOnRevealContext maxDisplacement={150}>
			<WithBookmarkGalleryControllerContext>
				<Core />
			</WithBookmarkGalleryControllerContext>
		</WithScrollOnRevealContext>
	);
}

export default BookmarkGalleryStack;
