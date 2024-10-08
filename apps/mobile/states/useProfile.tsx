import {
	ActivityPubUserAdapter,
	UserInterface,
	UserType,
} from '@dhaaga/shared-abstraction-activitypub';
import { createContext, useContext, useEffect, useState } from 'react';
import { useActivityPubRestClientContext } from './useActivityPubRestClient';

type Type = {
	user: UserInterface | null;
	userRaw: UserType | null;
	setData: (o: UserInterface) => void;
	setDataRaw: (o: UserType) => void;
};

const defaultValue: Type = {
	user: undefined,
	userRaw: undefined,
	setData: function (o: UserInterface): void {
		throw new Error('Function not implemented.');
	},
	setDataRaw: function (o: UserType): void {
		throw new Error('Function not implemented.');
	},
};

const ActivitypubUserContext = createContext<Type>(defaultValue);

export function useActivitypubUserContext() {
	return useContext(ActivitypubUserContext);
}

type Props = {
	user?: UserType;
	userI?: UserInterface;
	children: any;
};

function WithActivitypubUserContext({ user, userI, children }: Props) {
	const { primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;

	const [Value, setValue] = useState<UserInterface | null>(
		ActivityPubUserAdapter(null, domain),
	);
	const [RawValue, setRawValue] = useState<UserType | null>(null);

	// init
	useEffect(() => {
		if (userI) {
			// TODO: implement raw setter
			// setRawValue(userI)
			setValue(userI);
			return;
		}

		setRawValue(user);
		setValue(ActivityPubUserAdapter(user, domain));
	}, [user, userI, domain]);

	const set = (o: UserInterface) => setValue(o);
	const setRaw = (o: UserType) => {
		setRawValue(o);
		setValue(ActivityPubUserAdapter(o, domain));
	};

	return (
		<ActivitypubUserContext.Provider
			value={{
				user: Value,
				userRaw: RawValue,
				setData: set,
				setDataRaw: setRaw,
			}}
		>
			{children}
		</ActivitypubUserContext.Provider>
	);
}

export default WithActivitypubUserContext;
