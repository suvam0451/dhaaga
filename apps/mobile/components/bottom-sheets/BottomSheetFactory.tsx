import { memo, useMemo } from 'react';
import globalMmkvCacheServices from '../../services/globalMmkvCache.services';
import { View } from 'react-native';
import HashtagBottomSheet from './Hashtag';
import ExternalLinkActionSheet from './Link';
import PostComposerBottomSheet from './PostComposer';
import WithActivitypubStatusContext from '../../states/useStatus';
import Status from './Status';
import { BOTTOM_SHEET_ENUM } from '../../states/useGorhomBottomSheet';
import { useGlobalMmkvContext } from '../../states/useGlobalMMkvCache';
import BottomSheetAddReaction from './modules/BottomSheetAddReaction';

type BottomSheetFactoryProps = {
	type: string;
	requestId: string;
};

/**
 * Content mapper for the Gorhom
 * bottom sheet
 */
const BottomSheetFactory = memo(
	({ type, requestId }: BottomSheetFactoryProps) => {
		const { globalDb } = useGlobalMmkvContext();

		return useMemo(() => {
			switch (type) {
				case BOTTOM_SHEET_ENUM.HASHTAG: {
					const x =
						globalMmkvCacheServices.getBottomSheetProp_Hashtag(globalDb);
					if (!x) return <View></View>;
					return <HashtagBottomSheet visible={true} id={x.name} />;
				}
				case BOTTOM_SHEET_ENUM.LINK: {
					const x = globalMmkvCacheServices.getBottomSheetProp_Link(globalDb);
					if (!x) return <View></View>;
					return (
						<ExternalLinkActionSheet url={x.url} displayName={x.displayName} />
					);
				}
				case BOTTOM_SHEET_ENUM.STATUS_COMPOSER: {
					return <PostComposerBottomSheet />;
				}
				case BOTTOM_SHEET_ENUM.STATUS_MENU: {
					const x = globalMmkvCacheServices.getBottomSheetProp_Status(globalDb);
					if (!x) return <View></View>;
					return (
						<WithActivitypubStatusContext status={x}>
							<Status dto={x} />
						</WithActivitypubStatusContext>
					);
				}
				case BOTTOM_SHEET_ENUM.ADD_REACTION: {
					return <BottomSheetAddReaction />;
				}
				default:
					return <View></View>;
			}
		}, [requestId, type]);
	},
);

export default BottomSheetFactory;
