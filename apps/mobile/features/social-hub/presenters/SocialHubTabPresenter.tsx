import {
	useAppDb,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { useEffect, useReducer, useState } from 'react';
import {
	socialHubTabReducer as reducer,
	socialHubTabReducerActionType as ACTION,
	socialHubTabReducerDefault as reducerDefault,
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
	const [State, dispatch] = useReducer(reducer, reducerDefault);
	const { theme } = useAppTheme();
	const [Refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		dispatch({
			type: ACTION.INIT,
			payload: {
				db,
				profile: profile,
			},
		});
		dispatch({
			type: ACTION.RELOAD_PINS,
		});
	}, [profile, db]);

	function refresh() {
		setRefreshing(true);
		dispatch({
			type: ACTION.RELOAD_PINS,
		});
		setRefreshing(false);
	}

	const acct = ProfileService.getOwnerAccount(db, profile);

	return (
		<View>
			<ScrollView
				style={{
					backgroundColor: theme.palette.bg,
					height: '100%',
				}}
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={refresh} />
				}
			>
				<Header acct={acct} />

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
			<View style={{ position: 'absolute', bottom: 0 }}>
				<HubProfileListView />
			</View>
		</View>
	);
}

export default SocialHubTabPresenter;
