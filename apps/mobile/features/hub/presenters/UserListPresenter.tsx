import {
	Account,
	Profile,
	ProfilePinnedUser,
	AccountService,
} from '@dhaaga/db';
import { FlatList, StyleSheet } from 'react-native';
import PinnedUserView from '../views/PinnedUserView';
import {
	useActiveUserSession,
	useAppDb,
	useAppDialog,
	useAppGlobalStateActions,
} from '#/states/global/hooks';
import { DialogFactory } from '#/utils/dialog-factory';
import useAppNavigator from '#/states/useAppNavigator';
import { APP_PINNED_OBJECT_TYPE } from '#/services/driver.service';
import HubTabSectionContainer from '../components/HubTabSectionContainer';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';
import { HapticUtils } from '#/utils/haptics';

type Props = {
	profile: Profile;
	items: ProfilePinnedUser[];
	parentAcct: Account;
	onPressAddUser: () => void;
	onLongPressUser: (item: ProfilePinnedUser) => void;
};

function UserListPresenter({
	onPressAddUser,
	items,
	parentAcct,
	onLongPressUser,
}: Props) {
	const { acct } = useActiveUserSession();
	const { db } = useAppDb();
	const { restoreSession } = useAppGlobalStateActions();
	const { show, hide } = useAppDialog();
	const { toTimelineViaPin } = useAppNavigator();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	function onPress(item: ProfilePinnedUser) {
		if (parentAcct.id !== acct.id) {
			show(
				DialogFactory.toSwitchActiveAccount(() => {
					AccountService.select(db, parentAcct);
					try {
						restoreSession().then(() => {
							hide();
							toTimelineViaPin(item.id, 'user');
						});
					} catch (e) {
						hide();
					}
				}),
			);
			return;
		}

		switch (item.category) {
			case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_USER_LOCAL: {
				// toProfile(item.identifier);
				toTimelineViaPin(item.id, 'user');
				break;
			}
			case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_USER_REMOTE: {
				/**
				 * 	NOTE: this would need to resolve the remote server's
				 * 	drivers and make the necessary network calls to open
				 * 	and "anonymous" tab
				 */
				console.log('[WARN]: pin category not implemented');
				break;
			}
			default: {
				console.log('[WARN]: pin category not registered');
			}
		}
	}

	function onLongPress(item: ProfilePinnedUser) {
		HapticUtils.medium();
		onLongPressUser(item);
	}

	return (
		<HubTabSectionContainer
			label={t(`hub.section.users`)}
			style={styles.root}
			onPressAdd={onPressAddUser}
		>
			<FlatList
				data={items}
				numColumns={4}
				renderItem={({ item }) => (
					<PinnedUserView
						item={item}
						onPress={onPress}
						onLongPress={onLongPress}
					/>
				)}
			/>
		</HubTabSectionContainer>
	);
}

export default UserListPresenter;

const styles = StyleSheet.create({
	root: {
		marginTop: 16,
		marginHorizontal: 8,
	},
});
