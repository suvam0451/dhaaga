import CollectionDetailCtx from './contexts/CollectionDetailCtx';
import CollectionDetailPresenter from './presenters/CollectionDetailPresenter';

function CollectionView() {
	return (
		<CollectionDetailCtx>
			<CollectionDetailPresenter />
		</CollectionDetailCtx>
	);
}

export default CollectionView;
