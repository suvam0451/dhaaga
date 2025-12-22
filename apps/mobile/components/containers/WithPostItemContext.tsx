import { createContext, memo, useContext } from 'react';
import type { PostObjectType } from '@dhaaga/bridge';
import { usePostEventBusStore } from '#/hooks/pubsub/usePostEventBus';

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
const WithAppStatusItemContext = memo(({ children, dto }: Props) => {
	const { post } = usePostEventBusStore(dto);

	return (
		<AppStatusItemContext.Provider
			value={{
				dto: post,
			}}
		>
			{children}
		</AppStatusItemContext.Provider>
	);
});

export default WithAppStatusItemContext;
