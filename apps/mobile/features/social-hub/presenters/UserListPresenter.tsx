import { Account, Profile, ProfilePinnedUser } from '../../../database/_schema';
import { FlatList, StyleSheet } from 'react-native';
import PinnedUserView from '../views/PinnedUserView';
import {
	useAppAcct,
	useAppDb,
	useAppDialog,
} from '../../../hooks/utility/global-state-extractors';
import { DialogBuilderService } from '../../../services/dialog-builder.service';
import { AccountService } from '../../../database/entities/account';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import useAppNavigator from '../../../states/useAppNavigator';
import { APP_PINNED_OBJECT_TYPE } from '../../../services/driver.service';
import * as Haptics from 'expo-haptics';
import HubTabSectionContainer from '../components/HubTabSectionContainer';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import { useTranslation } from 'react-i18next';

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

	function onPress(item: ProfilePinnedUser) {
		if (parentAcct.id !== acct.id) {
			show(
				DialogBuilderService.toSwitchActiveAccount(() => {
					AccountService.select(db, parentAcct);
					try {
						loadApp().then(() => {
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
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
