import { FlatList } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import type {
	PostMediaAttachmentType,
	PostObjectType,
} from '@dhaaga/bridge/typings';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import MediaThumbView from '../view/MediaThumbView';
import { useAppDialog } from '#/hooks/utility/global-state-extractors';

type Props = {
	items: PostMediaAttachmentType[];
	post: PostObjectType;
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
				marginBottom:
					items.length > 0 ? appDimensions.timelines.sectionBottomMargin : 0,
			}}
		/>
	);
}

export default MediaThumbListPresenter;
