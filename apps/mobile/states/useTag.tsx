import {
	ActivityPubTagAdapter,
	TagTargetInterface,
	TagType,
} from '@dhaaga/bridge';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAppApiClient } from '#/states/global/hooks';

type Type = {
	tag: TagTargetInterface;
	setData: (o: TagTargetInterface) => void;
	setDataRaw: (o: TagType) => void;
};

const defaultValue: Type = {
	tag: undefined,
	setData: function (o: TagTargetInterface): void {
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
	const { driver } = useAppApiClient();

	const [Value, setValue] = useState<TagTargetInterface | null>(
		ActivityPubTagAdapter(null, driver),
	);
	const [RawValue, setRawValue] = useState<TagType | null>(null);

	// init
	useEffect(() => {
		setRawValue(tag);
		setValue(ActivityPubTagAdapter(tag, driver));
	}, [tag]);

	const set = (o: TagTargetInterface) => setValue(o);
	const setRaw = (o: TagType) => {
		setRawValue(o);
		setValue(ActivityPubTagAdapter(o, driver));
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
