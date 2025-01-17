import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import CollectionViewCtx from '../contexts/CollectionViewCtx';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';

function CollectionViewPresenter() {
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<CollectionViewCtx>
			<AppTopNavbar
				type={APP_TOPBAR_TYPE_ENUM.GENERIC}
				title={'Collection'}
				translateY={translateY}
			>
				<DataView />
			</AppTopNavbar>
		</CollectionViewCtx>
	);
}

export default CollectionViewPresenter;
