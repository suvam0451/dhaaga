import useCollectionDetailInteractor from '../interactors/useCollectionDetailInteractor';
import CollectionDetailView from '../views/CollectionDetailView';
import CollectionDetailWidget from '../components/CollectionDetailWidget';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import CollectionEmpty from '../components/CollectionEmpty';

function CollectionDetailPresenter() {
	const { state, onRefresh, IsRefreshing } = useCollectionDetailInteractor();
	const { translateY, onScroll } = useScrollMoreOnPageEnd();

	if (state.posts.length === 0)
		return (
			<AppTopNavbar
				type={APP_TOPBAR_TYPE_ENUM.GENERIC}
				title={'Collection'}
				translateY={translateY}
			>
				<CollectionEmpty />
			</AppTopNavbar>
		);

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={'Collection'}
			translateY={translateY}
		>
			<CollectionDetailView
				items={state.results}
				onRefresh={onRefresh}
				refreshing={IsRefreshing}
				onScroll={onScroll}
			/>
			<CollectionDetailWidget />
		</AppTopNavbar>
	);
}

export default CollectionDetailPresenter;
