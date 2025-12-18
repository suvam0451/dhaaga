import { UserTimelineCtx, useUserTimelineState } from '@dhaaga/core';
import { useAppApiClient } from '#/states/global/hooks';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { userFollowersQueryOpts } from '@dhaaga/react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { UserTimelineView } from '#/components/timelines/UserTimelineView';
import { useLocalSearchParams } from 'expo-router';

function Generator() {
	const { client } = useAppApiClient();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GLOSSARY]);
	const { id } = useLocalSearchParams<{ id: string }>();
	const State = useUserTimelineState();
	const queryResult = useQuery(userFollowersQueryOpts(client, id, State.maxId));

	return (
		<UserTimelineView
			label={t(`noun.follower_other`)}
			queryResult={queryResult}
			flatListKey={'followers/list'}
			navbarType={'simple'}
		/>
	);
}

function Followers() {
	return (
		<UserTimelineCtx>
			<Generator />
		</UserTimelineCtx>
	);
}

export default Followers;
