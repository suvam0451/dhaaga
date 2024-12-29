import { ActivityPubTagAdapter, TagInterface, TagType } from '@dhaaga/bridge';
import { createContext, useContext, useEffect, useState } from 'react';
import useGlobalState from './_global';
import { useShallow } from 'zustand/react/shallow';

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
	const { driver } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
		})),
	);

	const [Value, setValue] = useState<TagInterface | null>(
		ActivityPubTagAdapter(null, driver),
	);
	const [RawValue, setRawValue] = useState<TagType | null>(null);

	// init
	useEffect(() => {
		setRawValue(tag);
		setValue(ActivityPubTagAdapter(tag, driver));
	}, [tag]);

	const set = (o: TagInterface) => setValue(o);
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
