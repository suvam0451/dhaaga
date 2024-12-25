import { memo } from 'react';
import useMyProfile from '../api/useMyProfile';
import WithActivitypubUserContext from '../../../../states/useProfile';
import { ProfileContextWrapped } from '../../../common/user/UserViewProfile';

const MyProfile = memo(() => {
	const { data } = useMyProfile();

	return (
		<WithActivitypubUserContext user={data}>
			<ProfileContextWrapped />
		</WithActivitypubUserContext>
	);
});

export default MyProfile;
