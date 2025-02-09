import { FlatList } from 'react-native';
import { appDimensions } from '../../../styles/dimensions';
import { AppMediaObject, AppPostObject } from '../../../types/app-post.types';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import MediaThumbView from '../view/MediaThumbView';
import { useAppDialog } from '../../../hooks/utility/global-state-extractors';

type Props = {
	items: AppMediaObject[];
	post: AppPostObject;
	server?: KNOWN_SOFTWARE;
};

function MediaThumbListPresenter({ items, post, server }: Props) {
	const { show } = useAppDialog();
	function onPress() {}

	function onLongPress() {}

	return (
		<FlatList
			horizontal={true}
			data={items}
			renderItem={(item) => (
				<MediaThumbView
					url={item.item.previewUrl}
					onPress={onPress}
					onLongPress={onLongPress}
				/>
			)}
			style={{
				marginBottom: appDimensions.timelines.sectionBottomMargin,
				marginTop: 8,
			}}
		/>
	);
}

export default MediaThumbListPresenter;
