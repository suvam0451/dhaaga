import { useEffect, useState } from 'react';
import {
	AppTimelineReducerActionType,
	AppTimelineReducerDispatchType,
	AppTimelineReducerStateType,
} from '../../states/interactors/post-timeline.reducer';
import { AppPostObject } from '../../types/app-post.types';
import ActivityPubService from '../../services/activitypub.service';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../states/_global';

/**
 * Helps apply operations such as
 * liking, sharing etc. on post
 * items, when they are on a timeline
 */
function useTimelinePostActions(
	item: AppPostObject,
	State: AppTimelineReducerStateType,
	dispatch: AppTimelineReducerDispatchType,
	stateId: string,
	reloadParentState: () => void,
) {
	const [IsReady, setIsReady] = useState(false);
	const { client, driver } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			driver: o.driver,
		})),
	);

	useEffect(() => {}, [State, item]);

	function toggleLike() {
		ActivityPubService.toggleLike(
			client,
			item.id,
			item.interaction.liked,
			driver,
		)
			.then((res) => {
				dispatch({
					type: AppTimelineReducerActionType.UPDATE_LIKE_STATUS,
					payload: {
						id: item.id,
						delta: res,
					},
				});
			})
			.finally(() => {});
	}

	return { toggleLike };
}

/**
 * Helps apply operations such as
 * liking, sharing etc. on post
 * items, when they are on standalone
 *
 * e.g. - Notification, Previews etc.
 */
function useStandalonePostActions() {}
