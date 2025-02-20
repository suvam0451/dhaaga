import { Account, ProfilePinnedTag, AccountService } from '@dhaaga/db';
import { StyleSheet, View } from 'react-native';
import PinnedTagView from '../views/PinnedTagView';
import HubTabSectionContainer from '../components/HubTabSectionContainer';
import { DialogBuilderService } from '../../../services/dialog-builder.service';
import {
	useAppAcct,
	useAppDb,
	useAppDialog,
} from '../../../hooks/utility/global-state-extractors';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import useAppNavigator from '../../../states/useAppNavigator';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

type Props = {
	items: ProfilePinnedTag[];
	parentAcct: Account;
	onPressAddTag: () => void;
	onLongPressTag: (pinnedTag: ProfilePinnedTag) => void;
};

function TagListPresenter({
	items,
	parentAcct,
	onPressAddTag,
	onLongPressTag,
}: Props) {
	const { acct } = useAppAcct();
	const { db } = useAppDb();
	const { loadApp } = useGlobalState(
		useShallow((o) => ({
			loadApp: o.loadApp,
		})),
	);
	const { show, hide } = useAppDialog();
	const { toTimelineViaPin } = useAppNavigator();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	function onPress(item: ProfilePinnedTag) {
		if (parentAcct.id !== acct.id) {
			show(
				DialogBuilderService.toSwitchActiveAccount(() => {
					AccountService.select(db, parentAcct);
					try {
						loadApp().then(() => {
							hide();
							toTimelineViaPin(item.id, 'tag');
						});
					} catch (e) {
						hide();
					}
				}),
			);
			return;
		}

		hide();
		toTimelineViaPin(item.id, 'tag');
	}

	function onLongPress(item: ProfilePinnedTag) {
		onLongPressTag(item);
	}

	return (
		<HubTabSectionContainer
			label={t(`hub.section.tags`)}
			style={{
				marginTop: 16,
			}}
			onPressAdd={onPressAddTag}
		>
			<View style={styles.pinnedTagListContainer}>
				{items.map((tag, i) => (
					<PinnedTagView
						key={i}
						item={tag}
						onPress={onPress}
						onLongPress={onLongPress}
					/>
				))}
			</View>
		</HubTabSectionContainer>
	);
}

export default TagListPresenter;

const styles = StyleSheet.create({
	root: {
		marginTop: 16,
		marginHorizontal: 8,
	},
	pinnedTagListContainer: {
		flexWrap: 'wrap',
		display: 'flex',
		flexDirection: 'row',
		flexGrow: 1,
		overflow: 'hidden',
	},
});
