import { Account, ProfilePinnedUser } from '../../../database/_schema';
import { useMemo } from 'react';
import FlashListService from '../../../services/flashlist.service';
import { FlatList } from 'react-native';
import PinnedUserView from '../views/PinnedUserView';
import {
	useAppAcct,
	useAppDb,
	useAppDialog,
} from '../../../hooks/utility/global-state-extractors';
import PinnedUserLastItem from '../components/PinnedUserLastItem';
import { DialogBuilderService } from '../../../services/dialog-builder.service';
import { AccountService } from '../../../database/entities/account';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import useAppNavigator from '../../../states/useAppNavigator';
import { APP_PINNED_OBJECT_TYPE } from '../../../services/driver.service';
import * as Haptics from 'expo-haptics';
import { SocialHubPinSectionContainer } from '../../../components/screens/home/stack/landing/fragments/_factory';

type Props = {
	items: ProfilePinnedUser[];
	parentAcct: Account;
};

function PinnedUserListPresenter({ items, parentAcct }: Props) {
	const { acct } = useAppAcct();
	const listItems = useMemo(() => {
		return FlashListService.pinnedUsers(items);
	}, [items]);
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

	return (
		<SocialHubPinSectionContainer
			label={'Users'}
			style={{
				marginTop: 16,
			}}
		>
			<FlatList
				data={listItems}
				numColumns={4}
				renderItem={({ item }) => {
					if (item.type === 'entry')
						return (
							<PinnedUserView
								item={item.props.dto}
								onPress={onPress}
								onLongPress={onLongPress}
							/>
						);
					return <PinnedUserLastItem />;
				}}
			/>
		</SocialHubPinSectionContainer>
	);
}

export default PinnedUserListPresenter;
