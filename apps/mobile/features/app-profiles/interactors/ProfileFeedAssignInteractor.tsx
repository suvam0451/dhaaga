import { useProfileListFeedAssignment } from '../api/useProfileQuery';
import ProfileAssignmentPresenter from '../presenters/ProfileAssignmentPresenter';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import {
	useActiveUserSession,
	useAppDb,
	useAppDialog,
} from '#/states/global/hooks';
import { useProfileMutation } from '../api/useProfileMutation';
import { Profile, ProfileService } from '@dhaaga/db';
import useApiGetFeedDetails from '../../timelines/features/controller/interactors/useApiGetFeedDetails';

type Props = {
	uri: string;
	Header?: any;
	Footer?: any;
};

function ProfileFeedAssignInteractor({ uri, Header, Footer }: Props) {
	const { data, refetch } = useProfileListFeedAssignment(uri);
	const { show } = useAppDialog();
	const { db } = useAppDb();
	const { acct } = useActiveUserSession();
	const { toggleFeedPin } = useProfileMutation();
	const { data: feedData } = useApiGetFeedDetails(uri);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.DIALOGS]);

	function onPressAddProfile() {
		show(
			{
				title: t(`hub.profileAdd.title`),
				actions: [],
				description: t(`hub.profileAdd.description`, {
					returnObjects: true,
				}) as string[],
			},
			{ $type: 'text-prompt', placeholder: t(`hub.profileAdd.placeholder`) },
			(ctx) => {
				if (ctx.$type !== 'text-prompt') return;
				if (!ctx.userInput) return;
				ProfileService.addProfile(db, acct, ctx.userInput.trim());
				refetch();
			},
		);
	}

	function onToggle(profile: Profile) {
		if (!feedData) return;
		toggleFeedPin
			.mutateAsync({
				feed: feedData.feed,
				profile,
			})
			.finally(() => {
				refetch();
			});
	}

	return (
		<ProfileAssignmentPresenter
			data={data}
			onAddNewProfile={onPressAddProfile}
			onToggle={onToggle}
			Header={Header}
			Footer={Footer}
		/>
	);
}

export default ProfileFeedAssignInteractor;
