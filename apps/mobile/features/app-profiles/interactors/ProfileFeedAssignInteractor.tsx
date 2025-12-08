import { useProfileListFeedAssignment } from '../api/useProfileQuery';
import ProfileAssignmentPresenter from '../presenters/ProfileAssignmentPresenter';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import {
	useAppAcct,
	useAppDb,
	useAppDialog,
} from '#/hooks/utility/global-state-extractors';
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
	const { acct } = useAppAcct();
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
			t(`hub.profileAdd.placeholder`),
			(name: string) => {
				if (!!name) {
					ProfileService.addProfile(db, acct, name);
					refetch();
				}
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
