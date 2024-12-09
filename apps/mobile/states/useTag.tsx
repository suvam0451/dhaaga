import {
	ActivityPubTagAdapter,
	TagInterface,
	TagType,
} from '@dhaaga/shared-abstraction-activitypub';
import { createContext, useContext, useEffect, useState } from 'react';
import { useActivityPubRestClientContext } from './useActivityPubRestClient';

type Type = {
	tag: TagInterface;
	setData: (o: TagInterface) => void;
	setDataRaw: (o: TagType) => void;
};

const defaultValue: Type = {
	tag: undefined,
	setData: function (o: TagInterface): void {
		throw new Error('Function not implemented.');
	},
	setDataRaw: function (o: TagType): void {
		throw new Error('Function not implemented.');
	},
};

const ActivitypubTagContext = createContext<Type>(defaultValue);

export function useActivitypubTagContext() {
	return useContext(ActivitypubTagContext);
}

type Props = {
	tag: TagType;
	children: any;
};

/**
 * Wrap ActivityPub tag objects with this
 */
function WithActivitypubTagContext({ tag, children }: Props) {
	const { domain } = useActivityPubRestClientContext();

	const [Value, setValue] = useState<TagInterface | null>(
		ActivityPubTagAdapter(null, domain),
	);
	const [RawValue, setRawValue] = useState<TagType | null>(null);

	// init
	useEffect(() => {
		setRawValue(tag);
		setValue(ActivityPubTagAdapter(tag, domain));
	}, [tag]);

	const set = (o: TagInterface) => setValue(o);
	const setRaw = (o: TagType) => {
		setRawValue(o);
		setValue(ActivityPubTagAdapter(o, domain));
	};

	return (
		<ActivitypubTagContext.Provider
			value={{
				tag: Value,
				setData: set,
				setDataRaw: setRaw,
			}}
		>
			{children}
		</ActivitypubTagContext.Provider>
	);
}

export default WithActivitypubTagContext;
