import {
	useAppDb,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { useEffect, useReducer, useState } from 'react';
import {
	socialHubTabReducer,
	socialHubTabReducerActionType,
	socialHubTabReducerDefault,
} from '../../../states/interactors/social-hub-tab.reducer';
import { RefreshControl, ScrollView, View } from 'react-native';
import HubProfileListView from '../views/HubProfileListView';
import PinnedTimelineListPresenter from './PinnedTimelineListPresenter';
import { Profile } from '../../../database/_schema';
import Header from '../components/Header';
import { ProfileService } from '../../../database/entities/profile';
import PinnedUserListPresenter from './PinnedUserListPresenter';
import PinnedTagListPresenter from './PinnedTagListPresenter';

type Props = {
	// account left join guaranteed
	profile: Profile;
};

/**
 * Tabs in the Social Hub interface
 * represent a unique profile each
 */
function SocialHubTabPresenter({ profile }: Props) {
	const { db } = useAppDb();
	const [State, dispatch] = useReducer(
		socialHubTabReducer,
		socialHubTabReducerDefault,
	);
	const { theme } = useAppTheme();
	const [IsRefreshing, setIsRefreshing] = useState(false);

	useEffect(() => {
		dispatch({
			type: socialHubTabReducerActionType.INIT,
			payload: {
				db,
				profile: profile,
			},
		});
		dispatch({
			type: socialHubTabReducerActionType.RELOAD_PINS,
		});
	}, [profile, db]);

	function refresh() {
		setIsRefreshing(true);
		dispatch({
			type: socialHubTabReducerActionType.RELOAD_PINS,
		});
		setIsRefreshing(false);
	}

	const acct = ProfileService.getOwnerAccount(db, profile);

	return (
		<View>
			<ScrollView
				style={{
					backgroundColor: theme.palette.bg,
					height: '100%',
				}}
				contentContainerStyle={{
					// for the selection bar
					paddingBottom: 50,
				}}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={refresh} />
				}
			>
				<Header acct={acct} />
				<HubProfileListView />

				{/* --- Pinned Timelines --- */}
				<PinnedTimelineListPresenter
					account={State.acct}
					items={State.pins.timelines}
				/>

				{/* --- Pinned Users --- */}
				<PinnedUserListPresenter
					parentAcct={State.acct}
					items={State.pins.users}
				/>

				{/* --- Pinned Tags --- */}
				<PinnedTagListPresenter
					items={State.pins.tags}
					parentAcct={State.acct}
				/>
			</ScrollView>
		</View>
	);
}

export default SocialHubTabPresenter;
