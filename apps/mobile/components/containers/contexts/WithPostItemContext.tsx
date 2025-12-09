import { createContext, useContext, useEffect, useState } from 'react';
import type { PostObjectType } from '@dhaaga/bridge';
import { useAppPublishers } from '#/hooks/utility/global-state-extractors';

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
export const withPostItemContext = () => useContext(AppStatusItemContext);

type Props = {
	children: any;
	dto: PostObjectType;
};

/**
 * A context provider for a timeline post
 * item.
 *
 * - Makes the post-object available to children
 * - Subscribes to updates against a post in the global store
 *
 * @param children
 * @param dto
 * @constructor
 */
function WithAppStatusItemContext({ children, dto }: Props) {
	const { postObjectActions } = useAppPublishers();
	const [Post, setPost] = useState(null);

	function onUpdate({ uuid }) {
		setPost(postObjectActions.read(uuid));
	}

	useEffect(() => {
		if (!dto || !postObjectActions) return;
		setPost(postObjectActions.write(dto.uuid, dto));
		postObjectActions.subscribe(dto.uuid, onUpdate);
		return () => {
			postObjectActions.unsubscribe(dto.uuid, onUpdate);
		};
	}, [dto]);

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
