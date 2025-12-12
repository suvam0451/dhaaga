import { UserDetailedTimelineView } from '../../components/timelines/UserTimelineView';
import { UserTimelineCtx, useUserTimelineState } from '@dhaaga/core';
import { useAppApiClient } from '#/states/global/hooks';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { userFollowsQueryOpts } from '@dhaaga/react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';

function Generator() {
	const { client } = useAppApiClient();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GLOSSARY]);
	const { id } = useLocalSearchParams<{ id: string }>();
	const State = useUserTimelineState();
	const queryResult = useQuery(userFollowsQueryOpts(client, id, State.maxId));

	return (
		<UserDetailedTimelineView
			label={t(`noun.follower_other`)}
			queryResult={queryResult}
		/>
	);
}

function Followings() {
	return (
		<UserTimelineCtx>
			<Generator />
		</UserTimelineCtx>
	);
}

export default Followings;
