import { Account, ProfilePinnedUser } from '../../../database/_schema';
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

type Props = {
	items: ProfilePinnedUser[];
	parentAcct: Account;
};

function PinnedUserListPresenter({ items, parentAcct }: Props) {
	const { acct } = useAppAcct();
	const { db } = useAppDb();
	const { loadApp } = useGlobalState(
		useShallow((o) => ({
			loadApp: o.loadApp,
		})),
	);
	const { show, hide } = useAppDialog();
	const { toTimelineViaPin } = useAppNavigator();

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
	}

	function onPressAdd() {}

	return (
		<HubTabSectionContainer
			label={'Users'}
			style={styles.root}
			onPressAdd={onPressAdd}
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

export default PinnedUserListPresenter;

const styles = StyleSheet.create({
	root: {
		marginTop: 16,
		marginHorizontal: 8,
	},
});
