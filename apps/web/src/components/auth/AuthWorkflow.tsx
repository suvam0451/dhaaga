import AppLogo from '../../../public/assets/dhaaga/icon.png';
import BlueskyLogo from '../../../public/assets/branding/bluesky/logo.png';
import MastodonLogo from '../../../public/assets/branding/mastodon/logo.png';
import MisskeyLogo from '../../../public/assets/branding/misskey/logo.png';
import LemmyLogo from '../../../public/assets/branding/lemmy/logo.png';
import {
	IoPersonOutline,
	IoLockClosedOutline,
	IoServerOutline,
} from 'react-icons/io5';
import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function AccountSelectionFragment() {
	return (
		<div className="w-sm align-middle my-auto grid md:grid-cols-1 gap-6">
			<div className="bg-gray-300 mx-12 rounded-lg py-4">
				<h1 className="text-2xl font-bold text-center  w-auto">
					Select Account
				</h1>
			</div>
			<div className="bg-gray-200 mx-12 rounded-lg py-4">
				<h1 className="text-2xl font-bold text-center">Add Account</h1>
			</div>
		</div>
	);
}

type FormItemProps = {
	type: string;
	placeholder: string;
	value: string;
	setValue: (value: string) => void;
	Icon: ReactNode;
};

function FormItem({ type, placeholder, value, setValue, Icon }: FormItemProps) {
	return (
		<div className="mb-4 relative">
			<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
				{Icon}
			</span>
			<input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>
	);
}

type SharedFormWrapperProps = {
	onClickReset: () => void;
	children: any;
};

function SharedFormWrapper({ children, onClickReset }: SharedFormWrapperProps) {
	return (
		<form className="w-full max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md">
			{children}
			<button
				type="submit"
				className="w-full py-2 px-4 bg-yellow-200 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
			>
				Login
			</button>
			<button
				type={'reset'}
				className={'w-full bg-gray-200 py-2 px-4 my-4 font-semibold rounded-md'}
				onClick={onClickReset}
			>
				Back to Selection
			</button>
		</form>
	);
}

type AtProtoLoginProps = {
	onClickReset: () => void;
};

function AtProtoLogin({ onClickReset }: AtProtoLoginProps) {
	const [UsernameValue, setUsernameValue] = useState('');
	const [PasswordValue, setPasswordValue] = useState('');
	return (
		<SharedFormWrapper onClickReset={onClickReset}>
			<FormItem
				type={'text'}
				placeholder={'Username'}
				value={UsernameValue}
				setValue={setUsernameValue}
				Icon={<IoPersonOutline />}
			/>
			<FormItem
				type={'password'}
				placeholder={'Password'}
				value={PasswordValue}
				setValue={setPasswordValue}
				Icon={<IoLockClosedOutline />}
			/>
		</SharedFormWrapper>
	);
}

type ActivityPubLoginProps = {
	onClickReset: () => void;
};

function ActivityPubLogin({ onClickReset }: ActivityPubLoginProps) {
	const [ServerValue, setServerValue] = useState('');
	return (
		<SharedFormWrapper onClickReset={onClickReset}>
			<FormItem
				type={'text'}
				placeholder={'Your instance url'}
				value={ServerValue}
				setValue={setServerValue}
				Icon={<IoServerOutline />}
			/>
		</SharedFormWrapper>
	);
}

function MiAuthLogin({ onClickReset }: ActivityPubLoginProps) {
	const [ServerValue, setServerValue] = useState('');
	return (
		<SharedFormWrapper onClickReset={onClickReset}>
			<FormItem
				type={'text'}
				placeholder={'Your instance url'}
				value={ServerValue}
				setValue={setServerValue}
				Icon={<IoServerOutline />}
			/>
		</SharedFormWrapper>
	);
}

function LemmyLogin({ onClickReset }: ActivityPubLoginProps) {
	return (
		<SharedFormWrapper onClickReset={onClickReset}>
			<div />
		</SharedFormWrapper>
	);
}

type LoginFormProps = {
	authMode: AUTH_PROVIDER_TYPE;
	onClickReset: () => void;
};

function LoginForm({ authMode, onClickReset }: LoginFormProps) {
	switch (authMode) {
		case 'activitypub':
			return <ActivityPubLogin onClickReset={onClickReset} />;
		case 'miauth':
			return <MiAuthLogin onClickReset={onClickReset} />;
		case 'atproto':
			return <AtProtoLogin onClickReset={onClickReset} />;
		case 'lemmy':
			return <LemmyLogin onClickReset={onClickReset} />;
		default:
			return <div />;
	}
}

type AUTH_PROVIDER_TYPE = 'atproto' | 'activitypub' | 'miauth' | 'lemmy' | null;

type AuthModeSelectionProps = {
	value: AUTH_PROVIDER_TYPE;
	selectionCallback: (value: AUTH_PROVIDER_TYPE) => void;
};

function AuthModeSelection({
	value,
	selectionCallback,
}: AuthModeSelectionProps) {
	if (value !== null) return <div />;

	return (
		<div>
			<div className="bg-gray-100 flex items-center justify-center p-6">
				<div className="grid grid-cols-2 gap-6">
					<button
						className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center"
						onClick={() => selectionCallback('atproto')}
					>
						<img
							src={BlueskyLogo}
							alt="bluesky logo"
							className="h-12 w-auto"
							// objectFit={'contain'}
						/>
						<h2 className="text-xl font-semibold mt-4">Bluesky</h2>
					</button>

					<button
						className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center"
						onClick={() => selectionCallback('activitypub')}
					>
						<img
							src={MastodonLogo}
							alt="mastodon logo"
							className="h-12 w-auto"
							// objectFit={'contain'}
						/>
						<h2 className="text-xl font-semibold mt-4">Mastodon</h2>
					</button>

					<button
						className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center"
						onClick={() => selectionCallback('miauth')}
					>
						<img
							src={MisskeyLogo}
							alt="misskey logo"
							className="h-12 w-auto"
							// objectFit={'contain'}
						/>
						<h2 className="text-xl font-semibold mt-4">Misskey</h2>
					</button>

					<button
						className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center"
						onClick={() => selectionCallback('lemmy')}
					>
						<img
							src={LemmyLogo}
							alt="lemmy logo"
							className="h-12 w-auto"
							// objectFit={'contain'}
						/>
						<h2 className="text-xl font-semibold mt-4">Lemmy ⏳</h2>
					</button>
				</div>
			</div>
			<div className="flex flex-col mx-auto text-center">
				<p className="font-medium">Account creation is not supported</p>
				<p className="font-medium">You must use an existing account</p>
			</div>
		</div>
	);
}

function AccountCreationFragment() {
	const [AuthMode, setAuthMode] = useState<AUTH_PROVIDER_TYPE>(null);

	function toggleAuthMode(value: AUTH_PROVIDER_TYPE) {
		setAuthMode(AuthMode === value ? null : value);
	}

	function resetAuthMode() {
		setAuthMode(null);
	}

	return (
		<div className="flex flex-1 flex-col max-w-md mx-auto">
			<img
				src={AppLogo}
				alt="app logo"
				className="h-24 w-auto rounded-md mx-auto"
			/>
			<h1 className="text-3xl font-bold text-center mt-6">Add an Account</h1>
			<h1 className="text-xl font-medium text-center mt-1 mb-6">
				Select your platform
			</h1>
			<div className={'bg-red-300'}>
				<AnimatePresence>
					{AuthMode === null ? (
						<motion.div
							key="first"
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 50 }}
							transition={{ duration: 0.4 }}
							className={'absolute w-full left-1/2 transform -translate-x-1/2'}
						>
							<AuthModeSelection
								value={AuthMode}
								selectionCallback={toggleAuthMode}
							/>
						</motion.div>
					) : (
						<motion.div
							key="second"
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -50 }}
							transition={{ duration: 0.4 }}
							className={'absolute left-1/2 transform -translate-x-1/2'}
						>
							<LoginForm authMode={AuthMode} onClickReset={resetAuthMode} />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

function AuthWorkflow() {
	return (
		<div className={'flex flex-row py-12'}>
			<AccountCreationFragment />
		</div>
	);
	// return (
	// 	<div className="flex flex-col md:flex-row gap-4 py-12 px-auto">
	// 		<AccountSelectionFragment />
	// 		{/* <Separator orientation='vertical'/> */}
	// 		<div
	// 			className="bg-black"
	// 			style={{ height: 'auto', width: 2, backgroundColor: 'black' }}
	// 		></div>
	// 		<AccountCreationFragment />
	// 	</div>
	// );
}

export default AuthWorkflow;
