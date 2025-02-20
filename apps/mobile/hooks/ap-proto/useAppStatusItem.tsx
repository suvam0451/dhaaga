import { createContext, useContext, useEffect, useState } from 'react';
import { PostObjectType } from '@dhaaga/core';
import { useAppPublishers } from '../utility/global-state-extractors';

type Type = {
	dto: PostObjectType;
};

const defaultValue: Type = {
	dto: null,
};

const AppStatusItemContext = createContext<Type>(defaultValue);

/**
 * A leaner version of StatusInterface
 * passed around for efficient updates
 */
export const useAppStatusItem = () => useContext(AppStatusItemContext);

type Props = {
	children: any;
	dto: PostObjectType;
};

function WithAppStatusItemContext({ children, dto }: Props) {
	const { postPub } = useAppPublishers();
	const [Post, setPost] = useState(postPub?.addIfNotExist(dto?.uuid, dto));

	function onSubscription({ uuid }) {
		setPost(postPub.readCache(uuid));
	}

	useEffect(() => {
		if (!dto) return;
		setPost(postPub.addIfNotExist(dto.uuid, dto));
		postPub.subscribe(dto.uuid, onSubscription);
		return () => {
			postPub.unsubscribe(dto.uuid, onSubscription);
		};
	}, [dto?.uuid]);

	return (
		<AppStatusItemContext.Provider
			value={{
				dto: Post,
			}}
		>
			{children}
		</AppStatusItemContext.Provider>
	);
}

export default WithAppStatusItemContext;
