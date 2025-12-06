import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import SimpleUserTimeline from '#/components/timelines/SimpleUserTimeline';
import { useAppApiClient } from '#/hooks/utility/global-state-extractors';
import { userFollowsQueryOpts } from '@dhaaga/react';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

function ProfileFollowingsPresenter() {
	const { client } = useAppApiClient();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GLOSSARY]);
	const { id } = useLocalSearchParams<{ id: string }>();
	const queryResult = useQuery(userFollowsQueryOpts(client, id, null));

	return (
		<SimpleUserTimeline
			timelineLabel={t(`noun.follower_other`)}
			queryResult={queryResult}
		/>
	);
}

export default ProfileFollowingsPresenter;
