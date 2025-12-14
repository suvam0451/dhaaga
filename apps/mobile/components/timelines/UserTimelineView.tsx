import AppTimeline from '#/components/timelines/AppTimeline';
import UserListItemDetailedView from '#/features/timelines/view/UserListItemDetailedView';
import {
	UserTimelineStateAction,
	useUserTimelineDispatch,
	useUserTimelineState,
} from '@dhaaga/core';
import { AppTimelineProps } from '#/components/timelines/shared';
import { JSXElementConstructor, ReactElement } from 'react';

function _userTimelineView(
	props: AppTimelineProps & {
		renderItem: ({
			item,
		}) => ReactElement<unknown, string | JSXElementConstructor<any>>;
	},
) {
	const State = useUserTimelineState();
	const dispatch = useUserTimelineDispatch();

	function fnLoadNextPage(data: any) {
		dispatch({
			type: UserTimelineStateAction.APPEND,
			payload: data,
		});
	}

	function fnReset() {
		dispatch({
			type: UserTimelineStateAction.RESET,
		});
	}

	function fnLoadMore() {
		dispatch({
			type: UserTimelineStateAction.REQUEST_LOAD_MORE,
		});
	}

	return (
		<AppTimeline
			{...props}
			items={State.items}
			fnLoadNextPage={fnLoadNextPage}
			fnLoadMore={fnLoadMore}
			fnReset={fnReset}
		/>
	);
}

export function UserDetailedTimelineView(props: AppTimelineProps) {
	return (
		<_userTimelineView
			{...props}
			renderItem={({ item }) => <UserListItemDetailedView item={item} />}
		/>
	);
}

export function UserPartialTimelineView(props: AppTimelineProps) {
	return (
		<_userTimelineView
			{...props}
			renderItem={({ item }) => <UserListItemDetailedView item={item} />}
		/>
	);
}
