import { memo } from 'react';
import useMyProfile from '../api/useMyProfile';
import WithActivitypubUserContext from '../../../../states/useProfile';
import { ProfileContextWrapped } from '../../(shared)/stack/profile/SharedStackUserProfile';

const MyProfile = memo(() => {
	const { Data } = useMyProfile();

	return (
		<WithActivitypubUserContext userI={Data}>
			<ProfileContextWrapped />
		</WithActivitypubUserContext>
	);
});

export default MyProfile;
