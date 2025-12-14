import { useAppTheme } from '#/states/global/hooks';
import CollectionItem from '../components/CollectionItem';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';

type AssignmentSheetBookmarkViewProps = {
	bookmarked: boolean;
	toggleBookmark: (loader?: (flag: boolean) => void) => void;
};

function AssignmentSheetBookmarkView({
	bookmarked,
	toggleBookmark,
}: AssignmentSheetBookmarkViewProps) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

	const TIP_TEXT_COLOR = theme.secondary.a40;

	return (
		<CollectionItem
			label={t(`collections.bookmark`)}
			desc={t(`collections.bookmarkDesc`)}
			activeIconId={'bookmark'}
			inactiveIconId={'bookmark-outline'}
			active={bookmarked}
			activeTint={theme.primary}
			inactiveTint={TIP_TEXT_COLOR}
			onPress={() => {
				toggleBookmark();
			}}
		/>
	);
}

export default AssignmentSheetBookmarkView;
