import { memo } from 'react';
import useMyProfile from '../api/useMyProfile';
import WithActivitypubUserContext from '../../../../states/useProfile';
import { ProfileContextWrapped } from '../../../common/profile/AppProfile';

const MyProfile = memo(() => {
	const { Data } = useMyProfile();

	return (
		<WithActivitypubUserContext userI={Data}>
			<ProfileContextWrapped />
		</WithActivitypubUserContext>
	);
});

export default MyProfile;
