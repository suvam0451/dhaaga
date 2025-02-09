import { memo } from 'react';
import MastoSignIn from '../../../../features/onboarding/presenters/MastoApiSignIn';

const SigninMd = memo(function Foo() {
	return <MastoSignIn />;
});

export default SigninMd;
