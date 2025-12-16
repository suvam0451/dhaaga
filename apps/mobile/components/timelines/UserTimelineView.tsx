import AppTimeline from '#/components/timelines/AppTimeline';
import UserListItemDetailedView from '#/features/timelines/view/UserListItemDetailedView';
import {
	UserTimelineStateAction,
	useUserTimelineDispatch,
	useUserTimelineState,
} from '@dhaaga/core';
import { AppTimelineProps } from '#/components/timelines/shared';
import { JSXElementConstructor, ReactElement } from 'react';
import { useAppApiClient } from '#/states/global/hooks';
import { DriverService } from '@dhaaga/bridge';
import UserPartialListItemView from '#/features/timelines/view/UserPartialListItemView';

function _UserTimelineView(
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

function _UserDetailedTimelineView(props: AppTimelineProps) {
	return (
		<_UserTimelineView
			{...props}
			renderItem={({ item }) => <UserListItemDetailedView item={item} />}
		/>
	);
}

function _UserPartialTimelineView(props: AppTimelineProps) {
	return (
		<_UserTimelineView
			{...props}
			renderItem={({ item }) => <UserPartialListItemView user={item} />}
		/>
	);
}

export function UserTimelineView(props: AppTimelineProps) {
	const { driver } = useAppApiClient();

	return DriverService.supportsAtProto(driver) ? (
		<_UserPartialTimelineView {...props} />
	) : (
		<_UserDetailedTimelineView {...props} />
	);
}
