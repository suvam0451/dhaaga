import { Account, ProfilePinnedTag, AccountService } from '@dhaaga/db';
import { StyleSheet, View } from 'react-native';
import PinnedTagView from '../views/PinnedTagView';
import HubPinSectionContainer from './HubPinSectionContainer';
import { DialogFactory } from '#/utils/dialog-factory';
import {
	useActiveUserSession,
	useAppDb,
	useAppDialog,
	useAppGlobalStateActions,
} from '#/states/global/hooks';
import useAppNavigator from '#/states/useAppNavigator';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';

type Props = {
	items: ProfilePinnedTag[];
	parentAcct: Account;
	onPressAddTag: () => void;
	onLongPressTag: (pinnedTag: ProfilePinnedTag) => void;
};

function HubPinnedTagList({
	items,
	parentAcct,
	onPressAddTag,
	onLongPressTag,
}: Props) {
	const { acct } = useActiveUserSession();
	const { db } = useAppDb();
	const { restoreSession } = useAppGlobalStateActions();
	const { show, hide } = useAppDialog();
	const { toTimelineViaPin } = useAppNavigator();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	function onPress(item: ProfilePinnedTag) {
		if (parentAcct.id !== acct.id) {
			show(
				DialogFactory.toSwitchActiveAccount(() => {
					AccountService.select(db, parentAcct);
					try {
						restoreSession().then(() => {
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
		<HubPinSectionContainer
			label={t(`hub.section.tags`)}
			style={{
				marginTop: 16,
			}}
			onPressAdd={onPressAddTag}
		>
			<View style={styles.root}>
				{items.map((tag, i) => (
					<PinnedTagView
						key={i}
						item={tag}
						onPress={onPress}
						onLongPress={onLongPress}
					/>
				))}
			</View>
		</HubPinSectionContainer>
	);
}

export default HubPinnedTagList;

const styles = StyleSheet.create({
	root: {
		flexWrap: 'wrap',
		display: 'flex',
		flexDirection: 'row',
		flexGrow: 1,
		overflow: 'hidden',
	},
});
