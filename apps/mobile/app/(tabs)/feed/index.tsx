import {
	PostTimelineCtx,
	PostTimelineStateAction,
	TimelineFetchMode,
	usePostTimelineDispatch,
	usePostTimelineState,
} from '@dhaaga/core';
import {
	useActiveUserSession,
	useAppApiClient,
	useAppDb,
	useAppTheme,
} from '#/states/global/hooks';
import { unifiedPostFeedQueryOptions } from '@dhaaga/react';
import PostTimelineView from '#/components/timelines/PostTimelineView';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import useScrollHandleAnimatedList from '#/hooks/anim/useScrollHandleAnimatedList';
import NavBar_Feed from '#/components/topnavbar/NavBar_Feed';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import BearError from '#/components/svgs/BearError';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import { View } from 'react-native';
import { router } from 'expo-router';
import WithBackgroundSkin from '#/components/containers/WithBackgroundSkin';

function TimelineIdle() {
	const { animatedStyle } = useScrollHandleAnimatedList();

	return (
		<WithBackgroundSkin>
			<View
				style={{
					paddingTop: 52,
					flex: 1,
				}}
			>
				<NavBar_Feed animatedStyle={animatedStyle} />
				<ErrorPageBuilder
					stickerArt={<BearError />}
					errorMessage={'No Timeline Selected'}
					errorDescription={
						'You can pin and access various types of timelines from your personalised hub.'
					}
				>
					<View style={{ marginTop: 32 }}>
						<AppButtonVariantA
							label={'Go There'}
							loading={false}
							onClick={() => {
								router.navigate('/');
							}}
						/>
					</View>
				</ErrorPageBuilder>
			</View>
		</WithBackgroundSkin>
	);
}

function Content() {
	const { db } = useAppDb();
	const { client, driver, server } = useAppApiClient();
	const { acct } = useActiveUserSession();

	const State = usePostTimelineState()!;
	const dispatch = usePostTimelineDispatch()!;

	// reset the timeline on param change
	const params = useLocalSearchParams();
	const pinId: string = params['pinId'] as string;
	const pinType: string = params['pinType'] as string;

	useEffect(() => {
		if (!db) return;
		dispatch({
			type: PostTimelineStateAction.INIT,
			payload: {
				db,
			},
		});

		if (!pinType || !pinId) return;
		if (pinId) {
			dispatch({
				type: PostTimelineStateAction.RESET_USING_PIN_ID,
				payload: {
					id: parseInt(pinId),
					type: pinType as 'feed' | 'user' | 'tag',
				},
			});
		}
	}, [pinId, pinType]);

	useEffect(() => {
		dispatch({
			type: PostTimelineStateAction.RESET,
		});
	}, [State.feedType, State.query, State.opts, db, acct?.identifier]);

	const queryResult = useQuery(
		unifiedPostFeedQueryOptions(client, driver, server, acct?.identifier, {
			type: State.feedType,
			query: State.query,
			opts: State.opts,
			maxId: State.appliedMaxId,
			sessionId: State.sessionId,
		}),
	);

	if (State.feedType === TimelineFetchMode.IDLE) return <TimelineIdle />;
	return (
		<PostTimelineView
			label={null}
			queryResult={queryResult}
			navbarType={'unified'}
			flatListKey={'unified-feed'}
			skipTimelineInit
		/>
	);
}

function Page() {
	return (
		<WithBackgroundSkin>
			<PostTimelineCtx>
				<Content />
			</PostTimelineCtx>
		</WithBackgroundSkin>
	);
}

export default Page;
